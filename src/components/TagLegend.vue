<script setup lang="ts">
const tags = ['fire', 'ice', 'water', 'ranged', 'sharp', 'blunt', 'poison', 'dark', 'light', 'bite', 'sound', 'sand', 'undodgeable'];
tags.sort();
</script>

<template>
  Known attack types:
  <div class="description tags">
    <div class="tag-with-text" v-for="tag in tags">
      <span class="tag" :class="tag" /> <span class="tag-text">{{ tag }}</span>
    </div>
  </div>
</template>
<style scoped>
.tags {
  columns: 3;
  font-size: 16px;
  margin: 0 20px;
}

.tag-with-text {
  white-space: nowrap;
}
</style>
