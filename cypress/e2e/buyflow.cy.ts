it("Full purchase flow until PayPal redirect", () => {
  // Visit home page
  cy.visit("/");
  cy.wait(4000);

  // Go to products list from "Ver todos"
  cy.contains(/Ver todos/i).click({ force: true });
  cy.url().should("include", "/products");

  // Open the first product in the list
  cy.get('a[href*="/products/"]')
    .first()
    .scrollIntoView()
    .click({ force: true });

  // Ensure the product detail page is loaded
  cy.url().should("match", /\/products\/[A-Za-z0-9]+/);
  cy.get("h1", { timeout: 15000 }).should("exist");

  // Add product to cart
  cy.contains("button", /^Agregar al carrito$/i, { timeout: 20000 })
    .scrollIntoView()
    .should("be.visible")
    .click({ force: true });

  // Verify cart page
  cy.url({ timeout: 20000 }).should("include", "/cart");
  cy.contains(/Tu Carrito|Your Cart/i).should("exist");

  // Click "Ir a pagar" (Go to pay)
  cy.contains(/Ir a pagar/i, { timeout: 20000 })
    .scrollIntoView()
    .click({ force: true });

  // Wait for browser redirection to begin
  cy.wait(3000);

  // Validate that the URL changed from localhost to PayPal
  cy.url({ timeout: 20000 }).should("include", "paypal.com");

  // Now run checks inside the PayPal origin
  cy.origin("https://www.sandbox.paypal.com", () => {
    cy.url().should("include", "sandbox.paypal.com");
  });
});
