
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@/types/template";

interface TemplateCanvasProps {
  activeTemplate: Template | undefined;
  currentPage: number;
  canvasZoom: number;
  canvasWidth: number;
  onSelectionChange: (elementId: string | null) => void;
  onTextDoubleClick: (content: string) => void;
  onElementUpdate: (elementId: string, updates: any) => void;
}

export interface TemplateCanvasRef {
  addTextElement: () => void;
  addImagePlaceholder: () => void;
  addFieldElement: () => void;
  handleImageUpload: (file: File, x?: number, y?: number) => void;
  deleteSelectedElement: () => void;
  updateTextContent: (content: string) => void;
  getFabricCanvas: () => any;
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
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!editorRef.current || !activeTemplate) return;

    const dimensions = calculateCanvasDimensions();
    const totalHeight = dimensions.height * activeTemplate.totalPages;

    // Configurar o editor como contentEditable
    const editor = editorRef.current;
    editor.style.width = `${dimensions.width}px`;
    editor.style.height = `${totalHeight}px`;
    editor.style.minHeight = `${totalHeight}px`;

    // Focar no editor automaticamente
    editor.focus();

    // Adicionar placeholder quando vazio
    const updatePlaceholder = () => {
      if (editor.textContent?.trim() === '') {
        editor.setAttribute('data-placeholder', 'Clique aqui e comece a escrever...');
      } else {
        editor.removeAttribute('data-placeholder');
      }
    };

    updatePlaceholder();

    // Configurar eventos do editor
    const handleInput = () => {
      onSelectionChange('text-editor');
      updatePlaceholder();
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        onSelectionChange('text-editor');
      }
    };

    editor.addEventListener('input', handleInput);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      editor.removeEventListener('input', handleInput);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [activeTemplate?.orientation, activeTemplate?.totalPages]);

  useImperativeHandle(ref, () => ({
    addTextElement: () => {
      // Focar no editor
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },

    addImagePlaceholder: () => {
      // Inserir placeholder de imagem no cursor
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const placeholder = document.createElement('div');
          placeholder.style.cssText = `
            width: 200px;
            height: 150px;
            border: 2px dashed #ccc;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            margin: 10px;
            cursor: pointer;
          `;
          placeholder.textContent = 'Clique para adicionar imagem';
          range.insertNode(placeholder);
        }
      }
    },

    addFieldElement: () => {
      // Inserir campo dinâmico no cursor
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const field = document.createElement('span');
          field.style.cssText = `
            background: #e3f2fd;
            border: 1px solid #2196f3;
            padding: 2px 8px;
            border-radius: 4px;
            color: #1976d2;
            font-family: monospace;
          `;
          field.textContent = '{{campo.dinamico}}';
          range.insertNode(field);
        }
      }
    },

    handleImageUpload: (file: File, x = 100, y = 100) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editorRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const img = document.createElement('img');
            img.src = e.target?.result as string;
            img.style.maxWidth = '200px';
            img.style.height = 'auto';
            img.style.margin = '10px';
            range.insertNode(img);
          }
        }
      };
      reader.readAsDataURL(file);
    },

    deleteSelectedElement: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.deleteFromDocument();
      }
    },

    updateTextContent: (content: string) => {
      // Não necessário no editor livre
    },

    getFabricCanvas: () => null
  }));

  if (!activeTemplate) return null;

  const dimensions = calculateCanvasDimensions();
  const totalHeight = dimensions.height * activeTemplate.totalPages;

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
        >
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-full p-6 outline-none focus:outline-none relative editor-placeholder"
            style={{
              lineHeight: '1.6',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: '#000000',
              cursor: 'text'
            }}
            suppressContentEditableWarning={true}
          />
          
          {/* Indicadores de página */}
          {activeTemplate.totalPages > 1 && Array.from({ length: activeTemplate.totalPages - 1 }, (_, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 border-t-2 border-dashed border-orange-400"
              style={{
                top: `${dimensions.height * (index + 1)}px`,
                pointerEvents: 'none'
              }}
            >
              <div className="absolute left-4 -top-6 bg-orange-100 px-2 py-1 rounded text-xs text-orange-600 font-semibold">
                PÁGINA {index + 2}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>Zoom: {Math.round(canvasZoom * 100)}%</span>
            <span>Largura: {canvasWidth}px</span>
            <span className="text-orange-600">
              {activeTemplate.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
            </span>
          </div>
          <span>✍️ Editor de texto livre - Digite diretamente para escrever</span>
        </div>

        {/* CSS para o placeholder */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .editor-placeholder[data-placeholder]:empty::before {
              content: attr(data-placeholder);
              color: #9ca3af;
              pointer-events: none;
            }
          `
        }} />
      </CardContent>
    </Card>
  );
});

TemplateCanvas.displayName = 'TemplateCanvas';

export default TemplateCanvas;
