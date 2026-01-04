<script setup lang="ts">
const props = defineProps<{
  tags?: string[],
}>();
</script>

<template>
  <div class="tags" v-if="props.tags && props.tags.length > 0">
    <div class="tag-with-text" v-for="tag in props.tags">
      <span class="tag" :class="tag" /> <span class="tag-text">{{ tag }}</span>
    </div>
  </div>
</template>
<style scoped>
.tag-text {
  display: none;
}

.tag-with-text {
  display: inline-block;
  white-space: nowrap;
}

.tags:hover {
  margin: auto;
  width: fit-content;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: start;

  .tag-text {
    display: inline;
  }
}
</style>
