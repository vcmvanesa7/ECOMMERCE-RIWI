describe("Home Page", () => {
  it("loads the homepage", () => {
    cy.visit("http://localhost:3000");

    cy.contains("KOI").should("exist");
  });
});
