import { useDispatch } from "react-redux"
import { addToast } from "../store/uiSlice"

const buildToast = (type, title, message) => ({
  id: crypto.randomUUID(),
  type,
  title,
  message
})

export const useToast = () => {
  const dispatch = useDispatch()

  return {
    success: (title, message) =>
      dispatch(addToast(buildToast("success", title, message))),
    error: (title, message) =>
      dispatch(addToast(buildToast("error", title, message))),
    info: (title, message) =>
      dispatch(addToast(buildToast("info", title, message)))
  }
}
