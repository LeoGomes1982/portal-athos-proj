import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Canvas as FabricCanvas, FabricText, FabricImage, Rect, Circle, Group, Line } from "fabric";
import { Template, TemplateElement } from "@/types/template";

interface TemplateCanvasProps {
  activeTemplate: Template | undefined;
  currentPage: number;
  canvasZoom: number;
  canvasWidth: number;
  onSelectionChange: (elementId: string | null) => void;
  onTextDoubleClick: (content: string) => void;
  onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
}

export interface TemplateCanvasRef {
  addTextElement: () => void;
  addImagePlaceholder: () => void;
  addFieldElement: () => void;
  handleImageUpload: (file: File, x?: number, y?: number) => void;
  deleteSelectedElement: () => void;
  updateTextContent: (content: string) => void;
  getFabricCanvas: () => FabricCanvas | null;
}

const TemplateCanvas = forwardRef<TemplateCanvasRef, TemplateCanvasProps>(({
  activeTemplate,
  currentPage,
  canvasZoom,
  canvasWidth,
  onSelectionChange,
  onTextDoubleClick,
  onElementUpdate
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  const calculateCanvasDimensions = () => {
    if (!canvasContainerRef.current) {
      return { width: 800, height: 1131 };
    }

    const containerWidth = canvasContainerRef.current.clientWidth - 48;
    const maxWidth = Math.min(containerWidth, 1200);
    
    let width, height;
    
    if (activeTemplate?.orientation === 'landscape') {
      width = maxWidth;
      height = Math.round(maxWidth / 1.414);
    } else {
      width = maxWidth;
      height = Math.round(maxWidth * 1.414);
    }
    
    return { width, height };
  };

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

    fabricCanvasRef.current = canvas;

    // Adicionar separadores de página
    for (let page = 1; page < activeTemplate.totalPages; page++) {
      const pageBreakY = dimensions.height * page;
      
      const pageBreakLine = new Line([0, pageBreakY, dimensions.width, pageBreakY], {
        stroke: '#ff6b35',
        strokeWidth: 3,
        strokeDashArray: [15, 8],
        selectable: false,
        evented: false,
        excludeFromExport: false,
      });

      const pageLabel = new FabricText(`PÁGINA ${page + 1}`, {
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

      canvas.add(pageBreakLine);
      canvas.add(pageLabel);
      canvas.add(pageIcon);
    }

    // Configurar eventos do canvas
    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        let elementType = 'unknown';
        if ((activeObject as any).elementType) {
          elementType = (activeObject as any).elementType;
        } else if (activeObject.type === 'text' || activeObject instanceof FabricText) {
          elementType = 'text';
        } else if (activeObject.type === 'image') {
          elementType = 'image';
        } else if (activeObject.type === 'group') {
          elementType = 'field';
        }
        
        const elementId = (activeObject as any).elementId || Date.now().toString();
        onSelectionChange(elementId);
      }
    });

    canvas.on('selection:updated', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        let elementType = 'unknown';
        if ((activeObject as any).elementType) {
          elementType = (activeObject as any).elementType;
        } else if (activeObject.type === 'text' || activeObject instanceof FabricText) {
          elementType = 'text';
        } else if (activeObject.type === 'image') {
          elementType = 'image';
        } else if (activeObject.type === 'group') {
          elementType = 'field';
        }
        
        const elementId = (activeObject as any).elementId || Date.now().toString();
        onSelectionChange(elementId);
      }
    });

    canvas.on('selection:cleared', () => {
      onSelectionChange(null);
    });

    // Clique simples em qualquer lugar do canvas cria texto para escrita livre
    canvas.on('mouse:down', (e) => {
      // Se não clicou em nenhum objeto, criar novo texto
      if (!e.target) {
        const pointer = canvas.getPointer(e.e);
        const elementId = Date.now().toString();
        
        const text = new FabricText('Digite aqui...', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 16,
          fill: '#000000',
          fontFamily: 'Arial',
          editable: true,
          selectable: true,
        });

        // Definir propriedades customizadas
        (text as any).elementId = elementId;
        (text as any).elementType = 'text';
        
        canvas.add(text);
        canvas.setActiveObject(text);
        
        // Entrar em modo de edição imediatamente
        setTimeout(() => {
          canvas.setActiveObject(text);
          (text as any).enterEditing();
          (text as any).selectAll();
          canvas.renderAll();
        }, 100);
        
        onSelectionChange(elementId);
      }
    });

    // Duplo clique para editar texto existente
    canvas.on('mouse:dblclick', (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && (activeObject as any).elementType === 'text' && activeObject instanceof FabricText) {
        // Entrar no modo de edição inline
        setTimeout(() => {
          canvas.setActiveObject(activeObject);
          (activeObject as any).enterEditing();
          (activeObject as any).selectAll();
          canvas.renderAll();
        }, 50);
      }
    });

    // Capturar teclas para escrita direta quando nenhum objeto está selecionado
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeObject = canvas.getActiveObject();
      
      // Se não há objeto selecionado e é uma tecla de texto, criar novo texto
      if (!activeObject && e.key.length === 1) {
        const elementId = Date.now().toString();
        
        const text = new FabricText(e.key, {
          left: 50,
          top: 50,
          fontSize: 16,
          fill: '#000000',
          fontFamily: 'Arial',
          editable: true,
          selectable: true,
        });

        (text as any).elementId = elementId;
        (text as any).elementType = 'text';
        
        canvas.add(text);
        canvas.setActiveObject(text);
        
        // Entrar em modo de edição
        setTimeout(() => {
          (text as any).enterEditing();
          canvas.renderAll();
        }, 50);
        
        onSelectionChange(elementId);
        e.preventDefault();
      }
    };

    // Adicionar event listener para teclas
    document.addEventListener('keydown', handleKeyDown);

    // Eventos de edição de texto
    canvas.on('text:editing:entered', () => {
      console.log('Entrada no modo de edição');
    });

    canvas.on('text:editing:exited', (e) => {
      const textObject = e.target;
      if (textObject && textObject instanceof FabricText) {
        // Se o texto estiver vazio, removê-lo
        if (!textObject.text || textObject.text.trim() === '' || textObject.text === 'Digite aqui...') {
          canvas.remove(textObject);
        }
        canvas.renderAll();
      }
    });

    canvas.on('text:changed', (e) => {
      const textObject = e.target;
      if (textObject && textObject instanceof FabricText) {
        canvas.renderAll();
      }
    });

    // Eventos de drag and drop
    canvas.on('drop', (e) => {
      const event = e.e as DragEvent;
      event.preventDefault();
      
      const files = event.dataTransfer?.files;
      if (files && files[0] && files[0].type.startsWith('image/')) {
        // Handle image upload via drag and drop
      }
    });

    canvas.on('dragover', (e) => {
      e.e.preventDefault();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [activeTemplate?.orientation, activeTemplate?.totalPages]);

  useImperativeHandle(ref, () => ({
    addTextElement: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const elementId = Date.now().toString();
      const dimensions = calculateCanvasDimensions();
      
      const text = new FabricText('Digite aqui...', {
        left: 50,
        top: 100 + (dimensions.height * (currentPage - 1)),
        fontSize: 16,
        fill: '#000000',
        fontFamily: 'Arial',
        editable: true,
        selectable: true,
      });

      (text as any).elementId = elementId;
      (text as any).elementType = 'text';

      canvas.add(text);
      canvas.setActiveObject(text);
      
      // Entrar em modo de edição imediatamente
      setTimeout(() => {
        (text as any).enterEditing();
        (text as any).selectAll();
        canvas.renderAll();
      }, 100);
      
      setTimeout(() => {
        onSelectionChange(elementId);
      }, 150);
    },

    addImagePlaceholder: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const dimensions = calculateCanvasDimensions();
      const imageWidth = Math.min(200, dimensions.width * 0.25);
      const imageHeight = Math.min(150, imageWidth * 0.75);

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
        fontSize: Math.max(14, dimensions.width * 0.018),
        fill: '#666',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
      });

      const elementId = Date.now().toString();
      const group = new Group([rect, text], {
        left: 50,
        top: 100 + (dimensions.height * (currentPage - 1)),
      });

      (group as any).elementId = elementId;
      (group as any).elementType = 'image';

      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
    },

    addFieldElement: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const dimensions = calculateCanvasDimensions();
      const fieldWidth = Math.min(200, dimensions.width * 0.3);

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

      (group as any).elementId = elementId;
      (group as any).elementType = 'field';

      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
    },

    handleImageUpload: (file: File, x = 100, y = 100) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = new Image();
        imgElement.onload = () => {
          FabricImage.fromURL(e.target?.result as string).then((fabricImg) => {
            const maxWidth = 200;
            const maxHeight = 200;
            
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

            canvas.add(fabricImg);
            canvas.setActiveObject(fabricImg);
            canvas.renderAll();
          });
        };
        imgElement.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },

    deleteSelectedElement: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
      }
    },

    updateTextContent: (content: string) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject instanceof FabricText) {
        activeObject.set('text', content);
        canvas.renderAll();
      }
    },

    getFabricCanvas: () => fabricCanvasRef.current
  }));

  if (!activeTemplate) return null;

  return (
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
          className="border-2 border-gray-200 rounded-lg overflow-auto bg-white shadow-inner w-full focus-within:border-orange-400"
          style={{ maxHeight: '800px' }}
          tabIndex={0}
        >
          <canvas 
            ref={canvasRef}
            className="block mx-auto w-full focus:outline-none"
            tabIndex={0}
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
          <span>✍️ Clique em qualquer lugar para escrever • Digite para começar a escrever • Duplo clique para editar texto</span>
        </div>
      </CardContent>
    </Card>
  );
});

TemplateCanvas.displayName = 'TemplateCanvas';

export default TemplateCanvas;
