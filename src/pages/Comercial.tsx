
import React from "react";
import { ArrowLeft, Users, FileText, Building2, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Comercial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Módulo Comercial
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gerencie clientes, fornecedores, contratos e propostas comerciais
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Clientes e Fornecedores */}
          <Link to="/comercial/clientes-fornecedores">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Clientes e Fornecedores
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Cadastre e gerencie informações de clientes e fornecedores da empresa
              </p>
            </div>
          </Link>

          {/* Contratos e Propostas */}
          <Link to="/comercial/contratos-propostas">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Contratos e Propostas
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Crie, edite e gerencie contratos e propostas comerciais
              </p>
            </div>
          </Link>

          {/* Empresas */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer opacity-75">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Empresas
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Gerencie informações das empresas do grupo
            </p>
            <span className="inline-block mt-3 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Em breve
            </span>
          </div>

          {/* Relatórios */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer opacity-75">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Relatórios
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Visualize relatórios e métricas comerciais
            </p>
            <span className="inline-block mt-3 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Em breve
            </span>
          </div>

          {/* Financeiro */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer opacity-75">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <DollarSign size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Financeiro
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Controle financeiro e fluxo de caixa
            </p>
            <span className="inline-block mt-3 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
              Em breve
            </span>
          </div>

          {/* Agenda Comercial */}
          <Link to="/agenda">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Agenda Comercial
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Organize reuniões, tarefas e compromissos comerciais
              </p>
            </div>
          </Link>
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

export default Comercial;
