import { Client, Databases, ID } from "appwrite";
import { startingTeamData, type TeamData, type Store } from "./base";

const PROJECT_ID = '6840583c0004412239f1';
const DATABASE_ID = '6861bd350007aa692f7c';
const COLLECTION_ID = '6861bd6900131d72be3d';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);
const databases = new Databases(client);
let unsubscribe: () => void = () => { };
let subscribedTeamId: string | null = null;

export async function subscribe(teamId: string, store: Store) {
  if (teamId === subscribedTeamId) return;
  unsubscribe();
  subscribedTeamId = teamId;
  const doc = await getTeam(teamId);
  receiveFromDatabase(doc as TeamData, store);
  updateTeam(teamId, store.team);
  unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.${teamId}`, response => {
    receiveFromDatabase(response.payload as TeamData, store);
  });
}
function receiveFromDatabase(payload: TeamData, store: Store) {
  if (payload.fruit > store.team.fruit) {
    store.team.fruit = payload.fruit;
  }
  if (payload.packs > store.team.packs) {
    store.team.packs = payload.packs;
  }
  if ((payload.permanentWeaponLevel ?? 0) > (store.team.permanentWeaponLevel ?? 0)) {
    store.team.permanentWeaponLevel = payload.permanentWeaponLevel;
  }
  if ((payload.bestWeaponLevel ?? 1) > (store.team.bestWeaponLevel ?? 1)) {
    store.team.bestWeaponLevel = payload.bestWeaponLevel;
  }
  for (const x of payload.unlocked) {
    if (!store.team.unlocked.includes(x)) {
      store.team.unlocked.push(x);
    }
  }
  for (const x of payload.discovered) {
    if (!store.team.discovered.includes(x)) {
      store.team.discovered.push(x);
    }
  }
  if (payload.name !== store.team.name) {
    store.team.name = payload.name;
  }
  if ((payload.startTime ?? 0) > 0 && payload.startTime < store.team.startTime) {
    store.team.startTime = payload.startTime;
  }
  for (let i = 0; i < payload.floorCompletions.length; i++) {
    if (payload.floorCompletions[i] < store.team.floorCompletions[i]) {
      store.team.floorCompletions[i] = payload.floorCompletions[i];
    }
  }
}
export async function getTeam(teamId: string): Promise<TeamData> {
  const doc = await databases.getDocument(
    DATABASE_ID,
    COLLECTION_ID,
    teamId,
    []
  );
  return doc as unknown as TeamData;
}
export async function newTeam(): Promise<string> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    startingTeamData(),
  );
  return doc.$id;
}

export async function updateTeam(teamId: string, data: TeamData): Promise<void> {
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTION_ID,
    teamId,
    data,
  );
}
