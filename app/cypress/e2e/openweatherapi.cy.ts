import { set } from "cypress/types/lodash";

describe('OpenWeatherApi Tests', () => {

  const appUrl = Cypress.env('devUrl');

  it('should fetch data from api correctly for city with single result', () => {
    cy.visit(appUrl);

    // Check if the info message is visible when first time coming to the page
    cy.get('[data-cy="info-message"]').contains('Please enter a city name to search for weather data');

    // Check that the weather container is not visible when first time coming to the page
    cy.get('[data-cy="weather-container"]').should('not.exist');

    // Check if the input box is visible
    cy.get('[data-cy="city-name-input"]').should('be.visible');

    // Type a test city name into the input box
    cy.get('[data-cy="city-name-input"]').type('London, GB');

    // Assert that the input box contains the typed text
    cy.get('[data-cy="city-name-input"]').should('have.value', 'London, GB');

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Assert that info message is not anymore visible
    cy.get('[data-cy="info-message"]').should('not.exist');

    // Check that weather container is available
    cy.get('[data-cy="weather-container"]').should('be.visible');
  });

  it('should fetch data from api correctly for city with multiple results', () => {
    cy.visit(appUrl);

    // Type a test city name into the input box
    cy.get('[data-cy="city-name-input"]').type('Helsinki');

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Check that the results list is visible
    cy.get('[data-cy="results-list"]').should('be.visible');

    // Select first result from the list
    cy.get('[data-cy="result-row"]').first().click();

    // Check that weather container is available
    cy.get('[data-cy="weather-container"]').should('be.visible');

  });

  it('should fetch data from api correctly with different unit types', () => {
    cy.visit(appUrl);

    // Type a test city name into the input box
    cy.get('[data-cy="city-name-input"]').type('London, GB');

    // Select metric unit type
    cy.get('[data-cy="radio-metric"]').click();

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Check that weather container is available
    cy.get('[data-cy="weather-container"]').should('be.visible');

    // Check that units are in correct format
    cy.get('[data-cy="temperature-row"]').contains('°C');
    cy.get('[data-cy="wind-speed-row"]').contains('m/s');

    // Select metric unit type
    cy.get('[data-cy="radio-imperial"]').click();

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Check that weather container is available
    cy.get('[data-cy="weather-container"]').should('be.visible');

    // Check that units are in correct format
    cy.get('[data-cy="temperature-row"]').contains('°F');
    cy.get('[data-cy="wind-speed-row"]').contains('mph');

  });

  it('should show 5 day data table', () => {
    cy.visit(appUrl);

    // Type a test city name into the input box
    cy.get('[data-cy="city-name-input"]').type('London, GB');

    // Select metric unit type
    cy.get('[data-cy="radio-metric"]').click();

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Change to 5 days tab
    cy.get('[data-cy="tab-daily"]').click();

    // Check that weather data is available
    cy.get('[data-cy="five-day-table"]').should('be.visible');

    // Check that container has at least one row with temperature data
    cy.get('[data-cy="five-day-table"]').contains('°C');

  });

  it('should retain data after a page refresh', () => {
    cy.visit(appUrl);

    // Type a test city name into the input box
    cy.get('[data-cy="city-name-input"]').type('Helsinki');

    // Click the submit button
    cy.get('[data-cy="submit-button"]').click();

    // Check that the results list is visible
    cy.get('[data-cy="results-list"]').should('be.visible');

    // Select first result from the list
    cy.get('[data-cy="result-row"]').first().click();

    // Check that weather container is available
    cy.get('[data-cy="weather-container"]').should('be.visible');

    // Refresh the page
    cy.reload();

    // Verify that the data is still in localStorage after the refresh
    cy.get('[data-cy="weather-container"]').should('be.visible');

    // Verify that the city name still matches after refresh
    cy.get('[data-cy="city-name"]').contains('Helsinki');

  });
});