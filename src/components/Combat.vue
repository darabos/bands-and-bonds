<script setup lang="ts">
import { store, startingRunData, describeAbility, nextTo, onboard, abilityEffects, getAbilityBaseDamage, ethereal, getWeaknesses } from "../store.ts";
import { friendsByName } from "../friends.ts";
import { enemiesByName } from "../enemies.ts";
import { type Ability, type Friend, type Turn, numberFormat } from "../base.ts";
import SlowButton from "./SlowButton.vue";
import Progress from "./Progress.vue";
import { computed, ref, watch } from "vue";
import { destinationToPath, roomKey } from "../rooms.ts";
import EnemyRewards from "./EnemyRewards.vue";
import Gold from "./Gold.vue";
import Fruit from "./Fruit.vue";
import Num from "./Num.vue";
import Victory from "./Victory.vue";

const enemy = computed(() => store.currentEnemy());
const abilities = computed(() => {
  const abilities = [] as Ability[];
  const allAutomatic = !!onboard('Gear of Lords');
  const band = store.local.band;
  for (let row = 0; row < band.height; row++) {
    for (let col = 0; col < band.width; col++) {
      const place = col + row * band.width;
      const friend = friendsByName[band[place]];
      if (!friend) continue;
      const automatic = allAutomatic || !!nextTo('Lord of Gears', row, col);
      const az = nextTo('Azrekta', row, col);
      const abs = (az && friend.super?.abilities) || friend.abilities || [];
      for (const ab of abs) {
        if (ab.hidden?.(store)) continue;
        abilities.push({ ...ab, automatic, source: { name: friend.name, row, col } });
      }
    }
  }
  return abilities;
});

function executeAbility(ab: Ability) {
  if (!ab.name.includes('Illum') && !ab.name.includes("orge")) {
    console.log("Executing ability:", ab.name);
  }
  if (ab.onCompleted) {
    return ab.onCompleted(store, ab);
  }
  if (ab.damage) {
    const e = abilityEffects(ab);
    if (Math.random() < e.hitChance) {
      const dmg = getAbilityBaseDamage(ab);
      store.addDamage(Math.floor(dmg * e.damageMultiplier));
    }
  }
}
const fighting = computed(() => {
  return enemy.value && store.run.room.damage < enemy.value.health;
});

function retreat() {
  if (store.run.fruit) {
    store.team.fruit += store.run.fruit;
  }
  if (store.weaponLevel() > store.team.bestWeaponLevel) {
    store.team.bestWeaponLevel = store.weaponLevel();
  }
  const capturedMonsters = store.run.capturedMonsters;
  Object.assign(store.run, startingRunData());
  if (onboard("Monster Juggler")) {
    store.run.capturedMonsters = capturedMonsters;
  }
}
const KEEP_GOING: Turn = { title: 'Keep going', description: 'Continue exploring the dungeon.' };

const possibleTurns = computed(() => {
  const room = store.currentRoom();
  if (room.next) {
    return Object.entries(room.next).map(([title, next]) => ({ ...next, title }));
  }
  if (room.end) {
    return [];
  }
  return [KEEP_GOING];
});

const plannedTurn = computed(() => {
  const wf = onboard("Wayfinder");
  if (store.run.steps === 0 || !wf || !store.local.destination) return;
  const room = store.currentRoom();
  if (roomKey(room) === store.local.destination && wf.row < 2) {
    return { title: 'Retreat', description: 'The Wayfinder leads you back to the beginning.' };
  }
  if (room.end) return;
  const path = destinationToPath(store.local.destination);
  if (path.length <= store.run.steps + 1) return;
  if (!room.next) return roomKey(room) === roomKey(path[store.run.steps]) ? KEEP_GOING : undefined;
  const nextRoom = path[store.run.steps + 1];
  for (const [title, next] of Object.entries(room.next)) {
    if (nextRoom.label === next.label) {
      return { title, description: next.description };
    }
  }
});
function takeTurn(turn: string) {
  if (turn === 'Retreat') {
    retreat();
    store.run.steps += 1; // Get started on the next run immediately.
  } else {
    store.takeTurn(turn);
  }
}

