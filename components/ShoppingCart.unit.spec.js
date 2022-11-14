import { mount } from '@vue/test-utils';
import ShoppingCart from '@/components/ShoppingCart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';
import { CartManager } from '@/managers/CartManager';

describe('ShoppingCart', () => {
  let server;
  let manager;

  const mountShoppingCart = (quantity = 0, isOpen = false) => {
    const products = server.createList('product', quantity);
    const wrapper = mount(ShoppingCart, {
      propsData: {
        products,
        isOpen,
      },
      mocks: {
        $cart: manager,
      },
    });

    return { wrapper, products };
  };

  beforeEach(() => {
    manager = new CartManager();
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    manager.clearCart();
  });

  it('should mount the component', () => {
    const { wrapper } = mountShoppingCart();

    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when close button gets clicked', async () => {
    const { wrapper } = mountShoppingCart();

    const button = wrapper.find('[aria-label="Close"]');
    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should contain hidden class when no prop isOpen is passed', () => {
    const { wrapper } = mountShoppingCart();

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should not contain hidden class when prop isOpen is passed', () => {
    const { wrapper } = mountShoppingCart(0, true);

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when there are no products', () => {
    const { wrapper } = mountShoppingCart();

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are provided', () => {
    const { wrapper } = mountShoppingCart(2);

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });

  it('should display a button to clear cart', () => {
    const { wrapper } = mountShoppingCart(2);
    const button = wrapper.find('[data-testid="clear-button"]');

    expect(button.exists()).toEqual(true);
  });

  it('should call cart manager clearProducts() when button gets clicked', async () => {
    const spy = jest.spyOn(manager, 'clearProducts');
    const { wrapper } = mountShoppingCart(2);
    const button = wrapper.find('[data-testid="clear-button"]');

    await button.trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
