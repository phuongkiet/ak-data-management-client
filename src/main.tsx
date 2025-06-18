import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/route.tsx'
import { ThemeProvider } from './app/context/ThemeContext.tsx'
import { AppWrapper } from './components/common/PageMeta'
import './index.css'
import { store, StoreContext } from './app/stores/store.ts'
import { ToastContainer } from 'react-toastify'
import './app/common/common.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <ThemeProvider>
        <AppWrapper>
          <RouterProvider router={router} />
        </AppWrapper>
      </ThemeProvider>
    </StoreContext.Provider>
    <ToastContainer position="bottom-right" />
  </StrictMode>
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      registration => {
        console.log("SW registered: ", registration);
      },
      registrationError => {
        console.log("SW registration failed: ", registrationError);
      }
    );
  });
}
