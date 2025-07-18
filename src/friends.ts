import { marked } from 'marked';
import { numberFormat, type Ability, type Friend } from './base';

function numberSpan(n: number, extra?: string): string {
  const e = extra ?? '';
  return `<span class="numbers">${numberFormat(n)}${e}</span>`;
}

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
      duration: 50,
      consumes: { gold: 0 },
      description: (store) => `Increases the level of all weapons. (Currently ${numberSpan(store.weaponLevel())}.)`,
      onCompleted(store) {
        store.run.weaponLevelAdded += 1;
      },
      peaceful: true,
    }, {
      name: "Unforge",
      hidden: (store) => store.run.room.armorDamage === (store.currentEnemy()?.armor ?? 0),
      duration: 5,
      description: (store, self) => `Damages the armor of the enemy.\n\n${numberSpan(store.abilityEffects(self).damageMultiplier)} damage`,
      onCompleted(store, self) {
        const e = store.abilityEffects(self);
        if (Math.random() >= e.hitChance) return;
        store.run.room.armorDamage = Math.min(
          store.currentEnemy()?.armor ?? 0,
          store.run.room.armorDamage + e.damageMultiplier);
      },
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
        duration: 5,
        consumes: { gold: 5 },
        description: (store) => `Increases the level of all weapons. (Currently ${numberSpan(store.weaponLevel())}.)`,
        onCompleted(store) {
          store.run.weaponLevelAdded += 10;
        },
        peaceful: true,
      },
      {
        name: "Unforge",
        hidden: (store) => store.run.room.armorDamage === (store.currentEnemy()?.armor ?? 0),
        duration: 5,
        description: (store, self) => `Damages the armor of the enemy.\n\n${numberSpan(store.abilityEffects(self).damageMultiplier * 100)} damage`,
        onCompleted(store, self) {
          const e = store.abilityEffects(self);
          if (Math.random() >= e.hitChance) return;
          store.run.room.armorDamage = Math.min(
            store.currentEnemy()?.armor ?? 0,
            store.run.room.armorDamage + e.damageMultiplier * 100
          );
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
      damage: 1000000000,
      tags: ['sharp', 'cold'],
    }],
    super: {
      name: 'Hotblade',
      description: "A frozen warrior, now with a hot blade. Legends say his attacks will kill any foe, but each swing takes a thousand years.",
      abilities: [{
        name: "Glacial Flame Strike",
        description: "A very hot blade with a very sharp edge.",
        duration: 3600 * 24 * 365 * 1000,
        damage: 1000000000,
        tags: ['sharp', 'fire'],
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
      onCompleted(store, self) {
        const e = store.abilityEffects(self);
        if (Math.random() >= e.hitChance) return;
        store.addPoison(e.damageMultiplier);
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
        onCompleted(store, self) {
          const e = store.abilityEffects(self);
          if (Math.random() >= e.hitChance) return;
          store.addPoison(e.damageMultiplier * 10);
        },
      }],
    },
  },
  {
    name: 'Desert Rabbit',
    cost: 0,
    description: `
The Desert Rabbit often fights gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Rabbit in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
    `,
    super: {
      name: 'Desert Armadillo',
      description: `
The Desert Armadillo often fights gigantic enemies. He has developed a keen sense for their weaknesses.

With the Desert Armadillo in your band, you will see the weaknesses of enemies and the right attacks will deal double damage.
The damage bonus can be further increased with the Blessing of the Desert ability.
    `,
      abilities: [{
        name: "Blessing of the Desert",
        duration: 5,
        consumes: { gold: 1 },
        description: (store) => `Increases the damage multiplier for weaknesses. (Currently ${numberSpan(store.run.desertBlessingMultiplier, '×')}.)`,
        onCompleted(store) {
          store.run.desertBlessingMultiplier += 1;
        },
        peaceful: true,
      }],
    },
  },
  {
    name: 'Friend of Metal',
    description: 'A warrior equipped with high-quality metal armor and weapons.',
    cost: 0,
    abilities: [{
      name: "Steel Jab",
      duration: 3,
      damage: 10,
      description: "A finely crafted sword in the hands of a Friend of Metal.",
      tags: ['sharp', 'steel'],
    }],
    super: {
      name: 'Friend of Metal and Fire',
      abilities: [{
        name: "Steel Jab+",
        duration: 3,
        damage: 100,
        description: "A finely crafted sword in the hands of a Friend of Metal and Fire.",
        tags: ['sharp', 'steel'],
      }, {
        name: "Flame Jab+",
        duration: 3,
        damage: 100,
        description: "A flaming sword in the hands of a Friend of Metal and Fire.",
        tags: ['sharp', 'fire'],
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
    }],
  },
  {
    name: 'Lamplighter',
    cost: 0,
    description: "Lights up tiles around it, letting you expand your band.",
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
With the Royal Fruitbearer in your band, whenever you find fruit in the dungeon, every member of the party gets one piece.
    `,
    passiveEffects: ["When you find fruit, every member of the party gets one piece. (Thanks to the Royal Fruitbearer.)"],
    super: {
      name: 'Royal Fruitwearer',
      description: `
With the Royal Fruitwearer in your band, whenever you find fruit in the dungeon,
every member of the party gives one piece to every other member.
      `,
      passiveEffects: ["When you find fruit, every member of the party gives one piece to every other member. (Thanks to the Royal Fruitwearer.)"],
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
      onCompleted(store) {
        store.run.gold += 1;
      },
    }],
    super: {
      name: 'Sir Pur Lion',
      abilities: [{
        name: "Snatch",
        duration: 2.5,
        description: (store) => `Steals ${store.weaponLevel() > 1 ? `${store.weaponLevel()} pieces` : 'a piece'} of gold.`,
        onCompleted(store) {
          store.run.gold += store.weaponLevel();
        },
      }],
    },
  },
  {
    name: 'Kit Flash',
    cost: 0,
    description: "A wizard of speed, Kit Flash can speed up the abilities of every member of the band.",
    abilities: [{
      name: "Running Start",
      duration: 10,
      consumes: { gold: 1 },
      description: (store) => `Speed up all abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
      onCompleted(store) {
        store.run.speedLevel += 1;
      },
      peaceful: true,
    }],
    super: {
      name: 'Kit Storming',
      description: "A wizard of speed, Kit Storming can speed up the abilities of every member of the band.",
      abilities: [{
        name: "Running Start",
        duration: 10,
        consumes: (store) => ({ gold: store.run.speedLevel }),
        description: (store) => `Speed up all abilities. (Currently ${numberSpan(store.run.speedLevel, '×')}.)`,
        onCompleted(store) {
          store.run.speedLevel *= 2;
        },
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

With Wayfinder in your band, you can replace members of your band at campfires
and see more details on the map.
    `,
    super: {
      name: 'Wayfindest',
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
        },
        peaceful: true,
      }],
    }
  },
  {
    name: 'Bayla',
    cost: 0,
    description: `
Bayla is an unpredictable fighter. She can change her position in the middle of a fight to best target the weak spots
of her enemies. She's great friends with the Desert Rabbit.
    `,
    abilities: [{
      name: "Battle Rhythm",
      duration: 1,
      damage: 100,
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
To become Kins of Pump, people must shed all their fears and worries. They still love others,
but never worry or care about their wellbeing. They are free to pursue their desires without guilt or shame.

The Kin you found in the dungeon came here to search for treasure. They do not help out with fighting
or taking care of the band. They are great at finding gold, though. All gold finds are doubled.
    `,
    passiveEffects: ["Kin of Pump doubles the gold found after battles."],
    super: {
      name: 'King of Pump',
      description: `
To become Kins of Pump, people must shed all their fears and worries. They still love others,
but never worry or care about their wellbeing. They are free to pursue their desires without guilt or shame.

The Kin you found in the dungeon came here to search for treasure. They have now found a crown, and
started to act like a king. They still do not help, but all gold finds are now squared.
    `,
      passiveEffects: ["King of Pump squares the gold found after battles."],
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
The Eighth Swimmer was one of these unlucky people. Imagine walking among thirsty people
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
Pecquer is veteran mercenary from the thirty kingdoms. The warriors he fought besides sing songs of his bravery.
    `,
    abilities: [{
      name: "Sneak Past",
      duration: 6,
      hidden: (store) => store.run.skips >= 1,
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
    }],
    super: {
      name: 'Le Pecquer',
      abilities: [{
        name: "Sneak Past",
        duration: 6,
        hidden: (store) => store.run.skips >= 2,
        description: (store) => `
Pecquer leads the band fearlessly past the enemy.

Uses left: ${numberSpan(2 - store.run.skips)}`,
        onCompleted(store) {
          store.run.skips += 1;
          const next = store.currentRoom().next;
          const options = next ? Object.keys(next) : ['Keep going'];
          const choice = options[Math.floor(Math.random() * options.length)];
          store.takeTurn(choice);
        },
      }],
    },
  },
  {
    name: 'Hedge Lost',
    cost: 0,
    description: "",
    abilities: [{
      name: "Buy Fruit",
      duration: 5,
      consumes: { gold: 100 },
      description: 'Buy a piece of fruit at the Hedge Market.',
      onCompleted(store) {
        store.run.fruit += store.fruitMultiplier();
      },
      peaceful: true,
    }],
    super: {
      name: 'Hedge Found',
      abilities: [{
        name: "Buy Fruit",
        duration: 5,
        consumes: { gold: 100 },
        description: 'Buy a piece of fruit at the Hedge Market.',
        onCompleted(store) {
          store.run.fruit += store.fruitMultiplier();
        },
        peaceful: true,
      }, {
        name: "Buy Sapling",
        duration: 5,
        consumes: { gold: 100 },
        description: (store) => `
Buy a fruit sapling at the Hedge Market.${store.run.saplings ? `
(Currently ${numberSpan(store.run.saplings)} saplings producing
${numberSpan(store.run.saplings * store.fruitMultiplier(),
          ' <img src="images/generated/fruit.webp" class="resource-icon" />')} per second.)` : ''}`,
        onCompleted(store) {
          store.run.saplings += 1;
        },
        peaceful: true,
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
      onCompleted(store) {
        store.run.weaponLevelAdded += 1;
      },
      peaceful: true,
    }],
    super: {
      name: 'Zaktar Kadoque Karr',
      description: "Zaktar finds great joy in exposure to Azrekta's magic. His appetite for new experiences knows no bounds.",
      abilities: [{
        name: "Eat Fruit",
        duration: 1,
        consumes: (store) => ({ fruit: store.weaponLevel() }),
        description: 'Do you have too much fruit? Zaktar Kadoque Karr can eat the leftovers.\n\nOnly works with fruit acquired on this run.',
        onCompleted(store) {
          store.run.weaponLevelAdded += store.weaponLevel();
        },
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
      consumes: { gold: 10 },
      duration: .5,
      description: (store) =>
        `Construct a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
      onCompleted(store) {
        store.run.room.xaranthian.growers += 1;
      }
    }, {
      name: "Grow Gun",
      consumes: { gold: 10 },
      hidden: (store) => store.run.room.xaranthian.growers !== 1,
      duration: .5,
      description: (store) =>
        `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store) {
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
      },
    }, {
      name: "Grow Guns",
      consumes: { gold: 10 },
      hidden: (store) => store.run.room.xaranthian.growers < 2,
      duration: .5,
      description: (store) =>
        `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
      onCompleted(store) {
        console.log('grow guns', store.run.room.xaranthian.growers, store.run.room.xaranthian.guns);
        store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
      }
    }, {
      name: "Fire Xaranthian Gun",
      hidden: (store) => store.run.room.xaranthian.guns !== 1,
      duration: 5,
      description: "Fire the mechanical gun.",
      damage: 1,
    }, {
      name: "Fire Xaranthian Guns",
      hidden: (store) => store.run.room.xaranthian.guns < 2,
      duration: 5,
      description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
      damage: (store) => store.run.room.xaranthian.guns,
    }],
    super: {
      name: 'Xaranthian Power Constructor',
      abilities: [{
        name: "Construct Factory",
        consumes: { gold: 10 },
        duration: 5,
        description: (store) =>
          `Build a factory for producing mechanical turtles.${store.run.room.xaranthian.factories ? ` (Currently ${numberSpan(store.run.room.xaranthian.factories)} factories.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.factories += 1;
        },
      }, {
        name: "Produce Turtle",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.factories !== 1,
        duration: 5,
        description: (store) =>
          `Build a mechanical turtle in the factory.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories;
        },
      }, {
        name: "Produce Turtles",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.factories < 2,
        duration: 5,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.factories)} mechanical turtles in the factories.${store.run.room.xaranthian.turtles ? ` (Currently ${numberSpan(store.run.room.xaranthian.turtles)} turtles.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.turtles += store.run.room.xaranthian.factories;
        },
      }, {
        name: "Build Deployer",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.turtles !== 1,
        duration: 5,
        description: (store) =>
          `Build a deployer from the mechanical turtle.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles;
        }
      }, {
        name: "Build Deployers",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.turtles < 2,
        duration: 5,
        description: (store) =>
          `Build ${numberSpan(store.run.room.xaranthian.turtles)} deployers from the mechanical turtles.${store.run.room.xaranthian.deployers ? ` (Currently ${numberSpan(store.run.room.xaranthian.deployers)} deployers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.deployers += store.run.room.xaranthian.turtles;
        }
      }, {
        name: "Deploy Grower",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.deployers !== 1,
        duration: 5,
        description: (store) =>
          `Deploy a mechanical grower.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers;
        }
      }, {
        name: "Deploy Growers",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.deployers < 2,
        duration: 5,
        description: (store) =>
          `Deploy ${numberSpan(store.run.room.xaranthian.deployers)} mechanical growers.${store.run.room.xaranthian.growers ? ` (Currently ${numberSpan(store.run.room.xaranthian.growers)} growers.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.growers += store.run.room.xaranthian.deployers;
        }
      }, {
        name: "Grow Gun",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.growers !== 1,
        duration: 5,
        description: (store) =>
          `Grow a mechanical gun.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
        },
      }, {
        name: "Grow Guns",
        consumes: { gold: 10 },
        hidden: (store) => store.run.room.xaranthian.growers < 2,
        duration: 5,
        description: (store) =>
          `Grow ${numberSpan(store.run.room.xaranthian.growers)} mechanical guns.${store.run.room.xaranthian.guns ? ` (Currently ${numberSpan(store.run.room.xaranthian.guns)} guns.)` : ''}`,
        onCompleted(store) {
          store.run.room.xaranthian.guns += store.run.room.xaranthian.growers;
        }
      }, {
        name: "Fire Xaranthian Gun",
        hidden: (store) => store.run.room.xaranthian.guns !== 1,
        duration: 5,
        description: "Fire the mechanical gun.",
        damage: 1,
      }, {
        name: "Fire Xaranthian Guns",
        hidden: (store) => store.run.room.xaranthian.guns < 2,
        duration: 5,
        description: (store) => `Fire ${numberSpan(store.run.room.xaranthian.guns)} mechanical guns.`,
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
  "Bayla": 12,
  "Kit Flash": 13,
  "Kevin": 14,
  "Hedge Lost": 15,
  "Knight of Claws": 16,
  "Royal Fruitbearer": 17,
  "Xaranthian Constructor": 18,
  "Mongreler": 19,
  "Azrekta": 20,
  "Eighth Swimmer": 21,
  "Coldblade": 22,
  "Pur Lion": 23,
  "Smiling Pilot": 24,
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
  const dmg1 = getDamageForSmilingPilot(a1);
  for (const an2 of ATTACKS) {
    if (an1 >= an2) continue;
    const a2 = abilitiesByName[an2];
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
      combined.onCompleted = (store, self) => {
        const e = store.abilityEffects(self);
        if (Math.random() >= e.hitChance) return;
        store.addPoison((self.damage as number) * e.damageMultiplier);
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
  'Combined Battle Rhythm and Glacial Strike': 'Glacier Rhythm',
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
}
