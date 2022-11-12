import { mount } from '@vue/test-utils';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('should mount the component', () => {
    const wrapper = mount(SearchBar);

    expect(wrapper.vm).toBeDefined();
  });

  it('should emit search event when form is submited', async () => {
    const wrapper = mount(SearchBar);
    const term = 'term of the search';
    const input = wrapper.find('input[type="search"]');
    const form = wrapper.find('form');

    await input.setValue(term);
    await form.trigger('submit');

    expect(wrapper.emitted().doSearch).toBeTruthy();
    expect(wrapper.emitted().doSearch.length).toEqual(1);
    expect(wrapper.emitted().doSearch[0]).toMatchObject([{ term }]);
  });

  it('should emit search event when search input is cleared', async () => {
    const wrapper = mount(SearchBar);
    const term = 'term of the search';
    const input = wrapper.find('input[type="search"]');

    await input.setValue(term);
    await input.setValue('');

    expect(wrapper.emitted().doSearch).toBeTruthy();
    expect(wrapper.emitted().doSearch.length).toEqual(1);
    expect(wrapper.emitted().doSearch[0]).toMatchObject([{ term: '' }]);
  });
});
