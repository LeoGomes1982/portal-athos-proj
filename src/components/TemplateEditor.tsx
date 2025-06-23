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
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  
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

  // Calcular dimensões proporcionais baseadas na largura disponível
  const calculateCanvasDimensions = () => {
    if (!canvasContainerRef.current) {
      return { width: 800, height: 1131 }; // Fallback A4 proporcional
    }

    const containerWidth = canvasContainerRef.current.clientWidth - 48; // 24px padding em cada lado
    const maxWidth = Math.min(containerWidth, 1200); // Máximo de 1200px
    
    let width, height;
    
    if (activeTemplate?.orientation === 'landscape') {
      // A4 paisagem: proporção 1.414:1 (842:595)
      width = maxWidth;
      height = Math.round(maxWidth / 1.414);
    } else {
      // A4 retrato: proporção 1:1.414 (595:842)
      width = maxWidth;
      height = Math.round(maxWidth * 1.414);
    }
    
    return { width, height };
  };

  // Atualizar dimensões do canvas quando a janela redimensiona
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = calculateCanvasDimensions();
      setCanvasWidth(newDimensions.width);
      
      if (fabricCanvas) {
        fabricCanvas.setDimensions({
          width: newDimensions.width,
          height: newDimensions.height * (activeTemplate?.totalPages || 1)
        });
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Executar imediatamente

    return () => window.removeEventListener('resize', handleResize);
  }, [fabricCanvas, activeTemplate?.orientation, activeTemplate?.totalPages]);

  // Inicializar Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || !activeTemplate) return;

    const dimensions = calculateCanvasDimensions();
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
        fontSize: Math.max(14, dimensions.width * 0.018), // Fonte responsiva
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

  // Função para mudar orientação
  const changeOrientation = (orientation: 'portrait' | 'landscape') => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, orientation }
        : template
    );
    
    setTemplates(updatedTemplates);

    // Recriar o canvas com as novas dimensões
    if (fabricCanvas) {
      const dimensions = calculateCanvasDimensions();
      const totalHeight = (orientation === 'portrait' ? dimensions.height : dimensions.width) * activeTemplate.totalPages;
      
      fabricCanvas.setDimensions({
        width: orientation === 'portrait' ? dimensions.width : dimensions.height,
        height: totalHeight
      });
      fabricCanvas.renderAll();
    }

    toast({
      title: "Orientação alterada",
      description: `Template alterado para ${orientation === 'portrait' ? 'retrato' : 'paisagem'}`,
    });
  };

  // Função para adicionar página
  const addPage = () => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: template.totalPages + 1 }
        : template
    );
    
    setTemplates(updatedTemplates);

    // Redimensionar canvas
    if (fabricCanvas) {
      const dimensions = calculateCanvasDimensions();
      const newTotalHeight = dimensions.height * (activeTemplate.totalPages + 1);
      
      fabricCanvas.setDimensions({
        width: dimensions.width,
        height: newTotalHeight
      });

      // Adicionar separador para a nova página
      const pageBreakY = dimensions.height * activeTemplate.totalPages;
      
      const pageBreakLine = new Line([0, pageBreakY, dimensions.width, pageBreakY], {
        stroke: '#ff6b35',
        strokeWidth: 3,
        strokeDashArray: [15, 8],
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      const pageLabel = new FabricText(`PÁGINA ${activeTemplate.totalPages + 1}`, {
        left: 20,
        top: pageBreakY + 10,
        fontSize: Math.max(14, dimensions.width * 0.018),
        fill: '#ff6b35',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

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

      fabricCanvas.add(pageBreakLine);
      fabricCanvas.add(pageLabel);
      fabricCanvas.add(pageIcon);
      fabricCanvas.renderAll();
    }

    toast({
      title: "Página adicionada",
      description: `Nova página adicionada ao template`,
    });
  };

  // Função para remover página
  const removePage = () => {
    if (!activeTemplate || activeTemplate.totalPages <= 1) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: template.totalPages - 1 }
        : template
    );
    
    setTemplates(updatedTemplates);

    // Redimensionar canvas
    if (fabricCanvas) {
      const dimensions = calculateCanvasDimensions();
      const newTotalHeight = dimensions.height * (activeTemplate.totalPages - 1);
      
      fabricCanvas.setDimensions({
        width: dimensions.width,
        height: newTotalHeight
      });

      // Remover elementos da última página (separadores)
      const objects = fabricCanvas.getObjects();
      const pageBreakY = dimensions.height * (activeTemplate.totalPages - 1);
      
      objects.forEach(obj => {
        if (obj.top && obj.top >= pageBreakY) {
          fabricCanvas.remove(obj);
        }
      });

      fabricCanvas.renderAll();
    }

    // Ajustar página atual se necessário
    if (currentPage > activeTemplate.totalPages - 1) {
      setCurrentPage(activeTemplate.totalPages - 1);
    }

    toast({
      title: "Página removida",
      description: `Página removida do template`,
    });
  };

  // Função para navegar para uma página específica
  const goToPage = (pageNumber: number) => {
    if (!activeTemplate || pageNumber < 1 || pageNumber > activeTemplate.totalPages) return;

    setCurrentPage(pageNumber);

    // Scroll do canvas para a página
    if (fabricCanvas && canvasContainerRef.current) {
      const dimensions = calculateCanvasDimensions();
      const targetY = dimensions.height * (pageNumber - 1);
      
      canvasContainerRef.current.scrollTop = targetY;
    }

    toast({
      title: "Navegação",
      description: `Movido para página ${pageNumber}`,
    });
  };

  const handleImageUpload = (file: File, x = 100, y = 100) => {
    if (!fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        FabricImage.fromURL(e.target?.result as string).then((fabricImg) => {
          const maxWidth = 200;
          const maxHeight = 200;
          
          // Calculate scale to fit within max dimensions
          const scaleX = maxWidth / fabricImg.width!;
          const scaleY = maxHeight / fabricImg.height!;
          const scale = Math.min(scaleX, scaleY);
          
          fabricImg.set({
            left: x,
            top: y,
            scaleX: scale,
            scaleY: scale,
          });

          const elementId = Date.now().toString();
          (fabricImg as any).elementId = elementId;
          (fabricImg as any).elementType = 'image';

          fabricCanvas.add(fabricImg);
          fabricCanvas.setActiveObject(fabricImg);
          fabricCanvas.renderAll();

          const newElement: TemplateElement = {
            id: elementId,
            type: 'image',
            content: file.name,
            style: {
              fontSize: 14,
              color: '#000000',
              fontWeight: 'normal',
              fontStyle: 'normal',
              textDecoration: 'none',
              textAlign: 'left'
            },
            position: { x, y },
            size: { width: fabricImg.width! * scale, height: fabricImg.height! * scale }
          };

          updateTemplateElements(newElement);
          setSelectedElement(elementId);

          toast({
            title: "Sucesso",
            description: "Imagem adicionada ao template!",
          });
        });
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addTextElement = () => {
    if (!fabricCanvas) return;

    const elementId = Date.now().toString();
    const dimensions = calculateCanvasDimensions();
    
    const text = new FabricText('Clique duas vezes para editar', {
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
      fontSize: Math.max(16, dimensions.width * 0.02), // Fonte responsiva
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
      position: { x: 100, y: 100 + (dimensions.height * (currentPage - 1)) }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);

    toast({
      title: "Sucesso",
      description: "Elemento de texto adicionado! Duplo clique para editar.",
    });
  };

  const addImagePlaceholder = () => {
    if (!fabricCanvas) return;

    const dimensions = calculateCanvasDimensions();
    const imageWidth = Math.min(200, dimensions.width * 0.25); // 25% da largura ou 200px
    const imageHeight = Math.min(150, imageWidth * 0.75); // Manter proporção

    const rect = new Rect({
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
      width: imageWidth,
      height: imageHeight,
      fill: '#f0f0f0',
      stroke: '#ccc',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });

    const text = new FabricText('Clique para\nadicionar imagem', {
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
      fontSize: Math.max(14, dimensions.width * 0.018), // Fonte responsiva
      fill: '#666',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    const elementId = Date.now().toString();
    (rect as any).customData = { id: elementId, type: 'image' };
    (text as any).customData = { id: elementId, type: 'image' };

    const group = new Group([rect, text], {
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
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
      position: { x: 50, y: 100 + (dimensions.height * (currentPage - 1)) },
      size: { width: imageWidth, height: imageHeight }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);
  };

  const addFieldElement = () => {
    if (!fabricCanvas) return;

    const dimensions = calculateCanvasDimensions();
    const fieldWidth = Math.min(200, dimensions.width * 0.3); // 30% da largura ou 200px

    const rect = new Rect({
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
      width: fieldWidth,
      height: 30,
      fill: '#e3f2fd',
      stroke: '#2196f3',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
    });

    const text = new FabricText('{{campo.dinamico}}', {
      left: 60,
      top: 110 + (dimensions.height * (currentPage - 1)),
      fontSize: 14,
      fill: '#1976d2',
      fontFamily: 'monospace',
    });

    const elementId = Date.now().toString();
    const group = new Group([rect, text], {
      left: 50,
      top: 100 + (dimensions.height * (currentPage - 1)),
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
      position: { x: 50, y: 100 + (dimensions.height * (currentPage - 1)) }
    };

    updateTemplateElements(newElement);
    setSelectedElement(elementId);
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
                onClick={() => {}}
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
              <Button onClick={() => {}} size="sm">
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
                          onClick={() => goToPage(pageNum)}
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
              {textEditMode && selectedElement && (
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
                      onClick={() => {}}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
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
                    onClick={() => {}}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {}}
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
              {selectedElement && !textEditMode && (
                <div className="space-y-4 border-t pt-4">
                  <Label>Propriedades do Elemento</Label>
                  
                  {selectedElement && (
                    <div className="space-y-3">
                      <Button
                        variant="default"
                        onClick={() => {}}
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
                            value={16}
                            onChange={(e) => {}}
                          />
                        </div>
                        <div>
                          <Label>Cor</Label>
                          <Input
                            type="color"
                            value={'#000000'}
                            onChange={(e) => {}}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Cor de Fundo</Label>
                        <Input
                          type="color"
                          value={'#ffffff'}
                          onChange={(e) => {}}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <Bold size={16} />
                        </Button>
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <Italic size={16} />
                        </Button>
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <Underline size={16} />
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <AlignLeft size={16} />
                        </Button>
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <AlignCenter size={16} />
                        </Button>
                        <Button
                          variant={'default'}
                          size="sm"
                          onClick={() => {}}
                        >
                          <AlignRight size={16} />
                        </Button>
                      </div>
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
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  ref={canvasContainerRef}
                  className="border-2 border-gray-200 rounded-lg overflow-auto bg-white shadow-inner w-full"
                  style={{ maxHeight: '800px' }}
                >
                  <canvas 
                    ref={canvasRef}
                    className="block mx-auto w-full"
                  />
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Zoom: {Math.round(canvasZoom * 100)}%</span>
                    <span>Largura: {canvasWidth}px</span>
                    <span className="text-orange-600">
                      {activeTemplate.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
                    </span>
                  </div>
                  <span>Canvas responsivo • Linhas laranjas separam as páginas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
