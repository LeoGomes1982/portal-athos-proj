
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Info,
  Edit3,
  Type
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
        <Type size={24} className="mx-auto mb-2" />
        <p>Editor de Texto Livre</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">✍️ Como usar o editor</p>
              <p className="mb-1">• Clique na área branca e comece a digitar</p>
              <p className="mb-1">• Selecione texto para usar a barra de formatação</p>
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
          <Label className="font-semibold text-orange-800">Editor de Texto</Label>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">✍️ Editando texto</p>
              <p className="mb-1">• Selecione o texto que quer formatar</p>
              <p>• Use a barra de ferramentas acima para alterar fonte, cor, etc.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Ações Rápidas</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('bold')}
              className="text-xs"
            >
              Negrito
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('italic')}
              className="text-xs"
            >
              Itálico
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('underline')}
              className="text-xs"
            >
              Sublinhado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.execCommand('justifyCenter')}
              className="text-xs"
            >
              Centralizar
            </Button>
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
