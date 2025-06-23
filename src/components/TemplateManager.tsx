
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, Copy, Trash2, Settings } from "lucide-react";
import { Template } from "@/types/template";
import { templateStorage } from "@/services/templateStorage";
import { useToast } from "@/hooks/use-toast";
import DynamicFieldsModal from "@/components/modals/DynamicFieldsModal";

interface TemplateManagerProps {
  templates: Template[];
  activeTemplateId: string;
  onTemplateSelect: (id: string) => void;
  onSaveAll: () => void;
  tipo: 'proposta' | 'contrato';
}

export default function TemplateManager({
  templates,
  activeTemplateId,
  onTemplateSelect,
  onSaveAll,
  tipo
}: TemplateManagerProps) {
  const { toast } = useToast();
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showDynamicFields, setShowDynamicFields] = useState(false);

  const handleCreateTemplate = () => {
    // Implementation would go here
    setShowNewTemplateForm(false);
    setNewTemplateName('');
  };

  const handleSaveAll = () => {
    try {
      templateStorage.saveAll(templates, tipo);
      toast({
        title: "Templates salvos com sucesso!",
        description: `Todos os templates de ${tipo} foram salvos.`,
      });
      onSaveAll();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os templates.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Templates de {tipo === 'proposta' ? 'Proposta' : 'Contrato'}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDynamicFields(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Settings size={16} />
                Campos Dinâmicos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTemplateForm(true)}
              >
                <Plus size={16} />
                Novo Template
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAll}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Save size={16} />
                Salvar Todos
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showNewTemplateForm && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nome do novo template"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
              <Button onClick={handleCreateTemplate} size="sm">
                Criar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowNewTemplateForm(false);
                  setNewTemplateName('');
                }}
              >
                Cancelar
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  activeTemplateId === template.id 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{template.name}</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // duplicateTemplate(template.id);
                      }}
                    >
                      <Copy size={14} />
                    </Button>
                    {templates.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // deleteTemplate(template.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {template.elements.length} elementos • {template.totalPages} página(s) • {template.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DynamicFieldsModal
        isOpen={showDynamicFields}
        onClose={() => setShowDynamicFields(false)}
      />
    </>
  );
}
