<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import Combat from './components/Combat.vue'
import MapPage from './components/Map.vue'
import Band from './components/Band.vue'
import Settings from './components/Settings.vue'
import { store } from './store.ts'
import { numberFormat, costOfPacks } from './base';

const animationFrameId = ref<number | null>(null);
const lastFrameTime = ref(performance.now());
const lastRegenTime = ref(performance.now());
const lastSaplingTime = ref(performance.now());

type SelectedPage = 'combat' | 'map' | 'band' | 'settings';
const loadedPage = localStorage.getItem('bnb-current-page') as SelectedPage;
const page = ref<SelectedPage>(loadedPage ?? 'combat');
watch(page, (newValue) => {
  localStorage.setItem('bnb-current-page', newValue);
});

function mainLoop() {
  const currentTime = performance.now();
  // Spend at most 200 ms wall time catching up in chunks of increasing game time.
  let k = 0;
  let chunk = 100;
  while (lastFrameTime.value < currentTime && performance.now() < currentTime + 200) {
    runTo(Math.min(lastFrameTime.value + chunk, currentTime));
    k++;
    chunk = Math.floor(chunk * 1.1);
  }
  if (k > 1) console.log(`Caught up ${k} frames.`);
  animationFrameId.value = requestAnimationFrame(mainLoop);
}

const testMode = window.location.search.includes("test");
function runTo(currentTime: number) {
  let baseTime = currentTime;
  if (store.run.skipTime) {
    baseTime += store.run.skipTime;
    store.run.skipTime = 0;
  }
  let deltaTime = baseTime - lastFrameTime.value;
  const multiplier = testMode ? 100 : 1;
  deltaTime *= multiplier;
  const enemy = store.currentEnemy();
  if (enemy && store.run.room.damage < enemy.health) {
    deltaTime /= enemy?.slowTime ?? 1;
  }
  for (const [key, t] of Object.entries(store.run.timers)) {
    t.time ??= 0;
    if (t.affectedBySpeedLevel) {
      t.time += deltaTime * store.run.speedLevel;
    } else {
      t.time += deltaTime;
    }
    const times = Math.floor(t.time / t.duration);
    if (times > 0) {
      t.time -= t.duration * times;
      store.timerFinished(key, t, times);
    }
  }
  if (enemy && store.run.room.damage < enemy.health) {
    const poisonMultiplier = store.run.timers["monster-Decay Manifest-ability-Waft of Decay"] ? 2 : 1;
    const regenPerSecond = multiplier * ((enemy.regen ?? 0) - store.run.room.poison * poisonMultiplier);
    const regen = (baseTime - lastRegenTime.value) * regenPerSecond / 1000;
    if (regen > 1) {
      store.run.room.damage = Math.max(0, store.run.room.damage - Math.floor(regen));
      lastRegenTime.value += Math.floor(regen) / regenPerSecond * 1000;
    } else if (regen < -1) {
      store.addDamage(Math.floor(-regen), 1, { ignoreArmor: true });
      lastRegenTime.value -= Math.floor(-regen) / regenPerSecond * 1000;
    } else if (regen === 0) {
      lastRegenTime.value = currentTime;
    }
  }
  if (store.run.saplings > 0) {
    const fruitPerSecond = multiplier * store.run.saplings * store.fruitMultiplier();
    const fruits = (baseTime - lastSaplingTime.value) * fruitPerSecond / 1000;
    if (fruits > 1) {
      store.run.fruit += Math.floor(fruits);
      lastSaplingTime.value += Math.floor(fruits) * 1000 / fruitPerSecond;
    }
  } else {
    lastSaplingTime.value = currentTime;
  }
  lastFrameTime.value = currentTime;
}

const fruit = computed(() => store.team.fruit + store.run.fruit - costOfPacks(store.team.packs));

onMounted(() => {
  animationFrameId.value = requestAnimationFrame(mainLoop);
});

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>

<template>
  <div style="display: contents;" :class="{ 'blur-images': store.local.settings.blurImages, 'test-mode': testMode }"
    class="app">
    <div class="header">
      <div class="header-header">
        <div id="header-gold" class="numbers">
          <template v-if="store.run.gold">
            <img src="/images/generated/gold.webp" class="header-icon" />
            {{ numberFormat(store.run.gold) }}
          </template>
          <template v-if="store.run.saplings">
            &nbsp;<img src="/images/generated/sapling.webp" class="header-icon" />
            {{ numberFormat(store.run.saplings) }}
          </template>
        </div>
        <div class="logo title">
          <img src="/images/generated/logo.webp" alt="B" />ands
          <span style="color: #edb;">&nbsp;&&nbsp;</span>
          <img src="/images/generated/logo.webp" alt="B" />onds
        </div>
        <div id="header-fruit" class="numbers">
          <template v-if="fruit">{{ numberFormat(fruit) }}
            <img src="/images/generated/fruit.webp" class="header-icon" title="Gold spoils. Fruit is forever." />
          </template>
          &nbsp;
          {{ numberFormat(store.team.packs) }}
          <img src="/images/generated/pack.webp" class="header-icon" />
        </div>
      </div>
      <div class="tabs">
        <button :class="{ selected: page === 'combat' }" @click="page = 'combat'">Fight</button>
        <button :class="{ selected: page === 'map' }" @click="page = 'map'">Map</button>
        <button :class="{ selected: page === 'band' }" @click="page = 'band'">Band</button>
        <button :class="{ selected: page === 'settings' }" @click="page = 'settings'">Settings</button>
      </div>
    </div>
    <div class="page-container" v-show="page === 'combat'">
      <Combat :testMode="testMode" />
    </div>
    <div class="page-container" v-show="page === 'map'">
      <MapPage />
    </div>
    <div class="page-container" v-show="page === 'band'">
      <Band />
    </div>
    <div class="page-container" v-show="page === 'settings'">
      <Settings />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  min-width: 512px;
  flex-direction: column;
  background-color: #000;
  padding: 10px;
  padding-bottom: 0;
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;

  .header-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 20px;
  }

  .header-icon {
    width: 30px;
    height: 30px;
    vertical-align: top;
  }

  #header-gold {
    text-align: left;
  }

  #header-fruit {
    text-align: right;
  }

  #header-gold,
  #header-fruit {
    flex: 1 1 25%;
    white-space: nowrap;
  }

  .logo {
    flex: 1 1 50%;
  }
}


@media (max-width: 800px) {
  .header {
    .header-header {
      flex-wrap: wrap;
    }

    #header-gold,
    #header-fruit {
      order: 2;
      flex: 1 1 50%;
    }

    .logo {
      order: 1;
      flex: 1 1 100%;
    }
  }
}

.tabs {
  display: flex;
  justify-content: space-around;

  button {
    display: inline-block;
    width: auto;
    background-color: transparent;
    border-radius: 0;
    padding: 5px 10px;
    font-size: 20px;
    border: none !important;
    outline: none !important;
    color: #bbb;
  }

  button:hover,
  button:focus,
  button.selected {
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-thickness: 1px;
  }

  button.selected {
    color: #edb;
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  font-size: 35px;
  position: relative;
  padding: 0 30px;
}

.logo img {
  width: 60px;
  height: 60px;
  margin-left: -10px;
  margin-right: -10px;
}

.logo span {
  z-index: 1;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
  width: 100%;
}
</style>
