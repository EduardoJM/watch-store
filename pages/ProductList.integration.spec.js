import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import axios from 'axios';
import ProductList from '.';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { makeServer } from '@/miragejs/server';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;

  const getProducts = (overrides = [], quantity = 10) => {
    return [
      ...server.createList('product', quantity),
      ...overrides.map((override) => server.create('product', { ...override })),
    ];
  };

  const mountProductList = async (
    overrides = [],
    quantity = 10,
    shouldReject = false
  ) => {
    const products = getProducts(overrides, quantity);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('any error')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await nextTick();

    return { products, wrapper };
  };

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should mount the component', async () => {
    const { wrapper } = await mountProductList();

    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component', async () => {
    const { wrapper } = await mountProductList();

    expect(wrapper.findComponent(SearchBar)).toBeDefined();
  });

  it('should call axios.get on component mount', async () => {
    await mountProductList();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList();

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList([], 10, true);

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(0);

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!');
  });

  it('should filter the product list when a search is performed', async () => {
    const { wrapper } = await mountProductList([
      { title: 'My Custom Watch' },
      { title: 'Another Watch to test' },
    ]);

    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(12);

    const search = wrapper.findComponent(SearchBar);
    await search.find('input[type="search"]').setValue('watch');
    await search.find('form').trigger('submit');

    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('watch');
    expect(cards).toHaveLength(2);
    expect(cards.at(0).text()).toContain('My Custom Watch');
    expect(cards.at(1).text()).toContain('Another Watch to test');
  });

  it('should filter the product list and clear it to all products when a search input is cleared', async () => {
    const { wrapper } = await mountProductList([{ title: 'My Custom Watch' }]);

    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(11);

    const search = wrapper.findComponent(SearchBar);
    await search.find('input[type="search"]').setValue('watch');
    await search.find('form').trigger('submit');

    expect(wrapper.vm.searchTerm).toEqual('watch');
    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(1);

    await search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(11);
  });
});
