/// <reference types="cypress" />
import { makeServer } from '../../miragejs/server';

context('Store', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  context('Store > Product List', () => {
    it('should display "None Product Found" when no product is returned', () => {
      cy.visit('/');

      cy.getByTestId('product-card').should('have.length', 0);
      cy.get('body').contains('None Product Found');
    });

    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product');

      cy.visit('/');

      cy.getByTestId('product-card').should('have.length', 1);
      cy.get('body').contains('1 Product');
    });

    it('should display "10 Product" when 10 products is returned', () => {
      server.createList('product', 10);

      cy.visit('/');

      cy.getByTestId('product-card').should('have.length', 10);
      cy.get('body').contains('10 Products');
    });
  });

  context('Store > Search for products', () => {
    it('should type in the search field', () => {
      cy.visit('/');

      cy.get('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here');
    });

    it('should return one product when "Beautiful watch" is used as search term', () => {
      server.createList('product', 10);
      server.create('product', {
        title: 'beautiful watch',
      });

      cy.visit('/');

      cy.get('input[type="search"]').type('Beautiful Watch');

      cy.get('form[name="search-form"]').submit();

      cy.getByTestId('product-card').should('have.length', 1);
    });

    it('should not return any product', () => {
      server.createList('product', 10);

      cy.visit('/');

      cy.get('input[type="search"]').type('Beautiful Watch');

      cy.get('form[name="search-form"]').submit();

      cy.getByTestId('product-card').should('have.length', 0);
      cy.get('body').contains('None Product Found');
    });
  });

  context('Store -> Shopping Cart', () => {
    beforeEach(() => {
      server.createList('product', 10);
      cy.visit('/');
    });

    it('should not display shopping cart when page first loads', () => {
      cy.getByTestId('shopping-cart').should('not.be.visible');
    });

    it('should toggle shopping cart visibility when button is clicked', () => {
      cy.getByAriaLabel('Toggle cart').click();

      cy.getByTestId('shopping-cart').should('be.visible');

      cy.getByAriaLabel('Toggle cart').click({ force: true });

      cy.getByTestId('shopping-cart').should('not.be.visible');
    });

    it('should display "Cart is empty" message when there are no products', () => {
      cy.getByAriaLabel('Toggle cart').click();

      cy.getByTestId('shopping-cart').should('contain.text', 'Cart is empty');
    });

    it('should open shopping cart when a product is added', () => {
      cy.addToCart({ indexes: [0] });

      cy.getByTestId('shopping-cart').should('be.visible');
    });

    it('should add first product to the cart', () => {
      cy.addToCart({ indexes: [0] });

      cy.getByTestId('shopping-cart').should('be.visible');
      cy.getByTestId('cart-item').should('have.length', 1);
    });

    it('should add all products to the cart', () => {
      cy.addToCart('all');

      cy.getByTestId('shopping-cart').should('be.visible');
      cy.getByTestId('cart-item').should('have.length', 10);
    });

    it('should add 3 products to the cart', () => {
      cy.addToCart({ indexes: [1, 3, 5] });

      cy.getByTestId('shopping-cart').should('be.visible');
      cy.getByTestId('cart-item').should('have.length', 3);
    });

    it('should remove a product from cart', () => {
      cy.addToCart({ indexes: [2] });

      cy.getByTestId('cart-item').should('have.length', 1);

      cy.getByTestId('cart-item').find('[data-testid="remove-button"]').click();

      cy.getByTestId('cart-item').should('have.length', 0);
    });

    it('should clear cart when clear cart button is clicked', () => {
      cy.addToCart({ indexes: [2, 3, 4, 8] });

      cy.getByTestId('cart-item').should('have.length', 4);

      cy.getByTestId('shopping-cart')
        .find('[data-testid="clear-button"]')
        .click();

      cy.getByTestId('cart-item').should('have.length', 0);
    });

    it('should not display "Clear cart" button when cart is empty', () => {
      cy.getByAriaLabel('Toggle cart').click();

      cy.getByTestId('shopping-cart')
        .find('[data-testid="clear-button"]')
        .should('have.length', 0);
    });

    it('should display "Clear cart" button when cart is not empty', () => {
      cy.addToCart({ indexes: [1] });

      cy.getByTestId('shopping-cart')
        .find('[data-testid="clear-button"]')
        .should('be.visible');
    });

    it('should display quantity 1 when product is added to cart', () => {
      cy.addToCart({ indexes: [1] });

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '1');
    });

    it('should increase quantity when button + gets clicked', () => {
      cy.addToCart({ indexes: [1] });

      cy.getByAriaLabel('Increase').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '2');

      cy.getByAriaLabel('Increase').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '3');
    });

    it('should decrease quantity when button - gets clicked', () => {
      cy.addToCart({ indexes: [1] });

      cy.getByAriaLabel('Increase').click();
      cy.getByAriaLabel('Increase').click();
      cy.getByAriaLabel('Increase').click();

      cy.getByAriaLabel('Decrease').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '3');

      cy.getByAriaLabel('Decrease').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '2');

      cy.getByAriaLabel('Decrease').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '1');

      cy.getByAriaLabel('Decrease').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '0');
    });

    it('should not decrease below zero when button - gets clicked', () => {
      cy.addToCart({ indexes: [1] });

      cy.getByAriaLabel('Decrease').click();
      cy.getByAriaLabel('Decrease').click();
      cy.getByAriaLabel('Decrease').click();
      cy.getByAriaLabel('Decrease').click();

      cy.getByTestId('cart-item')
        .find('[aria-label="Quantity"]')
        .should('contain.text', '0');
    });
  });
});
