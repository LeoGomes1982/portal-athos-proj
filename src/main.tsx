import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remover importações que podem causar problemas em produção
// import './utils/clearTestData';
// import { stabilizeApp } from './utils/navigationStability';

// Inicializar estabilizadores apenas em desenvolvimento
// if (import.meta.env.DEV) {
//   stabilizeApp();
// }

createRoot(document.getElementById("root")!).render(<App />);
