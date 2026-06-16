import productsReducer, { setActiveCategory, setSearchQuery } from '../store/productsSlice';

const initial = { activeCategory: 'All', searchQuery: '' };

describe('productsSlice', () => {
  it('has correct initial state', () => {
    expect(productsReducer(undefined, { type: '@@INIT' })).toEqual(initial);
  });

  it('sets active category', () => {
    const state = productsReducer(initial, setActiveCategory('Jewelry'));
    expect(state.activeCategory).toBe('Jewelry');
  });

  it('sets search query', () => {
    const state = productsReducer(initial, setSearchQuery('frame'));
    expect(state.searchQuery).toBe('frame');
  });

  it('resets active category to All', () => {
    const state1 = productsReducer(initial, setActiveCategory('Birthday'));
    const state2 = productsReducer(state1, setActiveCategory('All'));
    expect(state2.activeCategory).toBe('All');
  });

  it('clears search query', () => {
    const state1 = productsReducer(initial, setSearchQuery('test'));
    const state2 = productsReducer(state1, setSearchQuery(''));
    expect(state2.searchQuery).toBe('');
  });
});
