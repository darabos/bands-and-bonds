import type { Enemy, Ability } from "./base";

export const allEnemies: Enemy[] = [
  { name: "Wild Slime", health: 10, rewards: { gold: 1000000, fruit: 1 }, weaknesses: ["fire", "ice", "left", "right"] },
  { name: "Poison Crow", health: 20, rewards: { gold: 2, fruit: 1 }, weaknesses: ["fire", "ice", "left"] },
  { name: "Animated Skeleton", health: 50, rewards: { gold: 5, fruit: 3 }, weaknesses: ["front", "blunt"] },
  { name: "Thick Door", health: 10, rewards: { gold: 0, fruit: 0 }, armor: 3, weaknesses: ["fire", "blunt", "back"] },
  { name: "Bandlings", health: 5, rewards: { gold: 5, fruit: 2 }, count: 5 },

  { name: "Dead Gladiator", health: 100, armor: 10, rewards: { gold: 5, fruit: 20 } },
  { name: "Lobster Daddy", health: 100, armor: 100, rewards: { gold: 10, fruit: 10 }, weaknesses: ["fire"] },
  { name: "Will-o-Wasp", health: 100, dodge: 3, rewards: { gold: 15, fruit: 1 }, weaknesses: ["front"] },
  { name: "The Shroud", health: 1000, ethereal: true, rewards: { gold: 10, fruit: 14 } },
  { name: "Dark Lord", health: 10_000, armor: 100, rewards: { gold: 10, fruit: 20 } },
  { name: "Clockomancer", health: 100_000, rewards: { fruit: 1000 }, slowTime: 100, passiveEffects: ["The Clockomancer slows down time."] },

  { name: "Glass Dragon", health: 100_000, rewards: { gold: 100, fruit: 10 }, weaknesses: ["blunt", "back"] },
  { name: "Xaranthian Construct", health: 650_000, rewards: { gold: 250 }, weaknesses: ["left"] },
  { name: "Potato Golem", health: 1_000, armor: 1_000, rewards: { fruit: 70 }, weaknesses: ["sharp", "fire"] },
  { name: "Fortified Door", health: 100, armor: 1000, rewards: {} },
  { name: "Master of Doors", health: 1_250_000, armor: 10_000, rewards: { fruit: 60 } },
  { name: "Corrupted Bounty Hunter", health: 990_000, armor: 1000, dodge: 0.25, rewards: { gold: 200 }, weaknesses: ["fast"] },
  { name: "Lior the Weaver", health: 160_000, armor: 1, dodge: 0.1, rewards: { gold: 200, fruit: 110 }, weaknesses: ["sharp", "fire"] },
  { name: "Skeletron", health: 100_000, armor: 200, rewards: { gold: 100 }, weaknesses: ["blunt", "back"], },
  { name: "Chago's Chamber", health: 600_000, armor: 1000, rewards: { gold: 200 }, weaknesses: ["blunt", "water"] },
  { name: "Chago", health: 140_000, armor: 25_000, rewards: { fruit: 120 }, weaknesses: ["blunt", "water"] },
  { name: "Door of Loathing", health: 1_000_000, armor: 10_000, immune: ['sharp', 'blunt'], rewards: { gold: 200 }, weaknesses: ["ice", "light"] },
  { name: "Zakatrixos", health: 120_000, ethereal: true, rewards: {} },
  { name: "Wands from the Depths", health: 600_000, armor: 24_000, rewards: { gold: 200, fruit: 40 }, immune: ["water"], weaknesses: ["ice"] },
  { name: "Skyrmions", health: 107, ethereal: true, count: 107, rewards: { fruit: 107 }, weaknesses: ["back"] },
  { name: "Defensive Installation", health: 1_000_000, armor: 1_000, rewards: { gold: 6_000 }, weaknesses: ["blunt", "front"] },
  { name: "Tenebra", health: 300_000, ethereal: true, rewards: {}, weaknesses: ["fire", "front"] },
  { name: "Landas Wizard", health: 320_000, dodge: 1, rewards: { gold: 200, fruit: 100 }, weaknesses: ["water", "back"] },
  { name: "Crystal Man", health: 600, dodge: 0.01, rewards: { gold: 2000, fruit: 1200 }, weaknesses: ["blunt", "ice"] },
  { name: "Power Crystal", health: 1, armor: 100_000, rewards: { fruit: 1_000_000 }, weaknesses: ["blunt"] },

  { name: "Frozen Centurion", health: 200, dodge: 10, rewards: { gold: 3, fruit: 10 }, immune: ["ice"], weaknesses: ["fire", "front"] },
  { name: "Trollish Maiden", health: 1000, regen: 100, rewards: { gold: 8, fruit: 10 }, passiveEffects: ["The Trollish Maiden heals quickly."] },
  { name: "Dryfin Carp", health: 10_000, rewards: { gold: 100, fruit: 20 }, weaknesses: ["water", "back"] },
  { name: "Scaffold Sorcery", health: 20_000, armor: 1000, rewards: { gold: 100, fruit: 12 }, weaknesses: ["fire", "axe"] },
  { name: "Lost Swimmer", health: 30_000, armor: 2000, rewards: { fruit: 50 }, immune: ["water"], weaknesses: ["ice"] },

  { name: "Skelemasterion", health: 80_000, rewards: { gold: 80, fruit: 15 }, weaknesses: ["ice", "left"], immune: ["light"] },
  { name: "Jaw Maw Maw", health: 60_000, regen: 60, rewards: { gold: 60, fruit: 16 }, passiveEffects: ["Jaw Maw Maw heals quickly."] },
  { name: "Decay Manifest", health: 120_000, rewards: { gold: 20, fruit: 19 }, weaknesses: ["fire", "right"] },
  { name: "Striped Horror", health: 200_000, dodge: 10, rewards: { gold: 10, fruit: 10 } },
  { name: "Dragonfly Agaric", health: 600_000, rewards: { gold: 20, fruit: 40 }, immune: ["poison"], weaknesses: ["fire", "left"] },
  { name: "Artifact Seeker", health: 70_000, dodge: 2, rewards: { gold: 2000, fruit: 60 }, weaknesses: ["ice", "fire", "water"] },
  { name: "Golden Chest", health: 1, armor: 10_000, rewards: { gold: 20_000 }, weaknesses: ["blunt"] },
  { name: "King of Tadpoles", health: 1_250_000, rewards: { gold: 100, fruit: 80 }, immune: ["water"] },
  { name: "Hopanoids", count: 10, health: 50_000, armor: 1_000, dodge: 1, rewards: { fruit: 200 }, weaknesses: ["fire"] },
  { name: "Tosyl Rose", health: 860_000, armor: 4_000, rewards: { gold: 100, fruit: 200 }, weaknesses: ["fire", "right"] },
  { name: "Sullen Bearer", health: 990_000, armor: 10_000, rewards: { gold: 200 }, weaknesses: ["back"] },
  { name: "Unwelcoming Glade", health: 2_400_000, rewards: { gold: 100, fruit: 200 }, weaknesses: ["fire", "axe"] },
  { name: "Food Mimic", health: 3_100_000, armor: 10, rewards: { gold: 100, fruit: 250 }, weaknesses: ["eating", "blunt"] },
  { name: "Frog Assassin", health: 1_050_000, dodge: 1, rewards: { gold: 1, fruit: 1 } },
  { name: "Enantiomers", count: 2, health: 1_000_000, armor: 9_100, dodge: 0.8, rewards: { fruit: 300 }, weaknesses: ["fire"] },
  { name: "Gnollish Ambassador", health: 750_000, armor: 10, dodge: 0.5, rewards: { gold: 200, fruit: 150 }, weaknesses: ["fire", "right"] },
  { name: "Web of Power", health: 10_000_000, rewards: { gold: 2_000, fruit: 100 }, weaknesses: ["water", "left"] },
  { name: "Tombstone of the Forgotten", health: 29_000_000, armor: 10_000, rewards: { gold: 2000, fruit: 250 }, weaknesses: ["front", "magic"] },
  { name: "Hippogryph", health: 80_000_000, regen: 10_000, rewards: { gold: 12_000, fruit: 400 }, weaknesses: ["fire", "left"] },
  { name: "The King's Armor", health: 60_000_000, armor: 100_000, rewards: { gold: 8_000 }, immune: ["sharp"], weaknesses: [] },
  { name: "Corridor of Illusions", health: 6_000_000, dodge: 0.1, rewards: { gold: 6_000, fruit: 600 }, weaknesses: ["light"] },
  { name: "Hiber Conduit", health: 100_000_000, regen: 8_000, rewards: { gold: 800, fruit: 800 }, immune: ["ice"], weaknesses: ["fire"] },
  { name: "Core Diver", health: 510_000_000, regen: 80_000, rewards: { gold: 200, fruit: 1000 }, immune: ["fire"], weaknesses: ["water"] },
  { name: "Smother Mother", health: 250_000_000, armor: 800_000, rewards: { gold: 200, fruit: 1500 }, immune: ["fire"], weaknesses: ["left", "water"] },
  { name: "The Final Warden", dodge: 0.1, health: 999_000_000, regen: 600_000, rewards: { gold: 15_000, fruit: 5000 }, immune: ["fire"], weaknesses: ["holy", "ice"] },
  { name: "Geckalog", health: 1_000_000_000, armor: 1_000_000_000, regen: 10_000_000, ethereal: true, rewards: { gold: 1_000_000_000, fruit: 1_000_000_000 }, passiveEffects: ["This dungeon is barely strong enough to contain the invincible Skelemasterion."], immune: ["light"] },
];

