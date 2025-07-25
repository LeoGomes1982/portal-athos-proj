import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';

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
import { AvaliacaoExterna } from "./pages/AvaliacaoExterna";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public route for authentication */}
              <Route 
                path="/auth" 
                element={<Auth onAuthenticated={setAuthenticatedUser} />} 
              />
              
              {/* Public routes that don't require authentication */}
              <Route path="/portal-vagas" element={<PortalVagas />} />
              <Route path="/cicad-formulario" element={<CICADFormulario />} />
              <Route path="/avaliacao-externa/:token" element={<AvaliacaoExterna />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
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
              <Route path="/portal-admissao" element={
                <ProtectedRoute>
                  <PortalAdmissao />
                </ProtectedRoute>
              } />
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
              <Route path="/processo-seletivo" element={
                <ProtectedRoute>
                  <ProcessoSeletivo />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;