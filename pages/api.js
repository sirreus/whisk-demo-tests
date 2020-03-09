const fetch = require("node-fetch");

const { I } = inject();

module.exports = {
  async getAccessToken() {
    const resp = await fetch("https://login-dev.whisk.com/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Bearer OWozGnwC7ykvA8KxGAadAxwk723IzriNNnqDFAlJQOCDcS0Y7Gb4PvLcFFcwWcBX"
      },
      body: JSON.stringify({
        email: "keg.tezt@gmail.com",
        password: "_Qwe123-asd"
      })
    });

    I.assert(resp.status, 200);
    // console.log(resp);
    const { token } = await resp.token.access_token.json();
    I.assertOk(token);
    // console.log(token);
    return token;
  }
};
