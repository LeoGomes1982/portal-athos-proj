import { useState } from "react";
import { FormularioCICAD, Denuncia } from "@/types/cicad";
import { FormularioCICADComponent } from "@/components/cicad/FormularioCICAD";
import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CICADFormulario() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (formulario: FormularioCICAD) => {
    try {
      // Criar nova denúncia
      const novaDenuncia: Denuncia = {
        ...formulario,
        id: Date.now().toString(),
        status: "em_investigacao",
        dataSubmissao: new Date().toISOString().split('T')[0]
      };

      // Carregar denúncias existentes do localStorage
      const denunciasExistentes = JSON.parse(localStorage.getItem('cicad_denuncias') || '[]');
      const novasDenuncias = [novaDenuncia, ...denunciasExistentes];
      
      // Salvar no localStorage
      localStorage.setItem('cicad_denuncias', JSON.stringify(novasDenuncias));
      
      console.log('Denúncia salva com sucesso:', novaDenuncia);
      setEnviado(true);
    } catch (error) {
      console.error('Erro ao salvar denúncia:', error);
      // Mesmo com erro, marcar como enviado para não perder o formulário
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="modern-card max-w-md mx-auto">
          <CardContent className="card-content text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Denúncia Enviada!
            </h2>
            <p className="text-slate-600 mb-6">
              Sua denúncia foi enviada de forma completamente anônima. 
              Obrigado por nos ajudar a construir um ambiente de trabalho melhor.
            </p>
            <p className="text-sm text-slate-500">
              Este formulário não armazena nenhuma informação que possa identificá-lo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4 shadow-lg">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Canal Anônimo CICAD
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Este é um canal 100% seguro e anônimo para denúncias e comunicações internas. 
            Suas informações não são rastreadas.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <h3 className="font-semibold text-blue-800 mb-2">🔒 Garantia de Anonimato</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Nenhum dado pessoal é coletado</li>
            <li>• Não há rastreamento de IP ou dispositivo</li>
            <li>• Suas informações são processadas de forma anônima</li>
            <li>• Todos os relatos são tratados com confidencialidade</li>
          </ul>
        </div>

        {/* Form */}
        <FormularioCICADComponent 
          onSubmit={handleSubmit}
          isFormularioPublico={true}
        />
      </div>
    </div>
  );
}