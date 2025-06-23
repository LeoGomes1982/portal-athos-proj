
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Upload, 
  Type,
  Image as ImageIcon,
  Database,
  ZoomIn,
  ZoomOut,
  FileText,
  RotateCcw
} from "lucide-react";
import { Template } from "@/types/template";

interface TemplateToolbarProps {
  activeTemplate: Template | undefined;
  currentPage: number;
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
  onAddPage: () => void;
  onRemovePage: () => void;
  onGoToPage: (page: number) => void;
  onAddTextElement: () => void;
  onAddImagePlaceholder: () => void;
  onAddFieldElement: () => void;
  onImageUpload: (file: File) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export default function TemplateToolbar({
  activeTemplate,
  currentPage,
  onOrientationChange,
  onAddPage,
  onRemovePage,
  onGoToPage,
  onAddTextElement,
  onAddImagePlaceholder,
  onAddFieldElement,
  onImageUpload,
  onZoomIn,
  onZoomOut,
  onResetZoom
}: TemplateToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeTemplate) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ferramentas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configurações de Página */}
        <div className="space-y-3 border-b pb-4">
          <Label className="text-orange-800 font-semibold">Configurações da Página</Label>
          
          <div>
            <Label>Orientação</Label>
            <div className="flex gap-2 mt-1">
              <Button
                variant={activeTemplate.orientation === 'portrait' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onOrientationChange('portrait')}
                className="flex-1"
              >
                <FileText size={16} className="mr-1" />
                Retrato
              </Button>
              <Button
                variant={activeTemplate.orientation === 'landscape' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onOrientationChange('landscape')}
                className="flex-1"
              >
                <RotateCcw size={16} className="mr-1" />
                Paisagem
              </Button>
            </div>
          </div>

          <div>
            <Label>Páginas ({activeTemplate.totalPages})</Label>
            <div className="flex gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onAddPage}
                className="flex-1"
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRemovePage}
                disabled={activeTemplate.totalPages <= 1}
                className="flex-1"
              >
                <Trash2 size={16} className="mr-1" />
                Remover
              </Button>
            </div>
          </div>

          {/* Navegação de Páginas */}
          {activeTemplate.totalPages > 1 && (
            <div>
              <Label>Ir para Página</Label>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {Array.from({ length: activeTemplate.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onGoToPage(pageNum)}
                    className="text-xs"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Adicionar Elementos */}
        <div className="space-y-2">
          <Label>Adicionar Elementos</Label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={onAddTextElement}
              className="justify-start"
            >
              <Type size={16} className="mr-2" />
              Texto Rico
            </Button>
            <Button
              variant="outline"
              onClick={onAddImagePlaceholder}
              className="justify-start"
            >
              <ImageIcon size={16} className="mr-2" />
              Imagem
            </Button>
            <Button
              variant="outline"
              onClick={onAddFieldElement}
              className="justify-start"
            >
              <Database size={16} className="mr-2" />
              Campo Dinâmico
            </Button>
          </div>
        </div>

        {/* Controles de Canvas */}
        <div className="space-y-2 border-t pt-4">
          <Label>Controles do Canvas</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
            >
              <ZoomOut size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetZoom}
            >
              100%
            </Button>
          </div>
        </div>

        {/* Upload de Imagem */}
        <div className="space-y-2 border-t pt-4">
          <Label>Upload de Imagem</Label>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload size={16} className="mr-2" />
            Carregar Imagem
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
          />
          <p className="text-xs text-gray-500">
            Ou arraste e solte uma imagem no canvas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
