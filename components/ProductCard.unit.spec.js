import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

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

describe('ProductCard', () => {
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

  it('should emit the event addToCart with product object when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard();

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted().addToCart).toBeTruthy();
    expect(wrapper.emitted().addToCart.length).toEqual(1);
    expect(wrapper.emitted().addToCart[0]).toMatchObject([{ product }]);
  });
});
