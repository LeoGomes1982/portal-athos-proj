import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Home } from "lucide-react";
import { UniformeModal } from "../modals/UniformeModal";
import { useNavigate } from "react-router-dom";

interface UniformesSubsectionProps {
  onBack: () => void;
}

// Dados mockados de uniformes
const resumoUniformes = {
  totalEntregas: 156,
  funcionariosComUniforme: 24,
  pecasMaisEntregues: "Camisa",
  ultimaEntrega: "2024-06-15"
};

const entregasRecentes = [
  {
    id: 1,
    funcionario: "Ana Silva",
    peca: "Camisa",
    tamanho: "M",
    quantidade: 2,
    dataEntrega: "2024-06-15",
    entregas: 3
  },
  {
    id: 2,
    funcionario: "João Santos",
    peca: "Calça",
    tamanho: "G",
    quantidade: 1,
    dataEntrega: "2024-06-14",
    entregas: 2
  },
  {
    id: 3,
    funcionario: "Maria Costa",
    peca: "Jaqueta",
    tamanho: "M",
    quantidade: 1,
    dataEntrega: "2024-06-13",
    entregas: 4
  }
];

export function UniformesSubsection({ onBack }: UniformesSubsectionProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-100 rounded-full opacity-20"></div>
      </div>

      <div className="relative z-10 py-6 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
          {/* Header */}
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="navigation-buttons">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onBack}
                  className="back-button"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => navigate("/")}
                  className="home-button"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </div>
            </div>
            <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-12 py-6 rounded-3xl shadow-lg border border-gray-200 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">👕</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Controle de Uniformes</h1>
                <p className="text-lg text-gray-600">Gestão Completa de Distribuição</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Controle total das entregas de uniformes para sua equipe
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              📊 Resumo de Uniformes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                <CardContent className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{resumoUniformes.totalEntregas}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Total de Entregas</div>
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Histórico
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                <CardContent className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 border-2 border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👥</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{resumoUniformes.funcionariosComUniforme}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Funcionários Uniformizados</div>
                  <div className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Ativos
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                <CardContent className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 border-2 border-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👕</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{resumoUniformes.pecasMaisEntregues}</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Peça Mais Entregue</div>
                  <div className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Popular
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                <CardContent className="text-center p-6">
                  <div className="w-16 h-16 bg-orange-100 border-2 border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📅</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">Hoje</div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Última Entrega</div>
                  <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    Recente
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ação Rápida */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              🎯 Nova Entrega de Uniforme
            </h2>
            <div className="text-center">
              <Button 
                onClick={() => setShowModal(true)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">➕</span>
                  <span>Registrar Entrega</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Entregas Recentes */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              📋 Entregas Recentes
            </h2>
            <div className="space-y-4">
              {entregasRecentes.map((entrega) => (
                <Card key={entrega.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-102">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">👕</span>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800 mb-1">{entrega.funcionario}</div>
                          <div className="text-lg text-gray-600 mb-1">
                            {entrega.peca} - Tamanho {entrega.tamanho}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                              Qtd: {entrega.quantidade}
                            </span>
                            <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">
                              {entrega.dataEntrega}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {entrega.entregas}
                        </div>
                        <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                          entrega{entrega.entregas > 1 ? 's' : ''} total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Distribuição por Peças */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">
              📊 Distribuição por Peças
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
              {[
                { peca: "Camisa", icon: "👔", quantidade: 48, cor: "blue" },
                { peca: "Camiseta", icon: "👕", quantidade: 36, cor: "green" },
                { peca: "Calça", icon: "👖", quantidade: 42, cor: "purple" },
                { peca: "Jaqueta", icon: "🧥", quantidade: 18, cor: "orange" },
                { peca: "Sapato", icon: "👞", quantidade: 12, cor: "red" }
              ].map((item) => (
                <Card key={item.peca} className="hover:shadow-xl transition-all duration-300 border-2 hover:scale-105">
                  <CardContent className="text-center p-6">
                    <div className={`w-16 h-16 bg-${item.cor}-100 border-2 border-${item.cor}-200 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-3xl">{item.icon}</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{item.quantidade}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{item.peca}</div>
                    <div className={`text-xs font-semibold text-${item.cor}-600 bg-${item.cor}-50 px-3 py-1 rounded-full`}>
                      Distribuídas
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="text-center">
            <div className="inline-flex items-center gap-6 text-base text-gray-600 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-200 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Sistema de Uniformes Online</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Estoque Atualizado</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Entregas Registradas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UniformeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
