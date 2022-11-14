import { CartManager } from '@/managers/CartManager';
import { makeServer } from '@/miragejs/server';

describe('CartManager', () => {
  let server;
  let manager;

  beforeEach(() => {
    manager = new CartManager();
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    manager.clearCart();
  });

  it('should set cart to open', () => {
    const state = manager.open();

    expect(state.open).toEqual(true);
  });

  it('should set cart to closed', () => {
    const state = manager.close();

    expect(state.open).toEqual(false);
  });

  it('should add product to the cart only once', () => {
    const product = server.create('product');

    manager.addProduct(product);
    const state = manager.addProduct(product);

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject(product);
  });

  it('should remove product from the cart', () => {
    const product = server.create('product');
    manager.addProduct(product);
    const state = manager.removeProduct(product.id);

    expect(state.items).toHaveLength(0);
  });

  it('should clear products', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    manager.addProduct(product1);
    let state = manager.addProduct(product2);

    expect(state.items).toHaveLength(2);

    state = manager.clearProducts();

    expect(state.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    manager.addProduct(product1);
    manager.open();
    let state = manager.addProduct(product2);

    expect(state.items).toHaveLength(2);
    expect(state.open).toEqual(true);

    state = manager.clearCart();

    expect(state.items).toHaveLength(0);
    expect(state.open).toEqual(false);
  });

  it('should return true if cart is not empty', () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    expect(manager.hasProducts()).toEqual(false);

    manager.addProduct(product1);
    manager.addProduct(product2);

    expect(manager.hasProducts()).toEqual(true);
  });

  it('should return false if product is not in the cart', () => {
    const product = server.create('product');

    expect(manager.productIsInTheCart(product)).toEqual(false);
  });

  it('should return true if product is already in the cart', () => {
    const product = server.create('product');
    manager.addProduct(product);

    expect(manager.productIsInTheCart(product)).toEqual(true);
  });

  it('should return the state', () => {
    const product = server.create('product');
    manager.open();
    manager.addProduct(product);
    const state = manager.getState();

    expect(state).toMatchObject({
      items: [product],
      open: true,
    });
  });
});
