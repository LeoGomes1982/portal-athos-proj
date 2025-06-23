
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bold, 
  Italic, 
  Underline, 
  Upload, 
  Plus, 
  Trash2, 
  Save,
  Copy,
  Type,
  Image as ImageIcon,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'field';
  content: string;
  style: {
    fontSize: number;
    color: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
  };
  position: { x: number; y: number };
  size?: { width: number; height: number };
  fieldType?: string;
  fieldKey?: string;
}

interface Template {
  id: string;
  name: string;
  elements: TemplateElement[];
}

interface TemplateEditorProps {
  tipo: 'proposta' | 'contrato';
}

export default function TemplateEditor({ tipo }: TemplateEditorProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: `Template Padrão - ${tipo === 'proposta' ? 'Proposta' : 'Contrato'}`,
      elements: []
    }
  ]);
  
  const [activeTemplateId, setActiveTemplateId] = useState('1');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  // Campos dinâmicos disponíveis
  const camposDinamicos = {
    empresa: [
      { key: 'nome', label: 'Nome da Empresa' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'email', label: 'E-mail' },
      { key: 'telefone', label: 'Telefone' },
      { key: 'endereco', label: 'Endereço' },
      { key: 'cidade', label: 'Cidade' },
      { key: 'estado', label: 'Estado' },
      { key: 'cep', label: 'CEP' }
    ],
    cliente: [
      { key: 'nome', label: 'Nome do Cliente' },
      { key: 'email', label: 'E-mail do Cliente' },
      { key: 'telefone', label: 'Telefone do Cliente' },
      { key: 'endereco', label: 'Endereço do Cliente' },
      { key: 'cidade', label: 'Cidade do Cliente' },
      { key: 'estado', label: 'Estado do Cliente' },
      { key: 'cep', label: 'CEP do Cliente' }
    ],
    proposta: [
      { key: 'numero', label: 'Número da Proposta' },
      { key: 'data', label: 'Data da Proposta' },
      { key: 'valor_total', label: 'Valor Total' },
      { key: 'servicos', label: 'Lista de Serviços' },
      { key: 'prazo', label: 'Prazo de Entrega' }
    ]
  };

  const addElement = (type: 'text' | 'image' | 'field') => {
    if (!activeTemplate) return;

    const newElement: TemplateElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Novo texto' : '',
      style: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none'
      },
      position: { x: 50, y: 50 }
    };

    if (type === 'image') {
      newElement.size = { width: 200, height: 150 };
    }

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, elements: [...template.elements, newElement] }
        : template
    );
    
    setTemplates(updatedTemplates);
    setSelectedElement(newElement.id);
  };

  const updateElement = (elementId: string, updates: Partial<TemplateElement>) => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? {
            ...template,
            elements: template.elements.map(element =>
              element.id === elementId ? { ...element, ...updates } : element
            )
          }
        : template
    );
    
    setTemplates(updatedTemplates);
  };

  const deleteElement = (elementId: string) => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? {
            ...template,
            elements: template.elements.filter(element => element.id !== elementId)
          }
        : template
    );
    
    setTemplates(updatedTemplates);
    setSelectedElement(null);
  };

  const handleImageUpload = (elementId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateElement(elementId, { content: result });
    };
    reader.readAsDataURL(file);
  };

  const createNewTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      elements: []
    };

    setTemplates([...templates, newTemplate]);
    setActiveTemplateId(newTemplate.id);
    setNewTemplateName('');
    setShowNewTemplateForm(false);
    
    toast({
      title: "Sucesso",
      description: "Novo template criado!",
    });
  };

  const duplicateTemplate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (!templateToDuplicate) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: `${templateToDuplicate.name} (Cópia)`,
      elements: templateToDuplicate.elements.map(element => ({
        ...element,
        id: `${element.id}_copy_${Date.now()}`
      }))
    };

    setTemplates([...templates, newTemplate]);
    toast({
      title: "Sucesso",
      description: "Template duplicado!",
    });
  };

  const deleteTemplate = (templateId: string) => {
    if (templates.length <= 1) {
      toast({
        title: "Erro",
        description: "Deve existir pelo menos um template.",
        variant: "destructive",
      });
      return;
    }

    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    
    if (activeTemplateId === templateId) {
      setActiveTemplateId(updatedTemplates[0].id);
    }

    toast({
      title: "Sucesso",
      description: "Template removido!",
    });
  };

  const saveTemplates = () => {
    // Aqui salvaria os templates no backend
    console.log('Templates salvos:', templates);
    toast({
      title: "Sucesso",
      description: "Templates salvos com sucesso!",
    });
  };

  const selectedElementData = activeTemplate?.elements.find(e => e.id === selectedElement);

  return (
    <div className="space-y-6">
      {/* Gerenciamento de Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Templates de {tipo === 'proposta' ? 'Proposta' : 'Contrato'}</span>
            <div className="flex gap-2">
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
                onClick={saveTemplates}
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
              <Button onClick={createNewTemplate} size="sm">
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
                onClick={() => setActiveTemplateId(template.id)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{template.name}</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateTemplate(template.id);
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
                          deleteTemplate(template.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {template.elements.length} elementos
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor do Template Ativo */}
      {activeTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ferramentas */}
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar Elementos</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => addElement('text')}
                    className="justify-start"
                  >
                    <Type size={16} className="mr-2" />
                    Texto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addElement('image')}
                    className="justify-start"
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Imagem
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addElement('field')}
                    className="justify-start"
                  >
                    <Database size={16} className="mr-2" />
                    Campo Dinâmico
                  </Button>
                </div>
              </div>

              {/* Propriedades do Elemento Selecionado */}
              {selectedElementData && (
                <div className="space-y-4 border-t pt-4">
                  <Label>Propriedades do Elemento</Label>
                  
                  {selectedElementData.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Texto</Label>
                        <Input
                          value={selectedElementData.content}
                          onChange={(e) => updateElement(selectedElement!, { content: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Tamanho</Label>
                          <Input
                            type="number"
                            value={selectedElementData.style.fontSize}
                            onChange={(e) => updateElement(selectedElement!, { 
                              style: { ...selectedElementData.style, fontSize: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Cor</Label>
                          <Input
                            type="color"
                            value={selectedElementData.style.color}
                            onChange={(e) => updateElement(selectedElement!, { 
                              style: { ...selectedElementData.style, color: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedElementData.style.fontWeight === 'bold' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElement(selectedElement!, { 
                            style: { 
                              ...selectedElementData.style, 
                              fontWeight: selectedElementData.style.fontWeight === 'bold' ? 'normal' : 'bold'
                            }
                          })}
                        >
                          <Bold size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.fontStyle === 'italic' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElement(selectedElement!, { 
                            style: { 
                              ...selectedElementData.style, 
                              fontStyle: selectedElementData.style.fontStyle === 'italic' ? 'normal' : 'italic'
                            }
                          })}
                        >
                          <Italic size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.textDecoration === 'underline' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElement(selectedElement!, { 
                            style: { 
                              ...selectedElementData.style, 
                              textDecoration: selectedElementData.style.textDecoration === 'underline' ? 'none' : 'underline'
                            }
                          })}
                        >
                          <Underline size={16} />
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedElementData.type === 'image' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Imagem</Label>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full"
                        >
                          <Upload size={16} className="mr-2" />
                          Carregar Imagem
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(selectedElement!, file);
                          }}
                        />
                      </div>
                      
                      {selectedElementData.size && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Largura</Label>
                            <Input
                              type="number"
                              value={selectedElementData.size.width}
                              onChange={(e) => updateElement(selectedElement!, { 
                                size: { ...selectedElementData.size!, width: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div>
                            <Label>Altura</Label>
                            <Input
                              type="number"
                              value={selectedElementData.size.height}
                              onChange={(e) => updateElement(selectedElement!, { 
                                size: { ...selectedElementData.size!, height: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedElementData.type === 'field' && (
                    <div className="space-y-3">
                      <div>
                        <Label>Tipo de Campo</Label>
                        <Select
                          value={selectedElementData.fieldType}
                          onValueChange={(value) => updateElement(selectedElement!, { fieldType: value, fieldKey: '' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empresa">Dados da Empresa</SelectItem>
                            <SelectItem value="cliente">Dados do Cliente</SelectItem>
                            <SelectItem value="proposta">Dados da Proposta/Contrato</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedElementData.fieldType && (
                        <div>
                          <Label>Campo</Label>
                          <Select
                            value={selectedElementData.fieldKey}
                            onValueChange={(value) => {
                              const campo = camposDinamicos[selectedElementData.fieldType as keyof typeof camposDinamicos]
                                .find(c => c.key === value);
                              updateElement(selectedElement!, { 
                                fieldKey: value,
                                content: `{{${selectedElementData.fieldType}.${value}}}`
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o campo" />
                            </SelectTrigger>
                            <SelectContent>
                              {camposDinamicos[selectedElementData.fieldType as keyof typeof camposDinamicos]
                                ?.map((campo) => (
                                <SelectItem key={campo.key} value={campo.key}>
                                  {campo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteElement(selectedElement!)}
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remover Elemento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Canvas de Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Preview: {activeTemplate.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="relative bg-white border-2 border-gray-200 min-h-[600px] overflow-hidden"
                  style={{ aspectRatio: '210/297' }} // A4 ratio
                >
                  {activeTemplate.elements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move border-2 ${
                        selectedElement === element.id 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        width: element.size?.width || 'auto',
                        height: element.size?.height || 'auto'
                      }}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      {element.type === 'text' && (
                        <div
                          style={{
                            fontSize: element.style.fontSize,
                            color: element.style.color,
                            fontWeight: element.style.fontWeight,
                            fontStyle: element.style.fontStyle,
                            textDecoration: element.style.textDecoration,
                            padding: '4px'
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      
                      {element.type === 'image' && element.content && (
                        <img
                          src={element.content}
                          alt="Template"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                      
                      {element.type === 'field' && (
                        <div
                          className="bg-blue-100 border border-blue-300 px-2 py-1 text-sm text-blue-700"
                          style={{
                            fontSize: element.style.fontSize,
                            color: element.style.color
                          }}
                        >
                          {element.content || `Campo dinâmico: ${element.fieldType}.${element.fieldKey}`}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {activeTemplate.elements.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Database size={48} className="mx-auto mb-4" />
                        <p>Adicione elementos ao seu template</p>
                        <p className="text-sm">Use as ferramentas ao lado para começar</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
