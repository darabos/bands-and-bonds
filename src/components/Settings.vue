<script setup lang="ts">
import { newTeam } from "../online.ts";
import { store } from "../store.ts";
import { allFriends } from "../friends.ts";
import { allRooms, roomKey } from "../rooms.ts";

async function reset() {
  if (await window.confirm("Are you sure you want to reset your progress? This cannot be undone.") && await window.confirm("Double checking: Are you sure you want to reset your progress? This cannot be undone.")) {
    localStorage.clear();
    window.location.reload();
  }
}

async function toggleOnline() {
  store.local.settings.online = !store.local.settings.online;
  if (store.local.settings.online) {
    if (!store.local.settings.teamId) {
      store.local.settings.teamId = await newTeam();
    }
  }
}

async function copyTeamLink() {
  const link = `${window.location.href}?join=${store.local.settings.teamId}`;
  console.log(link);
  await navigator.clipboard.writeText(link);
}

function unlockEverything() {
  store.team.unlocked = allFriends.map(friend => friend.name);
  store.team.discovered = allRooms.map(roomKey);
}
</script>

<template>
  <div class="actions">
    <button @click="toggleOnline()">
      <img :src="`images/generated/${store.local.settings.online ? 'on' : 'off'}line.webp`" />
      <div class="text">
        <div class="title">{{ store.local.settings.online ? 'Disable online features' : 'Enable online features' }}
        </div>
        <div class="description">
          When enabled, you can play Bands & Bonds with friends.
        </div>
        <p class="description">
          You share persistent progress, and everyone can go on dungeon runs independently.
        </p>
      </div>
    </button>
    <button @click="copyTeamLink()" v-if="store.local.settings.online && store.local.settings.teamId">
      <img src="/images/generated/copy-link.webp" />
      <div class="text">
        <div class="title">Copy invite link</div>
        <div class="description">
          Share this link with a friend to let them join your team.
        </div>
      </div>
    </button>
    <button @click="store.local.settings.blurImages = !store.local.settings.blurImages">
      <img src="/images/generated/blur-images.webp" />
      <div class="text">
        <div class="title">{{ store.local.settings.blurImages ? 'Unblur images' : 'Blur images' }}</div>
        <div class="description">
          All images in this prototype are AI generated. If you would rather not see them, turn on blurring.
        </div>
      </div>
    </button>
    <div class="section">Developer tools</div>
    <button @click="reset()">
      <img src="/images/generated/reset.webp" />
      <div class="text">
        <div class="title">Reset data</div>
        <div class="description">
          Throw away all your progress and start over.
        </div>
      </div>
    </button>
    <button @click="store.team.fruit *= 2">
      <img src="/images/generated/pack.webp" />
      <div class="text">
        <div class="title">Help I'm stuck</div>
        <div class="description">
          Games should be fun. If you want to skip ahead, you can cheat and double your fruit.
        </div>
      </div>
    </button>
    <button @click="unlockEverything()">
      <img src="/images/generated/rescue-locked.webp" />
      <div class="text">
        <div class="title">Unlock everything</div>
        <div class="description">
          Unlocks all characters. Definitely spoils the game.
        </div>
      </div>
    </button>
    <div class="section">Credits</div>
    <div class="credits">
      A game prototype by <a href="mailto:daniel.darabos@gmail.com" target="_blank">Daniel Darabos</a>.
      All images were created with <a href="https://sana.hanlab.ai/" target="_blank">Sana</a>.
      The map was drawn in <a href="https://www.dungeonscrawl.com/" target="_blank">DungeonScrawl</a>
      and brought to life using <a href="https://huggingface.co/spaces/multimodalart/flux-style-shaping"
        target="_blank">FLUX Style Shaping</a>.
      The fonts used are <a href="https://fonts.google.com/specimen/Grenze+Gotisch" target="_blank">Grenze Gotisch</a>,
      <a href="https://fonts.google.com/specimen/Bellefair" target="_blank">Bellefair</a>, and
      <a href="https://fonts.google.com/specimen/Germania+One" target="_blank">Germania One</a>.
      <a href="https://appwrite.io/" target="_blank">Appwrite</a> provides the database for the online features.
      Written in TypeScript using <a href="https://vuejs.org/" target="_blank">Vue.js</a> and
      <a href="https://vite.dev/" target="_blank">Vite</a>.
      See the source code on <a href="https://github.com/darabos/bands-and-bonds/" target="_blank">GitHub</a>.
    </div>
  </div>
</template>

<style scoped>
.actions {
  margin: 20px 0;
  columns: 310px auto;
  width: 100%;

  .section {
    display: block;
    color: #edb;
    break-after: avoid;
  }

  .section:before,
  .section:after {
    content: ' — ';
  }

  img {
    background-color: #000;
  }

  .credits {
    display: block;
    text-align: left;
    color: #edb;
  }
}

.actions>* {
  display: flex;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
