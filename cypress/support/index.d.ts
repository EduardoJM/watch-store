declare namespace Cypress {
  interface Chainable<Subject> {
    getByTestId(selector: string): Chainable<any>;
    getByAriaLabel(label: string): Chainable<any>;
    addToCart(data: 'all' | { indexes: number[] }): Chainable<any>;
  }
}
