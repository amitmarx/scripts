const credentials = require("./credentials.json");
const MongoClient = require("mongodb").MongoClient;
const fetch = require("node-fetch");
const url = `mongodb+srv://${credentials.username}:${credentials.password}@pimp-my-wolt.0hdyw.mongodb.net/?retryWrites=true&w=majority`;

//console.log(url)

async function getGroupMembers(groupId) {
  const getCurrentMembersUrl =
    "https://amitmarx.wixsite.com/pimp-my-wolt/_functions/list_group_members/" +
    encodeURI(groupId);
  const currentGroup = await fetch(getCurrentMembersUrl).then((x) => x.json());
  return currentGroup.items.map((x) => x.woltName);
}

async function fetchUnsettled() {
  const client = await MongoClient.connect(url);
  const collection = await client.db("Pimp-my-Wolt").collection("bi_events");
  const relevantEvents = await collection
    .find({
      $and: [{ "event_payload.allCibusUsersAvailable": { $ne: null } }],
    })
    .sort({ ts: -1 })
    .toArray();
  const noneFullSplitEvents = relevantEvents.filter(
    (e) =>
      e?.event_payload?.settledGuests?.length !=
      e?.event_payload?.guestsOrders?.length
  );

  const nonSettledEvents = noneFullSplitEvents.map((e) => {
    const settled = e?.event_payload?.settledGuests.map((x) => x.name);
    const guests = e?.event_payload?.guestsOrders.map((x) => x.name);
    const notSettled = guests.filter((g) => !settled.includes(g));
    return {
      group: e.group,
      notSettled,
      allCibusUsersAvailable: e.event_payload.allCibusUsersAvailable,
      // settled ,
      // guests,
    };
  });
  const unique = (array) => [...new Set(array)];
  const nonSettledGroups = nonSettledEvents.reduce((groups, event) => {
    if (!groups[event.group]) {
      groups[event.group] = {
        allCibusUsersAvailable: [],
        notSettled: [],
      };
    }
    const group = groups[event.group];
    group.allCibusUsersAvailable = unique([
      ...group.allCibusUsersAvailable,
      ...event.allCibusUsersAvailable,
    ]);
    group.notSettled = unique([...group.notSettled, ...event.notSettled]);
    return groups;
  }, {});

  await Promise.all(Object.keys(nonSettledGroups).map(async groupId=>{
    const members= await getGroupMembers(groupId);
    nonSettledGroups[groupId].notSettled = nonSettledGroups[groupId].notSettled.filter((x) => !members.includes(x));
  }))
  console.log(JSON.stringify(nonSettledGroups));

  client.close();
}

async function makeUpdate() {
  const updateGroup = async ({ groupId, matches }) => {
    const getCurrentMembersUrl =
      "https://amitmarx.wixsite.com/pimp-my-wolt/_functions/list_group_members/" +
      encodeURI(groupId);
    const currentGroup = await fetch(getCurrentMembersUrl).then((x) => x.json());
    const members = currentGroup.items.map((x) => x.woltName);
    const updates = matches.filter((m) => !members.includes(m.woltName));
    console.log(groupId)
    console.log("matches:", matches.map(m=>m.woltName))
    console.log("updates:", updates.map(m=>m.woltName))
    await Promise.all(
      updates.map(({ woltName, cibusName }) => {
        return fetch(
          "https://amitmarx.wixsite.com/pimp-my-wolt/_functions/group_member/" +
            encodeURI(groupId),
          {
            method: "post",
            body: JSON.stringify({ woltName, cibusName }),
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
  };

  const groupUpdates = require("./updates.json");
  return Promise.all(groupUpdates.map(updateGroup))
}

fetchUnsettled();
// makeUpdate();
