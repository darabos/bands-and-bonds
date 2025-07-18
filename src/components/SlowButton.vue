<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';
import { store } from '../store.ts';
import { marked } from 'marked';
import Gold from './Gold.vue';
import Fruit from './Fruit.vue';
const props = defineProps({
  timerKey: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: false },
  description: { type: String, required: false },
  autostart: { type: Boolean, default: false },
  cost: { type: Object as PropType<{ gold?: number; fruit?: number }>, default: () => ({}) },
});
const emit = defineEmits(['done']);
function done() {
  if (props.timerKey.includes("Grow")) {
    console.log("Done with Grow timer:", props.timerKey);
  }
  emit('done');
  if (props.timerKey.includes("Grow")) {
    console.log("Done emitted:", props.timerKey, pointerDown.value);
  }
  if (props.autostart || pointerDown.value) {
    start();
    if (props.timerKey.includes("Grow")) {
      console.log("restarted:", props.timerKey);
    }
  }
}
function start() {
  if (!affordable.value || running.value) return;
  if (!props.duration) return;
  if (!store.run.timers[props.timerKey]) {
    store.run.gold -= props.cost.gold || 0;
    store.run.fruit -= props.cost.fruit || 0;
    store.run.timers[props.timerKey] = {
      duration: props.duration,
      automatic: props.cost,
    };
  }
}
function style() {
  if (!props.duration) {
    return {};
  }
  if (!store.run.timers[props.timerKey]) {
    return { 'background': '#333' };
  }
  const percent = (store.run.timers[props.timerKey].time ?? 0) / props.duration * 100;
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
  const aff = store.run.gold >= (props.cost.gold ?? 0) && store.run.fruit >= (props.cost.fruit ?? 0);
  return aff;
});
watch(affordable, (newVal) => {
  if (newVal && props.autostart) {
    start();
  }
});
const running = computed(() => {
  return !!store.run.timers[props.timerKey];
});
const previousCallback = store.timerCallbacks[props.timerKey];
onMounted(() => {
  console.log('SlowButton mounted:', props.timerKey);
  store.timerCallbacks[props.timerKey] = done;
  if (props.autostart) {
    start();
  }
});
onUnmounted(() => {
  console.log('SlowButton unmounted:', props.timerKey);
  if (store.timerCallbacks[props.timerKey] === done) {
    if (previousCallback) {
      store.timerCallbacks[props.timerKey] = previousCallback;
    } else {
      delete store.timerCallbacks[props.timerKey];
    }
  }
  if (store.run.timers[props.timerKey]) {
    delete store.run.timers[props.timerKey];
    // Refund price.
    store.run.gold += props.cost.gold ?? 0;
    store.run.fruit += props.cost.fruit ?? 0;
  }
});
const pointerDown = ref(false);
console.log('SlowButton setup:', props.timerKey, props.autostart);
</script>

<template>
  <button @click="start()" @pointerdown="pointerDown = true; start();" @pointerup="pointerDown = false"
    @pointercancel="pointerDown = false" @pointerleave="pointerDown = false" :style="style()"
    :class="{ disabled: !affordable || running }" class="slow">
    {{ pointerDown }}
    <img v-bind:src="props.image" />
    <div class="text">
      <div class="cost" v-if="(props.cost.gold ?? 0) > 0" :class="{ unaffordable: !affordable && !running }">
        <Gold :amount="props.cost.gold ?? 0" />
      </div>
      <div class="cost" v-if="(props.cost.fruit ?? 0) > 0" :class="{ unaffordable: !affordable && !running }">
        <Fruit :amount="props.cost.fruit ?? 0" />
      </div>
      <div class="title">{{ props.title }}</div>
      <div class="description" v-html="description"></div>
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
}

.cost.unaffordable {
  color: red;
}
</style>
