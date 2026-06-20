import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { PopupProvider } from './contexts/PopupContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <PopupProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PopupProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
