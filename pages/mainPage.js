const { I } = inject();

module.exports = {
  title: "Whisk - Shopping List",
  authPopup: {
    container: '//div[contains(@class, "modal-mobile-popup")]',
    title: '//h2[text()="Sign up to save your list and recipes!"]',
    emailInput: '//div[@data-testid="email-phone-number-auth-input"]/div/input',
    passwordTitle: '//h2[text()="Enter your password"]',
    passwordInput: '//input[@name="password"]',
    loginButton:
      '//button[@data-testid="auth-login-button"]//div[text()="Log in"]'
  },
  navPanel: {
    container: '//div[@id="app"]/div[1]',
    homeLink: '//div[@id="app"]/div/a',
    tabPanel: {
      container: '//div[@id="app"]//nav[1]',
      shopingListButton: '//div[@data-testid="shopping-list-nav-link"]',
      recipesButton: {
        container: '//div[@data-testid="recipes-nav-link"]',
        link: '//a[text()="Recipes"]'
      }
    },
    accountPanel: {
      container: '//div[@id="app"]//nav[2]',
      avaterButton: '//button[@data-testid="avatar-button"]',
      emailPreview: '//button[@data-testid="avatar-button"]/div[2]',
      logoutButton: '//button[@data-testid="desktop-logout-button"]'
    }
  },
  recipesTab: {
    recipesMenuButton: '//div[@data-testid="recipes-tab-menu"]',
    collectionsMenuButton: '//div[@data-testid="collections-tab-menu"]',
    addCollectionButton: '//div[@data-testid="add-collection-button"]',
    newCollectionInput: '//div[@data-testid="new-collection-input"]//input',
    createCollectionButton:
      '//button[@data-testid="new-collection-add-button"]//div[text()="Create"]',
    collectionDotMenuButton:
      '//button[@data-testid="collection-page-horizontal-dot-menu"]',
    deleteCollectionButton:
      '//button[@data-testid="collection-page-delete-menu-button"][text()="Delete"]',
    deleteConfirmButton: '//button[@data-testid="confirm-delete-button"]'
  },

  async setEmail(email) {
    I.waitForVisible(this.authPopup.container, 5);
    I.waitForVisible(this.authPopup.emailInput, 3);
    I.fillField(this.authPopup.emailInput, email);
    I.pressKey("Enter");
  },

  async setPassword(password) {
    I.waitForVisible(this.authPopup.passwordInput, 3);
    I.fillField(this.authPopup.passwordInput, password);
    I.click(this.authPopup.loginButton);
  },

  async navPanelShouldBePresent() {
    I.waitForVisible(this.navPanel.container, 5);
    I.seeAttributesOnElements(this.navPanel.homeLink, {
      href: "https://dev.whisk.com/"
    });
    I.seeElement(this.navPanel.tabPanel.container);
    I.seeElement(this.navPanel.accountPanel.container);
  },

  async currentUserShouldBePresent(email) {
    I.waitForVisible(this.navPanel.accountPanel.container, 5);
    I.seeElement(this.navPanel.accountPanel.avaterButton);
    I.waitForText(email, 5, this.navPanel.accountPanel.emailPreview);
  },

  async logout() {
    I.seeElement(this.navPanel.accountPanel.container);
    I.click(this.navPanel.accountPanel.avaterButton);
    I.waitForText("Log out", 5, this.navPanel.accountPanel.logoutButton);
    I.click(this.navPanel.accountPanel.logoutButton);
  },

  async setAccessCookies(token) {
    I.setCookie({ name: "dev.whisk.USER_TOKEN", value: token });
  },

  async openRecipesTab() {
    I.seeElement(this.navPanel.tabPanel.recipesButton.link);
    I.seeAttributesOnElements(this.navPanel.tabPanel.recipesButton.link, {
      href: "https://dev.whisk.com/recipes"
    });
    const recipesLink = await I.grabAttributeFrom(
      this.navPanel.tabPanel.recipesButton.link,
      "href"
    );
    I.amOnPage(recipesLink);
  },

  async recipesTabShouldBePresent() {
    I.waitForVisible(this.recipesTab.recipesMenuButton, 5);
    I.waitForVisible(this.recipesTab.collectionsMenuButton, 5);
  },

  async addRecipeCollection() {
    const newCollectionID = await I.getRandomInt(1, 1000);
    const newCollectionName = `My awesome collection #${newCollectionID}`;
    I.seeTextEquals("Add Collection", this.recipesTab.addCollectionButton);
    I.click(this.recipesTab.addCollectionButton);
    I.waitForText("Create collection", 5, "h2");
    I.seeElement(this.recipesTab.newCollectionInput);
    I.fillField(this.recipesTab.newCollectionInput, newCollectionName);
    I.click(this.recipesTab.createCollectionButton);
    I.waitForElement(
      `//div[@data-testid="collection-name"][text()="${newCollectionName}"]`
    );
    return newCollectionName;
  },

  async deleteCollection(collectionName) {
    I.waitForVisible(
      `//div[@data-testid="collection-name"][text()="${collectionName}"]`,
      5
    );
    I.click(
      `//div[@data-testid="collection-name"][text()="${collectionName}"]`
    );
    I.waitForVisible(`//h2[text()="${collectionName}"]`, 5);
    I.waitForVisible(this.recipesTab.collectionDotMenuButton, 5);
    I.click(this.recipesTab.collectionDotMenuButton);
    I.waitForVisible(this.recipesTab.deleteCollectionButton, 5);
    I.click(this.recipesTab.deleteCollectionButton);
    I.waitForVisible(this.recipesTab.deleteConfirmButton, 5);
    I.click(this.recipesTab.deleteConfirmButton);
    I.waitForVisible(this.recipesTab.collectionsMenuButton, 5);
    I.dontSeeElement(
      `//div[@data-testid="collection-name"][text()="${collectionName}"]`
    );
  },

  async findProduct(product) {
    I.waitForVisible('//h2[text()="Shopping List"]');
    I.waitForVisible(
      '//input[@data-testid="desktop-add-item-autocomplete"]',
      3
    );
    I.fillField(
      '//input[@data-testid="desktop-add-item-autocomplete"]',
      product
    );
    I.waitForVisible('//div[@data-testid="desktop-add-item-autocomplete"]', 5);
  },

  async selectRandomProductFromSudggestList(product) {
    const visibleElementCount = await I.grabNumberOfVisibleElements(
      '//div[@data-testid="desktop-add-item-autocomplete"]/div/div'
    );
    const randomElement = await I.getRandomInt(1, visibleElementCount);
    const productName = await I.grabTextFrom(
      `//div[@data-testid="desktop-add-item-autocomplete"]/div/div[${randomElement}]`
    );
    I.click(
      `//div[@data-testid="desktop-add-item-autocomplete"]/div/div[${randomElement}]`
    );
    I.waitForVisible('//div[@data-testid="shopping-list-item"]', 5);
    I.waitForText(product, '//div[@data-testid="shopping-list-item"]');
    return productName;
  },

  async deleteProductFromShopingList(selectedProductName) {
    I.click(
      `//div[@data-testid="shopping-list-item"]//span[text()="${selectedProductName}"]`
    );
    I.waitForVisible('//div[contains(@class, "modal-mobile-popup")]//form', 5);
    I.seeElement('//button[@data-testid="edit-item-delete-button"]');
    I.click('//button[@data-testid="edit-item-delete-button"]');
    I.dontSeeElement('//div[contains(@class, "modal-mobile-popup")]//form');
  }
};
