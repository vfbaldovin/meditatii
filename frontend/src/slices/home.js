// src/slices/home.js
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state of the 'home' slice todo: redux
const initialState = {
  currentPage: 0,
  subjectId: 0,
  sort: 'CREATED.DESC'
  // Include other state variables relevant to 'Home' here
  // For example:
  // isLoading: false,
  // error: null,
};

export const home = createSlice({
  name: 'home', // Name of the slice
  initialState, // Initial state for the slice
  reducers: {
    // Reducer to set the current page
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSubjectId: (state, action) => {
      state.subjectId = action.payload
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },

    // Add other reducer functions here as needed
    // For example:
    // setLoading: (state, action) => {
    //   state.isLoading = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
  },
});

// Export the action creators
export const { setCurrentPage, setSubjectId, setSort /* , setLoading, setError */ } = home.actions;

// Export the reducer as the default export
export default home.reducer;

export class setTotalItemsInStore {
}
