import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Plus, FileText, Eye, Download } from "lucide-react";
import { funcionariosIniciais } from "@/data/funcionarios";
import { useToast } from "@/hooks/use-toast";

interface NovoDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documento: any) => void;
}

export function NovoDocumentoModal({ isOpen, onClose, onSubmit }: NovoDocumentoModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    tipoDestinatario: "",
    destinatario: "",
    temValidade: false,
    dataValidade: "",
    arquivo: null as File | null
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        arquivo: file,
        nome: prev.nome || file.name 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.arquivo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.nome || !formData.tipoDestinatario) {
      toast({
        title: "Erro", 
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.tipoDestinatario !== "geral" && !formData.destinatario) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um destinatário.",
        variant: "destructive",
      });
      return;
    }

    if (formData.temValidade && !formData.dataValidade) {
      toast({
        title: "Erro",
        description: "Por favor, defina a data de validade.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const novoDocumento = {
        id: Date.now().toString(),
        nome: formData.nome,
        tipo: formData.arquivo.type,
        tamanho: formData.arquivo.size,
        tipoDestinatario: formData.tipoDestinatario,
        destinatario: formData.destinatario || "Geral",
        temValidade: formData.temValidade,
        dataValidade: formData.temValidade ? formData.dataValidade : null,
        dataUpload: new Date().toISOString(),
        url: URL.createObjectURL(formData.arquivo),
        visualizado: false
      };

      onSubmit(novoDocumento);
      
      // Reset form
      setFormData({
        nome: "",
        tipoDestinatario: "",
        destinatario: "",
        temValidade: false,
        dataValidade: "",
        arquivo: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Sucesso",
        description: "Documento enviado com sucesso!",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar documento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const locais = [
    "Escritório Central",
    "Filial São Paulo", 
    "Filial Rio de Janeiro",
    "Almoxarifado",
    "Departamento Financeiro",
    "Recursos Humanos",
    "Tecnologia da Informação"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} />
            Adicionar Documento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de Arquivo */}
          <div className="space-y-2">
            <Label htmlFor="arquivo" className="text-sm font-medium">
              Arquivo *
            </Label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                id="arquivo"
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Selecionar Arquivo
                </Button>
                {formData.arquivo && (
                  <p className="text-sm text-slate-600">
                    Arquivo selecionado: {formData.arquivo.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nome do Documento */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome do Documento *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Digite o nome do documento"
              className="w-full"
            />
          </div>

          {/* Tipo de Destinatário */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Destinatário *
            </Label>
            <Select 
              value={formData.tipoDestinatario} 
              onValueChange={(value) => {
                handleChange("tipoDestinatario", value);
                handleChange("destinatario", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de destinatário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">🏢 Documento Geral</SelectItem>
                <SelectItem value="funcionario">👤 Funcionário</SelectItem>
                <SelectItem value="local">📍 Local/Setor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destinatário Específico */}
          {formData.tipoDestinatario === "funcionario" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Funcionário
              </Label>
              <Select value={formData.destinatario} onValueChange={(value) => handleChange("destinatario", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {funcionariosIniciais.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.nome}>
                      {funcionario.nome} - {funcionario.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.tipoDestinatario === "local" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Local/Setor
              </Label>
              <Select value={formData.destinatario} onValueChange={(value) => handleChange("destinatario", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um local ou setor" />
                </SelectTrigger>
                <SelectContent>
                  {locais.map((local, index) => (
                    <SelectItem key={index} value={local}>
                      {local}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Validade */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="temValidade"
                checked={formData.temValidade}
                onChange={(e) => handleChange("temValidade", e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="temValidade" className="text-sm font-medium">
                Este documento possui validade
              </Label>
            </div>

            {formData.temValidade && (
              <div className="space-y-2">
                <Label htmlFor="dataValidade" className="text-sm font-medium">
                  Data de Validade
                </Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => handleChange("dataValidade", e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? "Enviando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