const enemyAbilities: Record<string, Ability[]> = {
  "Wild Slime": [{ name: "Slobber", duration: 5, damage: 1, description: "Cover the enemy in slime." }],
  "Poison Crow": [{
    name: "Crow Blast", duration: 5, description: "An explosion of feathers and poison.",
    onCompleted(store, self) {
      const e = store.abilityEffects(self);
      if (e.hitChance < Math.random()) return;
      store.addPoison(10 * e.damageMultiplier);
    },
  }],
  "Animated Skeleton": [{ name: "Femurs Clashing", duration: 5, damage: 30, description: "Bones to bones. Ashes to ashes." }],
  "Thick Door": [{ name: "Creaking", duration: 10, damage: 0, description: "The door creaks ominously." }],
  "Bandlings": [{ name: "Swarm of Bandlings", duration: 5, damage: 1, description: "A swarm of fierce little warriors." }],
  "Dead Gladiator": [{ name: "Blades of Revenge", duration: 1, damage: 100, description: "A vengeful gladiator attacks." }],
  "Lobster Daddy": [{ name: "Claw Smash", duration: 100, damage: 1000, description: "A powerful claw attack." }],
  "Will-o-Wasp": [{ name: "Sting", duration: 0.05, damage: 1, description: "The quick and painful sting of a wasp." }],
  "The Shroud": [{ name: "Shroud of Darkness", duration: 1, damage: 1000, description: "Envelops the enemy in darkness." }],
  "Dark Lord": [{ name: "Shadow Strike", duration: 1, damage: 10, description: "The Dark Lord never misses.", tags: ['dark', 'undodgeable'] }],
  "Clockomancer": [{
    name: "Time Wrap", duration: 1, description: "Slows down time.",
    onCompleted(store) { store.run.speedLevel = 1; },
  }, {
    name: "Time Burp", duration: 1, description: "Pushes time forward.",
    onCompleted(store) { store.run.skipTime += 2_000; },
  }],
  "Glass Dragon": [{ name: "Shatter", duration: 1, damage: 100_000, description: "The repairs are expensive.", consumes: { gold: 100 }, tags: ['sharp'] }],
  "Xaranthian Construct": [{ name: "Fire Xaranthian Cannons", duration: 10, damage: 650_000, description: "Sounds like thunder, looks like lightning bolts flying straight at the target." }],
  "Potato Golem": [{
    name: "Fertilize Saplings", duration: 1, description: "The number of saplings you have is effectively doubled. Potato magic.",
    peaceful: true, consumes: (store) => ({ gold: store.run.saplings }),
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
        store.run.room.damage = enemy.health ?? 0;
      }
    },
  }],
  "Corrupted Bounty Hunter": [{ name: "Hyper Beam", duration: 100, damage: 1_250_000, description: "Imagine a rainbow turning to violence." }],
  "Lior the Weaver": [{ name: "Fabric of Reality", duration: 1, damage: 1, description: "" }],
  "Skeletron": [{ name: "Bonetron", duration: 1, damage: 1, description: "" }],
  "Chago's Chamber": [{ name: "Spring Trap", duration: 1, damage: 1, description: "" }],
  "Chago": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Door of Loathing": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Zakatrixos": [{
    name: "Pierce the Veil", duration: 100,
    description: `
For the duration of the spell, Zakatrixos shifts the band into the ethereal plane.
This negates the defenses of ethereal enemies.`,
  }],
  "Wands from the Depths": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Skyrmions": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Defensive Installation": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Tenebra": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Landas Wizard": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Crystal Man": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Power Crystal": [{ name: "", duration: 1, damage: 1, description: "" }],

  "Frozen Centurion": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Trollish Maiden": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Dryfin Carp": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Scaffold Sorcery": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Lost Swimmer": [{ name: "", duration: 1, damage: 1, description: "" }],

  "Geckalog": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Jaw Maw Maw": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Decay Manifest": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Striped Horror": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Dragonfly Agaric": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Artifact Seeker": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Golden Chest": [{ name: "", duration: 1, damage: 1, description: "" }],
  "King of Tadpoles": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Hopanoids": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Tosyl Rose": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Sullen Bearer": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Unwelcoming Glade": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Food Mimic": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Frog Assassin": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Enantiomers": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Gnollish Ambassador": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Web of Power": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Tombstone of the Forgotten": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Hippogryph": [{ name: "", duration: 1, damage: 1, description: "" }],
  "The King's Armor": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Corridor of Illusions": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Hiber Conduit": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Core Diver": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Smother Mother": [{ name: "", duration: 1, damage: 1, description: "" }],
  "The Final Warden": [{ name: "", duration: 1, damage: 1, description: "" }],
  "Skelemasterion": [{ name: "", duration: 1, damage: 1, description: "" }],
};

export const enemiesByName = {} as Record<string, Enemy>;
for (const e of allEnemies) {
  enemiesByName[e.name] = e;
  e.abilities = enemyAbilities[e.name] ?? [];
  for (const ab of e.abilities) {
    ab.image = e.name;
  }
}
