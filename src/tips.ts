import { type Store, costOfPacks } from './base';

export type Tip = {
  friend: string;
  enabled?: (store: Store) => boolean;
  text: string;
};

function resting(store: Store, names: string | string[]): boolean {
  const nameList = Array.isArray(names) ? names : [names];
  return nameList.every(name => store.team.unlocked.includes(name)) && !nameList.every(name => store.onboard(name));
}

const tipsByFriend: { [friend: string]: Partial<Tip>[] } = {
  "Stick Master": [
    { text: "Try swapping me for Lamplighter. You can do so on the Band page.", enabled: (store) => resting(store, 'Lamplighter') },
    { text: "I have observed that <i>armor</i> is subtracted from incoming damage.", enabled: (store) => store.team.discovered.includes('Dead Gladiator') },
    { text: "My staff is <i>blunt</i>. And I think sometimes that's for the best." },
  ],
  "Lamplighter": [
    { text: "Good thing I brought a lamp. This must be one of the darkest dungeons I've seen." },
    { text: "On mobile you can <i>hold</i> multiple buttons to keep repeating attacks." },
    {
      text: "Did you know you can <i>move</i> band members without removing and re-adding them? One click to select, another click to move. Like my grandma always said.",
      enabled: (store) => !store.team.unlocked.includes("Bayla")
    },
    {
      text: "Did you know you can <i>move</i> band members without removing and re-adding them? Bayla can do it even inside the dungeon.",
      enabled: (store) => store.team.unlocked.includes("Bayla")
    },
    {
      text: "This game can be played with friends online. You go on adventures individually and share the persistent progress. Check the <i>Settings</i> page. Or you can use this to share progress between multiple devices.",
      enabled: (store) => !store.local.settings.online
    },
    { text: "This game is not meant to be slow. If it feels slow, try a different band composition or go in a different direction." },
    { text: "We can't take advantage of enemy weaknesses when Desert Rabbit is not with us. I can't even see the elemental types of our attacks without him.", enabled: (store) => resting(store, "Desert Rabbit") },
    { text: "Azrekta is truly magical. Time to experiment!", enabled: (store) => resting(store, "Azrekta") },
    { text: "At least we have enough fruit to buy more packs now.", enabled: (store) => store.team.fruit + store.run.fruit >= costOfPacks(store.team.packs + 1) },
    {
      text: "I'm hungry. A band with the <i>Royal Fruitbearer</i> could collect some fruit.",
      enabled: (store) => resting(store, ["Royal Fruitbearer"]) && store.team.packs < 40
    },
    {
      text: "I'm hungry. A band with the <i>Royal Fruitbearer</i> and the <i>Lord of Gears</i> led by the <i>Wayfinder</i> could collect some fruit without our help.",
      enabled: (store) => resting(store, ["Royal Fruitbearer", "Lord of Gears", "Wayfinder"]) && store.team.packs < 60
    },
  ],
  "The Silent Song": [
    { text: "<i>Your friend plays a wonderful folk song, very quietly.</i>" },
  ],
  "The Silent Quartet": [
    { text: "<i>Your friends play a very quick song, very quietly.</i>" },
  ],
  "Coldblade": [
    { text: "This band is always in a hurry." },
  ],
  "Anvilomancer": [
    {
      text: `
<p>The old master sent his apprentice outside to chop firewood.
The apprentice looked up at the great mound of firewood and despaired.
<i>“Master,”</i> he called, <i>“I will never finish chopping all this firewood!”</i>
The master replied, <b>“Good. It would not fit in our stove anyway.”</b>
<p>Sometimes I feel like gold is my firewood.
` },
    {
      text: "Without Azrekta’s magic, I can only preserve a fraction of my improvements when we leave the dungeon.",
      enabled: (store) => store.team.unlocked.includes("Azrekta") && !store.onboard("Anvilominator")
    },
    {
      text: "My forge is not fast. We don't have to wait for it though. Exploring the dungeon is more exciting!",
    },
  ],
  "Knight of Claws": [
    {
      text: "I could fight more effectively if I had more space to move.",
      enabled(store) {
        const pos = store.onboard('Knight of Claws');
        const empty = pos ? store.emptySpacesAround(pos.row, pos.col).length : 0;
        return empty < 4;
      }
    },
  ],
  "Royal Fruitbearer": [
    { text: "I ♥️ fruit" },
  ],
  "Lord of Gears": [
    { text: "I will take care of fighting. Someone else can handle navigation.", enabled: (store) => resting(store, "Wayfinder") },
  ],
  "Wayfinder": [
    { text: "Click a location on the map to set a course.", enabled: (store) => !store.local.destination },
    { text: "I will take care of navigation. Let's find someone else to handle fighting.", enabled: (store) => resting(store, "Lord of Gears") },
  ],
  "Campfinder": [
    { text: "I love camping. I love campfires. I love lighting things on fire. How about flaming swords?", enabled: (store) => !resting(store, "Kevin") },
    { text: "I love camping. I love Kevin.", enabled: (store) => resting(store, "Kevin") },
  ],
  "Kevin": [
    { text: "I love fire. Big flaming vortices or friendly campfires. I love them all.", enabled: (store) => resting(store, ["Wayfinder", "Azrekta"]) },
  ],
  "Kevout": [
    { text: "Take a rest Campfinder. Chill out.", enabled: (store) => !!store.onboard("Campfinder") },
  ],
  "Azrekta": [
    { text: "You're telling me the enemies are not <i>ethereal</i> when I'm not around? That must be so cool!" },
  ],
  "Mongreler": [
    { text: "You have to be gentle with monsters. Everyone underestimates their power. It takes tender care and patience to tame them." },
    { text: "I want to catch the <i>biggest monster</i>!", enabled: (store) => store.team.discovered.includes("Skelemasterion") },
  ],
  "Bayla": [
    { text: "If Desert Rabbit sees an opening on the left, move me to the left so I can strike!", enabled: (store) => !!store.onboard("Desert Rabbit") },
  ],
  "Smiling Pilot": [
    {
      text: "I bet I would make a great wizard. <i>~eats a fly~</i>",
      enabled: (store) => !store.onboard("Smiling Wizard") && store.team.unlocked.includes("Azrekta")
    },
    {
      text: "I mimic abilities left and right. How about combining a <i>strong attack</i> and a <i>fast attack</i>?",
      enabled: (store) => !store.onboard("Coldblade")
    },
  ],
  "Seventh Swimmer": [
    { text: "Could you please drink something else?" },
  ],
  "Zaktar Kadoque": [
    { text: "I know a creature that was once a moose." },
  ],
  "Xaranthian Constructor": [
    { text: "Give me enough gold and a fulcrum on which to place it, and I shall blow up the world." },
  ],
};

export const allTips: Tip[] = Object.entries(tipsByFriend).flatMap(([friend, tips]) =>
  tips.map(tip => {
    let text = tip.text ?? '';
    text = text.replace('fruit', '<img src="images/generated/fruit.webp" class="resource-icon resource-icon-solo" />');
    text = text.replace('packs', '<img src="images/generated/pack.webp" class="resource-icon resource-icon-solo" />');
    text = text.replace('gold', '<img src="images/generated/gold.webp" class="resource-icon resource-icon-solo" />');
    text = text.replace("'", "’");
    return { ...tip, friend, text };
  })
);
