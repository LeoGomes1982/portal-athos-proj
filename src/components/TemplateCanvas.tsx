import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Template } from "@/types/template";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette
} from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  
  // Estados para a formatação
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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

  const handleImageUpload = (file: File, x = 100, y = 100) => {
    console.log('Starting image upload process:', file.name, file.type);
    
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image:', file.type);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File read successfully, creating image element');
      if (editorRef.current && e.target?.result) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const img = document.createElement('img');
          img.src = e.target.result as string;
          img.style.cssText = `
            max-width: 300px;
            height: auto;
            margin: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            display: inline-block;
          `;
          img.alt = file.name;
          
          // Add click handler for selection
          img.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Image clicked, adding resize handles');
            addResizeHandles(img);
          });
          
          range.insertNode(img);
          console.log('Image inserted into editor');
          
          // Auto-select the newly inserted image
          setTimeout(() => {
            addResizeHandles(img);
          }, 100);
        } else {
          // If no selection, append to the end of the editor
          console.log('No selection found, appending image to editor');
          const img = document.createElement('img');
          img.src = e.target.result as string;
          img.style.cssText = `
            max-width: 300px;
            height: auto;
            margin: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            display: block;
          `;
          img.alt = file.name;
          
          img.addEventListener('click', (event) => {
            event.stopPropagation();
            addResizeHandles(img);
          });
          
          editorRef.current.appendChild(img);
          addResizeHandles(img);
        }
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    
    reader.readAsDataURL(file);
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    
    // Trigger selection change to update the toolbar
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Force update of selection
        const event = new Event('selectionchange');
        document.dispatchEvent(event);
      }
    }, 10);
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(Number(newSize));
    applyFormatting('fontSize', '7'); // Use fontSize command with size
    // Then apply the actual size via CSS
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = newSize + 'px';
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, extract and wrap
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    applyFormatting('fontName', family);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    applyFormatting('foreColor', color);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    applyFormatting('backColor', color);
  };

  const addResizeHandles = (img: HTMLImageElement) => {
    // Remove existing handles
    removeResizeHandles();
    
    const wrapper = document.createElement('div');
    wrapper.className = 'image-resize-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      border: 2px solid #007bff;
      cursor: move;
    `;
    
    // Wrap the image
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    
    // Create resize handles
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
    handles.forEach(handle => {
      const handleElement = document.createElement('div');
      handleElement.className = `resize-handle resize-${handle}`;
      handleElement.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: #007bff;
        border: 1px solid white;
        cursor: ${handle.includes('n') || handle.includes('s') ? 
          (handle.includes('e') || handle.includes('w') ? 
            (handle.includes('nw') || handle.includes('se') ? 'nw-resize' : 'ne-resize') 
            : 'ns-resize') 
          : (handle.includes('e') || handle.includes('w') ? 'ew-resize' : 'move')};
        z-index: 10;
      `;
      
      // Position handles
      if (handle.includes('n')) handleElement.style.top = '-4px';
      if (handle.includes('s')) handleElement.style.bottom = '-4px';
      if (handle.includes('e')) handleElement.style.right = '-4px';
      if (handle.includes('w')) handleElement.style.left = '-4px';
      if (handle === 'n' || handle === 's') {
        handleElement.style.left = '50%';
        handleElement.style.transform = 'translateX(-50%)';
      }
      if (handle === 'e' || handle === 'w') {
        handleElement.style.top = '50%';
        handleElement.style.transform = 'translateY(-50%)';
      }
      
      // Add resize functionality
      handleElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startResize(img, handle, e);
      });
      
      wrapper.appendChild(handleElement);
    });
    
    setSelectedImage(img);
  };

  const removeResizeHandles = () => {
    const wrappers = document.querySelectorAll('.image-resize-wrapper');
    wrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (img && wrapper.parentNode) {
        wrapper.parentNode.insertBefore(img, wrapper);
        wrapper.remove();
      }
    });
    setSelectedImage(null);
  };

  const startResize = (img: HTMLImageElement, handle: string, e: MouseEvent) => {
    setIsResizing(true);
    setResizeHandle(handle);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (handle.includes('e')) {
        newWidth = startWidth + deltaX;
      } else if (handle.includes('w')) {
        newWidth = startWidth - deltaX;
      }
      
      if (handle.includes('s')) {
        newHeight = startHeight + deltaY;
      } else if (handle.includes('n')) {
        newHeight = startHeight - deltaY;
      }
      
      // Maintain aspect ratio for corner handles
      if (handle.length === 2) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      // Apply minimum size constraints
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);
      
      img.style.width = newWidth + 'px';
      img.style.height = newHeight + 'px';
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle('');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Calibri',
    'Roboto',
    'Open Sans'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

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

    // Configurar eventos do editor
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
      
      // Check if clicked on an image
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
          handleImageUpload(file);
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
  }, [activeTemplate?.orientation, activeTemplate?.totalPages, onSelectionChange]);

  useImperativeHandle(ref, () => ({
    addTextElement: () => {
      // Focar no editor
      if (editorRef.current) {
        editorRef.current.focus();
        onSelectionChange('text-editor');
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

    handleImageUpload,

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
        {/* CSS Styles */}
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

        {/* Barra de Ferramentas Permanente */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Fonte */}
            <div className="flex items-center gap-2">
              <Type size={16} className="text-gray-600" />
              <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tamanho da fonte */}
            <div className="flex items-center gap-1">
              <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Formatação */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('bold')}
              >
                <Bold size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('italic')}
              >
                <Italic size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('underline')}
              >
                <Underline size={16} />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Cores */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Palette size={16} className="text-gray-600" />
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="w-12 h-8 p-1 border rounded"
                  title="Cor do texto"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Fundo:</span>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="w-12 h-8 p-1 border rounded"
                  title="Cor de fundo"
                />
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Alinhamento */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyLeft')}
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyCenter')}
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyRight')}
              >
                <AlignRight size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyFull')}
              >
                <AlignJustify size={16} />
              </Button>
            </div>
          </div>
        </div>

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
          <span>✍️ Editor de texto livre - Digite diretamente ou arraste imagens</span>
        </div>
      </CardContent>
    </Card>
  );
});

TemplateCanvas.displayName = 'TemplateCanvas';

export default TemplateCanvas;
