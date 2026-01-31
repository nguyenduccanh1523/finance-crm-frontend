// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "@/app/store"
import { ThemeProvider } from "@/app/providers/ThemeProvider"
import { I18nProvider } from "@/app/providers/I18nProvider"

import "./index.css"
import { App } from "./App"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nProvider>
    </Provider>
  </React.StrictMode>,
)
