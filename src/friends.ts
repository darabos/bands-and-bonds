import { marked } from 'marked';
import { numberFormat, type Ability, type Friend } from './base';
import { turnsToPath } from './rooms';

function numberSpan(n: number, extra?: string): string {
  const e = extra ?? '';
  return `<span class="numbers">${numberFormat(n)}${e}</span>`;
}
const LOG_3_OVER_LOG_2 = Math.log(3) / Math.log(2);

export const allFriends: Friend[] = [
  {
    name: 'Anvilomancer',
    cost: 0,
    description: `
An expert Anvilomancer can upgrade your weapons in the midst of battle.
Upgrades are mostly lost when leaving the dungeon.
The starting weapon level is the square root of the highest level achieved.
    `,
    abilities: [{
      name: "Forge",
      duration: 5,
      consumes: { gold: 1 },
      description: (store) => `Increases the level of all weapons. (Currently ${numberSpan(store.weaponLevel())}.)`,
      onCompleted(store, times) {
        store.run.weaponLevelAdded += times;
      },
      peaceful: true,
    }],
    super: {
      name: 'Anvilominator',
      description: `
An expert Anvilominator can upgrade your weapons in the midst of battle.
The Anvilominator retains upgrades from earlier runs.
The starting weapon level is the highest level achieved.
    `,
      abilities: [{
        name: "Forge",
        duration: 10,
        consumes: { gold: 5 },
        description: (store) => `Increases the level of all weapons by ${numberSpan(10)}. (Currently ${numberSpan(store.weaponLevel())}.)`,
        onCompleted(store, times) {
          store.run.weaponLevelAdded += 10 * times;
        },
        peaceful: true,
      },
      {
        name: "Unforge",
        hidden: (store) => store.run.room.armorDamage === (store.currentEnemy()?.armor ?? 0),
        duration: 5,
        description: (store, self) => `Damages the armor of the enemy.\n\n${numberSpan(store.abilityEffects(self).damageMultiplier * 10)} damage`,
        onCompleted(store, times, self) {
          const e = store.abilityEffects(self);
          const hits = e.rndHits(times);
          store.run.room.armorDamage = Math.min(
            store.currentEnemy()?.armor ?? 0,
            store.run.room.armorDamage + e.damageMultiplier * hits * 10);
        },
      }],
    },
  },
  {
    name: 'Azrekta',
    cost: 0,
    description: `
Azrekta bedevils her friends and foes. Her friends become more powerful versions of themselves.
Her enemies become ethereal, making them challenging to hit.
    `,
    abilities: [],
  },
  {
    name: 'Coldblade',
    cost: 0,
    description: "A frozen warrior. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
    abilities: [{
      name: "Glacial Strike",
      description: "A very cold blade with a very sharp edge.",
      duration: 3600 * 24 * 365 * 1000,
      damage: 1_000_000_000_000,
      tags: ['ice'],
    }],
    super: {
      name: 'Hotblade',
      description: "A frozen warrior, now with a hot blade. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
      abilities: [{
        name: "Glacial Flame Strike",
        description: "A very hot blade with a very sharp edge.",
        duration: 3600 * 24 * 365 * 1000,
        damage: 1_000_000_000_000,
        tags: ['fire'],
      }],
    },
  },
  {
    name: 'Dark Chef',
    cost: 0,
    description: `
A master of the culinary arts, Dark Chef fights by poisoning the enemies.
The only way to defend against his attacks is to dodge them or wear layers of heavy armor.`,
    abilities: [{
      name: "Poison Strike",
      duration: 5,
      tags: ['poison'],
      description: (store) => store.run.room.poison ? `Damage over time. (Currently ${numberSpan(store.run.room.poison)} damage per second.)` : 'Damage over time.',
      onCompleted(store, times, self) {
        const e = store.abilityEffects(self);
        const hits = e.rndHits(times);
        store.addPoison(e.damageMultiplier, hits);
      },
    }],
    super: {
      name: 'Dark Sommelier',
      description: `
A master of the culinary arts, Dark Sommelier fights by poisoning the enemies.
The only way to defend against his attacks is to wear layers of heavy armor.`,
      abilities: [{
        name: "Poison Strike",
        duration: 5,
        tags: ['poison', 'undodgeable'],
        description: (store) => store.run.room.poison ? `Poison the air. (Currently ${numberSpan(store.run.room.poison)} damage per second.)` : 'Poison the air.',
        onCompleted(store, times, self) {
          const e = store.abilityEffects(self);
          const hits = e.rndHits(times);
          store.addPoison(e.damageMultiplier * 10, hits);
        },
      }],
    },
  },
  {
    name: 'Desert Rabbit',
    cost: 0,
    description: `
The Desert Rabbit grew up fighting gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Rabbit in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
    `,
    super: {
      name: 'Desert Armadillo',
      description: `
The Desert Armadillo grew up fighting gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Armadillo in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
The damage bonus can be further increased with the Blessing of the Desert ability.
    `,
      abilities: [{
        name: "Blessing of the Desert",
        duration: 5,
        consumes: { gold: 1 },
        description: (store) => `Increases the damage multiplier for weaknesses. (Currently ${numberSpan(store.run.desertBlessingMultiplier, '×')}.)`,
        onCompleted(store, times) {
          store.run.desertBlessingMultiplier += times;
        },
        peaceful: true,
      }],
    },
  },
  {
    name: 'Friend of Metal',
    description: 'A warrior equipped with metal armor and weapons expertly crafted in the forges of the Friendship Mountain.',
    cost: 0,
    abilities: [{
      name: "Steel Jab",
      duration: 3,
      damage: 10,
      description: "A finely crafted sword in the hands of a Friend of Metal.",
      tags: ['sharp'],
    }],
    super: {
      name: 'Friend of Metal and Fire',
      abilities: [{
        name: "Steel Jab+",
        duration: 3,
        damage: 100,
        description: "A finely crafted sword in the hands of a Friend of Metal and Fire.",
        tags: ['sharp'],
      }, {
        name: "Flame Jab+",
        duration: 3,
        damage: 100,
        description: "A flaming sword in the hands of a Friend of Metal and Fire.",
        tags: ['fire'],
      }],
    },
  },
  {
    name: 'Knight of Claws',
    cost: 0,
    description: `
Trained as an assassin, the Knight of Claws works best on his own. His power doubles for every empty space next to him.
    `,
    abilities: [{
      name: "Claws & Thorns",
      duration: 100,
      damage(store) {
        const pos = store.onboard('Knight of Claws');
        const empty = pos ? store.emptySpacesAround(pos.row, pos.col).length : 0;
        return 100 * 2 ** empty;
      },
      description: "A whirlwind of sharp blades ravages the battlefield.",
      tags: ['sharp'],
    }],
  },
  {
    name: 'Lamplighter',
    cost: 0,
    description: "Lamplighter lights up the tiles around it, letting you expand your band.",
    abilities: [{
      name: "Illuminate",
      duration: 1,
      damage: 2,
      description: "Shines a light on the battlefield, hurting the eyes accustomed to darkness.",
      tags: ['light'],
    }],
    super: { name: 'Lamperlighter' },
  },
  {
    name: 'Royal Fruitbearer',
    cost: 0,
    description: `
With the Royal Fruitbearer in your band, whenever you find fruit in the dungeon, every member of the band gives a piece to every other member.
    `,
    passiveEffects: ["When you find fruit, every member of the band gives a piece to every other member. (Thanks to the Royal Fruitbearer.)"],
    super: {
      name: 'Royal Fruitwearer',
      description: `
With the Royal Fruitwearer in your band, whenever you find fruit in the dungeon, every member of the band gives a piece to every other member.
In addition, any gold found is converted to fruit as well.
      `,
      passiveEffects: [
        "Any gold found is converted to fruit. (Thanks to the Royal Fruitwearer.)",
        "When you find fruit, every member of the band gives a piece to every other member. (Thanks to the Royal Fruitwearer.)",
      ],
    },
  },
  {
    name: 'Stick Master',
    cost: 0,
    description: `
Stick Master is a humble explorer. While wandering the forest, they came upon the ruins of a long-lost castle.
At the lowest level, they discovered the entrance to the dungeon.
    `,
    abilities: [{
      name: "Wooden Stick",
      duration: 0.5,
      damage: 1,
      description: "Whack it with a stick.",
      tags: ['blunt'],
    }],
    super: {
      name: 'Stick Grandmaster',
      abilities: [{
        name: "Wooden Stick",
        duration: 0.5,
        damage: 2,
        description: "Whack it with a stick quite hard.",
        tags: ['blunt'],
      }],
    },
  },
  {
    name: 'The Silent Song',
    cost: 0,
    description: "Her sweet melody doubles the damage dealt by friends standing next to her.",
    super: {
      name: 'The Silent Quartet',
      description: "Their sweet melody doubles the damage dealt by all friends.",
    },
  },
  {
    name: 'Lord of Gears',
    cost: 0,
    description: `
The Lord of Gears is a master of automation. The band members next to him need not do anything.
Their abilities will be activated automatically.
    `,
    super: {
      name: 'Gear of Lords',
      description: `
The Gear of Lords is the ultimate master of automation. All abilities will be activated automatically.
    `,
    },
  },
  {
    name: 'Pur Lion',
    cost: 0,
    description: "A thief, wanted in all the thirty kingdoms. Yet nobody is able to give an accurate description of him.",
    abilities: [{
      name: "Snatch",
      duration: 2.5,
      description: "Steals a piece of gold.",
      onCompleted(store, times) {
        store.run.gold += times;
      },
    }],
    super: {
      name: 'Sir Pur Lion',
      abilities: [{
        name: "Snatch",
        duration: (store) => 2.5 * store.weaponLevel(),
        preventRepeat: true,
        description: (store) => store.weaponLevel() > 1
          ? `Steals ${numberSpan(store.weaponLevel())} pieces of gold.\n\nLarger amounts take longer to steal.`
          : 'Steals a piece of gold.',
        onCompleted(store, times) {
          store.run.gold += store.weaponLevel() * times;
        },
      }],
    },
  },
  {
    name: 'Kit Flash',
    cost: 0,
    description: "A wizard of speed. Kit Flash can speed up the combat abilities of every member of the band.",
    abilities: [{
      name: "Running Start",
      duration: 10,
      consumes: { gold: 1 },
      description: (store) => `Speed up all combat abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
      onCompleted(store, times) {
        store.run.speedLevel += times;
      },
      peaceful: true,
    }],
    super: {
      name: 'Kit Storming',
      description: "A wizard of great speed. Kit Storming can quickly speed up the combat abilities of every member of the band.",
      abilities: [{
        name: "Running Start",
        duration: 10,
        consumes: (store) => ({ gold: Math.round(store.run.speedLevel ** LOG_3_OVER_LOG_2) }),
        description: (store) => `Speed up all combat abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
        onCompleted(store) {
          store.run.speedLevel *= 2;
        },
        preventRepeat: true,
        peaceful: true,
      }],
    },
  },
  {
    name: 'Wayfinder',
    cost: 0,
    description: `
A master of navigation, Wayfinder will guide your band through the dark corridors of the dungeon.
Just point to your destination on the map to get started.
To repeat the run after reaching the destination, place Wayfinder at the front of your band.

With Wayfinder in your band, you can replace members of your band at campfires.
Now that Wayfinder is free, you can see more details on the map.
    `,
    passiveEffects: (store) => store.onboard("Wayfinder")!.row < 2
      ? ["Wayfinder is placed in the front. Your band will retreat and start over after reaching the destination."]
      : ["Wayfinder is placed in the back. Your band will not start over after reaching the destination."],
    super: {
      name: 'Campfinder',
      description: `
A master of navigation, Campfinder will guide your band through the dark corridors of the dungeon.
Just point to your destination on the map to get started.
To repeat the run after reaching the destination, place Campfinder at the front of your band.

With Campfinder in your band, you can replace members of your band at campfires.
Now that Campfinder is free, you can see more details on the map.

Campfinder sets the weapons of nearby explorers on fire.
      `,
      passiveEffects: (store) => store.onboard("Campfinder")!.row < 2
        ? ["Campfinder is placed in the front. Your band will retreat and start over after reaching the destination."]
        : ["Campfinder is placed in the back. Your band will not start over after reaching the destination."],
      abilities: [{
        name: "Fall Back to Camp",
        duration: 20,
        description: 'Retreats to the last visited campfire.',
        onCompleted(store) {
          const path = store.currentPath();
          let steps = store.run.steps;
          while (steps > 0 && path[steps].type !== 'rescue') {
            steps -= 1;
          }
          store.run.steps = steps;
          store.run.turns = turnsToPath(steps, store.run.turns).turns;
          store.local.destination = undefined;
        },
        preventRepeat: true,
        preventAutomation: true,
        affectedBySpeedLevel: false,
        peaceful: true,
      }],
    }
  },
  {
    name: 'Bayla',
    cost: 0,
    description: `
Bayla is a master of movement. She can change her position in the middle of a fight to best target the weak spots
of her enemies. She's great friends with the Desert Rabbit.
    `,
    abilities: [{
      name: "Battle Rhythm",
      duration: 1,
      damage: 10,
      tags: ['sharp', 'fire', 'ice'],
      description: "A flight of small magical blades timed perfectly to find the weak spots of the enemy.",
    }],
    super: {
      name: 'Baylanda',
      description: `
Baylanda is a master choreographer. She can rearrange the band in the middle of a fight to best target the weak spots
of her enemies. She's great friends with the Desert Rabbit and likes to stick close to Azrekta.
`,
    },
  },
  {
    name: 'Kin of Pump',
    cost: 0,
    description: `
People who shed all their fears and worries can become Kins of Pump. They still love others,
but never worry or care about their wellbeing. They are free to pursue their desires without shame.

The Kin you found in the dungeon came here to search for treasure. They do not help out with fighting
or taking care of the band. They are great at finding gold, though. All gold finds are doubled.
    `,
    passiveEffects: ["Kin of Pump doubles the gold found after battles."],
    super: {
      name: 'King of Pump',
      description: `
People who shed all their fears and worries can become Kins of Pump. They still love others,
but never worry or care about their wellbeing. They are free to pursue their desires without shame.

The Kin you found in the dungeon came here to search for treasure. They have now found a crown, and
started to act like a king. They still do not help, but all gold finds are now multiplied a hundredfold.
    `,
      passiveEffects: ["King of Pump multiplies the gold found after battles a hundredfold."],
    },
  },
  {
    name: 'Kevin',
    cost: 0,
    description: `
Kevin is not so much a person as a phenomenon. When Kevin is present, all enemies are vulnerable to fire.
    `,
    super: {
      name: "Kevout",
      description: `
Kevout has cooled off a little. He has become focused and curious, drawing in everyone to exist in the moment.
When Kevout is present, even ethereal creatures are drawn into the material world.
    `,
    },
  },
  {
    name: 'Smiling Pilot',
    cost: 0,
    description: `
Shapeshifters live in the shadows and avoid any chance of being exposed. Except for the Smiling Pilot,
who took on the shape of Carl the Twelfth, king of the Froglands. Nobody is sure how long this
ruse lasted, and which of the decrees were written by the Smiling Pilot.

Chased by assassins from the Froglands, the Smiling Pilot eventually took refuge in this treacherous dungeon.

As a member of your band, he copies the attacks of the two friends to his left and right.
    `,
    super: {
      name: 'Smiling Wizard',
      description: `
Shapeshifters live in the shadows and avoid any chance of being exposed. Except for the Smiling Wizard,
who took on the shape of Carl the Twelfth, king of the Froglands. Nobody is sure how long this
ruse lasted, and which of the decrees were written by the Smiling Wizard.

Chased by assassins from the Froglands, the Smiling Wizard eventually took refuge in this treacherous dungeon.

Standing next to Azrekta, the Smiling Wizard takes her shape and copies her ability.
    `,
    },
  },
  {
    name: 'Mongreler',
    cost: 0,
    description: "A collector of unusual pets. Mongreler can capture weakened enemies and deploy them on the battlefield.",
    passiveEffects: ['Mongreler wants to capture enemies. Damage is reduced by 99% to avoid killing them.'],
    super: {
      name: 'Monster Juggler',
      description: `
A collector of unusual pets. Monster Juggler can capture weakened enemies and deploy them on the battlefield.
The captured enemies are kept even when the band retreats.
      `,
      passiveEffects: ['Monster Juggler wants to capture enemies. Damage is reduced by 99% to avoid killing them.'],
    },
  },
  {
    name: 'Eighth Swimmer',
    cost: 0,
    description: `
In the Landas Deserts the mages punish loud people by turning their bodies into water.
The Eighth Swimmer was one of these unlucky souls. Imagine walking among thirsty people
everyday with a body made of water.

They found refuge in this dungeon and now in your band.
    `,
    abilities: [{
      name: "Flood",
      duration: 10,
      damage: 10,
      description: "A deceptively slow attack that cannot be dodged.",
      tags: ['water', 'undodgeable'],
    }],
    super: {
      name: 'Seventh Swimmer',
      abilities: [{
        name: "Flood",
        duration: 10,
        damage: 10,
        description: "A deceptively slow attack that fills up the battlefield. No attacks can be dodged while the flood is in progress.",
        tags: ['water', 'undodgeable'],
      }],
    },
  },
  {
    name: 'Pecquer',
    cost: 0,
    description: `
Pecquer is a veteran mercenary from the thirty kingdoms. The warriors he fought besides sing songs of his bravery.
    `,
    abilities: [{
      name: "Sneak Past",
      duration: 6,
      hidden: (store) => store.run.skips >= 1 || !!store.currentRoom().end,
      description: (store) => `
Pecquer leads the band fearlessly past the enemy.

Uses left: ${numberSpan(1 - store.run.skips)}`,
      onCompleted(store) {
        store.run.skips += 1;
        const next = store.currentRoom().next;
        const options = next ? Object.keys(next) : ['Keep going'];
        const choice = options[Math.floor(Math.random() * options.length)];
        store.takeTurn(choice);
      },
      preventRepeat: true,
      preventAutomation: true,
      affectedBySpeedLevel: false,
    }],
    super: {
      name: 'Le Pecquer',
      abilities: [{
        name: "Sneak Past",
        duration: 6,
        hidden: (store) => store.run.skips >= 2 || !!store.currentRoom().end,
        description: (store) => `
Le Pecquer leads the band fearlessly past the enemy.

Uses left: ${numberSpan(2 - store.run.skips)}`,
        onCompleted(store) {
          store.run.skips += 1;
          const next = store.currentRoom().next;
          const options = next ? Object.keys(next) : ['Keep going'];
          const choice = options[Math.floor(Math.random() * options.length)];
          store.takeTurn(choice);
        },
        preventRepeat: true,
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }],
    },
  },
  {
    name: 'Hedge Lost',
    cost: 0,
    description: "Hedge Lost is the only trader in the Hedge Market who is not originally a shrew.",
    abilities: [{
      name: "Buy Fruit",
      duration: 1,
      consumes: { gold: 10 },
      description: 'Buy a piece of fruit at the Hedge Market.',
      onCompleted(store, times) {
        store.run.fruit += store.fruitMultiplier() * times;
      },
      peaceful: true,
    }, {
      name: "Buy Sapling",
      duration: 10,
      consumes: { gold: 1_000 },
      description: (store) => `
Buy a fruit sapling at the Hedge Market.${store.run.saplings ? `
(Currently ${numberSpan(store.run.saplings)} saplings producing
${numberSpan(store.run.saplings * store.fruitMultiplier(),
        ' <img src="images/generated/fruit.webp" class="resource-icon" />')} per second.)` : ''}`,
      onCompleted(store, times) {
        store.run.saplings += times;
      },
      peaceful: true,
    }],
    super: {
      name: 'Hedge Found',
      description: "Hedge Found is the only trader admitted to the Inner Hedge Market who is not originally a shrew.",
      abilities: [{
        name: "Buy Fruit",
        duration: 1,
        consumes: { gold: 10 },
        description: 'Buy a piece of fruit at the Hedge Market.',
        onCompleted(store, times) {
          store.run.fruit += store.fruitMultiplier() * times;
        },
        peaceful: true,
      }, {
        name: "Buy Sapling",
        duration: 10,
        consumes: { gold: 1_000 },
        description: (store) => `
Buy a fruit sapling at the Hedge Market.${store.run.saplings ? `
(Currently ${numberSpan(store.run.saplings)} saplings producing
${numberSpan(store.run.saplings * store.fruitMultiplier(),
          ' <img src="images/generated/fruit.webp" class="resource-icon" />')} per second.)` : ''}`,
        onCompleted(store, times) {
          store.run.saplings += times;
        },
        peaceful: true,
      }, {
        name: "Crash the Market",
        duration: 0.1,
        consumes: (store) => ({ saplings: Math.max(1, store.run.saplings) }),
        preventRepeat: true,
        preventAutomation: true,
        damage: (store) => 1000 * Math.max(1, store.run.saplings),
        description: 'Destroy all saplings to set the Hedge Market on fire.',
        tags: ['fire'],
      }],
    },
  },
  {
    name: 'Zaktar Kadoque',
    cost: 0,
    description: `
Zaktar Kadoque is an explorer from another world. He was not trapped in his cage at all,
rather he was examining it. He loves this dungeon and is very happy to have met your band.
He is particularly interested in the fruit you're holding.
    `,
    abilities: [{
      name: "Eat Fruit",
      duration: 1,
      consumes: { fruit: 1 },
      description: 'Do you have too much fruit? Zaktar Kadoque can eat the leftovers.\n\nOnly works with fruit acquired on this run.',
      onCompleted(store, times) {
        store.run.weaponLevelAdded += times;
      },
      peaceful: true,
    }],
    super: {
      name: 'Zaktar Kadoque Karr',
      description: "Zaktar finds great joy in exposure to Azrekta's magic. His appetite for new experiences knows no bounds.",
      abilities: [{
        name: "Eat Fruit",
        duration: 1,
        consumes: (store) => ({ fruit: Math.round(store.weaponLevel() ** LOG_3_OVER_LOG_2) }),
        description: 'Do you have too much fruit? Zaktar Kadoque Karr can eat the leftovers.\n\nOnly works with fruit acquired on this run.',
        onCompleted(store) {
          store.run.weaponLevelAdded += store.weaponLevel();
        },
        preventRepeat: true,
        peaceful: true,
      }],
    },
  },
  {
    name: 'Xaranthian Constructor',
    cost: 0,
    description: `
The Xaranthian Empire is said to be ruled by wise engineers who built powerful machines to ease their work.
But building such machines is hard work too, so the Xarantians built factories to produce mechanical turtles
that can build machines that can deploy other machines that can grow further machines.

The Xaranthian factories in turn are built by Xaranthian Constructors. This one has never seen
a Xaranthian person, and neither has anyone else in your band.
    `,
    abilities: [{
      name: "Construct Grower",
      consumes: { gold: 1_000 },
      duration: 16,
      description: (store) =>
        `Construct a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
      onCompleted(store, times) {
        store.run.room.xaranthian.growers += times;
      },
      preventAutomation: true,
      affectedBySpeedLevel: false,
    }, {
      name: "Grow Gun",
      consumes: { gold: 100 },
      hidden: (store) => store.run.room.xaranthian.growers !== 1,
      duration: 16,
      description: (store) =>
        `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store, times) {
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers * times;
      },
      preventAutomation: true,
      affectedBySpeedLevel: false,
    }, {
      name: "Grow Guns",
      consumes: { gold: 100 },
      hidden: (store) => store.run.room.xaranthian.growers < 2,
      duration: 16,
      description: (store) =>
        `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store, times) {
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers * times;
      },
      preventAutomation: true,
      affectedBySpeedLevel: false,
    }, {
      name: "Fire Xaranthian Gun",
      hidden: (store) => store.run.room.xaranthian.guns !== 1,
      duration: 16,
      description: "Fire the mechanical gun.",
      tags: ['ranged'],
      damage: 1,
    }, {
      name: "Fire Xaranthian Guns",
      hidden: (store) => store.run.room.xaranthian.guns < 2,
      duration: 16,
      description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
      tags: ['ranged'],
      damage: (store) => store.run.room.xaranthian.guns,
    }],
    super: {
      name: 'Xaranthian Power Constructor',
      abilities: [{
        name: "Construct Factory",
        consumes: { gold: 1_000_000 },
        duration: 16,
        description: (store) =>
          `Build a factory for producing mechanical turtles.${store.run.room.xaranthian.factories ? ` (Currently ${numberSpan(store.run.room.xaranthian.factories)} factories.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.factories += times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Produce Turtle",
        consumes: { gold: 100_000 },
        hidden: (store) => store.run.room.xaranthian.factories !== 1,
        duration: 16,
        description: (store) =>
          `Build a mechanical turtle in the factory.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Produce Turtles",
        consumes: { gold: 100_000 },
        hidden: (store) => store.run.room.xaranthian.factories < 2,
        duration: 16,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.factories)} mechanical turtles in the factories.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Build Deployer",
        consumes: { gold: 10_000 },
        hidden: (store) => store.run.room.xaranthian.turtles !== 1,
        duration: 16,
        description: (store) =>
          `Build a deployer from the mechanical turtle.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Build Deployers",
        consumes: { gold: 10_000 },
        hidden: (store) => store.run.room.xaranthian.turtles < 2,
        duration: 16,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.turtles)} deployers from the mechanical turtles.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Deploy Grower",
        consumes: { gold: 1_000 },
        hidden: (store) => store.run.room.xaranthian.deployers !== 1,
        duration: 16,
        description: (store) =>
          `Deploy a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Deploy Growers",
        consumes: { gold: 1_000 },
        hidden: (store) => store.run.room.xaranthian.deployers < 2,
        duration: 16,
        description: (store) =>
          `Deploy ${numberSpan(store.run.room.xaranthian.deployers)} mechanical growers.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Grow Gun",
        consumes: { gold: 100 },
        hidden: (store) => store.run.room.xaranthian.growers !== 1,
        duration: 16,
        description: (store) =>
          `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Grow Guns",
        consumes: { gold: 100 },
        hidden: (store) => store.run.room.xaranthian.growers < 2,
        duration: 16,
        description: (store) =>
          `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store, times) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers * times;
        },
        preventAutomation: true,
        affectedBySpeedLevel: false,
      }, {
        name: "Fire Xaranthian Gun",
        hidden: (store) => store.run.room.xaranthian.guns !== 1,
        duration: 16,
        description: "Fire the mechanical gun.",
        tags: ['ranged'],
        damage: 1,
      }, {
        name: "Fire Xaranthian Guns",
        hidden: (store) => store.run.room.xaranthian.guns < 2,
        duration: 16,
        description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
        tags: ['ranged'],
        damage: (store) => store.run.room.xaranthian.guns,
      }],
    },
  },
];
const costs: Record<string, number> = {
  "Stick Master": 1,
  "The Silent Song": 2,
  "Lord of Gears": 3,
  "Lamplighter": 4,
  "Kin of Pump": 5,
  "Dark Chef": 6,
  "Anvilomancer": 7,
  "Wayfinder": 8,
  "Pecquer": 9,
  "Friend of Metal": 10,
  "Desert Rabbit": 11,
  "Royal Fruitbearer": 12,
  "Smiling Pilot": 13,
  "Knight of Claws": 14,
  "Kevin": 15,
  "Hedge Lost": 16,
  "Bayla": 17,
  "Eighth Swimmer": 18,
  "Mongreler": 19,
  "Coldblade": 20,
  "Kit Flash": 21,
  "Xaranthian Constructor": 22,
  "Azrekta": 23,
  "Pur Lion": 24,
  "Zaktar Kadoque": 25,
};
export const friendsByName = {} as Record<string, Friend>;
const abilitiesByName = {} as Record<string, Ability>;
const abilityOwners = {} as Record<string, string>;
for (const f of allFriends) {
  friendsByName[f.name] = f;
  f.cost = costs[f.name];
  f.descriptionHtml = marked(f.description ?? '');
  if (f.super?.name) {
    friendsByName[f.super.name] = { ...f, ...f.super };
    if (f.super.description) {
      f.super.descriptionHtml = marked(f.super.description);
    }
  }
  for (const ab of f.abilities ?? []) {
    abilityOwners[ab.name] = f.name;
    abilitiesByName[ab.name] = ab;
  }
}
// Set up combined abilities for Smiling Pilot.
function getDamageForSmilingPilot(ab: Ability): number {
  if (ab.name === 'Claws & Thorns') return 100;
  if (ab.name === 'Poison Strike') return 1;
  if (typeof ab.damage === 'number') return ab.damage;
  throw new Error(`Ability ${ab.name} does not have a numeric damage value.`);
}
const ATTACKS = ['Battle Rhythm', 'Claws & Thorns', 'Flood', 'Glacial Strike', 'Illuminate', 'Poison Strike', 'Steel Jab', 'Wooden Stick'];
friendsByName['Smiling Pilot'].abilities = [];
for (const an1 of ATTACKS) {
  const a1 = abilitiesByName[an1];
  if (typeof a1.duration !== 'number') continue;
  const dmg1 = getDamageForSmilingPilot(a1);
  for (const an2 of ATTACKS) {
    if (an1 >= an2) continue;
    const a2 = abilitiesByName[an2];
    if (typeof a2.duration !== 'number') continue;
    const dmg2 = getDamageForSmilingPilot(a2);
    const combined: Ability = {
      name: `Combined ${a1.name} and ${a2.name}`,
      tags: [...(a1.tags ?? []), ...(a2.tags ?? [])],
      duration: Math.sqrt(a1.duration * a2.duration),
      damage: Math.sqrt(dmg1 * dmg2),
      description: `Smiling Pilot has copied this from ${abilityOwners[an1]} and ${abilityOwners[an2]}.`,
      hidden(store) {
        const pos = store.onboard('Smiling Pilot');
        const pos1 = store.onboard(abilityOwners[an1]);
        const pos2 = store.onboard(abilityOwners[an2]);
        if (!pos || !pos1 || !pos2) return true;
        if (pos1.row !== pos.row || pos2.row !== pos.row) return true;
        return Math.abs(pos1.col - pos.col) > 1 || Math.abs(pos2.col - pos.col) > 1;
      }
    };
    if (combined.tags?.includes('poison')) {
      combined.onCompleted = (store, times, self) => {
        const e = store.abilityEffects(self);
        const hits = e.rndHits(times);
        store.addPoison((self.damage as number) * e.damageMultiplier, hits);
      };
    }
    friendsByName['Smiling Pilot'].abilities.push(combined);
  }
}
const NICENAMES: Record<string, string> = {
  'Combined Glacial Strike and Wooden Stick': 'Glacial Stick',
  'Combined Glacial Strike and Steel Jab': 'Glacial Jab',
  'Combined Glacial Strike and Illuminate': 'Illuminated Glacier',
  'Combined Steel Jab and Wooden Stick': 'Wooden Jab',
  'Combined Illuminate and Wooden Stick': 'Illuminated Stick',
  'Combined Illuminate and Steel Jab': 'Illuminated Jab',
  'Combined Battle Rhythm and Wooden Stick': 'Wooden Rhythm',
  'Combined Battle Rhythm and Glacial Strike': 'Glacial Rhythm',
  'Combined Battle Rhythm and Steel Jab': 'Steel Rhythm',
  'Combined Battle Rhythm and Illuminate': 'Illuminated Rhythm',
  'Combined Battle Rhythm and Flood': 'Flooded Rhythm',
  'Combined Flood and Wooden Stick': 'Flooded Stick',
  'Combined Flood and Glacial Strike': 'Glacial Flood',
  'Combined Flood and Steel Jab': 'Flooded Jab',
  'Combined Flood and Illuminate': 'Illuminated Flood',
  'Combined Claws & Thorns and Wooden Stick': 'Claws & Stick',
  'Combined Claws & Thorns and Glacial Strike': 'Glacial Claws',
  'Combined Claws & Thorns and Steel Jab': 'Claws & Jab',
  'Combined Claws & Thorns and Illuminate': 'Illuminated Claws & Thorns',
  'Combined Claws & Thorns and Flood': 'Claws & Flood',
  'Combined Battle Rhythm and Claws & Thorns': 'Claws & Rhythm',
  'Combined Glacial Strike and Poison Strike': 'Glacial Poison',
  'Combined Illuminate and Poison Strike': 'Illuminated Poison',
  'Combined Battle Rhythm and Poison Strike': 'Poison Rhythm',
  'Combined Flood and Poison Strike': 'Poison Flood',
  'Combined Claws & Thorns and Poison Strike': 'Claws & Poison',
  'Combined Poison Strike and Wooden Stick': 'Wooden Poison',
  'Combined Poison Strike and Steel Jab': 'Steel Poison',
}
for (const ab of friendsByName['Smiling Pilot'].abilities) {
  ab.image = ab.name;
  ab.name = NICENAMES[ab.name];
  abilitiesByName[ab.name] = ab;
}
// for (const ab of Object.values(abilitiesByName)) {
//   if (typeof ab.duration !== 'number' || typeof ab.damage !== 'number') continue;
//   console.log(
//     `Ability: ${ab.name}, Damage per second: ${ab.damage / ab.duration}, duration: ${ab.duration}, Tags: ${ab.tags?.join(', ')}`
//   );
// }
