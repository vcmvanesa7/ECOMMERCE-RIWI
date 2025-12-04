import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/es",
    video: true,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {},
  },
});
