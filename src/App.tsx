import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LoginHome from "./pages/LoginHome";
import Home from "./pages/Home";
import DP from "./pages/DP";
import Comercial from "./pages/Comercial";
import ClientesFornecedores from "./pages/ClientesFornecedores";
import ContratosPropostas from "./pages/ContratosPropostas";
import Configuracoes from "./pages/Configuracoes";
import EdicaoContratosPropostas from "./pages/EdicaoContratosPropostas";
import PortalAdmissao from "./pages/PortalAdmissao";
import PortalVagas from "./pages/PortalVagas";
import Agenda from "./pages/Agenda";
import Gerencia from "./pages/Gerencia";
import Manuais from "./pages/Manuais";
import CICAD from "./pages/CICAD";
import CICADFormulario from "./pages/CICADFormulario";
import PortalMidiaExterna from "./pages/PortalMidiaExterna";
import ProcessoSeletivo from "./pages/ProcessoSeletivo";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota de login - página inicial */}
              <Route path="/" element={<LoginHome />} />
              
              {/* Rotas protegidas */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/dp" element={
                <ProtectedRoute>
                  <DP />
                </ProtectedRoute>
              } />
              
              <Route path="/agenda" element={
                <ProtectedRoute>
                  <Agenda />
                </ProtectedRoute>
              } />
              
              <Route path="/comercial" element={
                <ProtectedRoute>
                  <Comercial />
                </ProtectedRoute>
              } />
              
              <Route path="/comercial/clientes-fornecedores" element={
                <ProtectedRoute>
                  <ClientesFornecedores />
                </ProtectedRoute>
              } />
              
              <Route path="/comercial/contratos-propostas" element={
                <ProtectedRoute>
                  <ContratosPropostas />
                </ProtectedRoute>
              } />
              
              <Route path="/gerencia" element={
                <ProtectedRoute>
                  <Gerencia />
                </ProtectedRoute>
              } />
              
              <Route path="/manuais" element={
                <ProtectedRoute>
                  <Manuais />
                </ProtectedRoute>
              } />
              
              <Route path="/configuracoes" element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              } />
              
              <Route path="/configuracoes/contratos-propostas" element={
                <ProtectedRoute>
                  <EdicaoContratosPropostas />
                </ProtectedRoute>
              } />
              
              <Route path="/portal-admissao" element={<PortalAdmissao />} />
              <Route path="/portal-vagas" element={<PortalVagas />} />
              <Route path="/portal-midia-externa" element={
                <ProtectedRoute>
                  <PortalMidiaExterna />
                </ProtectedRoute>
              } />
              
              <Route path="/cicad" element={
                <ProtectedRoute>
                  <CICAD />
                </ProtectedRoute>
              } />
              
              <Route path="/cicad-formulario" element={<CICADFormulario />} />
              
              <Route path="/processo-seletivo" element={
                <ProtectedRoute>
                  <ProcessoSeletivo />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route para páginas não encontradas */}
              <Route path="*" element={<LoginHome />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;