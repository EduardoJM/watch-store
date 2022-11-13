import { mount } from '@vue/test-utils';
import ShoppingCart from '@/components/ShoppingCart';
import CartItem from '@/components/CartItem';
import { makeServer } from '@/miragejs/server';

describe('ShoppingCart', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ShoppingCart);

    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when close button gets clicked', async () => {
    const wrapper = mount(ShoppingCart);

    const button = wrapper.find('[aria-label="Close"]');
    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should contain hidden class when no prop isOpen is passed', () => {
    const wrapper = mount(ShoppingCart);

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should not contain hidden class when prop isOpen is passed', () => {
    const wrapper = mount(ShoppingCart, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });

  it('should display "Cart is empty" when there are no products', () => {
    const wrapper = mount(ShoppingCart);

    expect(wrapper.text()).toContain('Cart is empty');
  });

  it('should display 2 instances of CartItem when 2 products are provided', () => {
    const products = server.createList('product', 2);

    const wrapper = mount(ShoppingCart, {
      propsData: {
        products,
      },
    });

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain('Cart is empty');
  });
});
