import { mount } from '@vue/test-utils';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

describe('ShoppingCart', () => {
  let server;

  const mountCartItem = () => {
    const product = server.create('product');

    const wrapper = mount(CartItem, {
      propsData: {
        product,
      },
    });

    return { product, wrapper };
  };

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const { wrapper, product } = mountCartItem();

    expect(wrapper.text()).toContain(product.title);
    expect(wrapper.text()).toContain(`$ ${product.price}`);
  });

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.find('[aria-label="Quantity"]').text()).toEqual('1');
  });

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const button = wrapper.find('[aria-label="Increase"]');
    const quantity = wrapper.find('[aria-label="Quantity"]');

    await button.trigger('click');

    expect(quantity.text()).toEqual('2');

    await button.trigger('click');

    expect(quantity.text()).toEqual('3');
  });

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const increaseButton = wrapper.find('[aria-label="Increase"]');
    const decreaseButton = wrapper.find('[aria-label="Decrease"]');
    const quantity = wrapper.find('[aria-label="Quantity"]');

    await increaseButton.trigger('click');
    await increaseButton.trigger('click');
    await increaseButton.trigger('click');

    expect(quantity.text()).toEqual('4');

    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('3');

    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('2');

    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('1');

    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('0');
  });

  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem();
    const decreaseButton = wrapper.find('[aria-label="Decrease"]');
    const quantity = wrapper.find('[aria-label="Quantity"]');

    await decreaseButton.trigger('click');
    await decreaseButton.trigger('click');

    expect(quantity.text()).toEqual('0');
  });
});
