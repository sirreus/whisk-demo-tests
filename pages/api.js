const fetch = require("node-fetch");

const { I } = inject();

module.exports = {
  async getAccessTokenForLogin() {
    const bodyData = {
      clientId:
        "WCqJWnpNatcf3LUCxZmq94pR30sj2OOdBbMoGO8NGrMgUMk6Ogl4EMvLqcykNuGf",
      language: "en-US",
      locate: true
    };

    const resp = await fetch(
      "https://dev.whisk.com/api/graph/auth/anonymous/create",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(bodyData)
      }
    );

    I.assert(resp.status, 200);
    let data = await resp.json();
    I.assertOk(data.token.access_token);
    let access_token = data.token.access_token;
    return access_token;
  },

  async login(token) {
    const resp = await fetch("https://login-dev.whisk.com/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        email: "keg.tezt@gmail.com",
        password: "_Qwe123-asd"
      })
    });

    I.assert(resp.status, 200);
    let data = await resp.json();
    I.assertOk(data.token.access_token);
    let access_token = data.token.access_token;
    return access_token;
  },

  async getUserShoppingList(token) {
    const resp = await fetch("https://dev.whisk.com/api/graph/v1beta/lists", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    I.assert(resp.status, 200);
    let data = await resp.json();
    I.assertOk(data[0]);
    let list = data[0];
    return list;
  },

  async addItemToShoppingList(listId, token) {
    const newItem = "Bread";
    const bodyData = {
      items: [
        {
          name: newItem,
          isNew: true,
          addToRecent: true,
          localId: "operation_aa40edec-ad0e-434c-a78d-0fd6b9e73a6a"
        }
      ]
    };

    const resp = await fetch(
      `https://dev.whisk.com/api/graph/v1beta/${listId}/items`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      }
    );
    I.assert(resp.status, 200);
    let data = await resp.json();
    I.assertOk(data.items[0]);
    let item = data.items[0];
    I.assertOk(item.id);
    I.assert(item.name, newItem);
    return item;
  },

  async deleteItemFromShoppingList(listId, newItem, token) {
    const bodyData = {
      items: [
        {
          id: newItem.id,
          deleted: true
        }
      ]
    };

    const resp = await fetch(
      `https://dev.whisk.com/api/graph/v1beta/${listId}/items`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      }
    );
    I.assert(resp.status, 200);
    let data = await resp.json();
    let item = data.items[0];
    I.assert(item.id, newItem.id);
    I.assert(item.deleted, true);
  }
};
