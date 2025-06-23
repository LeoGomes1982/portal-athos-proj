
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateEditor from "@/components/TemplateEditor";

export default function EdicaoContratosPropostas() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/configuracoes")}
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Edição de Contratos e Propostas
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Configure os templates de contratos e propostas comerciais com editor visual avançado
          </p>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="propostas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="propostas">Templates de Propostas</TabsTrigger>
              <TabsTrigger value="contratos">Templates de Contratos</TabsTrigger>
            </TabsList>

            <TabsContent value="propostas" className="space-y-6 mt-8">
              <TemplateEditor tipo="proposta" />
            </TabsContent>

            <TabsContent value="contratos" className="space-y-6 mt-8">
              <TemplateEditor tipo="contrato" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
