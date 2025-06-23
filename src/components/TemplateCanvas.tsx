import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@/types/template";
import { useImageHandling } from "@/hooks/useImageHandling";
import { useCanvasDimensions } from "@/hooks/useCanvasDimensions";
import { useDynamicFields } from "@/hooks/useDynamicFields";
import TextFormattingToolbar from "./TextFormattingToolbar";

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
  const { handleImageUpload, addResizeHandles, removeResizeHandles } = useImageHandling();
  const { calculateCanvasDimensions } = useCanvasDimensions();
  const { fields } = useDynamicFields();

  useEffect(() => {
    if (!editorRef.current || !activeTemplate) return;

    const dimensions = calculateCanvasDimensions(canvasContainerRef, activeTemplate);
    const totalHeight = dimensions.height * activeTemplate.totalPages;

    const editor = editorRef.current;
    editor.style.width = `${dimensions.width}px`;
    editor.style.height = `${totalHeight}px`;
    editor.style.minHeight = `${totalHeight}px`;

    editor.focus();

    const handleInput = () => {
      console.log('Editor input event triggered');
      onSelectionChange('text-editor');
    };

    const handleSelectionChange = () => {
      console.log('Selection changed in editor');
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        onSelectionChange('text-editor');
      }
    };

    const handleClick = (e: MouseEvent) => {
      console.log('Editor clicked');
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'IMG') {
        addResizeHandles(target as HTMLImageElement);
      } else {
        removeResizeHandles();
      }
      
      onSelectionChange('text-editor');
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Drag over editor');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Drop event on editor');
      
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          console.log('Dropped file is an image, processing...');
          handleImageUpload(file, editorRef);
        } else {
          console.log('Dropped file is not an image:', file.type);
        }
      }
    };

    editor.addEventListener('input', handleInput);
    editor.addEventListener('click', handleClick);
    editor.addEventListener('dragover', handleDragOver);
    editor.addEventListener('drop', handleDrop);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      editor.removeEventListener('input', handleInput);
      editor.removeEventListener('click', handleClick);
      editor.removeEventListener('dragover', handleDragOver);
      editor.removeEventListener('drop', handleDrop);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [activeTemplate?.orientation, activeTemplate?.totalPages, onSelectionChange, handleImageUpload, addResizeHandles, removeResizeHandles, calculateCanvasDimensions]);

  useImperativeHandle(ref, () => ({
    addTextElement: () => {
      if (editorRef.current) {
        editorRef.current.focus();
        onSelectionChange('text-editor');
      }
    },

    addImagePlaceholder: () => {
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
      if (editorRef.current) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Criar um dropdown com os campos disponíveis
          const fieldSelect = document.createElement('select');
          fieldSelect.style.cssText = `
            background: #e3f2fd;
            border: 1px solid #2196f3;
            padding: 4px 8px;
            border-radius: 4px;
            color: #1976d2;
            font-family: monospace;
            margin: 2px;
          `;
          
          // Adicionar opção padrão
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = 'Selecione um campo...';
          fieldSelect.appendChild(defaultOption);
          
          // Adicionar campos dinâmicos agrupados por categoria
          const categories = ['cliente', 'fornecedor', 'empresa'] as const;
          
          categories.forEach(category => {
            const categoryFields = fields.filter(field => field.category === category);
            if (categoryFields.length > 0) {
              const optgroup = document.createElement('optgroup');
              optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
              
              categoryFields.forEach(field => {
                const option = document.createElement('option');
                option.value = `{{${field.key}}}`;
                option.textContent = field.label;
                optgroup.appendChild(option);
              });
              
              fieldSelect.appendChild(optgroup);
            }
          });
          
          // Adicionar evento de mudança
          fieldSelect.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            if (target.value) {
              const fieldSpan = document.createElement('span');
              fieldSpan.style.cssText = `
                background: #e3f2fd;
                border: 1px solid #2196f3;
                padding: 2px 8px;
                border-radius: 4px;
                color: #1976d2;
                font-family: monospace;
                margin: 2px;
                display: inline-block;
              `;
              fieldSpan.textContent = target.value;
              fieldSpan.contentEditable = 'false';
              
              target.parentNode?.replaceChild(fieldSpan, target);
            }
          });
          
          range.insertNode(fieldSelect);
          fieldSelect.focus();
        }
      }
    },

    handleImageUpload: (file: File) => {
      handleImageUpload(file, editorRef);
    },

    deleteSelectedElement: () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        selection.deleteFromDocument();
      }
      removeResizeHandles();
    },

    updateTextContent: (content: string) => {
      // Não necessário no editor livre
    },

    getFabricCanvas: () => null
  }));

  if (!activeTemplate) return null;

  const dimensions = calculateCanvasDimensions(canvasContainerRef, activeTemplate);
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
        <style dangerouslySetInnerHTML={{
          __html: `
            .text-editor-placeholder:empty:before {
              content: "Clique aqui e comece a escrever...";
              color: #9ca3af;
              font-style: italic;
              pointer-events: none;
            }
            .image-resize-wrapper {
              user-select: none;
            }
            .resize-handle {
              user-select: none;
            }
          `
        }} />

        <TextFormattingToolbar />

        <div 
          ref={canvasContainerRef}
          className="border-2 border-gray-200 rounded-lg overflow-auto bg-white shadow-inner w-full focus-within:border-orange-400 relative"
          style={{ maxHeight: '800px' }}
        >
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-full p-6 outline-none focus:outline-none text-editor-placeholder"
            style={{
              lineHeight: '1.6',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: '#000000',
              cursor: 'text'
            }}
            suppressContentEditableWarning={true}
          />
          
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
          <span>✍️ Editor de texto livre - Digite diretamente ou arraste imagens</span>
        </div>
      </CardContent>
    </Card>
  );
});

TemplateCanvas.displayName = 'TemplateCanvas';

export default TemplateCanvas;
