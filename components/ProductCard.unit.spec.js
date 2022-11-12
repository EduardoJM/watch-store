import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

describe('ProductCard', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product'),
      },
    });

    expect(wrapper.vm).toBeDefined();
  });

  it('should text() contains the product title and price', () => {
    const product = server.create('product');

    const wrapper = mount(ProductCard, {
      propsData: { product },
    });

    expect(wrapper.text()).toContain(product.title);
    expect(wrapper.text()).toContain(`$ ${product.price}`);
  });
});
