import { mount } from '@vue/test-utils';
import DefaultLayout from '@/layouts/default';
import ShoppingCart from '@/components/ShoppingCart';
import { CartManager } from '@/managers/CartManager';

describe('Default Layout', () => {
  let manager;

  beforeEach(() => {
    manager = new CartManager();
  });

  afterEach(() => {
    manager.clearCart();
  });

  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      mocks: {
        $cart: manager,
      },
      stubs: {
        Nuxt: true,
      },
    });
    return { wrapper };
  };

  it('should mount Cart', () => {
    const { wrapper } = mountLayout();

    expect(wrapper.findComponent(ShoppingCart).exists()).toEqual(true);
  });

  it('should toggle Cart visibility', async () => {
    const { wrapper } = mountLayout();
    const button = wrapper.find('[aria-label="Toggle cart"]');

    await button.trigger('click');

    expect(wrapper.vm.isCartOpen).toEqual(true);

    await button.trigger('click');

    expect(wrapper.vm.isCartOpen).toEqual(false);
  });
});
