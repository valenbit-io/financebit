# FinanceBit 💎 | by ValenBit

**FinanceBit** es una aplicación web moderna y reactiva para el seguimiento de criptomonedas en tiempo real. Desarrollada por **ValenBit**, esta herramienta ofrece una experiencia de usuario fluida para visualizar precios, tendencias de mercado y gestionar tus activos favoritos.

![FinanceBit Preview](/public/financebit.png)

## 🚀 Características Destacadas

- **Dashboard Interactivo:**
  - **Ticker en Vivo:** Cinta de precios con las criptomonedas más relevantes en el encabezado.
  - **Hero Section:** Visualización destacada de monedas aleatorias del top 100.
  - **Tabla de Mercado:** Datos en tiempo real con paginación y ordenamiento.
- **Visualización de Datos:**
  - **Gráficos Sparkline:** Tendencias de precios de los últimos 7 días integradas directamente en la tabla (usando Recharts).
  - **Indicadores de Cambio:** Colores semánticos para variaciones positivas (verde) y negativas (rojo).
- **Personalización y UX:**
  - **Multi-divisa:** Soporte instantáneo para **USD**, **MXN** y **EUR**.
  - **Modo Oscuro/Claro:** Tema adaptable con persistencia de preferencias.
  - **Favoritos (Watchlist):** Guarda tus monedas preferidas (persistencia en `localStorage`).
  - **Búsqueda Inteligente:** Filtrado rápido de criptomonedas con *debounce* para optimizar peticiones.
- **Rendimiento y SEO:**
  - **Caché Personalizado:** Hook `useCache` implementado para minimizar llamadas a la API y mejorar la velocidad de carga.
  - **SEO Dinámico:** Títulos y metadatos gestionados con `react-helmet-async`.

## 🛠️ Stack Tecnológico

Este proyecto ha sido construido utilizando las últimas tecnologías del ecosistema React:

- **Core:** React 19 + Vite
- **Estilos:** Tailwind CSS (Diseño Responsive & Dark Mode)
- **Enrutamiento:** React Router DOM v7
- **Estado Global:** React Context API
- **Gráficos:** Recharts
- **Datos:** CoinGecko API
- **Testing:** Vitest + React Testing Library
- **Calidad de Código:** ESLint + PropTypes

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- Node.js (v18 o superior)
- npm o yarn

## 🔧 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/valenbit-io/valenbit-crypto.git
   cd valenbit-crypto
   ```

2. **Instalar dependencias**
   El proyecto utiliza React 19. Se incluye un archivo `.npmrc` para manejar dependencias heredadas automáticamente.
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**
   Crea un archivo `.env` en la raíz del proyecto basándote en el ejemplo proporcionado:
   ```bash
   cp .env.example .env
   ```
   
   Contenido de `.env`:
   ```env
   VITE_API_URL=https://api.coingecko.com/api/v3
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://localhost:5173`.

## 🧪 Testing

El proyecto cuenta con una suite de pruebas unitarias configurada con Vitest.

Para ejecutar las pruebas:
```bash
npm test
```

## 🚀 Despliegue

El proyecto está optimizado para desplegarse en **Vercel**. Incluye un archivo `vercel.json` con configuraciones de seguridad (CSP, Headers) y reglas de reescritura para SPA.

---

Desarrollado como proyecto de portafolio. Los datos son proporcionados por la API gratuita de CoinGecko.
