<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import Num from './Num.vue';
import NumCounter from './NumCounter.vue';
const props = defineProps<{
  amount?: number;
  startAmount?: number;
  permanent?: boolean;
}>();
const image = computed(() => props.permanent ? 'weapon-level-permanent' : 'weapon-level-temporary');
</script>

<template>
  <template v-if="props.amount === undefined">
    <img :src="`images/generated/${image}.webp`" class="resource-icon resource-icon-solo" />
  </template>
  <template v-else-if="props.startAmount === undefined">
    <Num :amount="props.amount">
      <img :src="`images/generated/${image}.webp`" class="resource-icon" />
    </Num>
  </template>
  <template v-else>
    <NumCounter :amount="props.amount" :start-amount="props.startAmount">
      <img :src="`images/generated/${image}.webp`" class="resource-icon" />
    </NumCounter>
  </template>
</template>

<style scoped>
.resource-icon {
  transform: rotate(225deg);
}
</style>
