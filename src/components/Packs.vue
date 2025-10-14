<script lang="ts" setup>
import { defineProps } from 'vue';
import Num from './Num.vue';
const props = defineProps<{
  amount?: number;
}>();
</script>

<template>
  <template v-if="props.amount === undefined">
    <img src="/images/generated/pack.webp" class="resource-icon resource-icon-solo" />
  </template>
  <template v-else>
    <Num :amount="props.amount">
      <img src="/images/generated/pack.webp" class="resource-icon" />
    </Num>
  </template>
</template>
