import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types/template";
import { templateStorage } from "@/services/templateStorage";
import TemplateManager from "./TemplateManager";
import TemplateToolbar from "./TemplateToolbar";
import TemplateCanvas, { TemplateCanvasRef } from "./TemplateCanvas";
import TemplateProperties from "./TemplateProperties";

interface TemplateEditorProps {
  tipo: 'proposta' | 'contrato';
}

export default function TemplateEditor({ tipo }: TemplateEditorProps) {
  const { toast } = useToast();
  const canvasRef = useRef<TemplateCanvasRef>(null);
  
  const [templates, setTemplates] = useState<Template[]>(() => {
    const savedTemplates = templateStorage.getByType(tipo);
    if (savedTemplates.length > 0) {
      return savedTemplates;
    }
    
    return [
      {
        id: '1',
        name: `Template Padrão - ${tipo === 'proposta' ? 'Proposta' : 'Contrato'}`,
        elements: [],
        orientation: 'portrait',
        totalPages: 1
      }
    ];
  });
  
  const [activeTemplateId, setActiveTemplateId] = useState('1');
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [textEditMode, setTextEditMode] = useState(false);
  const [editingTextContent, setEditingTextContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(800);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleSaveAll = () => {
    try {
      templateStorage.saveAll(templates, tipo);
      toast({
        title: "Templates salvos!",
        description: `Todos os templates de ${tipo} foram salvos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os templates.",
        variant: "destructive",
      });
    }
  };

  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, orientation }
        : template
    );
    
    setTemplates(updatedTemplates);

    toast({
      title: "Orientação alterada",
      description: `Template alterado para ${orientation === 'portrait' ? 'retrato' : 'paisagem'}`,
    });
  };

  const handleAddPage = () => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: template.totalPages + 1 }
        : template
    );
    
    setTemplates(updatedTemplates);

    toast({
      title: "Página adicionada",
      description: "Nova página adicionada ao template",
    });
  };

  const handleRemovePage = () => {
    if (!activeTemplate || activeTemplate.totalPages <= 1) return;

    const updatedTemplates = templates.map(template => 
      template.id === activeTemplateId 
        ? { ...template, totalPages: template.totalPages - 1 }
        : template
    );
    
    setTemplates(updatedTemplates);

    if (currentPage > activeTemplate.totalPages - 1) {
      setCurrentPage(activeTemplate.totalPages - 1);
    }

    toast({
      title: "Página removida",
      description: "Página removida do template",
    });
  };

  const handleGoToPage = (pageNumber: number) => {
    if (!activeTemplate || pageNumber < 1 || pageNumber > activeTemplate.totalPages) return;

    setCurrentPage(pageNumber);
    toast({
      title: "Navegação",
      description: `Movido para página ${pageNumber}`,
    });
  };

  const handleSelectionChange = (elementId: string | null) => {
    console.log('TemplateEditor - Selection changed:', elementId);
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    const activeObject = fabricCanvas?.getActiveObject();
    
    if (activeObject) {
      console.log('TemplateEditor - Active object found:', activeObject);
      console.log('TemplateEditor - Object type:', activeObject.type);
      
      // Melhor detecção do tipo de elemento
      let elementType = 'unknown';
      if ((activeObject as any).elementType) {
        elementType = (activeObject as any).elementType;
      } else if (activeObject.type === 'text') {
        elementType = 'text';
      } else if (activeObject.type === 'image') {
        elementType = 'image';
      } else if (activeObject.type === 'group') {
        elementType = 'field';
      }
      
      const elementData = {
        elementId: elementId,
        elementType: elementType,
        fontSize: (activeObject as any).fontSize || 16,
        fontFamily: (activeObject as any).fontFamily || 'Arial',
        fill: (activeObject as any).fill || '#000000',
        backgroundColor: (activeObject as any).backgroundColor || '#ffffff',
        fontWeight: (activeObject as any).fontWeight || 'normal',
        fontStyle: (activeObject as any).fontStyle || 'normal',
        underline: (activeObject as any).underline || false,
        textAlign: (activeObject as any).textAlign || 'left'
      };
      
      console.log('TemplateEditor - Element data:', elementData);
      setSelectedElement(elementData);
      
      if (elementType === 'text' && (activeObject as any).text) {
        setEditingTextContent((activeObject as any).text);
      }
    } else {
      console.log('TemplateEditor - No active object, clearing selection');
      setSelectedElement(null);
    }
  };

  const handleTextDoubleClick = (content: string) => {
    setTextEditMode(true);
    setEditingTextContent(content);
  };

  const handleSaveTextEdit = () => {
    canvasRef.current?.updateTextContent(editingTextContent);
    setTextEditMode(false);
    toast({
      title: "Texto salvo",
      description: "Conteúdo do texto foi atualizado",
    });
  };

  const handleCancelTextEdit = () => {
    setTextEditMode(false);
    setEditingTextContent('');
  };

  const handleDeleteElement = () => {
    canvasRef.current?.deleteSelectedElement();
    setSelectedElement(null);
    toast({
      title: "Elemento removido",
      description: "Elemento foi removido do template",
    });
  };

  const handleStartTextEdit = () => {
    setTextEditMode(true);
  };

  const handleImageUpload = (file: File) => {
    canvasRef.current?.handleImageUpload(file);
    toast({
      title: "Sucesso",
      description: "Imagem adicionada ao template!",
    });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(canvasZoom * 1.2, 3);
    setCanvasZoom(newZoom);
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    fabricCanvas?.setZoom(newZoom);
    fabricCanvas?.renderAll();
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(canvasZoom * 0.8, 0.1);
    setCanvasZoom(newZoom);
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    fabricCanvas?.setZoom(newZoom);
    fabricCanvas?.renderAll();
  };

  const handleResetZoom = () => {
    setCanvasZoom(1);
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    fabricCanvas?.setZoom(1);
    fabricCanvas?.renderAll();
  };

  const handleTextFormattingChange = (property: string, value: any) => {
    console.log('Applying formatting:', property, value);
    const fabricCanvas = canvasRef.current?.getFabricCanvas();
    const activeObject = fabricCanvas?.getActiveObject();
    
    if (activeObject && ((activeObject as any).elementType === 'text' || activeObject.type === 'text')) {
      const updates: any = {};
      
      switch (property) {
        case 'fontSize':
          updates.fontSize = value;
          break;
        case 'fontFamily':
          updates.fontFamily = value;
          break;
        case 'color':
          updates.fill = value;
          break;
        case 'backgroundColor':
          updates.backgroundColor = value;
          break;
        case 'isBold':
          updates.fontWeight = value ? 'bold' : 'normal';
          break;
        case 'isItalic':
          updates.fontStyle = value ? 'italic' : 'normal';
          break;
        case 'isUnderline':
          updates.underline = value;
          break;
        case 'alignment':
          updates.textAlign = value;
          break;
      }
      
      console.log('Applying updates:', updates);
      activeObject.set(updates);
      fabricCanvas?.renderAll();
      
      // Atualizar o selectedElement para refletir as mudanças
      setSelectedElement(prev => ({ ...prev, ...updates }));
      
      toast({
        title: "Formatação aplicada",
        description: "Propriedades do texto foram atualizadas",
      });
    }
  };

  return (
    <div className="space-y-6">
      <TemplateManager
        templates={templates}
        activeTemplateId={activeTemplateId}
        onTemplateSelect={setActiveTemplateId}
        onSaveAll={handleSaveAll}
        tipo={tipo}
      />

      {activeTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-6">
            <TemplateToolbar
              activeTemplate={activeTemplate}
              currentPage={currentPage}
              onOrientationChange={handleOrientationChange}
              onAddPage={handleAddPage}
              onRemovePage={handleRemovePage}
              onGoToPage={handleGoToPage}
              onAddTextElement={() => canvasRef.current?.addTextElement()}
              onAddImagePlaceholder={() => canvasRef.current?.addImagePlaceholder()}
              onAddFieldElement={() => canvasRef.current?.addFieldElement()}
              onImageUpload={handleImageUpload}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
            />
            
            <TemplateProperties
              selectedElement={selectedElement}
              textEditMode={textEditMode}
              editingTextContent={editingTextContent}
              onTextContentChange={setEditingTextContent}
              onSaveTextEdit={handleSaveTextEdit}
              onCancelTextEdit={handleCancelTextEdit}
              onDeleteElement={handleDeleteElement}
              onStartTextEdit={handleStartTextEdit}
              onTextFormattingChange={handleTextFormattingChange}
            />
          </div>

          <div className="lg:col-span-3">
            <TemplateCanvas
              ref={canvasRef}
              activeTemplate={activeTemplate}
              currentPage={currentPage}
              canvasZoom={canvasZoom}
              canvasWidth={canvasWidth}
              onSelectionChange={handleSelectionChange}
              onTextDoubleClick={handleTextDoubleClick}
              onElementUpdate={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
