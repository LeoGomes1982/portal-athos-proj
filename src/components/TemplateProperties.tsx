
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trash2,
  Info,
  Edit3
} from "lucide-react";
import TextEditingToolbar from "./TextEditingToolbar";

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
  const [localText, setLocalText] = useState(editingTextContent);
  const [textProperties, setTextProperties] = useState({
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
    backgroundColor: '#ffffff',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    alignment: 'left'
  });

  useEffect(() => {
    setLocalText(editingTextContent);
  }, [editingTextContent]);

  useEffect(() => {
    if (selectedElement && selectedElement.elementType === 'text') {
      console.log('Selected element:', selectedElement);
      // Extrair propriedades do elemento selecionado
      setTextProperties({
        fontSize: selectedElement.fontSize || 16,
        fontFamily: selectedElement.fontFamily || 'Arial',
        color: selectedElement.fill || '#000000',
        backgroundColor: selectedElement.backgroundColor || '#ffffff',
        isBold: selectedElement.fontWeight === 'bold',
        isItalic: selectedElement.fontStyle === 'italic',
        isUnderline: selectedElement.underline || false,
        alignment: selectedElement.textAlign || 'left'
      });
    }
  }, [selectedElement]);

  const handleTextFormattingChange = (property: string, value: any) => {
    console.log('Formatting change:', property, value);
    setTextProperties(prev => ({ ...prev, [property]: value }));
    if (onTextFormattingChange) {
      onTextFormattingChange(property, value);
    }
  };

  const handleTextChange = (value: string) => {
    setLocalText(value);
    onTextContentChange(value);
  };

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Info size={24} className="mx-auto mb-2" />
        <p>Selecione um elemento no canvas para editar suas propriedades</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Edit3 size={16} className="text-orange-600" />
        <Label className="font-semibold text-orange-800">Propriedades do Elemento</Label>
      </div>

      {/* Barra de ferramentas de texto estilo Word - SEMPRE VISÍVEL para elementos de texto */}
      {selectedElement.elementType === 'text' && (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
          <Label className="text-sm font-medium text-orange-800">🎨 Formatação Estilo Word</Label>
          <TextEditingToolbar
            selectedElement={selectedElement}
            onFontSizeChange={(size) => handleTextFormattingChange('fontSize', size)}
            onFontFamilyChange={(family) => handleTextFormattingChange('fontFamily', family)}
            onColorChange={(color) => handleTextFormattingChange('color', color)}
            onBackgroundColorChange={(color) => handleTextFormattingChange('backgroundColor', color)}
            onBoldToggle={() => handleTextFormattingChange('isBold', !textProperties.isBold)}
            onItalicToggle={() => handleTextFormattingChange('isItalic', !textProperties.isItalic)}
            onUnderlineToggle={() => handleTextFormattingChange('isUnderline', !textProperties.isUnderline)}
            onAlignmentChange={(alignment) => handleTextFormattingChange('alignment', alignment)}
            currentFontSize={textProperties.fontSize}
            currentFontFamily={textProperties.fontFamily}
            currentColor={textProperties.color}
            currentBackgroundColor={textProperties.backgroundColor}
            isBold={textProperties.isBold}
            isItalic={textProperties.isItalic}
            isUnderline={textProperties.isUnderline}
            currentAlignment={textProperties.alignment}
          />
        </div>
      )}

      {/* Editor de conteúdo de texto */}
      {selectedElement.elementType === 'text' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Conteúdo do Texto</Label>
          <div className="space-y-2">
            <Textarea
              value={localText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Digite o texto aqui..."
              className="min-h-[100px] resize-y"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onSaveTextEdit}
                className="bg-green-600 hover:bg-green-700"
              >
                Aplicar Texto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelTextEdit}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Informação sobre edição inline */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">🎯 Como Usar</p>
            <p>1. Selecione um texto no canvas</p>
            <p>2. Use a barra de formatação acima (estilo Word)</p>
            <p>3. Edite o conteúdo na caixa de texto</p>
            <p>4. Clique "Aplicar Texto" para confirmar</p>
          </div>
        </div>
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

      {/* Ações do elemento */}
      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteElement}
          className="w-full"
        >
          <Trash2 size={16} className="mr-2" />
          Remover Elemento
        </Button>
      </div>
    </div>
  );
}
