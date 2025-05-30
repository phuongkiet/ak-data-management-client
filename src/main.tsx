import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/route.tsx'
import { ThemeProvider } from './app/context/ThemeContext.tsx'
import { AppWrapper } from './components/common/PageMeta'
import './index.css'
import { store, StoreContext } from './app/stores/store.ts'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <StoreContext.Provider value={store}>
          <RouterProvider router={router} />
        </StoreContext.Provider>
      </AppWrapper>
    </ThemeProvider>
    <ToastContainer position="bottom-right" />
  </StrictMode>
)
