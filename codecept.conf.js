const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./tests/*_test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      // browser: process.env.BROWSER || "firefox",
      // url: process.env.BASE_URL || "https://dev.whisk.com",
      url: "https://dev.whisk.com",
      windowSize: "1024x780",
      waitForNavigation: ["domcontentloaded", "networkidle0"],
      waitForAction: 500,
      show: false
    },
    AssertWrapper: {
      require: "codeceptjs-assert"
    }
  },
  include: {
    I: "./steps_file.js",
    API: "./pages/api.js",
    mainPage: "./pages/mainPage.js"
  },
  bootstrap: null,
  mocha: {},
  name: "whisk-demo-tests",
  plugins: {
    autoDelay: {
      delayBefore: 300,
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
  // multiple: {
  //   basic: {
  //     // run all tests in chrome
  //     browsers: ["chrome"]
  //   },
  //   smoke: {
  //     // run smoke tests in chrome
  //     browsers: ["firefox"]
  //   },
  //   parallel: {
  //     chunks: process.env.THREADS || 2,
  //     browsers: [
  //       {
  //         browser: "chrome",
  //         windowSize: "1024x780"
  //       },
  //       {
  //         browser: "firefox",
  //         windowSize: "1024x780"
  //       }
  //     ]
  //   }
  // }
};
