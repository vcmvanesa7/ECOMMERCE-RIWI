/// <reference types="cypress" />

describe("Auth Flow - Register → Login → Redirect Home", () => {
  const email = Cypress.env("TEST_EMAIL");
  const password = Cypress.env("TEST_PASSWORD");

  it("Visits register page", () => {
    cy.visit("/auth/register");
    cy.contains("Create an account", { timeout: 10000 }).should("exist");
    cy.wait(800);
  });

  it("Registers the test user", () => {
    cy.visit("/auth/register");
    cy.wait(800);

    cy.get('input[name="name"]').should("be.visible").clear().type("Test User");
    cy.get('input[name="email"]').should("be.visible").clear().type(email);
    cy.get('input[name="password"]')
      .should("be.visible")
      .clear()
      .type(password);

    cy.contains("Register").click();
    cy.url({ timeout: 10000 }).should("include", "/auth/login");
  });

  it("Logs in user and redirects home", () => {
    cy.visit("/auth/login");
    cy.wait(800);

    cy.get('input[name="email"]').should("be.visible").clear().type(email);
    cy.get('input[name="password"]')
      .should("be.visible")
      .clear()
      .type(password);

    cy.get('button[type="submit"]').click({ force: true });

    cy.url({ timeout: 15000 }).should("include", "/es");
  });
});
