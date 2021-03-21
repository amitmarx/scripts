async function deleteAllGroups(authorization) {
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,he;q=0.8",
    "app-language": "en",
    authorization,
    platform: "Web",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "w-wolt-session-id": "c20ace1b-d5cd-4182-b99d-bc659b51a52a",
    "x-wolt-web-clientid": "c08d64c562ee0c52340eaf24e0365a1c",
  };

  const groupIds = await fetch(
    "https://restaurant-api.wolt.com/v2/order_details/subscriptions",
    {
      headers,
    }
  )
    .then((x) => x.json())
    .then((x) => x.group_orders.map((x) => x.id));

  return Promise.all(
    groupIds.map((id) => {
      return fetch(`https://restaurant-api.wolt.com/v1/group_order/${id}`, {
        headers,
        method: "DELETE",
      });
    })
  );
}
