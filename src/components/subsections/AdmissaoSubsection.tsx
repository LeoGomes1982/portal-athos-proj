
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdmissaoModal } from "../modals/AdmissaoModal";
import { ChevronLeft } from "lucide-react";

interface AdmissaoSubsectionProps {
  onBack: () => void;
}

export function AdmissaoSubsection({ onBack }: AdmissaoSubsectionProps) {
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
        <h1 className="text-3xl font-bold text-blue-600">👋 Admissão de Colaboradores</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Resumo de Admissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Este mês</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Esta semana</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-sm text-gray-600">Total ano</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">🎯 Ação Rápida</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setShowModal(true)}
              className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">➕</span>
                <span>Nova Admissão</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📋 Admissões Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { nome: "Ana Silva", cargo: "Analista", data: "2024-06-15", status: "Concluída" },
              { nome: "João Santos", cargo: "Desenvolvedor", data: "2024-06-14", status: "Pendente" },
              { nome: "Maria Costa", cargo: "Gerente", data: "2024-06-13", status: "Concluída" }
            ].map((admissao, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">{admissao.nome}</div>
                    <div className="text-sm text-gray-600">{admissao.cargo}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{admissao.data}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    admissao.status === 'Concluída' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {admissao.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AdmissaoModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
