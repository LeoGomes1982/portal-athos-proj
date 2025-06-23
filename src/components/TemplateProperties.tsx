
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Info,
  Edit3,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from "lucide-react";

interface TemplatePropertiesProps {
  selectedElement: any | null;
  textEditMode: boolean;
  editingTextContent: string;
  onTextContentChange: (content: string) => void;
  onSaveTextEdit: () => void;
  onCancelTextEdit: () => void;
  onDeleteElement: () => void;
  onStartTextEdit: () => void;
  onTextFormattingChange?: (property: string, value: any) => void;
}

export default function TemplateProperties({
  selectedElement,
  textEditMode,
  editingTextContent,
  onTextContentChange,
  onSaveTextEdit,
  onCancelTextEdit,
  onDeleteElement,
  onStartTextEdit,
  onTextFormattingChange
}: TemplatePropertiesProps) {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Type size={24} className="mx-auto mb-2" />
        <p>Editor de Texto Livre</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">✍️ Como usar o editor</p>
              <p className="mb-1">• Clique na área branca e comece a digitar</p>
              <p className="mb-1">• Selecione texto para usar as ferramentas de formatação</p>
              <p>• Use as ferramentas da barra lateral para inserir elementos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedElement === 'text-editor') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Edit3 size={16} className="text-orange-600" />
          <Label className="font-semibold text-orange-800">Formatação de Texto</Label>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">✍️ Editando texto</p>
              <p className="mb-1">• Selecione o texto que quer formatar</p>
              <p>• Use as ferramentas abaixo para alterar fonte, cor, etc.</p>
            </div>
          </div>
        </div>

        {/* Ferramentas de Formatação */}
        <div className="space-y-4">
          {/* Fonte e Tamanho */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Fonte</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Família</Label>
                <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Tamanho</Label>
                <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10px</SelectItem>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                    <SelectItem value="20">20px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                    <SelectItem value="28">28px</SelectItem>
                    <SelectItem value="32">32px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cores */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Cores</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Texto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-xs text-gray-600">{textColor}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs">Fundo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-xs text-gray-600">{backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formatação */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formatação</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('bold')}
                className="text-xs"
              >
                <Bold size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('italic')}
                className="text-xs"
              >
                <Italic size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('underline')}
                className="text-xs"
              >
                <Underline size={14} />
              </Button>
            </div>
          </div>

          {/* Alinhamento */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Alinhamento</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyLeft')}
                className="text-xs"
              >
                <AlignLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyCenter')}
                className="text-xs"
              >
                <AlignCenter size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyFormatting('justifyRight')}
                className="text-xs"
              >
                <AlignRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Edit3 size={16} className="text-orange-600" />
        <Label className="font-semibold text-orange-800">Propriedades do Elemento</Label>
      </div>

      {/* Propriedades específicas por tipo de elemento */}
      {selectedElement.elementType === 'image' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Propriedades da Imagem</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Largura</Label>
              <Input
                type="number"
                defaultValue={200}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Altura</Label>
              <Input
                type="number"
                defaultValue={150}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.elementType === 'field' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Campo Dinâmico</Label>
          <div>
            <Label className="text-xs">Nome do Campo</Label>
            <Input
              placeholder="ex: cliente.nome"
              className="text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
