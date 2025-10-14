<script setup lang="ts">
import { computed, ref } from "vue";
import SlowButton from "./SlowButton.vue";
import { store, friendAt, nextTo, onboard } from "../store.ts";
import * as st from "../store.ts";
import { friendsByName } from "../friends.ts";
import Packs from "./Packs.vue";

const selected = ref(undefined as string | undefined);

function imageFor(row: number, col: number): string | undefined {
  const friend = friendAt(row, col);
  if (!friend) return undefined;
  const imageName = nextTo('Azrekta', row, col) && friend.super?.name || friend.name;
  return `images/generated/${imageName}.webp`;
}
function canSet(name: string): boolean {
  const onb = onboard(name);
  if (name === 'Lamplighter') return enabled.value && !onb;
  if (enabled.value) return true;
  if (!onb) return false;
  // Movement in battle is sometimes allowed.
  return name === 'Bayla' || !!onboard('Baylanda');
}
function set(row: number, col: number, name: string) {
  if (!canSet(name)) return;
  const onb = onboard(name);
  const cost = friendsByName[name]?.cost ?? 0;
  if (onb) {
    const savedBand = { ...store.local.band };
    remove(onb.row, onb.col);
    if (store.available(row, col)) {
      store.local.band[col + row * store.local.band.width] = name;
    }
    removeUnlit();
    if (store.run.steps > 0 && !onboard('Wayfinder')) {
      store.local.band = savedBand;
    }
  } else if (store.team.packs >= packsSpent.value + cost && store.available(row, col)) {
    store.local.band[col + row * store.local.band.width] = name;
  }
}
function remove(row: number, col: number) {
  const key = col + row * store.local.band.width;
  delete store.local.band[key];
}
function removeUnlit() {
  const band = store.local.band;
  // Drop anyone who is now on unlit tiles.
  for (let r = 0; r < band.height; r++) {
    for (let c = 0; c < band.width; c++) {
      if (!store.available(r, c)) {
        const place = c + r * band.width;
        const friend = band[place];
        if (friend) {
          remove(r, c);
        }
      }
    }
  }
}

const selectedFriend = computed(() => {
  const band = store.local.band;
  for (let row = 0; row < band.height; row++) {
    for (let col = 0; col < band.width; col++) {
      const place = col + row * band.width;
      const name = band[place];
      const friend = friendsByName[name];
      if (name === selected.value) {
        if (nextTo('Azrekta', row, col)) {
          return { ...friend, ...friend.super };
        }
        return friend;
      }
    }
  }
  return selected.value ? friendsByName[selected.value] : undefined;
});

function friendClicked(row: number, col: number) {
  const friend = friendAt(row, col);
  if (selected.value !== friend?.name) {
    selected.value = friend?.name;
  } else if (enabled.value) {
    const savedBand = { ...store.local.band };
    remove(row, col);
    removeUnlit();
    if (store.run.steps > 0 && !onboard('Wayfinder')) {
      store.local.band = savedBand;
    }
  }
}

const packsSpent = computed(() => {
  let spent = 0;
  for (const name of Object.values(store.local.band)) {
    const friend = friendsByName[name];
    if (friend) {
      spent += friend.cost;
    }
  }
  return spent;
});

type Bond = {
  image: string;
  style: string;
};

const bonds = computed(() => {
  const bonds: Bond[] = [];
  const band = store.local.band;
  for (let row = 0; row < band.height; row++) {
    for (let col = 0; col < band.width; col++) {
      const place = col + row * band.width;
      const name = band[place];
      if (!name) continue;
      const friend = friendsByName[name];
      const f = nextTo('Azrekta', row, col) ? friend.super ?? friend : friend;
      const abilities = f?.abilities ?? friend.abilities ?? [];
      const image = 'chain';
      for (const nn of ['Azrekta', 'Lord of Gears', 'The Silent Song', 'Campfinder']) {
        if (nn === 'Azrekta' && !friend.super) continue;
        if (nn === 'Lord of Gears' && !abilities.some(ab => !ab.preventAutomation)) continue;
        if (
          (nn === 'The Silent Song' || nn === 'Campfinder')
          && f.name !== 'Anvilominator' && !f.name?.startsWith('Dark') && !f.name?.startsWith('Xaranthian')
          && abilities.every(ab => !ab.damage || ab.hidden?.(store))) continue;
        const bond = nextTo(nn, row, col);
        if (bond) {
          bonds.push({
            image, style: bond[0] === row ?
              `left: ${(col + bond[1] + 1) * 103 / 2 - 15}px; top: ${(row + 0.5) * 103 - 15}px; transform: rotate(90deg);` :
              `left: ${(col + 0.5) * 103 - 15}px; top: ${(row + bond[0] + 1) * 103 / 2 - 15}px;`,
          });
        }
      }
      if (name === 'Knight of Claws') {
        for (const p of store.emptySpacesAround(row, col)) {
          bonds.push({
            image, style: p.row === row ?
              `left: ${(col + p.col + 1) * 103 / 2 - 15}px; top: ${(row + 0.5) * 103 - 15}px; transform: rotate(90deg);` :
              `left: ${(col + 0.5) * 103 - 15}px; top: ${(row + p.row + 1) * 103 / 2 - 15}px;`,
          });
        }
      } else if (name === 'Smiling Pilot') {
        if (friend.abilities?.every(ab => ab.hidden?.(store))) continue;
        bonds.push({
          image, style: `left: ${(col + 1) * 103 - 15}px; top: ${(row + 0.5) * 103 - 15}px; transform: rotate(90deg);`,
        });
        bonds.push({
          image, style: `left: ${col * 103 - 15}px; top: ${(row + 0.5) * 103 - 15}px; transform: rotate(90deg);`,
        });
      }
    }
  }
  return bonds;
});

