import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sidebarOpen: false,
  toasts: []
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSidebar(state) {
      state.sidebarOpen = false
    },
    addToast(state, action) {
      state.toasts.push(action.payload)
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    }
  }
})

export const { toggleSidebar, closeSidebar, addToast, removeToast } =
  uiSlice.actions
export default uiSlice.reducer
