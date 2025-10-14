import { durationFormat, type Ability, type Enemy, type Store } from "./base";

const SKELEMASTERION_RANKS = [
  { name: "Ultramasterion", limit: 0 },
  { name: "Grandmasterion", limit: 0 },
  { name: "Rapid Destructorion", limit: 0 },
  { name: "Honorary Hopanoid", limit: 0 },
  { name: "Skyrmion Skirmisher", limit: 0 },
  { name: "Tosyl Ambassador", limit: 0 },
  { name: "Bandling General", limit: 0 },
  { name: "Trollish Mayor", limit: 1000 * 60 * 60 * 24 * 8 },
  { name: "Potato Potential", limit: Number.POSITIVE_INFINITY },
];
const numRanks = SKELEMASTERION_RANKS.length;
for (let i = 2; i < numRanks; ++i) {
  SKELEMASTERION_RANKS[numRanks - 1 - i].limit = Math.ceil(SKELEMASTERION_RANKS[numRanks - i].limit / 2);
}
function getRank(time: number): number {
  for (let i = 0; i < SKELEMASTERION_RANKS.length; i++) {
    if (time < SKELEMASTERION_RANKS[i].limit) {
      return i;
    }
  }
  throw new Error("Unreachable — the last entry has limit = Infinity");
}

