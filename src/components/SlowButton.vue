<script setup lang="ts">
import { marked } from 'marked';
import { computed, onUnmounted, ref, watch, type PropType } from 'vue';
import { store, modifiedDurationFormat } from '../store.ts';
import Fruit from './Fruit.vue';
import Gold from './Gold.vue';
import Saplings from './Saplings.vue';
import { costOfPacks, durationFormat, type Resources } from '../base.ts';
const props = defineProps({
  timerKey: { type: String, required: false },
  title: { type: String, required: true },
  tags: { type: Array, required: false },
  image: { type: String, required: true },
  duration: { type: Number, required: false },
  catalogMode: { type: Boolean, required: false },
  description: { type: String, required: false },
  autostart: { type: Boolean, default: false },
  holdAutomatically: { type: Boolean, default: true },
  affectedBySpeedLevel: { type: Boolean, default: false },
  cost: { type: Object as PropType<Resources>, default: () => ({ gold: 0, fruit: 0, saplings: 0 }) },
});
function start() {
  if (!props.timerKey || !props.duration) return;
  if (!affordable.value) return;
  store.startTimer(props.timerKey, {
    duration: props.duration,
    cost: props.cost,
    automatic: props.autostart || pointerDown.value,
    affectedBySpeedLevel: props.affectedBySpeedLevel,
  });
}
function style() {
  if (!props.duration || !props.timerKey) {
    return {};
  }
  const t = store.run.timers[props.timerKey];
  if (!t) {
    return { 'background': '#333' };
  }
  const percent = (t.time ?? 0) / t.duration * 100;
  const color = '#486';
  const bgColor = '#333';
  return {
    border: `1px solid ${color} !important`,
    background: `
    linear-gradient(
      95deg,
      ${color}, ${percent}%, ${color}, ${percent}%, ${bgColor}, ${bgColor}
      ) no-repeat` };
}
const description = computed(() => {
  return props.description ? marked(props.description) : "";
});
const affordable = computed(() => {
  if (props.timerKey === 'buy-pack') return costOfPacks(store.team.packs + 1) <= store.team.fruit;
  const aff = store.run.gold >= props.cost.gold && store.run.fruit >= props.cost.fruit && store.run.saplings >= props.cost.saplings;
  return aff;
});
watch(affordable, (newVal) => {
  if (newVal && (props.autostart || pointerDown.value)) {
    start();
  }
});
if (props.autostart && affordable.value) {
  start();
}
const running = computed(() => {
  return props.timerKey && !!store.run.timers[props.timerKey];
});
const pointerDown = ref(false);
watch(pointerDown, (newVal) => {
  if (!props.timerKey || props.autostart || !store.run.timers[props.timerKey]) return;
  store.run.timers[props.timerKey].automatic = newVal;
  if (!newVal) {
    if (store.run.lastHeld === props.timerKey) {
      store.run.lastHeld = undefined;
    } else if (props.holdAutomatically) {
      store.run.lastHeld = props.timerKey;
    }
  }
});
onUnmounted(() => {
  if (props.timerKey && store.run.timers[props.timerKey]) {
    delete store.run.timers[props.timerKey];
    if (store.run.lastHeld === props.timerKey) {
      store.run.lastHeld = undefined;
    }
    // Refund cost.
    store.run.gold += props.cost.gold;
    store.run.fruit += props.cost.fruit;
    store.run.saplings += props.cost.saplings;
  }
});

const duration = computed(() => modifiedDurationFormat(props.duration, props.affectedBySpeedLevel));
const baseDuration = computed(() => props.duration ? durationFormat(props.duration) : undefined);
</script>

<template>
  <button @click="start()" @pointerdown="pointerDown = true; start();" @pointerup="pointerDown = false"
    @blur="if (props.timerKey === store.run.lastHeld) store.run.lastHeld = undefined;"
    @pointercancel="pointerDown = false" @pointerleave="pointerDown = false" :style="style()"
    :class="{ 'can-hold': true, disabled: !affordable || running }" class="slow">
    <div>
      <img v-bind:src="props.image" />
      <div class="tags"><span v-for="tag in props.tags" class="tag" :class="tag"></span></div>
    </div>
    <div class="text">
      <div class="cost" v-if="props.cost.gold > 0" :class="{ unaffordable: !affordable && !running }">
        <Gold :amount="props.cost.gold" />
      </div>
      <div class="cost" v-if="props.cost.fruit > 0" :class="{ unaffordable: !affordable && !running }">
        <Fruit :amount="props.cost.fruit" />
      </div>
      <div class="cost" v-if="props.cost.saplings > 0" :class="{ unaffordable: !affordable && !running }">
        <Saplings :amount="props.cost.saplings" />
      </div>
      <div class="title">{{ props.title }}</div>
      <div class="description" v-html="description"></div>
      <div v-show="running" class="duration numbers">{{ duration }}</div>
      <div v-if="catalogMode" class="duration numbers">
        {{ duration }}
        <template v-if="baseDuration && duration !== baseDuration"> (base: {{ baseDuration }}) </template>
      </div>
    </div>
  </button>
</template>

<style scoped>
.text {
  width: 100%;
}

.cost {
  float: right;
  margin: 5px;
  margin-top: 1px;
}

.cost.unaffordable {
  color: red;
}

.duration {
  position: absolute;
  bottom: 2px;
  right: 8px;
  font-size: 12px;
  color: #486;
}

.tags {
  text-align: center;
}
</style>
