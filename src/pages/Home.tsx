
import React from "react";
import { Users, FileText, Calendar, Settings, ArrowRight, Building } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-8 shadow-xl">
            <Building size={40} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Grupo Athos
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Portal integrado para gestão empresarial completa. 
            Acesse todos os módulos do sistema de forma centralizada.
          </p>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {/* RH Module */}
          <Link to="/rh">
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Recursos Humanos
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Gestão completa de funcionários, admissões e documentação
              </p>
              <div className="flex items-center text-green-600 font-medium">
                Acessar <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* DP Module */}
          <Link to="/dp">
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Departamento Pessoal
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Folha de pagamento, benefícios e rotinas trabalhistas
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Acessar <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Commercial Module */}
          <Link to="/comercial">
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Comercial
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Clientes, fornecedores, contratos e propostas comerciais
              </p>
              <div className="flex items-center text-orange-600 font-medium">
                Acessar <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Agenda Module */}
          <Link to="/agenda">
            <div className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Agenda
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Compromissos, reuniões e planejamento de atividades
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                Acessar <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/portal-admissao"
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Portal de Admissão</h3>
                <p className="text-sm text-slate-600">Processo de admissão de funcionários</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-green-600 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/configuracoes"
              className="flex items-center p-4 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-slate-500 rounded-xl flex items-center justify-center mr-4">
                <Settings size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Configurações</h3>
                <p className="text-sm text-slate-600">Configurações do sistema e templates</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