export const allEnemies: Enemy[] = [
  { name: "Wild Slime", health: 10, rewards: { gold: 1, fruit: 1 }, weaknesses: ["fire", "ice", "left", "right"] },
  { name: "Poison Crow", health: 20, rewards: { gold: 2, fruit: 1 }, weaknesses: ["fire", "ice", "left"] },
  { name: "Animated Skeleton", health: 50, rewards: { gold: 5, fruit: 3 }, weaknesses: ["front", "blunt"] },
  { name: "Thick Door", health: 10, rewards: { gold: 0, fruit: 0 }, armor: 3, weaknesses: ["fire", "blunt", "back"] },
  { name: "Bandlings", health: 5, rewards: { gold: 5, fruit: 2 }, count: 5 },

  { name: "Dead Gladiator", health: 100, armor: 10, rewards: { gold: 5, fruit: 10 } },
  { name: "Lobster Daddy", health: 100, armor: 100, rewards: { gold: 10, fruit: 5 }, weaknesses: ["fire"] },
  { name: "Will-o-Wasp", health: 100, dodge: 3, rewards: { gold: 15, fruit: 1 }, weaknesses: ["front"] },
  { name: "The Shroud", health: 1000, ethereal: true, rewards: { gold: 10, fruit: 7 } },
  { name: "Dark Lord", health: 10_000, armor: 800, rewards: { gold: 10, fruit: 10 } },
  { name: "Clockomancer", health: 100_000, rewards: { fruit: 1000 }, slowTime: 100, passiveEffects: ["The Clockomancer slows down time."] },

  { name: "Glass Dragon", health: 100_000, rewards: { gold: 20, fruit: 10 }, weaknesses: ["blunt", "back"] },
  { name: "Xaranthian Construct", health: 450_000, rewards: { gold: 50 }, weaknesses: ["left"] },
  { name: "Potato Golem", health: 1_000, armor: 1_000, rewards: { fruit: 70, saplings: 1 }, weaknesses: ["sharp", "fire"] },
  { name: "Fortified Door", health: 100, armor: 1000, rewards: {} },
  { name: "Master of Doors", health: 1_250_000, armor: 10_000, rewards: { fruit: 30 } },
  { name: "Corrupted Bounty Hunter", health: 990_000, armor: 1000, dodge: 0.25, rewards: { gold: 200 }, weaknesses: ["front"] },
  { name: "Lior the Weaver", health: 160_000, armor: 1, dodge: 0.1, rewards: { gold: 200, fruit: 80 }, weaknesses: ["sharp", "fire"] },
  { name: "Skeletron", health: 100_000, armor: 200, rewards: { gold: 100 }, weaknesses: ["blunt", "back"], },
  { name: "Chago's Chamber", health: 600_000, armor: 1000, rewards: { gold: 200 }, weaknesses: ["blunt", "water"] },
  { name: "Chago", health: 140_000, armor: 25_000, rewards: { fruit: 60 }, dodge: 0.01, weaknesses: ["blunt", "water"] },
  { name: "Door of Loathing", health: 1_000_000, armor: 10_000, immune: ['sharp', 'blunt'], rewards: { gold: 200 }, weaknesses: ["ice", "light"] },
  { name: "Zakatrixos", health: 120_000, ethereal: true, rewards: {} },
  { name: "Wands from the Depths", health: 600_000, armor: 24_000, rewards: { gold: 200, fruit: 40 }, immune: ["water"], weaknesses: ["ice"] },
  { name: "Skyrmions", health: 137, ethereal: true, count: 137, rewards: { fruit: 137 }, weaknesses: ["back"] },
  { name: "Defensive Installation", health: 1_000_000, armor: 1_000, rewards: { gold: 800 }, weaknesses: ["blunt", "front"] },
  { name: "Tenebra", health: 300_000, ethereal: true, rewards: { fruit: 77 }, weaknesses: ["fire", "front"] },
  { name: "Landas Wizard", health: 320_000, dodge: 0.001, rewards: { gold: 200, fruit: 100 }, weaknesses: ["water", "back"] },
  { name: "Crystal Man", health: 600, dodge: 0.00001, rewards: { gold: 1000, fruit: 500 }, weaknesses: ["blunt", "ice"] },
  { name: "Power Crystal", health: 1, armor: 100_000, rewards: { fruit: 10_000 }, weaknesses: ["blunt"] },

  { name: "Frozen Centurion", health: 200, dodge: 10, rewards: { gold: 3, fruit: 5 }, immune: ["ice"], weaknesses: ["fire", "front"] },
  { name: "Trollish Maiden", health: 1_000, regen: 100, rewards: { gold: 8, fruit: 6 }, passiveEffects: ["The Trollish Maiden heals quickly."] },
  { name: "Dryfin Carp", health: 10_000, rewards: { gold: 12, fruit: 10 }, weaknesses: ["water", "back"] },
  { name: "Scaffold Sorcery", health: 20_000, armor: 1_000, rewards: { gold: 25, fruit: 6 }, weaknesses: ["fire", "sharp"] },
  { name: "Lost Swimmer", health: 30_000, armor: 2_000, rewards: { fruit: 20 }, immune: ["water"], weaknesses: ["ice"] },

  { name: "Geckalog", health: 80_000, rewards: { gold: 30, fruit: 15 }, weaknesses: ["ice", "left"] },
  { name: "Jaw Maw Maw", health: 60_000, regen: 60, rewards: { gold: 60, fruit: 16 }, passiveEffects: ["Jaw Maw Maw heals quickly."] },
  { name: "Gnollish Ambassador", health: 120_000, dodge: 10, rewards: { gold: 20, fruit: 19 }, weaknesses: ["fire", "right"] },
  { name: "Striped Horror", health: 200_000, armor: 50, rewards: { gold: 10, fruit: 20 } },
  {
    name: "Dragonfly Agaric", health: 600_000, rewards: { gold: 20, fruit: 30 }, immune: ["poison"], regen: 3_000, weaknesses: ["fire", "left"],
    passiveEffects: ["The spores of the Dragonfly Agaric are toxic to everything but itself."],
  },
  { name: "Artifact Seeker", health: 70_000, dodge: 2, rewards: { gold: 1_000, fruit: 20 }, weaknesses: ["ice", "fire", "water"] },
  { name: "Golden Chest", health: 1, armor: 10_000, rewards: { gold: 7_500 }, weaknesses: ["blunt"] },
  { name: "King of Tadpoles", health: 1_250_000, rewards: { gold: 100, fruit: 60 }, immune: ["water"] },
  { name: "Hopanoids", count: 12, health: 50_000, armor: 1_000, dodge: 1, rewards: { fruit: 100 }, weaknesses: ["fire"] },
  { name: "Tosyl Rose", health: 860_000, armor: 4_000, rewards: { gold: 100, fruit: 100 }, weaknesses: ["fire", "right"] },
  { name: "Sullen Bearer", health: 990_000, armor: 10_000, rewards: { gold: 200 }, weaknesses: ["back"] },
  { name: "Unwelcoming Glade", health: 2_400_000, rewards: { gold: 100, fruit: 100, saplings: 1 }, weaknesses: ["fire", "sharp"] },
  { name: "Food Mimic", health: 3_100_000, armor: 10, rewards: { gold: 100, fruit: 120 }, weaknesses: ["blunt", "bite"] },
  { name: "Frog Assassin", health: 1_050_000, dodge: 0.1, rewards: { gold: 1, fruit: 1 }, weaknesses: ["ice"] },
  { name: "Enantiomers", count: 2, health: 1_000_000, armor: 29_000, dodge: 0.1, rewards: { fruit: 150 }, weaknesses: ["fire"] },
  {
    name: "Decay Manifest", health: 2_000_000, regen: 5_000, rewards: { gold: 200, fruit: 75 }, weaknesses: ["fire", "right"],
    passiveEffects: ["The fruiting bodies of the Decay Manifest regrow as soon as you destroy them."],
  },
  { name: "Web of Power", health: 10_000_000, rewards: { gold: 2_000, fruit: 50 }, weaknesses: ["water", "left"] },
  { name: "Tombstone of the Forgotten", health: 29_000_000, armor: 100_000, rewards: { gold: 2_000, fruit: 125 }, weaknesses: ["front", "light"] },
  {
    name: "Hippogryph", health: 80_000_000, regen: 10_000, rewards: { gold: 12_000, fruit: 200 }, weaknesses: ["fire", "left"],
    passiveEffects: ["The Hippogryph heals quickly."],
  },
  { name: "The King's Armor", health: 60_000_000, armor: 1_000_000, rewards: { gold: 8_000 }, immune: ["sharp"], weaknesses: [] },
  { name: "Corridor of Illusions", health: 6_000_000, dodge: 0.01, rewards: { gold: 6_000, fruit: 300 }, weaknesses: ["light"] },
  {
    name: "Hiber Conduit", health: 100_000_000, regen: 8_000, rewards: { gold: 800, fruit: 400 }, immune: ["ice"], weaknesses: ["fire"],
    passiveEffects: ["The molten parts of Hiber Conduit freeze to a solid form with little delay."],
  },
  {
    name: "Core Diver", health: 510_000_000, regen: 80_000, rewards: { gold: 200, fruit: 500 }, immune: ["fire"], weaknesses: ["water"],
    passiveEffects: ["A lumbering shape of magma stands before you. The Core Diver's surface is continuously shed and renewed by a fiery flow."],
  },
  {
    name: "Smother Mother", health: 250_000_000, armor: 8_000_000, rewards: { gold: 200, fruit: 750 }, immune: ["fire", "light"], weaknesses: ["left", "water"],
    passiveEffects: ["The Smother Mother is encased in an armor that must have a melting point beyond anything in our world."],
  },
  {
    name: "The Final Warden", dodge: 0.001, health: 999_000_000, regen: 600_000, rewards: { gold: 15_000, fruit: 2500 },
    immune: ["fire", "poison"], weaknesses: ["light", "ice"],
    passiveEffects: ["The air itself is strained and torn as the colossal form of the Final Warden moves, too fast to track."],
  },
  {
    name: "Skelemasterion", health: 1_000_000_000_000_000, armor: 1_000_000_000_000, regen: 1_000_000_000_000, ethereal: true,
    rewards: { gold: 1_000_000, fruit: 1_000_000 }, immune: ["fire", "ice", "water", "light", "dark", "poison", "sharp", "blunt", "ranged"],
    passiveEffects: ["This dungeon is barely strong enough to contain the invincible Skelemasterion."],
    eulogy: (store) => {
      const time = store.team.floorCompletions[0] || 0;
      const rank = getRank(time);
      const rankText = time
        ? rank === 0
          ? `<p>You won in <span class="numbers">${durationFormat(time)}</span>, earning you the ultimate rank of <i>${SKELEMASTERION_RANKS[0].name}</i>.</p>`
          : `<p>You won in <span class="numbers">${durationFormat(time)}</span>, earning you the rank of <i>${SKELEMASTERION_RANKS[rank].name}</i>.
          The cutoff for the next rank is at <span class="numbers">${durationFormat(SKELEMASTERION_RANKS[rank - 1].limit)}</span>.</p>`
        : `<p>Your adventure started before time measurement was implemented. If you start a new adventure, your time will be measured.</p>`;
      if (store.run.capturedMonsters.includes('Skelemasterion')) {
        return `<img src="images/generated/Skelemasterion-captured.webp" class="friend" style="margin-top: -30px;">
    <h1 style="margin-top: -10px">Skelemasterion is captured!</h1>
    <div class="description">
        ${rankText}
        <p>Your victory is complete. Your band organizes a feast.</p>
        <p>You search Skelemasterion's lair and collect its treasures. You can force the beast to reveal its secrets now.
          Finally you learn how to access the next level of the dungeon.</p>
    </div>`;
      } else {
        return `<img src="images/generated/Skelemasterion-dead.webp" class="friend">
    <h1 style="margin-top: -30px">Skelemasterion is defeated!</h1>
    <div class="description">
        ${rankText}
        <p>Victory is yours. A great evil has been vanquished. Time to celebrate!</p>
        <p>You search Skelemasterion's lair and collect its treasures. Yet you miss something that only Skelemasterion could reveal...</p>
    </div>`;
      }
    },
  }
];

