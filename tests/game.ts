import { test, expect, type Page, type Locator } from '@playwright/test';
import fs from 'node:fs';

export default class Game {
  clicks: number;
  totalClicks: number;
  packs: number;
  packsUsed: number;
  constructor(private page: Page) {
    this.clicks = 0;
    this.totalClicks = 0;
    this.packs = 1;
    this.packsUsed = 1;
  }
  async setup() {
    this.page.setDefaultTimeout(1_000);
    await this.page.goto('/?test', { timeout: 10_000 });
    await this.page.addStyleTag({ path: 'tests/test-overrides.css' });
    this.page.on('dialog', async (dialog) => { await dialog.accept() });
    await expect(this.page).toHaveTitle(/Bands & Bonds/);
  }
  button(name: string) {
    return this.page.getByRole('button', { name });
  }
  async clickButton(name: string) {
    await test.step(`Click ${name}`, async () => {
      await this.button(name).click();
    });
    this.clicks++;
  }
  async defeatEnemy(name: string) {
    // Clicks attack buttons until the enemy is defeated.
    await test.step(`Defeat ${name}`, async () => {
      await expect(this.page.getByRole('heading', { name })).toBeVisible();
      const attacks = await this.page.locator('.actions > .slow').elementHandles();
      const clicksBefore = this.clicks;
      while (true) {
        if (await this.page.getByText('Defeated').isVisible()) {
          console.log(`Defeated ${name} after ${this.clicks - clicksBefore} clicks.`);
          return;
        }
        for (const e of attacks) {
          const r = await e.evaluate(e => {
            if (e instanceof HTMLElement && e.textContent?.includes("Sneak Past")) return 0;
            if (e instanceof HTMLButtonElement && !e.classList.contains('disabled')) {
              e.click();
              return 1;
            }
            if (e instanceof HTMLElement && e.innerHTML === 'Navigation') return -1;
            return 0;
          }, { timeout: 0 }).catch(() => -1);
          if (r === -1) break;
          this.clicks += r;
        }
      }
    });
  }
  async waitToDefeatEnemy(name: string, timeout = 5_000) {
    // Does nothing until the enemy is defeated.
    await test.step(`Defeat ${name} passively`, async () => {
      await expect(this.page.getByRole('heading', { name })).toBeVisible({ timeout });
      await expect(this.page.getByText('Defeated')).toBeVisible({ timeout });
    });
  }
  async holdToDefeatEnemy(enemy: string, action: string, timeout = 5_000) {
    await test.step(`Defeat ${enemy} by holding ${action}`, async () => {
      await expect(this.page.getByRole('heading', { name: enemy })).toBeVisible();
      const unforge = this.button('Unforge');
      if (await unforge.isVisible()) {
        // Wait for "Unforge" to disappear, otherwise it can interfere with the hold.
        await this.button(action).hover();
        await this.page.mouse.down();
        await expect(unforge).not.toBeVisible({ timeout });
        await this.page.mouse.up();
        this.clicks++;
      }
      if (await this.button(action).isVisible()) {
        await this.button(action).hover();
        await this.page.mouse.down();
        await expect(this.page.getByText('Defeated')).toBeVisible({ timeout });
        await this.waitToDefeatEnemy(enemy);
        this.clicks++;
      }
    });
  }
  async waitForFruitAtLeast(count: number) {
    const fruitCounter = this.page.locator('#header-fruit');
    await this.waitForNumberAtLeast(fruitCounter, count);
  }
  async waitForGoldAtMost(count: number) {
    const goldCounter = this.page.locator('#header-gold');
    await this.waitForNumberAtMost(goldCounter, count);
  }
  waitForNumber(counter: Locator, re?: RegExp) {
    return expect.poll(async () => {
      const text = await counter.textContent();
      const match = text?.match(re || /.*?([0-9,]+)/);
      return match ? Number.parseInt(match[1].replace(/,/g, ''), 10) : 0;
    }, {
      message: "waiting for counter",
      timeout: 10_000,
    });
  }
  async waitForNumberAtMost(counter: Locator, target: number) {
    await this.waitForNumber(counter).toBeLessThanOrEqual(target);
  }
  async waitForNumberAtLeast(counter: Locator, target: number) {
    await this.waitForNumber(counter).toBeGreaterThanOrEqual(target);
  }
  async waitForWeaponLevel(target: number) {
    const forgeButton = this.page.getByRole("button").filter({ hasText: 'Forge' });
    await this.waitForNumber(forgeButton, /.*?Currently ([0-9,]+)/).toBeGreaterThanOrEqual(target);
  }
  async xaranthianDefeatEnemy(enemy: string, quota: number, timeout = 5_000) {
    await test.step(`Defeat ${enemy} the Xaranthian way`, async () => {
      await expect(this.page.getByRole('heading', { name: enemy })).toBeVisible();
      await this.button("Construct Grower").click();
      this.clicks++;
      await expect(this.button("Grow Gun").or(this.button("Grow Guns"))).toBeVisible();
      await this.button("Construct Grower").hover();
      await this.page.mouse.down();
      await this.waitForNumberAtLeast(this.button("Construct Grower"), quota);
      await this.page.mouse.up();
      this.clicks++;
      await this.button("Grow Guns").click();
      this.clicks++;
      await expect(this.button("Fire Xaranthian Guns")).toBeVisible();
      await this.button("Grow Guns").hover();
      await this.page.mouse.down();
      await this.waitForNumberAtLeast(this.button("Grow Guns"), quota * quota);
      await this.page.mouse.up();
      this.clicks++;
      await this.button("Fire Xaranthian Guns").hover();
      await this.page.mouse.down();
      await expect(this.page.getByText('Defeated')).toBeVisible({ timeout });
      await this.waitToDefeatEnemy(enemy);
      this.clicks++;
    });
  }
  async expectHeading(name: string) {
    await expect(this.page.getByRole('heading', { name })).not.toBeEmpty();
  }
  async tab(name: string) {
    await this.clickButton(name);
  }
  band(name: string) {
    return {
      grid: this.page.locator('.band-grid').getByRole('button', { name }),
      details: this.page.locator('.band-details').getByRole('heading', { name: FRIEND_MATCHERS[name] || name }),
      unlocked: this.page.locator('.band-unlocked').getByRole('button', { name }),
    };
  }
  async removeFromBand(name: string) {
    await test.step(`Remove ${name} from band`, async () => {
      const b = this.band(name);
      await expect(b.grid).toBeVisible();
      if (!await b.details.isVisible()) {
        await b.grid.click();
        await expect(b.details).toBeVisible();
      }
      await b.grid.click();
      await expect(b.unlocked).toBeVisible();
    });
  }
  async addToBand(name: string, nth = 0) {
    await test.step(`Add ${name} to band`, async () => {
      const b = this.band(name);
      await b.unlocked.click();
      await expect(b.details).toBeVisible();
      await this.page.locator('.band-grid').getByRole('button', { name: '+' }).nth(nth).click();
      await expect(b.grid).toBeVisible();
    });
  }
  async buyPacks() {
    await test.step('Buy packs', async () => {
      const button = this.page.getByRole('button', { name: 'Buy 1 for' });
      let bought = 0;
      while (true) {
        if (await button.evaluate((el) => el.classList.contains('unaffordable'))) {
          console.log(`Bought ${bought} packs.`);
          return;
        }
        await button.click();
        bought++;
      }
    });
  }
  async retreat() {
    await test.step(`Retreat after ${this.clicks} clicks`, async () => {
      const retreat = this.button('Retreat');
      await expect(retreat).toBeVisible();
      const text = await retreat.textContent();
      const m = text?.match(/keep the ([0-9,]+)/);
      if (m) {
        console.log(`Retreated after ${this.clicks} clicks with ${m[1]} fruit.`);
      } else {
        console.log(`Retreated after ${this.clicks} clicks with no fruit.`);
      }
      await retreat.click();
      await retreat.click();
      await expect(this.button('Enter the Dungeon')).toBeVisible();
    });
    this.totalClicks += this.clicks;
    this.clicks = 0;
  }
  async rescue(name: string) {
    console.log(`Rescued ${name}.`);
    await test.step(`Rescue ${name}`, async () => {
      await this.clickButton('Rescue prisoner');
      await this.expectHeading(name);
    });
  }
  async manageBand(commands) {
    await test.step("Change band", async () => {
      await this.tab('Band');
      await this.buyPacks();
      await commands();
      const band = await this.page.locator('.band-grid').getByRole('button').evaluateAll(elements =>
        elements.map(el => el.getAttribute('aria-label'))
      );
      const summary = await this.page.getByText(/a total cost of \d+\s*, leaving you with \d+/).textContent();
      const m = summary?.match(/a total cost of (\d+)\s*, leaving you with (\d+)/);
      if (!m) throw new Error("Couldn't find band summary.");
      const used = Number.parseInt(m[1]);
      const remaining = Number.parseInt(m[2]);
      this.packsUsed = used;
      this.packs = used + remaining;
      console.log(`${used}/${used + remaining} Band: ${band}`);
      await this.tab('Fight');
    });
  }
  async setDestination(enemy: string) {
    await this.tab('Map');
    await this.page.locator(`.marker[alt="${enemy}"]`).click();
    await this.tab('Fight');
  }
  async stopTraveling() {
    await this.tab('Map');
    await this.page.getByText("Stop traveling").click();
    await this.tab('Fight');
  }

