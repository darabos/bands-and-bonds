<script lang="ts" setup>
import { costOfPacks } from "../base.ts";
import { lastRun, store } from "../store.ts";
import Fruit from "./Fruit.vue";
import WeaponLevel from "./WeaponLevel.vue";
import { computed, ref, watch } from "vue";
const reveal = ref(0);
const weaponLevelPreserved = computed(() => {
  if (!lastRun.value) return 0;
  return lastRun.value.hadAnvilominator
    ? lastRun.value.weaponLevelAdded
    : lastRun.value.hadAnvilomancer
      ? Math.floor(Math.sqrt(lastRun.value.weaponLevelAdded))
      : 0;
});
const show = computed(() => !!lastRun.value && (lastRun.value.fruit > 0 || lastRun.value.weaponLevelAdded > 0));
watch(lastRun, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    reveal.value = 0;
    const interval = setInterval(() => {
      reveal.value += 1;
      if (reveal.value >= 6) {
        clearInterval(interval);
      }
    }, 150);
  }
}, { immediate: true });
const duration = { enter: 300, leave: 0 };
</script>

<template>
  <div class="retreat-results">
    <Transition :duration="duration">
      <h1 v-if="show" class="header-top">
        <img src="/images/generated/fruit.webp" class="decoration-1" />
        <img src="/images/generated/fruit.webp" class="decoration-2" />
        <img src="/images/generated/fruit.webp" class="decoration-3" />
        Retreated
        <img src="/images/generated/fruit.webp" class="decoration-3" />
        <img src="/images/generated/fruit.webp" class="decoration-2" />
        <img src="/images/generated/fruit.webp" class="decoration-1" />
      </h1>
    </Transition>
    <table class="math" v-if="show">
      <tbody>
        <Transition :duration="duration">
          <tr v-if="reveal >= 1" :style="{ opacity: reveal >= 2 ? '1' : '0' }">
            <td class="label">
              Collected:
            </td>
            <td>
              <Fruit :amount="lastRun!.fruit" :start-amount="reveal >= 2 ? 1 : undefined" />
            </td>
            <td v-if="lastRun!.weaponLevelAdded > 0">
              <WeaponLevel :amount="lastRun!.weaponLevelAdded" :start-amount="reveal < 2 ? undefined : 1" />
            </td>
          </tr>
        </Transition>
        <Transition>
          <tr v-if="reveal >= 3 && weaponLevelPreserved > 0 && lastRun!.hadAnvilomancer"
            :style="{ opacity: reveal >= 4 ? '1' : '0' }">
            <td colspan="2" class="label" v-if="lastRun!.hadAnvilominator">
              Anvilominator preserves:
            </td>
            <td colspan="2" class="label" v-else>
              Anvilomancer preserves:
            </td>
            <td>
              <WeaponLevel :amount="weaponLevelPreserved" :permanent="true"
                :start-amount="reveal < 4 ? undefined : 1" />
            </td>
          </tr>
        </Transition>
        <Transition>
          <tr v-if="reveal >= 5" :style="{ opacity: reveal >= 6 ? '1' : '0' }">
            <td class="label">You have:</td>
            <td>
              <Fruit
                :start-amount="reveal < 6 ? undefined : store.team.fruit - costOfPacks(store.team.packs) - lastRun!.fruit"
                :amount="store.team.fruit - costOfPacks(store.team.packs)" />
            </td>
            <td v-if="weaponLevelPreserved > 0">
              <WeaponLevel :amount="store.weaponLevel()" :permanent="true"
                :start-amount="reveal < 6 ? undefined : store.weaponLevel() - weaponLevelPreserved" />
            </td>
          </tr>
        </Transition>
      </tbody>
    </table>
    <Transition :duration="duration">
      <h1 v-if="show" class="header-bottom">
        <img src="/images/generated/fruit.webp" class="decoration-1" />
        <img src="/images/generated/fruit.webp" class="decoration-2" />
        <img src="/images/generated/fruit.webp" class="decoration-3" />
        <img src="/images/generated/fruit.webp" class="decoration-2" />
        <img src="/images/generated/fruit.webp" class="decoration-1" />
      </h1>
    </Transition>
  </div>
</template>

<style scoped>
.retreat-results {
  font-weight: bold;
}

td {
  text-align: right;
  padding: 0 30px;
  transition: font-size 0.15s;
}

.decoration-1 {
  width: 7px;
  padding: 0 2px
}

.decoration-2 {
  width: 11px;
}

.decoration-3 {
  width: 15px;
}

.header-top,
.header-bottom {
  box-sizing: border-box;
  border: 30px solid transparent;
  border-top: none;
  border-bottom: none;
  margin: 0;
  padding: 2px 20px;
  transition: opacity 0.3s linear;
}

.header-top {
  border-top: none;
  border-bottom: 1px solid #edb;

  img {
    margin-bottom: -2px;
  }
}

.header-bottom {
  border-top: 1px solid #edb;
  padding-top: 5px;

  img {
    vertical-align: top;
  }
}

td.label {
  text-align: left;
}

tr {
  transition: opacity 0.3s linear;
}

tr.v-enter-from td {
  font-size: 0;
}

tr.v-enter-to td {
  font-size: 1em;
}

table {
  border-spacing: 0;
}

.header-top.v-enter-from,
.header-bottom.v-enter-from {
  opacity: 0;
}

.header-top.v-enter-to,
.header-bottom.v-enter-to {
  opacity: 1;
}
</style>
