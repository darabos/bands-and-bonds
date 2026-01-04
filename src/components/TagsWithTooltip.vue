<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  tags?: string[],
}>();

const textVisible = ref(false);

function showText() {
  textVisible.value = true;
}

function hideText() {
  textVisible.value = false;
}
</script>

<template>
  <div class="tags" v-if="props.tags && props.tags.length > 0" @mouseenter="showText" @mouseleave="hideText">
    <template v-if="textVisible">
      <div class="tag-with-text" v-for="tag in props.tags">
        <span class="tag" :class="tag" /> <span class="tag-text">{{ tag }}</span>
      </div>
    </template>
    <div v-else>
      <span class="tag" :class="tag" :key="tag" v-for="tag in props.tags" />
    </div>
  </div>

</template>
<style scoped>
.tags {
  margin: auto;
  width: fit-content;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.tag-with-text {
  white-space: nowrap;
}
</style>
