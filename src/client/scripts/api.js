// src/common/config/index.ts
var config_default = {
  server: {
    host: "localhost",
    port: 3000,
    dbPath: "./data.json"
  }
};

// src/client/scripts/api.ts
var base = `http://${config_default.server.host}:${config_default.server.port}/api`;
var endpoint = (route) => `${base}/${route}`;
var get = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
var post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  return json;
};
async function getUsers() {
  return await get(endpoint("users"));
}
async function getUser(id) {
  return await get(endpoint(`users/${id}`));
}
async function getUserFriends(id) {
  return await get(endpoint(`users/${id}/friends`));
}
async function getUserMessages(id) {
  return await get(endpoint(`users/${id}/messages`));
}
async function addUserFriend(id, friendId) {
  return await post(endpoint(`users/${id}/addFriend`), { id: friendId });
}
async function removeUserFriend(id, friendId) {
  return await post(endpoint(`users/${id}/removeFriend`), { id: friendId });
}
async function createUser(userData) {
  return await post(endpoint("users/create"), userData);
}
async function updateUser(id, data) {
  return await post(endpoint(`users/${id}/update`), data);
}
async function userSetStatus(id, status) {
  return await post(endpoint(`users/${id}/setStatus`), { status });
}
async function userSetRole(id, role) {
  return await post(endpoint(`users/${id}/setRole`), { role });
}