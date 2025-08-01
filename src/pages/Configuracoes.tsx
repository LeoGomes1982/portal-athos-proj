import React, { useState, useEffect } from "react";
import { ArrowLeft, Settings, Building2, User, FileText, Bell, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import GerenciarEmpresasModal from "@/components/modals/GerenciarEmpresasModal";
import { LogsSubsection } from "@/components/subsections/LogsSubsection";
import { ImportarFuncionariosModal } from "@/components/modals/ImportarFuncionariosModal";

const Configuracoes = () => {
  const navigate = useNavigate();
  const [isEmpresasModalOpen, setIsEmpresasModalOpen] = useState(false);
  const [showLogsSection, setShowLogsSection] = useState(false);
  const [isImportarModalOpen, setIsImportarModalOpen] = useState(false);
  
  // Estados para configurações gerais
  const [configuracoes, setConfiguracoes] = useState({
    nomeUsuario: "Administrador",
    emailUsuario: "admin@sistema.com",
    notificacoesPush: true,
    notificacoesEmail: false,
    temaEscuro: false,
    autoSalvar: true,
    modeloContrato: ""
  });

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const configSalvas = localStorage.getItem('configuracoes');
    if (configSalvas) {
      setConfiguracoes(JSON.parse(configSalvas));
    }
  }, []);

  // Salvar configurações no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes));
  }, [configuracoes]);

  const handleConfigChange = (field: string, value: any) => {
    setConfiguracoes(prev => ({ ...prev, [field]: value }));
  };

  // Se está mostrando a seção de logs, renderizar apenas ela
  if (showLogsSection) {
    return <LogsSubsection onBack={() => setShowLogsSection(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
            <span className="text-slate-700">Voltar</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl mb-4 shadow-lg">
            <Settings size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Configurações
          </h1>
          <p className="text-slate-600">
            Gerencie as configurações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configurações de Usuário */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Perfil do Usuário</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nomeUsuario">Nome</Label>
                <Input
                  id="nomeUsuario"
                  value={configuracoes.nomeUsuario}
                  onChange={(e) => handleConfigChange("nomeUsuario", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="emailUsuario">E-mail</Label>
                <Input
                  id="emailUsuario"
                  type="email"
                  value={configuracoes.emailUsuario}
                  onChange={(e) => handleConfigChange("emailUsuario", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Configurações de Notificações */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Notificações</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificacoesPush">Notificações Push</Label>
                  <p className="text-sm text-slate-600">Receber notificações no navegador</p>
                </div>
                <Switch
                  id="notificacoesPush"
                  checked={configuracoes.notificacoesPush}
                  onCheckedChange={(checked) => handleConfigChange("notificacoesPush", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notificacoesEmail">Notificações por E-mail</Label>
                  <p className="text-sm text-slate-600">Receber notificações por e-mail</p>
                </div>
                <Switch
                  id="notificacoesEmail"
                  checked={configuracoes.notificacoesEmail}
                  onCheckedChange={(checked) => handleConfigChange("notificacoesEmail", checked)}
                />
              </div>
            </div>
          </div>

          {/* Configurações do Sistema */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Sistema</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="temaEscuro">Tema Escuro</Label>
                  <p className="text-sm text-slate-600">Ativar modo escuro</p>
                </div>
                <Switch
                  id="temaEscuro"
                  checked={configuracoes.temaEscuro}
                  onCheckedChange={(checked) => handleConfigChange("temaEscuro", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSalvar">Auto-salvar</Label>
                  <p className="text-sm text-slate-600">Salvar automaticamente as alterações</p>
                </div>
                <Switch
                  id="autoSalvar"
                  checked={configuracoes.autoSalvar}
                  onCheckedChange={(checked) => handleConfigChange("autoSalvar", checked)}
                />
              </div>
            </div>
          </div>

          {/* Gerenciamento de Empresas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Empresas</h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Gerencie as empresas cadastradas no sistema, incluindo informações básicas como nome, CNPJ e dados de contato.
              </p>
              
              <Button 
                onClick={() => setIsEmpresasModalOpen(true)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Building2 size={16} className="mr-2" />
                Gerenciar Empresas
              </Button>
            </div>
          </div>

          {/* Importar Funcionários */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Importar Funcionários</h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Importe funcionários em massa através de um arquivo Excel com as informações necessárias.
              </p>
              
              <Button 
                onClick={() => setIsImportarModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Users size={16} className="mr-2" />
                Adicionar Funcionários em Massa
              </Button>
            </div>
          </div>

          {/* Modelo de Contrato */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Modelo de Contrato</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="modeloContrato">Template do Contrato</Label>
                <p className="text-sm text-slate-600 mb-2">
                  Defina o modelo padrão para geração de contratos. Use variáveis como {"{nomeCliente}"}, {"{servicosEscolhidos}"}, {"{valorTotal}"}, etc.
                </p>
                <Textarea
                  id="modeloContrato"
                  value={configuracoes.modeloContrato}
                  onChange={(e) => handleConfigChange("modeloContrato", e.target.value)}
                  placeholder="Digite aqui o modelo do contrato..."
                  className="min-h-[200px] resize-y"
                />
              </div>
            </div>
          </div>

          {/* Logs do Sistema */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Logs do Sistema</h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Visualize registros de exclusões e auditoria do sistema para monitoramento e controle de atividades.
              </p>
              
              <Button 
                onClick={() => setShowLogsSection(true)}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <FileText size={16} className="mr-2" />
                Visualizar Logs
              </Button>
            </div>
          </div>

        </div>

        <GerenciarEmpresasModal
          isOpen={isEmpresasModalOpen}
          onClose={() => setIsEmpresasModalOpen(false)}
        />
        
        <ImportarFuncionariosModal
          isOpen={isImportarModalOpen}
          onClose={() => setIsImportarModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Configuracoes;
