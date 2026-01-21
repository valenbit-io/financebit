import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CryptoProvider } from './context/CryptoContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CryptoProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CryptoProvider>
    </BrowserRouter>
  </React.StrictMode>,
)