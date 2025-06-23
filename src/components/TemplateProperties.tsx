
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trash2,
  Info,
  Edit3
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

      {/* Informação sobre edição inline */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">🎯 Como Usar</p>
            <p>1. Clique duas vezes em um texto para editá-lo diretamente</p>
            <p>2. Selecione o texto para ver a barra de formatação acima</p>
            <p>3. Use os controles da barra para formatar o texto</p>
            <p>4. A formatação é aplicada em tempo real</p>
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