const unusedFriends = computed(() => {
  const used = new Set(Object.values(store.local.band));
  const unused = store.team.unlocked.filter(name => !used.has(name));
  unused.sort((a, b) => friendsByName[a].cost - friendsByName[b].cost);
  return unused;
});

const enabled = computed(() => {
  if (store.run.steps === 0) return true;
  if (onboard('Wayfinder')) {
    const room = store.currentRoom();
    return room.type === 'rescue';
  }
  return false;
});
</script>

<template>
  <p>
    Your band is assembled at a total cost of
    <Packs :amount="packsSpent" />,
    leaving you with
    <Packs :amount="store.team.packs - packsSpent" />
    to hire more members.
  </p>
  <div class="band-grid" :class="{ enabled, disabled: !enabled }">
    <img class="light-ring" :src="`images/generated/light-ring.webp`" :class="store.lightRadius()" />
    <div class="band-row" v-for="(_, row) in store.local.band.height" :key="row">
      <template v-for="(_, col) in store.local.band.width" :key="col">
        <button v-if="friendAt(row, col)" class="band-cell" :class="{ unavailable: !store.available(row, col) }"
          @click="friendClicked(row, col)" :aria-label="friendAt(row, col)?.name ?? ''">
          <img v-if="friendAt(row, col)" :src="imageFor(row, col)" />
        </button>
        <button v-else-if="store.available(row, col)" class="band-cell" @click="selected && set(row, col, selected)"
          aria-label="+">
          ＋
        </button>
        <button v-else class="band-cell unavailable">
        </button>
        <template
          v-if="row === 2 && col === 2 && store.team.unlocked.includes('Lamplighter') && !onboard('Lamplighter')">
          <div v-if="!enabled" class="band-tutorial">
            Retreat to make changes to the band
          </div>
          <div v-else-if="friendAt(row, col)?.name === 'Stick Master' && selected !== 'Stick Master'"
            class="band-tutorial">
            Click me to select me
          </div>
          <div v-else-if="friendAt(row, col)?.name === 'Stick Master' && selected === 'Stick Master'"
            class="band-tutorial">
            Click me again to remove me from the band
          </div>
          <div v-else-if="!friendAt(row, col) && (selected === 'Stick Master' || !selected)" class="band-tutorial">
            Select someone below to add them to the band
          </div>
          <div
            v-else-if="!friendAt(row, col) && store.team.packs >= packsSpent + (friendsByName[selected ?? '']?.cost ?? 0) && store.available(row, col)"
            class="band-tutorial">
            Click here to add {{ selected }} to the band
          </div>
          <div v-else-if="!friendAt(row, col)" class="band-tutorial">
            Buy more <img src="/images/generated/pack.webp" class="resource-icon" />
            to afford adding {{ selected }} to the band
          </div>
        </template>
        <template v-if="row === 2 && col === 3 && onboard('Lamplighter') && Object.keys(st.bandByName).length === 1">
          <div v-if="!enabled" class="band-tutorial-narrow">
            Retreat to make changes to the band
          </div>
          <div v-else-if="(selected === 'Lamplighter' || !selected)" class="band-tutorial-narrow">
            Select someone below to add them to the band
          </div>
          <div
            v-else-if="store.team.packs >= packsSpent + (friendsByName[selected ?? '']?.cost ?? 0) && store.available(row, col)"
            class="band-tutorial-narrow">
            Click here to add {{ selected }} to the band
          </div>
          <div v-else class="band-tutorial-narrow">
            Buy more <img src="/images/generated/pack.webp" class="resource-icon" />
            to afford adding {{ selected }} to the band
          </div>
        </template>
      </template>
    </div>
    <img v-for="bond in bonds" class="chain" :src="`images/generated/${bond.image}.webp`" :style="bond.style" />
  </div>
  <p v-if="enabled" class="description" style="color: #edb; margin-bottom: 0;">
    You can change your band here. Tap members to select or remove them. Tap empty spaces to move or add the selected
    member.
  </p>
  <p v-else class="description" style="color: #edb; margin-bottom: 0;">
    You cannot change your band now. The dungeon is dangerous. Retreat to a safe place to make changes.
  </p>
  <div class="below-grid">
    <div class="band-unlocked" v-show="unusedFriends.length > 0">
      <template v-for="name in unusedFriends" :key="name">
        <button class="band-cell" @click="selected = name" @focus="selected = name" :aria-label="name"
          :class="{ unaffordable: store.team.packs < friendsByName[name].cost + packsSpent }">
          <img :src="`images/generated/${name}.webp`" />
        </button>
      </template>
    </div>
    <div class="band-details" v-if="selected && selectedFriend">
      <div class="friend-cost numbers"
        :class="{ unaffordable: store.team.packs < selectedFriend.cost + packsSpent && !onboard(selected) }">
        {{ selectedFriend?.cost ?? 0 }} <img src="/images/generated/pack.webp" class="resource-icon" />
      </div>
      <img class="friend" :src="`images/generated/${selectedFriend.name}.webp`" />
      <h1>{{ selectedFriend.name }}</h1>
      <div class="description" v-html="selectedFriend.descriptionHtml"></div>
      <template v-for="ab in selectedFriend.abilities" :key="ab.name">
        <SlowButton :title="ab.name" :catalog-mode="true"
          :description="st.describeAbility(ab, st.abilityEffects(ab), true)" :duration="st.abilityDuration(ab) * 1000"
          :affectedBySpeedLevel="ab.affectedBySpeedLevel ?? !ab.peaceful"
          :image="`images/generated/${ab.image ?? ab.name}.webp`" v-if="!ab.hideInDescription || !ab.hidden?.(store)"
          :cost="st.abilityCost(ab)"
          :tags="onboard('Desert Rabbit') && st.abilityTags({ ...ab, source: onboard(selected) })" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.band-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 10px;
  position: relative;
}

