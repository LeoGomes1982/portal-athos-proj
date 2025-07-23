import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load components to improve initial load time
const LoginHome = lazy(() => import("./pages/LoginHome"));
const Home = lazy(() => import("./pages/Home"));
const DP = lazy(() => import("./pages/DP"));
const Comercial = lazy(() => import("./pages/Comercial"));
const ClientesFornecedores = lazy(() => import("./pages/ClientesFornecedores"));
const ContratosPropostas = lazy(() => import("./pages/ContratosPropostas"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const EdicaoContratosPropostas = lazy(() => import("./pages/EdicaoContratosPropostas"));
const PortalAdmissao = lazy(() => import("./pages/PortalAdmissao"));
const PortalVagas = lazy(() => import("./pages/PortalVagas"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Gerencia = lazy(() => import("./pages/Gerencia"));
const Manuais = lazy(() => import("./pages/Manuais"));
const CICAD = lazy(() => import("./pages/CICAD"));
const CICADFormulario = lazy(() => import("./pages/CICADFormulario"));
const PortalMidiaExterna = lazy(() => import("./pages/PortalMidiaExterna"));
const ProcessoSeletivo = lazy(() => import("./pages/ProcessoSeletivo"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner message="Carregando aplicação..." />}>
              <Routes>
                {/* Rota de login - página inicial */}
                <Route path="/" element={<LoginHome />} />
                
                {/* Rotas protegidas */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando página inicial..." />}>
                      <Home />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/dp" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Departamento Pessoal..." />}>
                      <DP />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/agenda" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Agenda..." />}>
                      <Agenda />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/comercial" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Comercial..." />}>
                      <Comercial />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/comercial/clientes-fornecedores" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Clientes e Fornecedores..." />}>
                      <ClientesFornecedores />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/comercial/contratos-propostas" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Contratos e Propostas..." />}>
                      <ContratosPropostas />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/gerencia" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Gerência..." />}>
                      <Gerencia />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/manuais" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Manuais..." />}>
                      <Manuais />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Configurações..." />}>
                      <Configuracoes />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/configuracoes/contratos-propostas" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Edição de Contratos..." />}>
                      <EdicaoContratosPropostas />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/portal-admissao" element={
                  <Suspense fallback={<LoadingSpinner message="Carregando Portal de Admissão..." />}>
                    <PortalAdmissao />
                  </Suspense>
                } />
                
                <Route path="/portal-vagas" element={
                  <Suspense fallback={<LoadingSpinner message="Carregando Portal de Vagas..." />}>
                    <PortalVagas />
                  </Suspense>
                } />
                
                <Route path="/portal-midia-externa" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Portal de Mídia..." />}>
                      <PortalMidiaExterna />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/cicad" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando CICAD..." />}>
                      <CICAD />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                <Route path="/cicad-formulario" element={
                  <Suspense fallback={<LoadingSpinner message="Carregando Formulário CICAD..." />}>
                    <CICADFormulario />
                  </Suspense>
                } />
                
                <Route path="/processo-seletivo" element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner message="Carregando Processo Seletivo..." />}>
                      <ProcessoSeletivo />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route para páginas não encontradas */}
                <Route path="*" element={<LoginHome />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;