  async saveState(filename: string) {
    const localStorageData = await this.page.evaluate(() => {
      return Object.fromEntries(Object.entries(localStorage));
    });
    const meta = {
      clicks: this.clicks,
      totalClicks: this.totalClicks,
      packs: this.packs,
      packsUsed: this.packsUsed,
    };
    fs.writeFileSync(filename, JSON.stringify({ meta, localStorageData }, null, 2));
  }
  async loadState(filename: string) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    await this.page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value as string);
      }
    }, data.localStorageData);
    Object.assign(this, data.meta);
    await this.page.reload({ timeout: 10_000 });
  }
  async run(repeats, commands?) {
    const _commands = commands ? commands : repeats;
    const _repeats = commands ? repeats : 1;
    for (let i = 0; i < _repeats; i++) {
      await test.step(`(${this.packsUsed}/${this.packs}) Run`, async () => {
        await this.clickButton('Enter the Dungeon');
        await _commands();
        await this.retreat();
      });
    }
  }
}

const FRIEND_MATCHERS = {
  "Anvilomancer": /Anvilomancer|Anvilominator/,
  "Coldblade": /Coldblade|Hotblade/,
  "Dark Chef": /Dark Chef|Dark Sommelier/,
  "Desert Rabbit": /Desert Rabbit|Desert Armadillo/,
  "Friend of Metal": /Friend of Metal|Friend of Metal and Fire/,
  "Lamplighter": /Lamplighter|Lamperlighter/,
  "Royal Fruitbearer": /Royal Fruitbearer|Royal Fruitwearer/,
  "Stick Master": /Stick Master|Stick Grandmaster/,
  "The Silent Song": /The Silent Song|The Silent Quartet/,
  "Lord of Gears": /Lord of Gears|Gear of Lords/,
  "Pur Lion": /Pur Lion|Sir Pur Lion/,
  "Kit Flash": /Kit Flash|Kit Storming/,
  "Wayfinder": /Wayfinder|Campfinder/,
  "Bayla": /Bayla|Baylanda/,
  "Kin of Pump": /Kin of Pump|King of Pump/,
  "Kevin": /Kevin|Kevout/,
  "Smiling Pilot": /Smiling Pilot|Smiling Wizard/,
  "Mongreler": /Mongreler|Monster Juggler/,
  "Eighth Swimmer": /Eighth Swimmer|Seventh Swimmer/,
  "Pecquer": /Pecquer|Le Pecquer/,
  "Hedge Lost": /Hedge Lost|Hedge Found/,
  "Zaktar Kadoque": /Zaktar Kadoque|Zaktar Kadoque Karr/,
  "Xaranthian Constructor": /Xaranthian Constructor|Xaranthian Power Constructor/,
};
