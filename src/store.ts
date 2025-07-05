import { computed, reactive, watch } from 'vue';
import { allRooms, turnsToPath, roomKey } from './rooms.ts';
import { allEnemies } from './enemies.ts';
import { friendsByName } from './friends.ts';
import * as base from './base';
import * as online from './online.ts';
import { costOfPacks } from './base';

export function startingRoomData(): base.RoomData {
  // Everything specific to the current room. Deleted when leaving the room.
  return {
    damage: 0,
    armorDamage: 0,
    poison: 0,
    kills: 0,
  };
}
export function startingRunData(): base.RunData {
  // Everything specific to the current run. Deleted when the run ends.
  return {
    weaponLevel: 1,
    desertBlessingMultiplier: 2,
    speedLevel: 1,
    steps: 0,
    turns: [],
    gold: 0,
    fruit: 0, // Fruit collected in this run. Only for statistics.
    capturedAbilities: [],
    room: startingRoomData(),
    timers: {} as Record<string, base.Timer>,
  };
}

function startingBand(): base.Band {
  return {
    width: 5,
    height: 5,
    12: 'Stick Master',
  };
}
function startingUnlocked(): string[] {
  return ['Stick Master'];
}
function startingDiscovered(): string[] {
  return [];
}
function startingSettings(): base.Settings {
  return {
    blurImages: false,
    online: false,
    sound: true,
  };
}
export function startingLocalData(): base.LocalData {
  return {
    band: startingBand(),
    settings: startingSettings(),
  };
}
function startingTeamData(): base.TeamData {
  return {
    fruit: 1,
    packs: 1,
    bestWeaponLevel: 1,
    unlocked: startingUnlocked(),
    discovered: startingDiscovered(),
    name: 'Unnamed Guild',
  };
}

const loadedRunData = localStorage.getItem('bnb-run');
export const runData = reactive<base.RunData>(loadedRunData ? JSON.parse(loadedRunData) : startingRunData());
const loadedLocal = localStorage.getItem('bnb-local');
export const localData = reactive<base.LocalData>(loadedLocal ? JSON.parse(loadedLocal) : startingLocalData());
const loadedTeam = localStorage.getItem('bnb-team');
export const teamData = reactive<base.TeamData>(loadedTeam ? JSON.parse(loadedTeam) : startingTeamData());
export const store: base.Store = {
  run: runData,
  local: localData,
  team: teamData,
  currentRoom() {
    return current.value.room ?? allRooms[0];
  },
  currentEnemy() {
    return current.value.enemy;
  },
  currentPath() {
    return current.value.path ?? allRooms[0];
  },
  addDamage(x: number) {
    return addDamage(x);
  },
  addPoison(x: number) {
    const armor = (store.currentEnemy()?.armor ?? 0) - store.run.room.armorDamage;
    store.run.room.poison += Math.max(0, x * store.run.weaponLevel - armor);
  },
  bandByName() {
    return bandByName.value;
  },
  onboard(name: string) {
    return onboard(name);
  },
  emptySpacesAround(row: number, col: number) {
    const empty: { row: number, col: number }[] = [];
    for (const [r, c] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]] as [number, number][]) {
      const place = c + r * store.local.band.width;
      if (store.available(r, c) && !store.local.band[place]) {
        empty.push({ row: r, col: c });
      }
    }
    return empty;
  },
  available(row: number, col: number): boolean {
    const dist = Math.max(Math.abs(row - 2), Math.abs(col - 2));
    if (lightRadius.value === 'radius3') return dist <= 2;
    if (lightRadius.value === 'radius2') return dist <= 1;
    return dist === 0;
  },
  lightRadius() {
    return lightRadius.value;
  },
}

const lightRadius = computed(() => {
  const lamplighter = friendAt(2, 2)?.name === 'Lamplighter';
  if (!lamplighter) return 'radius1';
  if (nextTo('Azrekta', 2, 2)) {
    return 'radius3';
  }
  return 'radius2';
});

watch(store.run, (newValue) => {
  localStorage.setItem('bnb-run', JSON.stringify(newValue))
}, { deep: true });
watch(store.local, (newValue) => {
  localStorage.setItem('bnb-local', JSON.stringify(newValue))
  if (store.local.settings.online && store.local.settings.teamId) {
    online.subscribe(store.local.settings.teamId, store);
  }
}, { deep: true });
if (store.local.settings.online && store.local.settings.teamId) {
  online.subscribe(store.local.settings.teamId, store);
}
watch(store.team, (newValue) => {
  localStorage.setItem('bnb-team', JSON.stringify(newValue))
  if (store.local.settings.online && store.local.settings.teamId) {
    online.updateTeam(store.local.settings.teamId, newValue);
  }
}, { deep: true });

