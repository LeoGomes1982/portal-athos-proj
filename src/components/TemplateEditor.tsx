import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Database,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  ZoomIn,
  ZoomOut,
  Edit3,
  RotateCcw,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, Circle, Group, Line } from "fabric";

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
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
  position: { x: number; y: number };
  size?: { width: number; height: number };
  fieldType?: string;
  fieldKey?: string;
  rotation?: number;
}

interface Template {
  id: string;
  name: string;
  elements: TemplateElement[];
  orientation: 'portrait' | 'landscape';
  totalPages: number;
}

interface TemplateEditorProps {
  tipo: 'proposta' | 'contrato';
}

export default function TemplateEditor({ tipo }: TemplateEditorProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: `Template Padrão - ${tipo === 'proposta' ? 'Proposta' : 'Contrato'}`,
      elements: [],
      orientation: 'portrait',
      totalPages: 2
    }
  ]);
  
  const [activeTemplateId, setActiveTemplateId] = useState('1');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [editingText, setEditingText] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);
  const [editingTextContent, setEditingTextContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  // Dimensões A4 em pixels (300 DPI para melhor qualidade)
  const A4_DIMENSIONS = {
    portrait: { width: 595, height: 842 },
    landscape: { width: 842, height: 595 }
  };

  const getCurrentDimensions = () => {
    return activeTemplate ? A4_DIMENSIONS[activeTemplate.orientation] : A4_DIMENSIONS.portrait;
  };

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

  // Inicializar Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || !activeTemplate) return;

    const dimensions = getCurrentDimensions();
    const totalHeight = dimensions.height * activeTemplate.totalPages;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: dimensions.width,
      height: totalHeight,
      backgroundColor: "#ffffff",
      selection: true,
    });

    // Adicionar separadores de página
    for (let page = 1; page < activeTemplate.totalPages; page++) {
      const pageBreakY = dimensions.height * page;
      
      // Linha divisória
      const pageBreakLine = new Line([0, pageBreakY, dimensions.width, pageBreakY], {
        stroke: '#ff6b35',
        strokeWidth: 3,
        strokeDashArray: [15, 8],
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      // Texto indicativo da página
      const pageLabel = new FabricText(`PÁGINA ${page + 1}`, {
        left: 20,
        top: pageBreakY + 10,
        fontSize: 14,
        fill: '#ff6b35',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      // Ícone de página
      const pageIcon = new Rect({
        left: dimensions.width - 60,
        top: pageBreakY + 5,
        width: 40,
        height: 30,
        fill: 'transparent',
        stroke: '#ff6b35',
        strokeWidth: 2,
        rx: 4,
        ry: 4,
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      canvas.add(pageBreakLine);
      canvas.add(pageLabel);
      canvas.add(pageIcon);
    }

    // Configurar eventos do canvas
    canvas.on('selection:created', (e) => {
      console.log('Selection created:', e);
      const activeObject = e.selected?.[0];
      if (activeObject && (activeObject as any).elementId) {
        const elementId = (activeObject as any).elementId;
        console.log('Selected element ID:', elementId);
        setSelectedElement(elementId);
        
        // Se é um elemento de texto, preparar para edição
        if ((activeObject as any).elementType === 'text' && activeObject instanceof FabricText) {
          setEditingTextContent(activeObject.text || '');
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      console.log('Selection updated:', e);
      const activeObject = e.selected?.[0];
      if (activeObject && (activeObject as any).elementId) {
        const elementId = (activeObject as any).elementId;
        console.log('Updated selected element ID:', elementId);
        setSelectedElement(elementId);
        
        // Se é um elemento de texto, preparar para edição
        if ((activeObject as any).elementType === 'text' && activeObject instanceof FabricText) {
          setEditingTextContent(activeObject.text || '');
        }
      }
    });

    canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
      setSelectedElement(null);
      setTextEditMode(false);
      setEditingTextContent('');
    });

    // Evento de duplo clique para edição de texto
    canvas.on('mouse:dblclick', (e) => {
      console.log('Double click detected:', e);
      const activeObject = canvas.getActiveObject();
      console.log('Active object on double click:', activeObject);
      
      if (activeObject && (activeObject as any).elementType === 'text') {
        console.log('Starting text edit mode');
        setTextEditMode(true);
        if (activeObject instanceof FabricText) {
          setEditingTextContent(activeObject.text || '');
        }
      }
    });

    // Drag and drop para imagens
    canvas.on('drop', (e) => {
      const event = e.e as DragEvent;
      event.preventDefault();
      
      const files = event.dataTransfer?.files;
      if (files && files[0] && files[0].type.startsWith('image/')) {
        handleImageUpload(files[0], event.offsetX || 100, event.offsetY || 100);
      }
    });

    canvas.on('dragover', (e) => {
      e.e.preventDefault();
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [activeTemplate?.orientation, activeTemplate?.totalPages]);

  const changeOrientation = (orientation: 'portrait' | 'landscape') => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, orientation }
        : template
    );
    
    setTemplates(updatedTemplates);
    setCurrentPage(1);
    
    toast({
      title: "Orientação alterada",
      description: `Template alterado para ${orientation === 'portrait' ? 'retrato' : 'paisagem'}`,
    });
  };

  const addPage = () => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: template.totalPages + 1 }
        : template
    );
    
    setTemplates(updatedTemplates);
    
    toast({
      title: "Página adicionada",
      description: `Template agora tem ${activeTemplate.totalPages + 1} páginas`,
    });
  };

  const removePage = () => {
    if (!activeTemplate || activeTemplate.totalPages <= 1) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: Math.max(1, template.totalPages - 1) }
        : template
    );
    
    setTemplates(updatedTemplates);
    setCurrentPage(Math.min(currentPage, activeTemplate.totalPages - 1));
    
    toast({
      title: "Página removida",
      description: `Template agora tem ${Math.max(1, activeTemplate.totalPages - 1)} páginas`,
    });
  };

  const scrollToPage = (pageNumber: number) => {
    if (!fabricCanvas || !activeTemplate) return;

    const dimensions = getCurrentDimensions();
    const targetY = dimensions.height * (pageNumber - 1);
    
    // Scroll suave para a página
    const canvasContainer = canvasRef.current?.parentElement;
    if (canvasContainer) {
      canvasContainer.scrollTo({
        top: targetY * canvasZoom,
        behavior: 'smooth'
      });
    }
    
    setCurrentPage(pageNumber);
  };

  const addTextElement = () => {
    if (!fabricCanvas) return;

    const elementId = Date.now().toString();
    
    const text = new FabricText('Clique duas vezes para editar', {
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
      fontSize: 16,
      fill: '#000000',
      fontFamily: 'Arial',
      editable: false,
    });

    // Adicionar metadata customizada
    (text as any).elementId = elementId;
    (text as any).elementType = 'text';

    console.log('Adding text element with ID:', elementId);

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();

    const newElement: TemplateElement = {
      id: elementId,
      type: 'text',
      content: 'Clique duas vezes para editar',
      style: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left'
      },
      position: { x: 100, y: 100 + (getCurrentDimensions().height * (currentPage - 1)) }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);

    toast({
      title: "Sucesso",
      description: "Elemento de texto adicionado! Duplo clique para editar.",
    });
  };

  const updateTextContent = () => {
    if (!fabricCanvas || !selectedElement || !textEditMode) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject instanceof FabricText) {
      activeObject.set('text', editingTextContent);
      fabricCanvas.renderAll();
      
      // Atualizar no estado
      updateElement(selectedElement, { content: editingTextContent });
      
      setTextEditMode(false);
      
      toast({
        title: "Sucesso",
        description: "Texto atualizado!",
      });
    }
  };

  const cancelTextEdit = () => {
    setTextEditMode(false);
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && activeObject instanceof FabricText) {
      setEditingTextContent(activeObject.text || '');
    }
  };

  const startTextEdit = () => {
    if (!selectedElement || !fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && (activeObject as any).elementType === 'text') {
      console.log('Starting text edit mode via button');
      setTextEditMode(true);
      if (activeObject instanceof FabricText) {
        setEditingTextContent(activeObject.text || '');
      }
    }
  };

  const addImagePlaceholder = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
      width: 200,
      height: 150,
      fill: '#f0f0f0',
      stroke: '#ccc',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });

    const text = new FabricText('Clique para\nadicionar imagem', {
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
      fontSize: 14,
      fill: '#666',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    const elementId = Date.now().toString();
    (rect as any).customData = { id: elementId, type: 'image' };
    (text as any).customData = { id: elementId, type: 'image' };

    const group = new Group([rect, text], {
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
    });

    (group as any).customData = { id: elementId, type: 'image' };

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();

    const newElement: TemplateElement = {
      id: elementId,
      type: 'image',
      content: '',
      style: {
        fontSize: 14,
        color: '#666666',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'center'
      },
      position: { x: 100, y: 100 + (getCurrentDimensions().height * (currentPage - 1)) },
      size: { width: 200, height: 150 }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);
  };

  const addFieldElement = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
      width: 200,
      height: 30,
      fill: '#e3f2fd',
      stroke: '#2196f3',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
    });

    const text = new FabricText('{{campo.dinamico}}', {
      left: 110,
      top: 110 + (getCurrentDimensions().height * (currentPage - 1)),
      fontSize: 14,
      fill: '#1976d2',
      fontFamily: 'monospace',
    });

    const elementId = Date.now().toString();
    const group = new Group([rect, text], {
      left: 100,
      top: 100 + (getCurrentDimensions().height * (currentPage - 1)),
    });

    (group as any).customData = { id: elementId, type: 'field' };

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();

    const newElement: TemplateElement = {
      id: elementId,
      type: 'field',
      content: '{{campo.dinamico}}',
      style: {
        fontSize: 14,
        color: '#1976d2',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left'
      },
      position: { x: 100, y: 100 + (getCurrentDimensions().height * (currentPage - 1)) }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);
  };

  const handleImageUpload = (file: File, x = 100, y = 100) => {
    if (!fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      FabricImage.fromURL(result).then((img) => {
        img.set({
          left: x,
          top: y + (getCurrentDimensions().height * (currentPage - 1)),
          scaleX: 0.5,
          scaleY: 0.5,
        });

        const elementId = Date.now().toString();
        (img as any).customData = { id: elementId, type: 'image' };

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();

        const newElement: TemplateElement = {
          id: elementId,
          type: 'image',
          content: result,
          style: {
            fontSize: 14,
            color: '#000000',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            textAlign: 'left'
          },
          position: { x, y: y + (getCurrentDimensions().height * (currentPage - 1)) },
          size: { width: img.width! * 0.5, height: img.height! * 0.5 }
        };

        updateTemplateElements(newElement);
        setSelectedElement(elementId);
      });
    };
    reader.readAsDataURL(file);
  };

  const updateTemplateElements = (newElement: TemplateElement) => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, elements: [...template.elements, newElement] }
        : template
    );
    
    setTemplates(updatedTemplates);
  };

  const updateElement = (elementId: string, updates: Partial<TemplateElement>) => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? {
            ...template,
            elements: template.elements.map(element =>
              element.id === elementId 
                ? { ...element, ...updates }
                : element
            )
          }
        : template
    );
    
    setTemplates(updatedTemplates);
  };

  const updateElementStyle = (elementId: string, styleUpdates: Partial<TemplateElement['style']>) => {
    if (!activeTemplate || !fabricCanvas) return;

    // Atualizar no estado
    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? {
            ...template,
            elements: template.elements.map(element =>
              element.id === elementId 
                ? { ...element, style: { ...element.style, ...styleUpdates } }
                : element
            )
          }
        : template
    );
    
    setTemplates(updatedTemplates);

    // Atualizar no canvas
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && (activeObject as any).customData?.id === elementId) {
      if (activeObject instanceof FabricText) {
        if (styleUpdates.fontSize) activeObject.set('fontSize', styleUpdates.fontSize);
        if (styleUpdates.color) activeObject.set('fill', styleUpdates.color);
        if (styleUpdates.fontWeight) activeObject.set('fontWeight', styleUpdates.fontWeight);
        if (styleUpdates.fontStyle) activeObject.set('fontStyle', styleUpdates.fontStyle);
        if (styleUpdates.textAlign) activeObject.set('textAlign', styleUpdates.textAlign);
        if (styleUpdates.backgroundColor) activeObject.set('backgroundColor', styleUpdates.backgroundColor);
      }
      fabricCanvas.renderAll();
    }
  };

  const deleteSelectedElement = () => {
    if (!fabricCanvas || !selectedElement) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      fabricCanvas.renderAll();
    }

    // Remove do estado
    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? {
            ...template,
            elements: template.elements.filter(element => element.id !== selectedElement)
          }
        : template
    );
    
    setTemplates(updatedTemplates);
    setSelectedElement(null);
  };

  const zoomCanvas = (factor: number) => {
    if (!fabricCanvas) return;
    
    const newZoom = Math.max(0.1, Math.min(3, canvasZoom * factor));
    setCanvasZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const createNewTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      elements: [],
      orientation: 'portrait',
      totalPages: 1
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
      })),
      orientation: templateToDuplicate.orientation,
      totalPages: templateToDuplicate.totalPages
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

  console.log('Selected element:', selectedElement);
  console.log('Selected element data:', selectedElementData);
  console.log('Text edit mode:', textEditMode);

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
                  {template.elements.length} elementos • {template.totalPages} página(s) • {template.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor do Template Ativo */}
      {activeTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Ferramentas Expandidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Configurações de Página */}
              <div className="space-y-3 border-b pb-4">
                <Label className="text-orange-800 font-semibold">Configurações da Página</Label>
                
                <div>
                  <Label>Orientação</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={activeTemplate.orientation === 'portrait' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeOrientation('portrait')}
                      className="flex-1"
                    >
                      <FileText size={16} className="mr-1" />
                      Retrato
                    </Button>
                    <Button
                      variant={activeTemplate.orientation === 'landscape' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => changeOrientation('landscape')}
                      className="flex-1"
                    >
                      <RotateCcw size={16} className="mr-1" />
                      Paisagem
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Páginas ({activeTemplate.totalPages})</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPage}
                      className="flex-1"
                    >
                      <Plus size={16} className="mr-1" />
                      Adicionar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removePage}
                      disabled={activeTemplate.totalPages <= 1}
                      className="flex-1"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>

                {/* Navegação de Páginas */}
                {activeTemplate.totalPages > 1 && (
                  <div>
                    <Label>Ir para Página</Label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {Array.from({ length: activeTemplate.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => scrollToPage(pageNum)}
                          className="text-xs"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Adicionar Elementos</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    onClick={addTextElement}
                    className="justify-start"
                  >
                    <Type size={16} className="mr-2" />
                    Texto Rico
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addImagePlaceholder}
                    className="justify-start"
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Imagem
                  </Button>
                  <Button
                    variant="outline"
                    onClick={addFieldElement}
                    className="justify-start"
                  >
                    <Database size={16} className="mr-2" />
                    Campo Dinâmico
                  </Button>
                </div>
              </div>

              {/* Editor de Texto Inline */}
              {textEditMode && selectedElementData?.type === 'text' && (
                <div className="space-y-3 border-2 border-orange-500 bg-orange-50 p-4 rounded-lg">
                  <Label className="text-orange-800 font-semibold flex items-center gap-2">
                    <Edit3 size={16} />
                    Editando Texto
                  </Label>
                  <Textarea
                    value={editingTextContent}
                    onChange={(e) => setEditingTextContent(e.target.value)}
                    placeholder="Digite o texto aqui..."
                    className="min-h-[100px] resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={updateTextContent}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelTextEdit}
                    >
                      Cancelar
                    </Button>
                  </div>
                  <p className="text-xs text-orange-700">
                    💡 Dica: Use Shift+Enter para quebras de linha
                  </p>
                </div>
              )}

              {/* Controles de Canvas */}
              <div className="space-y-2 border-t pt-4">
                <Label>Controles do Canvas</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => zoomCanvas(1.2)}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => zoomCanvas(0.8)}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCanvasZoom(1);
                      fabricCanvas?.setZoom(1);
                      fabricCanvas?.renderAll();
                    }}
                  >
                    100%
                  </Button>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2 border-t pt-4">
                <Label>Upload de Imagem</Label>
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
                    if (file) handleImageUpload(file);
                  }}
                />
                <p className="text-xs text-gray-500">
                  Ou arraste e solte uma imagem no canvas
                </p>
              </div>

              {/* Propriedades do Elemento Selecionado */}
              {selectedElementData && !textEditMode && (
                <div className="space-y-4 border-t pt-4">
                  <Label>Propriedades do Elemento</Label>
                  
                  {selectedElementData.type === 'text' && (
                    <div className="space-y-3">
                      <Button
                        variant="default"
                        onClick={startTextEdit}
                        className="w-full justify-start bg-orange-500 hover:bg-orange-600"
                      >
                        <Edit3 size={16} className="mr-2" />
                        Editar Texto
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Tamanho</Label>
                          <Input
                            type="number"
                            min="8"
                            max="72"
                            value={selectedElementData.style.fontSize}
                            onChange={(e) => updateElementStyle(selectedElement!, { 
                              fontSize: Number(e.target.value) 
                            })}
                          />
                        </div>
                        <div>
                          <Label>Cor</Label>
                          <Input
                            type="color"
                            value={selectedElementData.style.color}
                            onChange={(e) => updateElementStyle(selectedElement!, { 
                              color: e.target.value 
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Cor de Fundo</Label>
                        <Input
                          type="color"
                          value={selectedElementData.style.backgroundColor || '#ffffff'}
                          onChange={(e) => updateElementStyle(selectedElement!, { 
                            backgroundColor: e.target.value 
                          })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedElementData.style.fontWeight === 'bold' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { 
                            fontWeight: selectedElementData.style.fontWeight === 'bold' ? 'normal' : 'bold'
                          })}
                        >
                          <Bold size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.fontStyle === 'italic' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { 
                            fontStyle: selectedElementData.style.fontStyle === 'italic' ? 'normal' : 'italic'
                          })}
                        >
                          <Italic size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.textDecoration === 'underline' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { 
                            textDecoration: selectedElementData.style.textDecoration === 'underline' ? 'none' : 'underline'
                          })}
                        >
                          <Underline size={16} />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={selectedElementData.style.textAlign === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { textAlign: 'left' })}
                        >
                          <AlignLeft size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.textAlign === 'center' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { textAlign: 'center' })}
                        >
                          <AlignCenter size={16} />
                        </Button>
                        <Button
                          variant={selectedElementData.style.textAlign === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateElementStyle(selectedElement!, { textAlign: 'right' })}
                        >
                          <AlignRight size={16} />
                        </Button>
                      </div>
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
                    onClick={deleteSelectedElement}
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remover Elemento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Canvas Fabric.js */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Editor: {activeTemplate.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Página {currentPage} de {activeTemplate.totalPages}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Move size={16} />
                      Duplo clique no texto para editar • Arraste para mover
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-gray-200 rounded-lg overflow-auto bg-white shadow-inner"
                  style={{ maxHeight: '800px' }}
                >
                  <canvas 
                    ref={canvasRef}
                    className="block mx-auto"
                  />
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Zoom: {Math.round(canvasZoom * 100)}%</span>
                    <span>Formato A4: {getCurrentDimensions().width}x{getCurrentDimensions().height}px</span>
                    <span className="text-orange-600">
                      {activeTemplate.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
                    </span>
                  </div>
                  <span>Linhas laranjas separam as páginas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
