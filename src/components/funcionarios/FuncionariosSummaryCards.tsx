import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star } from "lucide-react";
import { Funcionario } from "@/types/funcionario";

interface FuncionariosSummaryCardsProps {
  funcionarios: Funcionario[];
  alertasExperiencia: number;
  alertasAvisoPrevio: number;
}

export function FuncionariosSummaryCards({ 
  funcionarios, 
  alertasExperiencia, 
  alertasAvisoPrevio 
}: FuncionariosSummaryCardsProps) {
  const funcionariosAtivos = funcionarios.length;
  const funcionariosFerias = funcionarios.filter(f => f.status === 'ferias').length;
  const funcionariosExperiencia = funcionarios.filter(f => f.status === 'experiencia').length;
  const funcionariosAviso = funcionarios.filter(f => f.status === 'aviso').length;
  const funcionariosDestaque = funcionarios.filter(f => f.status === 'destaque').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 animate-slide-up">
      <Card className="modern-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-green-600">
            {funcionariosAtivos}
          </div>
          <div className="text-sm text-green-600/80">Total Ativos</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">🏖️</div>
          <div className="text-2xl font-bold text-purple-600">
            {funcionariosFerias}
          </div>
          <div className="text-sm text-purple-600/80">Em Férias</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 relative">
        <CardContent className="card-content text-center p-4">
          {alertasExperiencia > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          )}
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-orange-600">
            {funcionariosExperiencia}
          </div>
          <div className="text-sm text-orange-600/80">Experiência</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-red-50 to-red-100 border-red-200 relative">
        <CardContent className="card-content text-center p-4">
          {alertasAvisoPrevio > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          )}
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-red-600">
            {funcionariosAviso}
          </div>
          <div className="text-sm text-red-600/80">Aviso Prévio</div>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="card-content text-center p-4">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-yellow-600">
            {funcionariosDestaque}
          </div>
          <div className="text-sm text-yellow-600/80">Destaque</div>
        </CardContent>
      </Card>
    </div>
  );
}