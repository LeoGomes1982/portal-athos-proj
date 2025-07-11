
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RH from "./pages/RH";
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
import PortalMidiaExterna from "./pages/PortalMidiaInterna";
import ProcessoSeletivo from "./pages/ProcessoSeletivo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rh" element={<RH />} />
          <Route path="/dp" element={<DP />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/comercial" element={<Comercial />} />
          <Route path="/comercial/clientes-fornecedores" element={<ClientesFornecedores />} />
          <Route path="/comercial/contratos-propostas" element={<ContratosPropostas />} />
          <Route path="/gerencia" element={<Gerencia />} />
          <Route path="/manuais" element={<Manuais />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/configuracoes/contratos-propostas" element={<EdicaoContratosPropostas />} />
          <Route path="/portal-admissao" element={<PortalAdmissao />} />
          <Route path="/portal-vagas" element={<PortalVagas />} />
          <Route path="/portal-midia-externa" element={<PortalMidiaExterna />} />
          <Route path="/cicad" element={<CICAD />} />
          <Route path="/cicad-formulario" element={<CICADFormulario />} />
          <Route path="/processo-seletivo" element={<ProcessoSeletivo />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
