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
      <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Users size={20} className="text-primary" />
            Total Ativos
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-primary mb-2">{funcionariosAtivos}</div>
          <p className="text-primary/80">funcionários</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <span className="text-primary text-lg">🏖️</span>
            Em Férias
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-primary mb-2">{funcionariosFerias}</div>
          <p className="text-primary/80">funcionários</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 relative">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <span className="text-orange-700 text-lg">⏳</span>
            Experiência
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          {alertasExperiencia > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          )}
          <div className="text-4xl font-bold text-orange-700 mb-2">{funcionariosExperiencia}</div>
          <p className="text-orange-700/80">funcionários</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-red-100 to-red-200 border-red-300 relative">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <span className="text-red-700 text-lg">⚠️</span>
            Aviso Prévio
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          {alertasAvisoPrevio > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
          )}
          <div className="text-4xl font-bold text-red-700 mb-2">{funcionariosAviso}</div>
          <p className="text-red-700/80">funcionários</p>
        </CardContent>
      </Card>

      <Card className="modern-card bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 shadow-yellow-200/50">
        <CardHeader className="card-header">
          <CardTitle className="section-title flex items-center gap-2 mb-0">
            <Star size={20} className="text-yellow-700 fill-yellow-600" />
            Destaque
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="text-4xl font-bold text-yellow-700 mb-2">{funcionariosDestaque}</div>
          <p className="text-yellow-700/80">funcionários</p>
        </CardContent>
      </Card>
    </div>
  );
}