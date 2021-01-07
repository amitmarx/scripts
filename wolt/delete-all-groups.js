async function deleteAllGroups() {
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,he;q=0.8",
    "app-language": "en",
    authorization:
      "Bearer eyJ0eXAiOiJ4LnVzZXIrand0IiwiYWxnIjoiRVMyNTYiLCJraWQiOiI3ZjFlNzJiMDQ1ZTQxMWViOWI4NjE2YWQ0ZjgxMDg0NCJ9.eyJhdWQiOlsicmVzdGF1cmFudC1hcGkiLCJ3b2x0YXV0aCIsImNvdXJpZXJjbGllbnQiXSwiaXNzIjoid29sdGF1dGgiLCJqdGkiOiI2NzMwZmM5MDUwZDkxMWViYmY5NDNlNjVlYmUwNjNmYyIsInVzZXIiOnsiaWQiOiI1YzNlMzMyNmE3MTRlNzAwMGMwMTI5OGEiLCJuYW1lIjp7ImZpcnN0X25hbWUiOiJBbWl0IiwibGFzdF9uYW1lIjoiTWFyeCJ9LCJlbWFpbCI6ImFtaXRtYXJ4QGdtYWlsLmNvbSIsInJvbGVzIjpbInVzZXIiXSwibGFuZ3VhZ2UiOiJlbiIsInByb2ZpbGVfcGljdHVyZSI6eyJ1cmwiOiJodHRwczovL3MzLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2NyZWRpdG9ybm90bWVkaWEvNjNhNWRlOTE4YzEzNTA2MzdhODNlMGZiOTg3ZGJiMWU2ZjIyNDk3ZDBmOGMyMzNmM2ZhMzNlZTFmZmE4OGY5MDY2MWM0YWVjODk3NjU2OTFkNTA2OThjMzg0MDllZmQ5NjM5NmRiZTM3NThiMWUzYTVhY2Q3N2M3MzkxNTM5MDcifSwicGVybWlzc2lvbnMiOltdLCJwaG9uZV9udW1iZXIiOiIrOTcyNTQzOTc0MDc3IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNvdW50cnkiOiJJU1IifSwicGF5bG9hZCI6ImpvY3MwcG1qTEwxRzVER0xhM2dROFJJYkNRR24wQVVZbENNZEEwbE10aVNBZXFPb2MvZGtGWUsvK090MmpuTEVHMnZlTm94QXdtNXlsQVE4czB3bTBiTlFsQVlHcWhiajg1cmR5T0JOZ3ZuRHZJTVF5Z0ViY0lJNXFGL3BHSThIdUhGYXFBdDZoMmU1QTJOaEpLckNLVmk5bk11cEExZjJsbUEvdFY4NHg5Mk84MlZlcFRPQjhqTzg5ZkwzL0ZtdG9HaTA4RDhnZGNVYTlvV2lpYlA5SmdCUjNFa1I2TVl3RnEwQ3pqVVZVRHlld3BvZEtlVVcvdnUrd2g2cmozMU5RckIrb1dvak5pRW84bnNhSmZCQWk2VWJhTXVtclZ5Q0x2YzUrUDZHN3BPR3Q0V3EiLCJpYXQiOjE2MTAwMTgwMjMsImV4cCI6MTYxMDAxOTgyM30.md6-0pTaPUYi0mnQizVX8aA0dYS1-hZHmj8y6MBHpI9KCb56njOvV-coME7n3slqol5snyRvpnArdESlmMexuA",
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
