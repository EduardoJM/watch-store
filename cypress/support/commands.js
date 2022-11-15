Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
});

Cypress.Commands.add('getByAriaLabel', (label) => {
  return cy.get(`[aria-label="${label}"]`);
});

Cypress.Commands.add('addToCart', (data) => {
  if (typeof data === 'string' && data === 'all') {
    return cy
      .getByTestId('product-card')
      .get('button')
      .click({ force: true, multiple: true });
  }
  const { indexes } = data;
  for (const index of indexes) {
    cy.getByTestId('product-card')
      .eq(index)
      .find('button')
      .click({ force: true });
  }
});