const passiveEffects = computed(() => {
  const effects = [] as string[];
  for (const name in store.bandByName()) {
    const friend = friendsByName[name];
    if (friend?.passiveEffects) {
      effects.push(...friend.passiveEffects);
    }
  }
  if (!enemy.value) return effects;
  const count = enemy.value.count ?? 1;
  const s = count > 1 ? '' : 's';
  const is = count > 1 ? 'are' : 'is';
  effects.push(...enemy.value.passiveEffects ?? []);
  if (enemy.value.immune) {
    const attacks = [];
    for (const i of enemy.value.immune) {
      attacks.push(`<u>${i} attacks</u>`);
    }
    effects.push(
      `${enemy.value.name} ${is} immune to ${attacks.join(' and ')}.`);
  }
  if (enemy.value.dodge) {
    effects.push(
      `${enemy.value.name} dodge${s} attacks that take longer
      than ${numberFormat(enemy.value.dodge)} second${enemy.value.dodge === 1 ? "" : "s"}.
      Faster attacks have a chance to hit.`);
  }
  if (ethereal.value) {
    effects.push(
      `Enemy is ethereal${enemy.value.ethereal ? "" : " due to Azrekta's presence"}. Most attacks will miss.`);
  }
  if (onboard("Desert Rabbit")) {
    const weaknesses = [];
    for (const weakness of getWeaknesses(enemy.value)) {
      if (['left', 'right', 'front', 'back'].includes(weakness)) {
        weaknesses.push(`<u>attacks from the ${weakness}</u>`);
      } else {
        weaknesses.push(`<u>${weakness} attacks</u>`);
      }
    }
    if (weaknesses.length > 0) {
      const animal = onboard("Desert Armadillo") ? 'Desert Armadillo' : 'Desert Rabbit';
      effects.push(`${animal} tells you that ${enemy.value.name} ${is} weak to ${weaknesses.join(' and ')}.`);
    }
  }
  return effects;
});

