
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Save, Download, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EdicaoContratosPropostas() {
  const navigate = useNavigate();
  
  // Estados para os templates
  const [templateProposta, setTemplateProposta] = useState({
    cabecalho: "PROPOSTA COMERCIAL",
    empresa: "GA SERVIÇOS E CONSULTORIA LTDA",
    endereco: "Rua Exemplo, 123 - Centro - Cidade/UF - CEP: 00000-000",
    telefone: "(11) 99999-9999",
    email: "contato@gaservicos.com.br",
    rodape: "Atenciosamente,\nEquipe GA Serviços"
  });

  const [templateContrato, setTemplateContrato] = useState({
    cabecalho: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
    empresa: "GA SERVIÇOS E CONSULTORIA LTDA",
    endereco: "Rua Exemplo, 123 - Centro - Cidade/UF - CEP: 00000-000",
    telefone: "(11) 99999-9999",
    email: "contato@gaservicos.com.br",
    rodape: "Este contrato é regido pelas leis brasileiras.\nGA Serviços e Consultoria Ltda"
  });

  const handleSaveTemplate = (tipo: 'proposta' | 'contrato') => {
    // Aqui salvaria os templates no backend
    console.log(`Template ${tipo} salvo com sucesso!`);
    alert(`Template de ${tipo} salvo com sucesso!`);
  };

  const handleExportTemplate = (tipo: 'proposta' | 'contrato') => {
    const template = tipo === 'proposta' ? templateProposta : templateContrato;
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-${tipo}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (tipo: 'proposta' | 'contrato') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const template = JSON.parse(e.target?.result as string);
            if (tipo === 'proposta') {
              setTemplateProposta(template);
            } else {
              setTemplateContrato(template);
            }
            alert(`Template de ${tipo} importado com sucesso!`);
          } catch (error) {
            alert('Erro ao importar template. Verifique se o arquivo é válido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

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
            Configure os templates de contratos e propostas comerciais
          </p>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="propostas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="propostas">Templates de Propostas</TabsTrigger>
              <TabsTrigger value="contratos">Templates de Contratos</TabsTrigger>
            </TabsList>

            <TabsContent value="propostas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Template de Proposta Comercial</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleImportTemplate('proposta')}
                      >
                        <Upload size={16} />
                        Importar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportTemplate('proposta')}
                      >
                        <Download size={16} />
                        Exportar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveTemplate('proposta')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Save size={16} />
                        Salvar
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cabecalho-proposta">Título do Cabeçalho</Label>
                        <Input
                          id="cabecalho-proposta"
                          value={templateProposta.cabecalho}
                          onChange={(e) => setTemplateProposta({...templateProposta, cabecalho: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa-proposta">Nome da Empresa</Label>
                        <Input
                          id="empresa-proposta"
                          value={templateProposta.empresa}
                          onChange={(e) => setTemplateProposta({...templateProposta, empresa: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endereco-proposta">Endereço</Label>
                        <Input
                          id="endereco-proposta"
                          value={templateProposta.endereco}
                          onChange={(e) => setTemplateProposta({...templateProposta, endereco: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="telefone-proposta">Telefone</Label>
                        <Input
                          id="telefone-proposta"
                          value={templateProposta.telefone}
                          onChange={(e) => setTemplateProposta({...templateProposta, telefone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-proposta">E-mail</Label>
                        <Input
                          id="email-proposta"
                          value={templateProposta.email}
                          onChange={(e) => setTemplateProposta({...templateProposta, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rodape-proposta">Rodapé</Label>
                        <Textarea
                          id="rodape-proposta"
                          value={templateProposta.rodape}
                          onChange={(e) => setTemplateProposta({...templateProposta, rodape: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contratos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Template de Contrato</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleImportTemplate('contrato')}
                      >
                        <Upload size={16} />
                        Importar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportTemplate('contrato')}
                      >
                        <Download size={16} />
                        Exportar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveTemplate('contrato')}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Save size={16} />
                        Salvar
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cabecalho-contrato">Título do Cabeçalho</Label>
                        <Input
                          id="cabecalho-contrato"
                          value={templateContrato.cabecalho}
                          onChange={(e) => setTemplateContrato({...templateContrato, cabecalho: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa-contrato">Nome da Empresa</Label>
                        <Input
                          id="empresa-contrato"
                          value={templateContrato.empresa}
                          onChange={(e) => setTemplateContrato({...templateContrato, empresa: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endereco-contrato">Endereço</Label>
                        <Input
                          id="endereco-contrato"
                          value={templateContrato.endereco}
                          onChange={(e) => setTemplateContrato({...templateContrato, endereco: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="telefone-contrato">Telefone</Label>
                        <Input
                          id="telefone-contrato"
                          value={templateContrato.telefone}
                          onChange={(e) => setTemplateContrato({...templateContrato, telefone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-contrato">E-mail</Label>
                        <Input
                          id="email-contrato"
                          value={templateContrato.email}
                          onChange={(e) => setTemplateContrato({...templateContrato, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rodape-contrato">Rodapé</Label>
                        <Textarea
                          id="rodape-contrato"
                          value={templateContrato.rodape}
                          onChange={(e) => setTemplateContrato({...templateContrato, rodape: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
