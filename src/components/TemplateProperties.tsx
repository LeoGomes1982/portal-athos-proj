
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Underline, 
  Trash2,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

interface TemplatePropertiesProps {
  selectedElement: string | null;
  textEditMode: boolean;
  editingTextContent: string;
  onTextContentChange: (content: string) => void;
  onSaveTextEdit: () => void;
  onCancelTextEdit: () => void;
  onDeleteElement: () => void;
  onStartTextEdit: () => void;
}

export default function TemplateProperties({
  selectedElement,
  textEditMode,
  editingTextContent,
  onTextContentChange,
  onSaveTextEdit,
  onCancelTextEdit,
  onDeleteElement,
  onStartTextEdit
}: TemplatePropertiesProps) {
  if (!selectedElement) return null;

  return (
    <div className="space-y-4 border-t pt-4">
      <Label>Propriedades do Elemento</Label>
      
      {/* Editor de Texto Inline */}
      {textEditMode ? (
        <div className="space-y-3 border-2 border-orange-500 bg-orange-50 p-4 rounded-lg">
          <Label className="text-orange-800 font-semibold flex items-center gap-2">
            <Edit3 size={16} />
            Editando Texto
          </Label>
          <Textarea
            value={editingTextContent}
            onChange={(e) => onTextContentChange(e.target.value)}
            placeholder="Digite o texto aqui..."
            className="min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSaveTextEdit}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Salvar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelTextEdit}
            >
              Cancelar
            </Button>
          </div>
          <p className="text-xs text-orange-700">
            💡 Dica: Use Shift+Enter para quebras de linha
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            variant="default"
            onClick={onStartTextEdit}
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
                defaultValue={16}
              />
            </div>
            <div>
              <Label>Cor</Label>
              <Input
                type="color"
                defaultValue="#000000"
              />
            </div>
          </div>

          <div>
            <Label>Cor de Fundo</Label>
            <Input
              type="color"
              defaultValue="#ffffff"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bold size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Italic size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Underline size={16} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <AlignLeft size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <AlignCenter size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <AlignRight size={16} />
            </Button>
          </div>
        </div>
      )}

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
  );
}
