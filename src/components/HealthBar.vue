<script setup lang="ts">
import { ref, watch } from 'vue';
import { numberFormat } from '../base.ts'

const props = defineProps<{
  value: number
  max: number
  color?: string
  label?: string
  title?: string
  regen?: number
}>()
const scratched = ref(false);
watch(() => props.value, (newValue, oldValue) => {
  if (newValue < oldValue) {
    scratched.value = true;
  }
});
</script>

<template>
  <div class="progress-container" :title="title">
    <div class="progress-bar" v-show="value > 0" :style="{ width: `${(value / max) * 100}%`, backgroundColor: color }">
    </div>
    <div class="progress-text numbers" v-if="!scratched">
      {{ numberFormat(max) }} {{ label }}
    </div>
    <div class="progress-text numbers" v-else>
      {{ numberFormat(value) }} / {{ numberFormat(max) }} {{ label }}
      <div class="regen" v-if="regen">{{ `+${numberFormat(regen)}/s` }}</div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  position: relative;
  width: 240px;
  background-color: #333;
  border-radius: 4px;
  border: 1px solid #000;
  overflow: hidden;
  margin-top: 8px;
  margin-left: auto;
  margin-right: auto;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background-color: #4caf50;
  border-right: 1px solid #000;
  transition: width 0.1s;
}

.progress-text {
  position: relative;
  padding: 0 8px;
  font-weight: bold;
  font-size: 20px;
  text-align: right;
}

.regen {
  font-size: 12px;
  color: #fffa;
  margin-top: -4px;
  margin-bottom: 4px;
}
</style>
