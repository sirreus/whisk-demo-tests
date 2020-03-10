Feature("Main page dev.whisk.com tests");

Before(async (I, mainPage) => {
  const email = "keg.tezt@gmail.com";
  const password = "_Qwe123-asd";

  I.amOnPage("/");
  I.clearCookie();
  I.waitForVisible(mainPage.authPopup.title, 3);
  await mainPage.setEmail(email);
  I.waitForVisible(mainPage.authPopup.passwordTitle, 3);
  await mainPage.setPassword(password);
  await mainPage.navPanelShouldBePresent();
});

/**
 * данный тест к сожалению не удалось реализовать
 * т.к. при попытке дернуть ручку авторизации
 * с корректными данными логин/пароль в ответ мне приходит
 * 401 статус код...
 * я проверил сам запрос через DevTools который отправляется,
 * если "авторизовываться руками" нашел только в хедерсас
 * Authorization, но при подстановки в запрос успеха не добился
 * скорей всего длинный хэш который в этом заголовке еще как-то
 * хитро генериться и он уникальный для каждой сессии.
 */
xScenario("Login by user access token", async (I, API, mainPage) => {
  const token = await API.getAccessToken();
  await mainPage.setAccessCookies(token);
  I.amOnPage("/");
  await mainPage.navPanelShouldBePresent();
  await mainPage.currentUserShouldBePresent("keg.tezt@gmail.com");
});

Scenario("User login and logout must be correct", async mainPage => {
  await mainPage.currentUserShouldBePresent("keg.tezt@gmail.com");
  await mainPage.logout();
});

Scenario("Add item to shoping list", async (I, mainPage) => {
  const product = "Milk";

  I.wait(3); // <-- необходимый костыль для подгрузки кол-во айтемов в списке
  I.waitForVisible('//div[contains(text(), " item")]', 5);
  const startItemsCount = (
    await I.grabTextFrom('//div[contains(text(), " item")]')
  ).split(" ")[0]; // <-- узкое место, т.к. из-за скорости обработки запроса иногда забираю отсюда 0

  await mainPage.findProduct(product);
  const selectedProductName = await mainPage.selectRandomProductFromSudggestList(
    product
  );

  const currentItemsCount = (
    await I.grabTextFrom('//div[contains(text(), " item")]')
  ).split(" ")[0];
  I.assert(Number(currentItemsCount), Number(startItemsCount) + 1); // <-- и тут падает потому что иногда startItemsCount = 0, см.стр.52

  await mainPage.deleteProductFromShopingList(selectedProductName);

  const actualItemsCount = (
    await I.grabTextFrom('//div[contains(text(), " item")]')
  ).split(" ")[0];
  I.assert(Number(actualItemsCount), Number(startItemsCount));
});

Scenario("Create recipes collection", async (I, mainPage) => {
  await mainPage.openRecipesTab();
  await mainPage.recipesTabShouldBePresent();
  I.click(mainPage.recipesTab.collectionsMenuButton);
  const collectionName = await mainPage.addRecipeCollection();
  await mainPage.deleteCollection(collectionName);
});
