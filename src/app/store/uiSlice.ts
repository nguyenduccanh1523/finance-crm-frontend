// src/app/store/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type Theme = "light" | "dark" | "system"
type Language = "en" | "vi"

interface UiState {
  theme: Theme
  language: Language
}

// đọc từ localStorage nếu có
function loadInitialTheme(): Theme {
  const saved = localStorage.getItem("ui.theme")
  if (saved === "light" || saved === "dark" || saved === "system") return saved
  return "light"
}

function loadInitialLanguage(): Language {
  const saved = localStorage.getItem("ui.language")
  if (saved === "vi" || saved === "en") return saved
  return "vi"
}

const initialState: UiState = {
  theme: loadInitialTheme(),
  language: loadInitialLanguage(),
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem("ui.theme", action.payload)
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      localStorage.setItem("ui.language", action.payload)
    },
  },
})

export const { setTheme, setLanguage } = uiSlice.actions
export default uiSlice.reducer
export type { Theme, Language }
