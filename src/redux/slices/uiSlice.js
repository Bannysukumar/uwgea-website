import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    darkMode: localStorage.getItem('pc_admin_theme') === 'dark',
    globalSearch: '',
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('pc_admin_theme', state.darkMode ? 'dark' : 'light');
    },
    setGlobalSearch(state, action) {
      state.globalSearch = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, toggleDarkMode, setGlobalSearch } =
  uiSlice.actions;
export default uiSlice.reducer;
