
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { UniformeModal } from "../modals/UniformeModal";

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
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-blue-600">👕 Controle de Uniformes</h1>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-blue-600">{resumoUniformes.totalEntregas}</div>
            <div className="text-sm text-gray-600">Total de Entregas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-green-600">{resumoUniformes.funcionariosComUniforme}</div>
            <div className="text-sm text-gray-600">Funcionários Uniformizados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">👕</div>
            <div className="text-2xl font-bold text-purple-600">{resumoUniformes.pecasMaisEntregues}</div>
            <div className="text-sm text-gray-600">Peça Mais Entregue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-lg font-bold text-orange-600">Hoje</div>
            <div className="text-sm text-gray-600">Última Entrega</div>
          </CardContent>
        </Card>
      </div>

      {/* Ação Rápida */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🎯 Nova Entrega de Uniforme</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto h-16 text-lg bg-blue-600 hover:bg-blue-700 px-8"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">➕</span>
              <span>Registrar Entrega</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Entregas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Entregas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entregasRecentes.map((entrega) => (
              <div key={entrega.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    👕
                  </div>
                  <div>
                    <div className="font-medium">{entrega.funcionario}</div>
                    <div className="text-sm text-gray-600">
                      {entrega.peca} - Tamanho {entrega.tamanho}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qtd: {entrega.quantidade} | {entrega.dataEntrega}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    {entrega.entregas} entrega{entrega.entregas > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Peças */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Distribuição por Peças</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { peca: "Camisa", icon: "👔", quantidade: 48, cor: "bg-blue-100 text-blue-700" },
              { peca: "Camiseta", icon: "👕", quantidade: 36, cor: "bg-green-100 text-green-700" },
              { peca: "Calça", icon: "👖", quantidade: 42, cor: "bg-purple-100 text-purple-700" },
              { peca: "Jaqueta", icon: "🧥", quantidade: 18, cor: "bg-orange-100 text-orange-700" },
              { peca: "Sapato", icon: "👞", quantidade: 12, cor: "bg-red-100 text-red-700" }
            ].map((item) => (
              <div key={item.peca} className={`text-center p-4 rounded-lg ${item.cor}`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xl font-bold">{item.quantidade}</div>
                <div className="text-sm">{item.peca}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UniformeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
