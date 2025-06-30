
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Calendar, DollarSign, Clock, Award, Target, Brain, CheckCircle } from "lucide-react";

interface Cargo {
  id: number;
  nome: string;
  nivel: "I" | "II" | "III";
  salarioBase: string;
  beneficios: string[];
  habilidadesEspecificas: string[];
  habilidadesEsperadas: string[];
  responsabilidades: string[];
  carencia: number;
  status: "ativo" | "inativo";
  criadoEm: string;
}

interface VisualizarCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargo: Cargo;
  onEdit: () => void;
}

export function VisualizarCargoModal({ isOpen, onClose, cargo, onEdit }: VisualizarCargoModalProps) {
  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case 'I': return 'bg-green-500';
      case 'II': return 'bg-blue-500';
      case 'III': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-purple-800">
                  {cargo.nome}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getNivelColor(cargo.nivel)} text-white`}>
                    Nível {cargo.nivel}
                  </Badge>
                  <Badge className={`${cargo.status === 'ativo' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                    {cargo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Salário Base</p>
                    <p className="text-lg font-bold text-green-800">{cargo.salarioBase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Carência</p>
                    <p className="text-lg font-bold text-blue-800">{cargo.carencia} meses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Criado em</p>
                    <p className="text-lg font-bold text-purple-800">
                      {new Date(cargo.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefícios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cargo.beneficios.map((beneficio, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-800">
                    {beneficio}
                  </Badge>
                ))}
              </div>
              {cargo.beneficios.length === 0 && (
                <p className="text-gray-500 italic">Nenhum benefício cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Habilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Habilidades Específicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cargo.habilidadesEspecificas.map((habilidade, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{habilidade}</span>
                    </div>
                  ))}
                </div>
                {cargo.habilidadesEspecificas.length === 0 && (
                  <p className="text-gray-500 italic">Nenhuma habilidade específica cadastrada</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Habilidades Esperadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cargo.habilidadesEsperadas.map((habilidade, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{habilidade}</span>
                    </div>
                  ))}
                </div>
                {cargo.habilidadesEsperadas.length === 0 && (
                  <p className="text-gray-500 italic">Nenhuma habilidade esperada cadastrada</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Responsabilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
                Responsabilidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cargo.responsabilidades.map((responsabilidade, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                    <span className="text-sm">{responsabilidade}</span>
                  </div>
                ))}
              </div>
              {cargo.responsabilidades.length === 0 && (
                <p className="text-gray-500 italic">Nenhuma responsabilidade cadastrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onEdit} className="bg-purple-600 hover:bg-purple-700">
            <Edit className="w-4 h-4 mr-2" />
            Editar Cargo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
