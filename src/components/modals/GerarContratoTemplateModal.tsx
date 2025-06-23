
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { templateStorage, SavedTemplate } from "@/services/templateStorage";
import { useDynamicFields } from "@/hooks/useDynamicFields";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GerarContratoTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoData: {
    cliente: string;
    empresa: string;
    servicos: Array<{ descricao: string; valor: number }>;
    valorTotal: number;
    status: 'ativo';
  };
}

export default function GerarContratoTemplateModal({ 
  isOpen, 
  onClose, 
  contratoData 
}: GerarContratoTemplateModalProps) {
  const { toast } = useToast();
  const { getFieldsByCategory } = useDynamicFields();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  
  const contractTemplates = templateStorage.getByType('contrato');
  const selectedTemplate = contractTemplates.find(t => t.id === selectedTemplateId);
  
  // Campos dinâmicos por categoria
  const clienteFields = getFieldsByCategory('cliente');
  const empresaFields = getFieldsByCategory('empresa');
  
  const handleFieldChange = (fieldKey: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleGenerateContract = () => {
    if (!selectedTemplate) {
      toast({
        title: "Erro",
        description: "Selecione um template para gerar o contrato.",
        variant: "destructive",
      });
      return;
    }

    // Verificar campos obrigatórios
    const requiredFields = [...clienteFields, ...empresaFields].filter(field => field.required);
    const missingFields = requiredFields.filter(field => !fieldValues[field.key]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os campos: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Simular geração do contrato
    const contractData = {
      template: selectedTemplate,
      contrato: contratoData,
      campos: fieldValues,
      dataGeracao: new Date().toISOString()
    };

    console.log('Dados do contrato gerado:', contractData);
    
    // Aqui seria implementada a lógica real de geração do PDF/documento
    toast({
      title: "Contrato gerado!",
      description: `Contrato baseado no template "${selectedTemplate.name}" foi gerado com sucesso.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-orange-600">
            <FileText size={24} />
            Gerar Contrato com Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de Template */}
          <div className="space-y-2">
            <Label htmlFor="template">Template de Contrato *</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {contractTemplates.length === 0 ? (
                  <SelectItem value="" disabled>
                    Nenhum template encontrado
                  </SelectItem>
                ) : (
                  contractTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {contractTemplates.length === 0 && (
              <p className="text-sm text-gray-500">
                Crie templates de contrato em Configurações → Edição de Contratos e Propostas
              </p>
            )}
          </div>

          {selectedTemplate && (
            <>
              {/* Informações do Contrato */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Informações do Contrato</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Cliente:</Label>
                    <p>{contratoData.cliente}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Empresa:</Label>
                    <p>{contratoData.empresa}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Valor Total:</Label>
                    <p className="font-bold text-orange-600">
                      R$ {contratoData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <Label className="font-medium">Serviços:</Label>
                    <p>{contratoData.servicos.length} serviço(s)</p>
                  </div>
                </div>
              </div>

              {/* Campos Dinâmicos do Cliente */}
              {clienteFields.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados do Cliente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {clienteFields.map((field) => (
                      <div key={field.id}>
                        <Label htmlFor={field.key}>
                          {field.label} {field.required && '*'}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type === 'phone' ? 'tel' : field.type}
                          value={fieldValues[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={`Digite ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campos Dinâmicos da Empresa */}
              {empresaFields.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados da Empresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {empresaFields.map((field) => (
                      <div key={field.id}>
                        <Label htmlFor={field.key}>
                          {field.label} {field.required && '*'}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type === 'phone' ? 'tel' : field.type}
                          value={fieldValues[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={`Digite ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateContract}
              disabled={!selectedTemplateId}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              <Download size={16} />
              Gerar Contrato
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
