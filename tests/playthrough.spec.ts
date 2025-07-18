import { expect, test } from '@playwright/test';
import Game from './game';

test('playthrough', async ({ page }) => {
  const game = new Game(page);
  await game.setup();

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.rescue('Lamplighter');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Stick Master');
    await game.addToBand('Lamplighter');
    await game.addToBand('Stick Master');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Bandlings');
    await game.clickButton('Keep going');
    await game.rescue('The Silent Song');
  });
  await game.manageBand(async () => {
    await game.addToBand('The Silent Song');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Thick Door');
    await game.clickButton('Keep going');
    await game.rescue('Friend of Metal');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Friend of Metal');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Animated Skeleton');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Lamplighter');
    await game.addToBand('Friend of Metal');
    await game.addToBand('The Silent Song');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.rescue('Dark Chef');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.rescue('Anvilomancer');
  });
  await game.manageBand(async () => {
    await game.addToBand('Dark Chef');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Trollish Maiden');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dryfin Carp');
    await game.clickButton('Keep going');
    await game.rescue('Kin of Pump');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Dark Chef');
    await game.addToBand('Anvilomancer');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.rescue('Royal Fruitbearer');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Go straight');
    await game.defeatEnemy('The Shroud');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dark Lord');
    await game.clickButton('Keep going');
    await game.rescue('Lord of Gears');
    await game.clickButton('Keep going');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Anvilomancer');
    await game.removeFromBand('The Silent Song');
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Stick Master');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('The Silent Song');
  });

  const shortWithGears = async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Poison Crow');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Animated Skeleton');
  }
  await game.run(8, shortWithGears);

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Silent Song');
    await game.addToBand('Dark Chef');
    await game.addToBand('Friend of Metal');
  });
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Trollish Maiden');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Dryfin Carp');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Scaffold Sorcery');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lost Swimmer');
    await game.clickButton('Keep going');
    await game.rescue('Coldblade');
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Xaranthian Construct');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.rescue('Pecquer');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Friend of Metal');
    await game.addToBand('Pecquer');
  });
  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.clickButton('Sneak Past');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.defeatEnemy('Fortified Door');
    await game.clickButton('Keep going');
    await game.rescue('Knight of Claws');
  });
  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Knight of Claws', 1);
    await game.addToBand('Dark Chef', 1);
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.rescue('Wayfinder');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.rescue('Desert Rabbit');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('The Silent Song');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Stick Master');
  });

  await game.run(5, async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Frozen Centurion');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('The Silent Song');
    await game.addToBand('Royal Fruitbearer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Kin of Pump');
  });


  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.rescue('Bayla');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Artifact Seeker")
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Dark Chef');
    await game.addToBand('Pecquer');
    await game.addToBand('Knight of Claws', 2);
  });

  async function goLeft() {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Will-o-Wasp');
    await game.clickButton('Turn left');
    await game.defeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Xaranthian Construct');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
  }
  await game.run(async () => {
    await goLeft();
    await game.clickButton('Open door');
    await game.defeatEnemy('Fortified Door');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.clickButton('Sneak Past');
    await game.rescue('Kit Flash');
  });

  await game.run(async () => {
    await goLeft();
    await game.clickButton('Go straight');
    await game.clickButton('Open door');
    await game.clickButton('Sneak Past');
    await game.rescue('Mongreler');
  });

  await game.run(async () => {
    await goLeft();
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Sneak Past');
    await game.rescue('Azrekta');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Kit Flash');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Knight of Claws', 2);
  });

  await game.run(async () => {
    await game.defeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.defeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.defeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.defeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Artifact Seeker")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Golden Chest")
    await game.clickButton('Keep going');
    await game.defeatEnemy("King of Tadpoles")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Hopanoids");
    await game.clickButton('Keep going');
    await game.defeatEnemy("Tosyl Rose")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Sullen Bearer")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Unwelcoming Glade")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Food Mimic")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Frog Assassin")
    await game.clickButton('Keep going');
    await game.defeatEnemy("Enantiomers");
    await game.clickButton('Keep going');
    await game.rescue('Smiling Pilot');
    await game.clickButton('Keep going');
    await game.defeatEnemy("Gnollish Ambassador");
    await game.clickButton('Keep going');
    await game.rescue('Hedge Lost');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Bayla', 1);
    await game.addToBand('Royal Fruitbearer', 1);
    await game.addToBand('The Silent Song', 1);
  });

  async function fruitRun() {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.holdToDefeatEnemy('Frozen Centurion', 'Illuminate');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Striped Horror")
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Dragonfly Agaric");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Artifact Seeker")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Golden Chest")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("King of Tadpoles")
  }
  await game.run(fruitRun);

  await game.manageBand(async () => {
    await game.addToBand('Stick Master');
  });

  await game.run(2, fruitRun);
  await game.manageBand(async () => {
    await game.addToBand('Kin of Pump');
  });
  await game.run(2, fruitRun);


  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Friend of Metal');
    await game.addToBand('Pecquer', 1);
    await game.addToBand('Azrekta');
    await game.addToBand('Lord of Gears', 1);
    await game.addToBand('Anvilomancer', 1);
  });

  await game.run(async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Lobster Daddy');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Will-o-Wasp', 'Illuminate');
    await game.clickButton('Turn left');
    await game.waitToDefeatEnemy('Glass Dragon');
    await game.clickButton('Keep going');
    await game.clickButton('Sneak Past');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Sneak Past');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Skeletron');
    await game.clickButton('Keep going');
    await game.clickButton('Turn left');
    await game.waitToDefeatEnemy("Chago's Chamber");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Chago');
    await game.clickButton('Keep going');
    await game.rescue('Kevin');
  });

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Stick Master');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Anvilomancer');
    await game.addToBand('The Silent Song');
    await game.addToBand('Azrekta');
    await game.addToBand('Royal Fruitbearer', 8);
  });
  async function fruitRunShort() {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Geckalog');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Jaw Maw Maw');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Decay Manifest");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Striped Horror")
  }
  await game.run(2, fruitRunShort);

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Kin of Pump');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Bayla');
    await game.addToBand('Kit Flash');
    await game.addToBand('Desert Rabbit');
  });

  await game.run(async () => {
    await game.holdToDefeatEnemy('Wild Slime', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.holdToDefeatEnemy('Dead Gladiator', 'Battle Rhythm');
    await game.clickButton('Turn left');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Lobster Daddy', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Will-o-Wasp', 'Battle Rhythm');
    await game.clickButton('Turn left');
    await game.holdToDefeatEnemy('Glass Dragon', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Xaranthian Construct', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.clickButton('Go straight');
    await game.holdToDefeatEnemy('Lior the Weaver', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Skeletron', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.holdToDefeatEnemy('Door of Loathing', 'Illuminate', 10_000);
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Zakatrixos', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.holdToDefeatEnemy('Wands from the Depths', 'Battle Rhythm');
    await game.clickButton('Turn left');
    await game.holdToDefeatEnemy('Skyrmions', 'Battle Rhythm', 20_000);
    await game.clickButton('Turn right');
    await game.holdToDefeatEnemy('Defensive Installation', 'Battle Rhythm');
    await game.clickButton('Keep going');
    await game.rescue('Xaranthian Constructor');
  });

  console.log(`Total clicks: ${game.totalClicks}`);
  await game.saveState('last state.json');
});
test('next steps', async ({ page }) => {
  const game = new Game(page);
  await game.setup();
  await game.loadState('last state.json');

  await game.manageBand(async () => {
    await game.removeFromBand('Lamplighter');
    await game.addToBand('Lamplighter');
    await game.addToBand('Anvilomancer');
    await game.addToBand('Lord of Gears');
    await game.addToBand('Kit Flash');
    await game.addToBand('Kin of Pump');
    await game.addToBand('Xaranthian Constructor');
    // TODO: Find out why Growers don't work when Stick Master is not in the band.
    // await game.addToBand('Stick Master');
  });

  await game.run(async () => {
    await game.waitToDefeatEnemy('Wild Slime');
    await game.clickButton('Keep going');
    await game.clickButton('Go straight');
    await game.waitToDefeatEnemy('Dead Gladiator');
    await game.clickButton('Turn right');
    await game.waitToDefeatEnemy('Frozen Centurion');
    await game.clickButton('Keep going');
    await game.clickButton('Turn right');
    await game.xaranthianDefeatEnemy('Geckalog', 5);
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy('Jaw Maw Maw', 10_000);
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Decay Manifest", 10_000);
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Striped Horror", 10_000);
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Dragonfly Agaric", 20_000);
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Artifact Seeker")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Golden Chest")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("King of Tadpoles");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Hopanoids");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Tosyl Rose")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Sullen Bearer")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Unwelcoming Glade")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Food Mimic")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Frog Assassin")
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Enantiomers");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Gnollish Ambassador");
    await game.clickButton('Keep going');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Web of Power");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Tombstone of the Forgotten");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Hippogryph");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("The King's Armor");
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Corridor of Illusions");
    await game.clickButton('Keep going');
    await game.rescue('Zaktar Kadoque');
    await game.clickButton('Keep going');
    await game.waitToDefeatEnemy("Hiber Conduit");
    await game.clickButton('Keep going');
    await game.xaranthianDefeatEnemy("Core Diver", 60);
    await game.clickButton('Keep going');
    await game.xaranthianDefeatEnemy("Smother Mother", 70);
    await game.clickButton('Keep going');
    await game.xaranthianDefeatEnemy("The Final Warden", 100);
    await game.clickButton('Keep going');
    await game.xaranthianDefeatEnemy("Skelemasterion", 1000);
  });
});