const current = computed(() => {
  const path = turnsToPath(store.run.steps, store.run.turns);
  const room = path[path.length - 1];
  const enemy = ['combat', 'boss', 'finalboss'].includes(room.type) ? allEnemies.find((e) => e.name === room.name) : undefined;
  return { path, room, enemy };
});

function addDamage(x: number) {
  const enemy = store.currentEnemy();
  if (!enemy) return;
  if (store.run.room.damage >= enemy.health) return; // Already defeated.
  let dmg = x;
  const capturing = onboard("Mongreler");
  if (capturing) {
    dmg *= 0.01;
  }
  dmg -= (enemy.armor ?? 0) - store.run.room.armorDamage;
  if (dmg < 0) return;
  store.run.room.damage += dmg;
  if (store.run.room.damage >= enemy.health) {
    store.run.room.kills += 1;
    const remaining = (enemy.count ?? 1) - store.run.room.kills;
    if (remaining > 0) {
      store.run.room.damage = 0;
      store.run.room.armorDamage = 0;
      store.run.room.poison = 0;
    } else {
      store.run.room.damage = enemy.health;
      store.run.room.poison = 0;
      store.run.gold += enemy.rewards?.gold ?? 0;
      let fruit = enemy.rewards?.fruit ?? 0;
      if (onboard("Royal Fruitbearer")) {
        fruit *= Object.keys(bandByName.value).length;
      }
      if (onboard("Royal Fruitwearer")) {
        fruit *= Object.keys(bandByName.value).length - 1;
      }
      store.run.fruit += fruit;
      store.team.fruit += fruit;
      if (capturing) {
        store.run.capturedAbilities.push(...enemy.abilities ?? []);
      }
    }
  }
}

export async function takeTurn(turn: string, skipConfirmation?: boolean) {
  if (!skipConfirmation && !await window.confirm(`${turn}?`)) return;
  store.run.room = startingRoomData();
  store.run.steps += 1;
  if (turn !== 'Keep going') {
    store.run.turns.push(turn);
  }
  let path = turnsToPath(store.run.steps, store.run.turns);
  let room = path[path.length - 1];
  while (room.type === 'none' && !room.next) {
    // Skip rooms with nothing to do.
    store.run.steps += 1;
    path = turnsToPath(store.run.steps, store.run.turns);
    room = path[path.length - 1];
  }
  if (!store.team.discovered.includes(roomKey(room))) {
    store.team.discovered.push(roomKey(room));
  }
}

export function describeAbility(ab: base.Ability): string {
  let d = ab.description;
  if (typeof d === "function") {
    d = d(store);
  }
  if (ab.damage) {
    const dmg = getAbilityDamage(ab);
    d += `\n\n${base.numberFormat(dmg)} damage`;
  }
  return d;
}

export function getAbilityDamage(ab: base.Ability): number {
  if (!ab.damage) return 0;
  let dmg = ab.damage;
  if (typeof dmg === "function") {
    dmg = dmg(store);
  }
  dmg *= store.run.weaponLevel;
  if (onboard("The Silent Quartet") || ab.source && nextTo("The Silent Song", ab.source.row, ab.source.col)) {
    dmg *= 2;
  }
  return dmg;
}

export const bandByName = computed(() => {
  const byName = {} as Record<string, { row: number, col: number }>;
  for (let row = 0; row < store.local.band.height; row++) {
    for (let col = 0; col < store.local.band.width; col++) {
      const place = col + row * store.local.band.width;
      const n = store.local.band[place];
      if (n) {
        byName[n] = { row, col };
      }
    }
  }
  const az = byName.Azrekta;
  if (az) {
    for (const [row, col] of [[az.row - 1, az.col], [az.row + 1, az.col], [az.row, az.col - 1], [az.row, az.col + 1]] as [number, number][]) {
      const place = col + row * store.local.band.width;
      const n = store.local.band[place];
      if (!n) continue;
      const friend = friendsByName[n];
      if (friend?.super?.name) {
        delete byName[friend.name];
        byName[friend.super.name] = { row, col };
      }
    }
  }
  return byName;
});

export function friendAt(row: number, col: number): base.Friend | undefined {
  return friendsByName[store.local.band[col + row * store.local.band.width]];
}
export function nextTo(name: string, row: number, col: number): [number, number] | null {
  const b = bandByName.value[name];
  return b && Math.abs(b.row - row) + Math.abs(b.col - col) === 1 ? [b.row, b.col] : null;
}
export function onboard(name: string): { row: number, col: number } | undefined {
  const sup = friendsByName[name].super?.name;
  return bandByName.value[name] || sup && bandByName.value[sup];
}
export const fruitAvailable = computed(() => {
  return store.team.fruit - costOfPacks(store.team.packs);
});
