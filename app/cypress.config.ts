import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Default URL for cy.visit()
    env: {
      devUrl: 'http://localhost:4200', // Custom environment variable for development URL
      prodUrl: '' // Custom environment variable for production URL
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
