import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';
import { cartState } from '@/state';

describe('ProductCard', () => {
  let server;

  const mountProductCard = () => {
    const product = server.create('product', {
      title: 'Product Title',
      price: 22,
      image:
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=689&q=80',
    });
    const wrapper = mount(ProductCard, {
      propsData: { product },
    });
    return { product, wrapper };
  };

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component and match snapshot', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should add item to cartState when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard();

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(cartState.items).toHaveLength(1);
    expect(cartState.items[0]).toMatchObject(product);
  });

  it.todo('should ensure product is not added to the cart twice');
});
