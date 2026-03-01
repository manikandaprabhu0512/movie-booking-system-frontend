import reducer, {
  addToast,
  closeSidebar,
  removeToast,
  toggleSidebar
} from "./uiSlice"

describe("uiSlice", () => {
  it("toggles sidebar open state", () => {
    const nextState = reducer(undefined, toggleSidebar())
    expect(nextState.sidebarOpen).toBe(true)
  })

  it("closes sidebar", () => {
    const state = { sidebarOpen: true, toasts: [] }
    const nextState = reducer(state, closeSidebar())
    expect(nextState.sidebarOpen).toBe(false)
  })

  it("adds and removes toast", () => {
    const toast = { id: "1", title: "ok", message: "saved", type: "success" }
    const withToast = reducer(undefined, addToast(toast))
    expect(withToast.toasts).toHaveLength(1)

    const afterRemove = reducer(withToast, removeToast("1"))
    expect(afterRemove.toasts).toHaveLength(0)
  })
})