function discardMonster(store: Store, name: string) {
  store.run.capturedMonsters = store.run.capturedMonsters.filter(m => m !== name);
}

const enemyAbilities: Record<string, Ability[]> = {
  "Wild Slime": [{ name: "Slobber", duration: 5, damage: 1, description: "Cover the enemy in slime." }],
  "Poison Crow": [{
    name: "Crow Blast", duration: 5, description: "An explosion of feathers and poison.",
    tags: ['poison'], damage: 10,
    onCompleted(store, times, self) {
      const e = store.abilityEffects(self);
      const hits = e.rndHits(times);
      store.addPoison(10 * e.damageMultiplier, hits);
    },
  }],
  "Animated Skeleton": [{ name: "Femurs Clashing", duration: 5, damage: 30, description: "Bones to bones. Ashes to ashes.", tags: ['blunt'] }],
  "Thick Door": [{ name: "Creaking", duration: 10, damage: 0, description: "The door creaks ominously.", tags: ['sound'] }],
  "Bandlings": [{ name: "Swarm of Bandlings", duration: 5, damage: 1, description: "A swarm of fierce little warriors.", tags: ['blunt'] }],
  "Dead Gladiator": [{ name: "Blades of Revenge", duration: 1, damage: 100, description: "A vengeful gladiator attacks.", tags: ['sharp'] }],
  "Lobster Daddy": [{ name: "Claw Smash", duration: 100, damage: 1000, description: "A powerful claw attack.", tags: ['sharp'] }],
  "Will-o-Wasp": [{ name: "Sting", duration: 0.05, damage: 1, description: "The quick and painful sting of a wasp.", tags: ['poison'] }],
  "The Shroud": [{ name: "Shroud of Darkness", duration: 1, damage: 1000, description: "Envelops the enemy in darkness.", tags: ['dark'] }],
  "Dark Lord": [{ name: "Shadow Strike", duration: 1, damage: 10, description: "The Dark Lord never misses.", tags: ['dark', 'undodgeable'] }],
  "Clockomancer": [{
    name: "Time Wrap", duration: 1, description: "Slows down time.", peaceful: true,
    onCompleted(store) { store.run.speedLevel = 1; },
  }, {
    name: "Time Burp", duration: 2, description: "Pushes time forward.", peaceful: true, affectedBySpeedLevel: true,
    onCompleted(store, times) {
      const speed = store.run.speedLevel;
      const factor = 1 + speed / (speed + 200);
      // At factor = 1 it's a 2x speedup. At factor = 2 it's theoretically infinite speedup.
      // The formula above gives a speedup of speed/100+2.
      store.run.skipTime += 1_000 * times * factor / speed;
    },
  }],
  "Glass Dragon": [{ name: "Shatter", duration: 1, damage: 100_000, description: "The repairs are expensive.", consumes: { gold: 100 }, tags: ['sharp'] }],
  "Xaranthian Construct": [{ name: "Fire Xaranthian Cannons", duration: 10, damage: 650_000, description: "Sounds like thunder, looks like lightning bolts flying straight at the target." }],
  "Potato Golem": [{
    name: "Fertilize Saplings", duration: 1, description: "The number of saplings you have is effectively doubled. Potato magic.",
    peaceful: true, consumes: (store) => ({ gold: 100 * store.run.saplings }),
    onCompleted(store) {
      store.run.saplings *= 2;
    },
  }],
  "Fortified Door": [{ name: "Fortified Slam", duration: 1, damage: 1, description: "Slams shut with a sound so loud, it is felt by everyone.", tags: ['blunt', 'sound', 'undodgeable'] }],
  "Master of Doors": [{
    name: "Master Key", duration: 1, description: "Immediately defeats door-type enemies.",
    onCompleted(store) {
      const enemy = store.currentEnemy();
      if (enemy?.name?.includes("Door")) {
        store.addDamage(Infinity, 1);
      }
    },
  }],
  "Corrupted Bounty Hunter": [{ name: "Hyper Beam", duration: 100, damage: 1_250_000, description: "Imagine a rainbow turning to violence." }],
  "Lior the Weaver": [{
    name: "Fabric of Reality", duration: 5, damage: 120_000, tags: ['left', 'right', 'front', 'back'],
    description: "An attack that comes from all directions at once.",
  }],
  "Skeletron": [{ name: "Bonetron", duration: 2, damage: 1000, tags: ['blunt'], description: "Applies a bone to the head of the enemy." }],
  "Chago's Chamber": [],
  "Chago": [{
    name: "Create Cheese Demon", duration: 300, description: "Chago releases a demon to chew on the enemy.",
    tags: ['bite'], damage: 160_000,
    onCompleted(store, times, self) {
      const e = store.abilityEffects(self);
      const hits = e.rndHits(times);
      store.addPoison(160_000 * e.damageMultiplier, hits);
    },
  }],
  "Door of Loathing": [{
    name: "Look of Loathing", duration: 60, damage: 1, tags: ['dark'],
    description: "The Door of Loathing taunts the enemy and draws its attacks onto itself.",
  }],
  "Zakatrixos": [{
    name: "Pierce the Veil", duration: 100,
    description: `
For the duration of the spell, Zakatrixos shifts the band into the ethereal plane.
This negates the defenses of ethereal enemies.`,
  }],
  "Wands from the Depths": [
    { name: "Sapphire Wand", duration: 10, damage: 120_000, description: "One of the Wands from the Depths.", tags: ['water'] },
    { name: "Emerald Wand", duration: 10, damage: 120_000, description: "One of the Wands from the Depths.", tags: ['poison'] },
    { name: "Ruby Wand", duration: 10, damage: 120_000, description: "One of the Wands from the Depths.", tags: ['fire'] },
  ],
  "Skyrmions": [{
    name: "Release Excitation Energy", duration: 107, damage: 107, tags: ['light'],
    description: "Skyrmion pairing of opposite charges from opposite valleys is favored by both Coulomb and effective Zeeman terms."
  }],
  "Defensive Installation": [{
    name: "Set Up Defenses", duration: 1200, damage: 800_000_000, tags: ['ranged'],
    description: "The best defense is a slow but devastating attack."
  }],
  "Tenebra": [
    { name: "Ebony Stripe", tags: ['dark'], duration: 100, damage: 1_100_000, description: "The black stripes connect to the darkness of the underworld." },
    { name: "Ivory Stripe", tags: ['light'], duration: 100, damage: 1_100_000, description: "The white stripes connect to the light of the heavens." },
  ],
  "Landas Wizard": [{ name: "Send Sand", tags: ['sand'], duration: 100, damage: 200_000, description: "A sandstorm passes through the battlefield." }],
  "Crystal Man": [{ name: "Resonate Crystals", tags: ['sound'], duration: 8, damage: 80_000, description: "The Crystal Man emits a mighty vibration when wet." }],
  "Power Crystal": [],

  "Frozen Centurion": [{
    name: "Frozen Century", duration: 100 * 365 * 24 * 60 * 60, damage: 5_000_000_000_000, tags: ['ice'],
    description: "An attack of patience and determination.",
  }],
  "Trollish Maiden": [{
    name: "Maiden's Smash", duration: 1, damage: 1000, tags: ['blunt'],
    description: "The narrow corridors of the dungeon limit the athleticism of trolls, but they are still a force to fear.",
  }],
  "Dryfin Carp": [{
    name: "Sand Bubbles", duration: 20, damage: 1_000, tags: ['sand'],
    description: "Dryfin Carps are feared across the Landas Desert for their ferocious bubble attacks.",
  }],
  "Scaffold Sorcery": [{
    name: "Collapse Scaffold", duration: 5, tags: ['blunt'],
    description: "A single-use ability that deals significant damage to those caught under the scaffold.",
    onCompleted(store, _times, self) {
      const e = store.abilityEffects(self);
      store.addDamage(12_000_000 * e.damageMultiplier, 1);
      discardMonster(store, 'Scaffold Sorcery');
    },
  }],
  "Lost Swimmer": [{
    name: "Flood", duration: 100, damage: 1_000_000, tags: ['water', 'undodgeable'],
    description: "A deceptively slow attack that fills up the battlefield. No attacks can be dodged while the flood is in progress.",
  }],
  "Geckalog": [{ name: "Tail Whoop", duration: 0.1, damage: 40, tags: ['blunt'], description: "A quick strike of the Geckalog's tail." }],
  "Jaw Maw Maw": [{
    name: "Healing Factor", duration: 1, description: "Jaw Maw Maw can restore anyone to full health, not just herself.",
    onCompleted(store) {
      store.run.room.damage = 0;
    }
  }],
  "Gnollish Ambassador": [{
    name: "Diplomatic Cables", duration: 12, damage: 5_000, tags: ['sharp'],
    description: "A web of Gnollish steel wires strangle the enemy.",
  }],
  "Striped Horror": [
    { name: "Ebony Stripe", tags: ['dark'], duration: 100, damage: 30_000, description: "The black stripes connect to the darkness of the underworld." },
    { name: "Ivory Stripe", tags: ['light'], duration: 100, damage: 30_000, description: "The white stripes connect to the light of the heavens." },
  ],
  "Dragonfly Agaric": [{
    name: "Agaric Poison Strike", tags: ['poison'], duration: 5, description: "The deadly poison of the Dragonfly Agaric causes great damage over time.", damage: 20,
    onCompleted(store, times, self) {
      const e = store.abilityEffects(self);
      const hits = e.rndHits(times);
      store.addPoison(20 * e.damageMultiplier, hits);
    }
  }],
  "Artifact Seeker": [{
    name: "Seek Artifact", duration: 10, peaceful: true, description: `
Finds a chest containing an artifact worth a thousand pieces of <img src="images/generated/gold.webp" class="resource-icon resource-icon-solo" />.
Have these chests always been around us?`,
    onCompleted(store, times) {
      store.run.gold += 10_000 * times;
    },
  }],
  "Golden Chest": [],
  "King of Tadpoles": [{
    name: "Recruit Tadpole", duration: 30, description: "The king sends a tadpole to battle.", tags: ['bite'],
    damage: 60,
    onCompleted(store, times, self) {
      const e = store.abilityEffects(self);
      const hits = e.rndHits(times);
      store.addPoison(60 * e.damageMultiplier, hits);
    },
  }],
  "Hopanoids": [{
    name: "Release Hopanoids", duration: 1, description: "Releasing the Hopanoids will give you a rush of speed.", peaceful: true,
    onCompleted(store) {
      store.run.speedLevel += 2;
      discardMonster(store, 'Hopanoids');
    },
  }],
  "Tosyl Rose": [{
    name: "Dance of Petals", duration: 0.5, damage: 120, tags: ['sharp'],
    description: `
The head of the Tosyl warrior disappears in an explosion of sharp petals.
Then a whirlwind collects all the petals and puts them back together in the shape of a rose. Beautiful and deadly.` }],
  "Sullen Bearer": [{
    name: "Grim Strike", duration: 100, damage: 20_000, tags: ['dark'],
    description: "A lurching attack that seems easy to defend against. The metal of the blade can be stopped by armor. The evil of its bearer can not.",
  }],
  "Unwelcoming Glade": [],
  "Food Mimic": [{
    name: "Mimic Fruit", duration: 60, peaceful: true,
    onCompleted(store) {
      store.run.fruit += 1_000 * store.fruitMultiplier();
      discardMonster(store, 'Food Mimic');
    },
    description: "The Food Mimic permanently turns into a large amount of <img src=\"images/generated/fruit.webp\" class=\"resource-icon resource-icon-solo\" />.",
  }],
  "Frog Assassin": [{ name: "Last Croak", duration: 2, damage: 20_000, description: "Hire a famous assassin.", consumes: { gold: 100_000 }, tags: ['sharp'] }],
  "Enantiomers": [{
    name: "Last Flash", duration: 10, description: "The Enantiomers cancel each other out in a final burst that increases your speed.",
    peaceful: true,
    onCompleted(store) {
      store.run.speedLevel += 10;
      discardMonster(store, 'Enantiomers');
    }
  }],
  "Decay Manifest": [{
    name: "Waft of Decay", duration: 5, description: "While this ability is active, poisoned enemies lose health twice as fast.",
  }],
  "Web of Power": [{
    name: "Spider Power", tags: ['poison'], duration: 0.2, damage: 100, description: "A quick, sharp stab is all that is felt.",
  }],
  "Tombstone of the Forgotten": [{
    name: "The Forgotten Siege", duration: 10_000, damage: 800_000_000, tags: ['dark'],
    description: "Knights from beyond the tomb lay waste to your enemies.",
  }],
  "Hippogryph": [{
    name: "Hippograb", tags: ['blunt'], duration: 25, damage: 200_000,
    description: "The beast lifts its prey into the air, then smashes them to the ground.",
  }],
  "The King's Armor": [],
  "Corridor of Illusions": [],
  "Hiber Conduit": [{
    name: "Hibernate", tags: ['ice'], duration: 240, damage: 2_400_000,
    description: "Pipes filled with sub-zero liquid coil around the target.",
  }],
  "Core Diver": [{
    name: "Magma Vortex", duration: 60, damage: 1_200_000, tags: ['fire'],
    description: "The Core Diver floods the area with magma that pulls down your enemies.",
  }],
  "Smother Mother": [{
    name: "Smother", tags: ['poison', 'fire', 'dark', 'undodgeable'], duration: 15, damage: 300_000,
    description: "Fumes from the underworld cover the battlefield. All life and light is extinguished.",
  }],
  "The Final Warden": [{
    name: "The Final Warning", duration: 120, damage: 2_400_000, tags: ['ranged', 'sound'],
    description: "A warning, a generous pause, then the ring of a deadly weapon.",
  }],
  "Skelemasterion": [
    {
      name: "Cancelion", duration: 10, description: "Skelemasterion defeats the opponent. Skelemasterion is lost in the process.",
      preventRepeat: true,
      onCompleted(store) {
        store.addDamage(Infinity, 1);
        discardMonster(store, 'Skelemasterion');
      },
    },
    {
      name: "Reveal Skelemasterion's Stairway", duration: 20, peaceful: true,
      description: `
Hidden in Skelemasterion's lair is a stairway leading to the second level of the dungeon.

NOT IMPLEMENTED YET

This is the end of the current content. Congratulations and thanks for playing!`,
      hidden: (store) => store.currentRoom()?.name !== 'Skelemasterion',
      onCompleted() {
        // TODO: Implement second level.
      },
    },
  ],
};

export const enemiesByName = {} as Record<string, Enemy>;
for (const e of allEnemies) {
  enemiesByName[e.name] = e;
  e.abilities = enemyAbilities[e.name] ?? [];
  for (const ab of e.abilities) {
    ab.image = e.name;
  }
}