.band-row {
  display: flex;
  justify-content: center;
  gap: 3px;
}

.band-cell {
  width: 100px;
  height: 100px;
  margin: 0;
  padding: 10px;
  color: #333;
  background-color: #000;
  border-radius: 10px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    border: 0;
  }
}

.band-tutorial,
.band-tutorial-narrow {
  animation: bounce 3s ease-in-out 0s infinite;
  position: absolute;
  bottom: 55%;
  left: 63%;
  background-color: #000;
  color: #fff;
  padding: 5px 10px;
  border-radius: 15px;
  border-bottom-left-radius: 0;
}

@keyframes bounce {
  0% {
    transform: rotate(1deg) translateY(-5px);
  }

  5% {
    transform: rotate(-1deg) translateY(2px);
  }

  7% {
    transform: none;
  }

  95% {
    transform: none;
  }

  100% {
    transform: rotate(1deg) translateY(-5px);
  }
}

.band-tutorial-narrow {
  left: 82%;
}

u {
  font-size: 1.2em;
}

.band-cell.unavailable {
  border: 0;
  visibility: hidden;
}

.band-cell.unaffordable {
  border: 0.5px solid #f00;
}

.light-ring.radius1 {
  width: 110px;
}

.light-ring.radius2 {
  width: 316px;
}

.light-ring.radius3 {
  width: 522px;
}

.light-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 10px;
}

.chain {
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 3;
}

.band-unlocked {
  flex: 1 1;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  justify-content: center;
  min-width: 350px;
}

.band-details {
  flex: 1 1;
  background-color: #000;
  border-radius: 30px;
  margin: 20px 0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;

  >img {
    /* to make room for the cost */
    margin-left: 30px;
    margin-right: 30px;
  }

  h1 {
    margin-top: -10px;
    margin-bottom: 5px;
  }

  .description {
    margin-bottom: 20px;
  }

  .friend-cost {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .friend-cost.unaffordable {
    color: red;
  }

}

.below-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  gap: 20px;
}

h2 {
  margin-bottom: 0;
  font-family: 'Grenze Gotisch', serif;
  font-weight: 200;
}

.friend-cost {
  font-size: 18px;
}

.disabled button:hover {
  border-color: black;
}

.disabled button {
  outline: 0;
  cursor: default;
}
</style>
