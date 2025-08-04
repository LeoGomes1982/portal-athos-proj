import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from "./pages/Home";
import DP from "./pages/DP";
import Comercial from "./pages/Comercial";
import ClientesFornecedores from "./pages/ClientesFornecedores";
import ContratosPropostas from "./pages/ContratosPropostas";
import Configuracoes from "./pages/Configuracoes";
import EdicaoContratosPropostas from "./pages/EdicaoContratosPropostas";
import PortalAdmissao from "./pages/PortalAdmissao";
import PortalVagas from "./pages/PortalVagas";

import Gerencia from "./pages/Gerencia";

import CICAD from "./pages/CICAD";
import CICADFormulario from "./pages/CICADFormulario";

import ProcessoSeletivo from "./pages/ProcessoSeletivo";
import { AvaliacaoExterna } from "./pages/AvaliacaoExterna";
import { GestaoServicosExtras } from "./pages/GestaoServicosExtras";
import Fiscalizacoes from "./pages/Fiscalizacoes";
import Operacoes from "./pages/Operacoes";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Public route for authentication */}
              <Route 
                path="/auth" 
                element={<Auth />} 
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
              <Route path="/operacoes" element={
                <ProtectedRoute>
                  <Operacoes />
                </ProtectedRoute>
              } />
              <Route path="/operacoes/gestao-servicos-extras" element={
                <ProtectedRoute>
                  <GestaoServicosExtras />
                </ProtectedRoute>
              } />
              <Route path="/fiscalizacoes" element={
                <ProtectedRoute>
                  <Fiscalizacoes />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;