function nth(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${numberFormat(n)}<sup>${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}</sup>`;
}

const rescuedFriend = computed(() => {
  const room = store.currentRoom();
  return room?.type === 'rescue' && room.name && friendsByName[room.name];
});
const rescueAvailable = computed(() => {
  const friend = rescuedFriend.value;
  return friend && !store.team.unlocked.includes(friend.name);
});
const justRescued = ref<Friend | null>(null);
function unlockRescue() {
  const friend = rescuedFriend.value;
  if (!friend) return;
  store.team.unlocked.push(friend.name);
  justRescued.value = friend;
}
watch(() => store.run.steps, () => {
  if (justRescued.value && store.currentRoom().name !== justRescued.value.name) {
    justRescued.value = null;
  }
});

function abilityPrice(ab: Ability) {
  if (ab.consumes) {
    if (typeof ab.consumes === 'function') {
      return ab.consumes(store);
    }
    return ab.consumes;
  }
  return {};
}

const hideActions = ref(false);

// Preload victory images.
for (const url of [
  'images/generated/victory1.webp',
  'images/generated/victory2.webp',
  'images/generated/victory3.webp',
  'images/generated/victory4.webp',
]) {
  const img = new Image();
  img.src = url;
}
</script>

<template>
  <div class="enemy" v-if="enemy">
    <template v-if="enemy.count && enemy.count > 1">
      <div class="description" v-if="store.run.room.kills < enemy.count">Currently fighting the
        <span class="numbers" v-html="nth(store.run.room.kills + 1)" /> of
        <Num :amount="enemy.count" />
      </div>
      <div class="description" v-else>Defeated
        <Num :amount="enemy.count" /> enemies! You gained
        <EnemyRewards :enemy="enemy" />.
      </div>
    </template>
    <template v-else>
      <div class="description" v-if="enemy.health > store.run.room.damage">Currently fighting:</div>
      <div class="description" v-else>Defeated! You gained
        <EnemyRewards :enemy="enemy" />.
      </div>
    </template>
    <h1>{{ enemy.name }}</h1>
    <img :src="`images/generated/${enemy.name}.webp`" :alt="enemy.name" :class="{ ethereal }"
      :style="enemy.health <= store.run.room.damage && { filter: 'saturate(0.3) contrast(1.5)' }" />
    <Progress :value="enemy.health - store.run.room.damage" :max="enemy.health" color="#c00" label="HP" />
    <Progress v-if="enemy.armor" :value="enemy.armor - store.run.room.armorDamage" :max="enemy.armor" color="#666"
      label="Armor" title="Armor is subtracted from damage" />
  </div>
  <div class="rescue" v-if="justRescued">
    <img :src="`images/generated/${justRescued.name}.webp`" :alt="justRescued.name" />
    <h1>{{ justRescued.name }}</h1>
    <p class="description" style="margin-top: 0;">has joined you!</p>
    <div class="description" v-html="justRescued.descriptionHtml"></div>
  </div>
  <div class="scene" v-else-if="rescueAvailable">
    <img src="/images/generated/rescue-locked.webp" alt="A creature in a cage" />
    <h1>Prisoner found</h1>
    <p class="description">You see a hooded figure in a cage. Will you let them out?</p>
  </div>
  <div class="scene" v-else-if="rescuedFriend">
    <img src="/images/generated/camp.webp" alt="Adventurers around a campfire" />
    <h1>Camping</h1>
    <p class="description">You rescued {{ rescuedFriend.name }} here earlier. You stop to recover your strength.</p>
  </div>
  <div class="passive-effect" v-for="effect in passiveEffects" v-html="effect" />
  <Victory :show="!!store.run.timers.celebrating" @on-start="hideActions = true;" @on-end="hideActions = false;" />
  <div class="actions" v-show="!hideActions">
    <template v-for="ab in abilities" :key="ab.name">
      <SlowButton v-if="store.run.steps > 0 && (fighting || ab.peaceful)" :timer-key="`ability-${ab.name}`"
        :title="ab.name" :description="describeAbility(ab)" :cost="abilityPrice(ab)"
        :image="`images/generated/${ab.image ?? ab.name}.webp`" :duration="ab.duration * 1000"
        @done="if (ab.name.includes('Grow')) console.log('done', ab); executeAbility(ab)" :autostart="ab.automatic" />
    </template>
    <div v-if="store.run.capturedMonsters.length > 0" class="section">Captured Monsters</div>
    <template v-for="monster in store.run.capturedMonsters" :key="monster">
      <template v-for="ab in enemiesByName[monster].abilities" :key="ab.name">
        <SlowButton v-if="store.run.steps > 0 && (fighting || ab.peaceful)" :timer-key="`ability-${ab.name}`"
          :title="ab.name" :description="describeAbility(ab)" :cost="abilityPrice(ab)"
          :image="`images/generated/${ab.image ?? ab.name}.webp`" :duration="ab.duration * 1000"
          @done="executeAbility(ab)" :autostart="ab.automatic" />
      </template>
    </template>
    <template v-if="fighting">
      <div class="section">Navigation</div>
    </template>
    <template v-else-if="plannedTurn">
      <div class="section">Navigation</div>
      <SlowButton v-if="!hideActions" timer-key="wayfinder-turn" :duration="1000" :title="plannedTurn.title!"
        :description="plannedTurn.description" :image="`images/generated/${plannedTurn.title}.webp`"
        @done="takeTurn(plannedTurn.title!)" :autostart="true" />
    </template>
    <template v-else>
      <SlowButton v-if="rescueAvailable" timer-key="rescue-unlock" :duration="8000" title="Rescue prisoner"
        description="Take the poor creature with you." image="images/generated/rescue-unlock.webp"
        @done="unlockRescue()" />
      <div class="section">Navigation</div>
      <button v-for="turn in possibleTurns" :key="turn.title" @click="store.takeTurn(turn.title!)">
        <img :src="`images/generated/${turn.title}.webp`" />
        <div class="text">
          <div class="title">{{ turn.title }}</div>
          <div class="description">
            <p>{{ turn.description }}</p>
          </div>
        </div>
      </button>
    </template>
    <button @click="retreat()" v-if="store.run.steps > 0">
      <img src="/images/generated/Retreat.webp" />
      <div class="text">
        <div class="title">Retreat</div>
        <div class="description">
          <p>
            Leave the dungeon and return to safety.
            <template v-if="store.run.gold > 0 && store.run.fruit > 0">
              You will lose
              <Gold :amount="store.run.gold" /> but keep the
              <Fruit :amount="store.run.fruit" /> you've collected.
            </template>
            <template v-else-if="store.run.gold > 0">
              You will lose
              <Gold :amount="store.run.gold" />.
            </template>
            <template v-else-if="store.run.fruit > 0">
              You keep the
              <Fruit :amount="store.run.fruit" /> you've collected.
            </template>
          </p>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.enemy {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  img {
    transition: filter 2s;
  }
}

.enemy img,
.scene img {
  width: 100px;
  height: 100px;
  border-radius: 40%;
  border: 2px outset #edb;
  box-shadow: 0 0 10px #000;
}

.enemy img.ethereal {
  border-top-color: #ace;
  border-left-color: #e8c;
  border-bottom-color: #e8c;
  border-right-color: #8af;
}

.rescue {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  border-radius: 10px;
  padding: 10px 30px;
  padding-top: 0;
  margin: 10px 0;

  img {
    width: 200px;
    mix-blend-mode: lighten;
    margin-top: -45px;
  }

  h1 {
    margin-top: -15px;
    margin-bottom: 0px;
  }
}

.scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;

  h1 {
    margin: 0px;
  }
}

.actions {
  margin: 20px 0;
  columns: 310px auto;
  width: 100%;

  .section {
    display: block;
    color: #edb;
    break-after: avoid;
  }

  .section:before,
  .section:after {
    content: ' — ';
  }
}

.actions>* {
  display: flex;
  margin: 0 auto;
  margin-bottom: 10px;
}

.passive-effect {
  color: #edb;
  margin-top: 10px;
}
</style>
