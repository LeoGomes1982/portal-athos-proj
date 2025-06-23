
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bold, 
  Italic, 
  Underline, 
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info
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
      
      {/* Informação sobre edição inline */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Edição de Texto Inline</p>
            <p>Clique duas vezes diretamente no texto no canvas para editá-lo, como no Word!</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
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
