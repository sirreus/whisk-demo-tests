Feature("API integration test for dev.whisk.com");

Scenario(
  "Log in as an existing user, get his Shopping list, add an item to this list and then delete it",
  async API => {
    const token = await API.getAccessTokenForLogin();
    const accessToken = await API.login(token);
    const shoppingList = await API.getUserShoppingList(accessToken);
    const newItem = await API.addItemToShoppingList(
      shoppingList.id,
      accessToken
    );
    await API.deleteItemFromShoppingList(shoppingList.id, newItem, accessToken);
  }
);
