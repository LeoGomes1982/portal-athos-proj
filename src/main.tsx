import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Limpar dados de teste
import './utils/clearTestData';

createRoot(document.getElementById("root")!).render(<App />);
