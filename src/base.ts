export type Resources = {
  gold: number;
  fruit: number;
  saplings: number;
};

export type Timer = {
  time?: number;
  duration: number;
  cost: Resources;
  automatic?: boolean;
  affectedBySpeedLevel?: boolean;
};

export type Band = {
  width: number;
  height: number;
  [x: number]: string;
};

export type Xaranthian = {
  factories: number;
  turtles: number;
  deployers: number;
  growers: number;
  guns: number;
};

export type RoomData = {
  // Everything specific to the current room. Deleted when leaving the room.
  damage: number;
  armorDamage: number;
  poison: number;
  kills: number;
  xaranthian: Xaranthian;
};
export type RunData = {
  // Everything specific to the current run. Deleted when the run ends.
  weaponLevelAdded: number;
  speedLevel: number;
  desertBlessingMultiplier: number;
  steps: number;
  turns: string[];
  gold: number;
  fruit: number; // Fruit collected in this run. Added to team.fruit on retreat.
  saplings: number;
  skips: number;
  capturedMonsters: string[];
  room: RoomData;
  timers: Record<string, Timer>;
  lastHeld?: string;
  skipTime: number; // Time to skip in the next frame, for time-skip abilities.
};

export type Settings = {
  blurImages: boolean;
  online: boolean;
  sound: boolean;
  teamId?: string;
}

export type LocalData = {
  band: Band;
  destination?: string, // Coordinate key for destination room.
  settings: Settings;
}

export type TeamData = {
  fruit: number;
  packs: number;
  bestWeaponLevel?: number; // The old way — for compatibility.
  permanentWeaponLevel?: number; // The new way.
  unlocked: string[]; // Friend names.
  discovered: string[]; // Room keys.
  name: string;
  startTime: number;
  floorCompletions: number[];
}
export function startingTeamData(): TeamData {
  return {
    fruit: 1,
    packs: 1,
    bestWeaponLevel: 1,
    permanentWeaponLevel: 0,
    unlocked: ['Stick Master'],
    discovered: [],
    name: 'Unnamed Guild',
    startTime: 0,
    floorCompletions: [],
  };
}


export type AbilityEffects = {
  damageMultiplier: number; // Total multiplier.
  baseMultiplier: number; // For information: multipliers independent of the enemy.
  enemyMultiplier: number; // For information: multipliers due to the enemy.
  hitChance: number;
  rndHits(numAttacks: number): number; // Returns the random number of hits based on the hit chance.
};

export type DamageOptions = {
  ignoreArmor?: boolean;
};

export type Store = {
  run: RunData;
  local: LocalData;
  team: TeamData;
  startTimer: (key: string, timer: Timer) => void;
  timerFinished: (key: string, timer: Timer, times: number) => void;
  currentEnemy: () => Enemy | undefined;
  currentRoom: () => Room;
  currentPath: () => Room[];
  addDamage: (amount: number, times: number, opts?: DamageOptions) => void;
  addPoison: (amount: number, times: number) => void;
  bandByName: () => Record<string, { row: number; col: number }>;
  onboard: (name: string) => { name: string, row: number; col: number } | undefined;
  emptySpacesAround: (row: number, col: number) => { row: number; col: number }[];
  available: (row: number, col: number) => boolean;
  lightRadius: () => string;
  getRewards: (enemy: Enemy) => Resources;
  takeTurn: (turn: string) => void;
  fruitMultiplier: () => number;
  abilityEffects: (ab: Ability) => AbilityEffects;
  weaponLevel: () => number;
};

export type Turn = {
  title?: string; // Not included in Room.next, but added otherwise.
  label?: string; // The label of the next room.
  description?: string; // Description of the turn.
  leadsTo?: string; // The room key of the next enemy.
};

export type Room = {
  x: number;
  y: number;
  type: string;
  name?: string;
  next?: Record<string, Turn>; // The path diverges.
  label?: string; // Referenced from "next", like a goto label.
  end?: boolean; // If true, this is the end of the path.
  leadsTo?: string; // The room key of the next enemy, if `next` is not defined.
  index?: number; // Index in allRooms.
};

export type Ability = {
  name: string;
  image?: string;
  hidden?: ((store: Store) => boolean);
  hideInDescription?: boolean; // Hide it by default in descriptive contexts, like on the Band page.
  description: string | ((store: Store, self: Ability) => string);
  duration: number | ((store: Store) => number);
  damage?: number | ((store: Store) => number);
  consumes?: { [x: string]: number } | ((store: Store) => { [x: string]: number });
  onCompleted?: (store: Store, times: number, self: Ability) => void;
  preventRepeat?: boolean; // If true, fire at most once per tick. Use it if "consumes" is not fixed!
  preventAutomation?: boolean;
  automatic?: boolean;
  tags?: string[];
  peaceful?: boolean; // If true, can be used outside of combat.
  affectedBySpeedLevel?: boolean; // Defaults to true for non-peaceful abilities.
  source?: { name: string; row: number; col: number }; // The friend this comes from.
};

export type Friend = {
  name: string;
  cost: number;
  description?: string;
  abilities?: Ability[];
  super?: Partial<Friend>;
  descriptionHtml?: string | Promise<string>;
  passiveEffects?: string[] | ((store: Store) => string[]);
}

export type Enemy = {
  name: string;
  health: number;
  armor?: number;
  immune?: string[];
  regen?: number;
  count?: number;
  dodge?: number; // Attacks slower than this will miss. Chance to hit ramps to 100% as duration approaches 0.
  ethereal?: boolean;
  rewards?: Partial<Resources>;
  abilities?: Ability[];
  passiveEffects?: string[];
  weaknesses?: string[];
  slowTime?: number;
  eulogy?: (store: Store) => string;
};

const _numberFormatFrac = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const _numberFormatInt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function numberFormat(x: number): string {
  if (x < 0) return `−${numberFormat(-x)}`;
  if (x > 9_999_999_999) {
    return `${numberFormat(x / 1_000_000_000)} B`;
  }
  if (x < 10) {
    return _numberFormatFrac.format(x);
  }
  return _numberFormatInt.format(x);
}
export function costOfPacks(packs: number): number {
  return Math.floor(0.00000001 * packs ** 7 + packs);
}

export function durationFormat(durationMs: number): string {
  if (!durationMs) return "0 seconds";
  let duration = durationMs;
  const units = ['year', 'day', 'hour', 'minute', 'second', 'ms', 'µs', 'ns'];
  const divisors = [365, 24, 60, 60, 1000, 1000, 1000];
  let level = units.indexOf('ms');
  while (level > 0 && duration >= divisors[level - 1]) {
    duration /= divisors[level - 1];
    level--;
  }
  while (level < units.length - 1 && duration < 1) {
    duration *= divisors[level];
    level++;
  }
  const d = Math.floor(duration);
  const plural = d === 1 || units[level].endsWith('s') ? '' : 's';
  const lvl1 = `${numberFormat(d)} ${units[level]}${plural}`;
  if (d < 10 && level < divisors.length) {
    const remainder = Math.round((duration - d) * divisors[level]);
    if (remainder > 0) {
      const plural = remainder === 1 || units[level + 1].endsWith('s') ? '' : 's';
      const lvl2 = `${numberFormat(remainder)} ${units[level + 1]}${plural}`;
      return `${lvl1} ${lvl2}`;
    }
  }
  return lvl1;
}
