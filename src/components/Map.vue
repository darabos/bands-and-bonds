<script setup lang="ts">
import { onboard, store } from "../store.ts";
import { type Room, allRooms, destinationToPath, roomKey, turnsToPath } from "../rooms.ts";
import curvedLine from "./curved-line.ts";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

const mapElement = useTemplateRef('mapElement');
const scale = ref(1.0);

const resizeObserver = new ResizeObserver(() => {
  if (!mapElement.value) return;
  scale.value = mapElement.value.clientWidth / 800;
});
onMounted(() => {
  if (!mapElement.value) return;
  scale.value = mapElement.value.clientWidth / 800;
  resizeObserver.observe(mapElement.value);
});
onUnmounted(() => {
  resizeObserver.disconnect();
});

const rooms = computed(() => turnsToPath(store.run.steps, store.run.turns));
const pos = ref({ x: 0, y: 0 });

function icon(room: Room) {
  return room.type;
}

function style(room: Room, factor?: number) {
  if (!mapElement.value) return { display: 'none' };
  const x = room.x * scale.value;
  const y = room.y * scale.value;
  let s = 30 * scale.value * (factor ?? 1);
  if (room.type === 'boss') {
    s *= 1.2;
  }
  if (room.type === 'finalboss') {
    s *= 2;
  }
  return {
    left: `${x - s / 2}px`,
    top: `${y - s / 2}px`,
    width: `${s}px`,
    height: `${s}px`,
  };
}

function roomClicked(room: Room) {
  const key = roomKey(room);
  if (onboard("Wayfinder") && store.discovered.includes(key)) {
    store.destination = key;
  }
}

const line = computed(() => curvedLine(20, scale.value, rooms.value));
const planRooms = computed(() => onboard("Wayfinder") && store.destination ? destinationToPath(store.destination) : []);
const planLine = computed(() => curvedLine(20, scale.value, planRooms.value));

</script>

<template>
  <div class="map" ref="mapElement">
    <div class="map-backdrop" />
    { x: {{ pos.x }}, y: {{ pos.y }} }
    <svg width="100%" height="100%">
      <path :d="line" stroke="white" :stroke-width="5 * scale" fill="none" />
      <path :d="planLine" stroke="white" :stroke-width="3 * scale" stroke-dasharray="3 5" fill="none" />
    </svg>
    <template v-for="room in allRooms">
      <img v-if="room.type !== 'none'" :alt="room.name" :style="style(room)"
        @mouseenter="pos = { x: room.x, y: room.y }" :src="`images/generated/${icon(room)}-outlined.webp`"
        :class="{ marker: true, undiscovered: !store.discovered.includes(roomKey(room)) }" @click="roomClicked(room)" />
    </template>
    <img v-if="store.run.steps > 0" :style="style(rooms[rooms.length - 1], 2)" src="/images/generated/ring.webp"
      class="marker ring" />
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  max-width: 800px;
  position: relative;
  background-color: black;
  border-radius: 20px;
  overflow: hidden;
}

.map-backdrop {
  aspect-ratio: 1.5;
  margin: calc(min(20px, 2vw));
  background-image: url('/images/generated/map.webp');
  background-size: cover;
}

img.marker {
  position: absolute;
}

img.marker.undiscovered {
  filter: blur(2px) brightness(0.2);
}

/* This would be cool if it didn't fly in from 0, 0.
img.ring {
  transition: left 0.2s ease-in-out, top 0.2s ease-in-out;
} */

svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
