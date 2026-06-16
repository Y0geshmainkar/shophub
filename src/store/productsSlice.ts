import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  activeCategory: string;
  searchQuery: string;
}

const productsSlice = createSlice({
  name: 'products',
  initialState: { activeCategory: 'All', searchQuery: '' } as ProductsState,
  reducers: {
    setActiveCategory(state, action: PayloadAction<string>) {
      state.activeCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setActiveCategory, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
