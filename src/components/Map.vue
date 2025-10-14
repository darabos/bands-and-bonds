<script setup lang="ts">
import { onboard, store } from "../store.ts";
import { enemiesByName } from "../enemies.ts";
import { allRooms, destinationToPath, roomKey, roomsByLabel, turnsToPath } from "../rooms.ts";
import { type Room, durationFormat } from "../base.ts";
import * as cl from "./curved-line.ts";
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import EnemyRewards from "./EnemyRewards.vue";
import Num from "./Num.vue";

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

const rooms = computed(() => turnsToPath(store.run.steps, store.run.turns).path);

function icon(room: Room) {
  return room.type.replace('rescue', 'pack');
}

function style(room: Room, factor?: number) {
  if (!mapElement.value) return { display: 'none' };
  const x = room.x * scale.value;
  const y = room.y * scale.value;
  let s = 30 * scale.value * (factor ?? 1);
  if (room.type === 'boss') {
    s *= 1.2;
  } else if (room.type === 'finalboss') {
    s *= 2;
  } else {
    s *= 0.9;
  }
  return {
    left: `${x - s / 2}px`,
    top: `${y - s / 2}px`,
    width: `${s}px`,
    height: `${s}px`,
  };
}

function roomClicked(room: Room) {
  hoveredRoom.value = room;
  const key = roomKey(room);
  if (onboard("Wayfinder") && store.team.discovered.includes(key)) {
    store.local.destination = key;
  }
}

const line = computed(() => cl.curvedLine(20, scale.value, rooms.value));
const planRooms = computed(() =>
  onboard("Wayfinder") && store.local.destination ? destinationToPath(store.local.destination) : []);
const planLine = computed(() => cl.curvedLine(20, scale.value, planRooms.value));
const hoveredRoom = ref<Room | null>(null);
const hoveredEnemy = computed(() => hoveredRoom.value?.name ? enemiesByName[hoveredRoom.value.name] : null);
const discoveredLines = computed(() => {
  function getSegments(rooms: Room[], segments: Set<string>) {
    const last = rooms[rooms.length - 1];
    if (last.end || last.next || last !== allRooms[0] && last.type !== 'none' && !store.team.discovered.includes(roomKey(last))) {
      let prevPos: string | null = null;
      for (const s of cl.curvedLineSegments(20, scale.value, rooms)) {
        if (prevPos)
          segments.add(`M ${prevPos} ${s}`);
        prevPos = s.split(' ').slice(-2).join(' ');
      }
      if (!last.next) return;
    }
    const nextRooms: Room[][] = last.next ?
      Object.values(last.next).map(n => [last, allRooms[roomsByLabel[n.label!]]])
      : last.end ? [] : [[...rooms, allRooms[(last.index ?? 0) + 1]]];
    for (const path of nextRooms) {
      getSegments(path, segments);
    }
  }
  const segments = new Set<string>();
  getSegments([allRooms[0]], segments);
  return Array.from(segments).join(' ');
});
</script>

<template>
  <div class="map" ref="mapElement">
    <div class="map-backdrop" />
    <svg width="100%" height="100%">
      <path :d="discoveredLines" stroke="#fff8" :stroke-width="1 * scale" fill="none" />
      <path :d="line" stroke="white" :stroke-width="5 * scale" fill="none" />
      <path :d="planLine" stroke="white" :stroke-width="3 * scale" stroke-dasharray="3 5" fill="none" />
      <circle v-if="rooms?.[rooms.length - 1]?.type === 'none'" :cx="rooms[rooms.length - 1].x * scale"
        :cy="rooms[rooms.length - 1].y * scale" :r="5 * scale" fill="white" />
    </svg>
    <template v-for="room in allRooms">
      <img v-if="room.type !== 'none'" :alt="room.name" :style="style(room)" @mouseenter="hoveredRoom = room"
        @mouseleave="hoveredRoom = null" :src="`images/generated/${icon(room)}-outlined.webp`"
        :class="{ marker: true, undiscovered: !store.team.discovered.includes(roomKey(room)) }"
        @click="roomClicked(room)" />
    </template>
    <img v-if="store.run.steps > 0" :style="style(rooms[rooms.length - 1], 2)" src="/images/generated/ring.webp"
      class="marker ring" />
    <div v-if="hoveredRoom?.name" class="hovered-room" :class="{ right: hoveredRoom.x > 407 }"
      :style="{ top: `${hoveredRoom.y * scale}px`, left: `${hoveredRoom.x * scale}px` }">
      <img :class="{
        'friend-portrait': hoveredRoom.type === 'rescue',
        'enemy-portrait': hoveredRoom.type !== 'rescue',
        ethereal: hoveredRoom.type !== 'rescue' && hoveredEnemy?.ethereal
      }" :src="`images/generated/${hoveredRoom.name}.webp`" :alt="hoveredRoom.name" />
      <h1>{{ hoveredRoom.name }}</h1>
      <p v-if="hoveredEnemy && store.team.unlocked.includes('Wayfinder')">
        <template v-if="hoveredEnemy.count">
          <Num :amount="hoveredEnemy.count">×</Num>&nbsp;<!-- no space other than the nbsp -->
        </template>
        <Num :amount="hoveredEnemy.health" />HP
        <template v-if="hoveredEnemy.armor">
          <Num :amount="hoveredEnemy.armor" />armor
        </template>
        <template v-if="hoveredEnemy.dodge">
          <span class="numbers">{{ durationFormat(hoveredEnemy.dodge * 1000) }}</span> dodge
        </template>
        <template v-if="hoveredEnemy.regen">
          <Num :amount="hoveredEnemy.regen" />regeneration/s
        </template>
      </p>
      <p v-if="hoveredEnemy?.rewards">Rewards when defeated:
        <EnemyRewards :enemy="hoveredEnemy" />
      </p>
    </div>
  </div>
  <button v-if="onboard('Campfinder') && store.local.destination" @click="store.local.destination = undefined">
    <img src="/images/generated/Campfinder.webp" />
    <div class="text">
      <div class="title">Stop traveling</div>
      <div class="description">
        <p>Ask Campfinder to stop for now.</p>
      </div>
    </div>
  </button>
  <button v-else-if="onboard('Wayfinder') && store.local.destination" @click="store.local.destination = undefined">
    <img src="/images/generated/Wayfinder.webp" />
    <div class="text">
      <div class="title">Stop traveling</div>
      <div class="description">
        <p>Ask Wayfinder to stop for now.</p>
      </div>
    </div>
  </button>
</template>

<style scoped>
.map {
  width: 100%;
  max-width: 800px;
  position: relative;
  background-color: black;
  border-radius: 20px;
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
  pointer-events: none;
}

img.marker.ring {
  pointer-events: none;
}

.hovered-room {
  pointer-events: none;
  position: absolute;
  max-width: 300px;
  width: 40vw;
  background-color: black;
  color: white;
  padding: 10px;
  border-radius: 10px;
  z-index: 10;

  .enemy-portrait {
    margin-top: -60px;
    width: 60px;
    height: 60px;
    border-radius: 40%;
    border: 2px outset #edb;
    box-shadow: 0 0 10px #000;
  }

  .enemy-portrait.ethereal {
    border-top-color: #ace;
    border-left-color: #e8c;
    border-bottom-color: #e8c;
    border-right-color: #8af;
  }

  .friend-portrait {
    width: 60px;
    height: 60px;
  }

  h1 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 20px;
  }

  p {
    margin-top: 0;
  }
}

.hovered-room.right {
  transform: translate(-100%, 0%);
}

svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
