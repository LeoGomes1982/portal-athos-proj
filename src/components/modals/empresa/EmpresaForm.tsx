
import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhone, 
  validateCNPJ, 
  validateCEP,
  validateFileType,
  validateFileSize,
  sanitizeFileName
} from "@/utils/security";

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  logo?: string;
  ativo: boolean;
}

interface FormData {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  logo: string;
}

interface EmpresaFormProps {
  formData: FormData;
  editingEmpresa: Empresa | null;
  logoPreview: string;
  onInputChange: (field: string, value: string) => void;
  onLogoChange: (logo: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EmpresaForm = ({ 
  formData, 
  editingEmpresa, 
  logoPreview, 
  onInputChange, 
  onLogoChange, 
  onSubmit, 
  onCancel 
}: EmpresaFormProps) => {
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeInMB = 5;

    if (!validateFileType(file, allowedTypes)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo inválido. Use: JPG, PNG, GIF ou WebP",
        variant: "destructive",
      });
      return;
    }

    if (!validateFileSize(file, maxSizeInMB)) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Máximo permitido: ${maxSizeInMB}MB`,
        variant: "destructive",
      });
      return;
    }

    const sanitizedFileName = sanitizeFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result);
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo de imagem.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
        </h3>
        <Button 
          variant="outline" 
          onClick={() => { 
            console.log("Cancel form button clicked");
            onCancel(); 
          }}
        >
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Upload de Logo */}
        <div className="md:col-span-2">
          <Label>Logo da Empresa</Label>
          <div className="mt-2 flex items-center space-x-4">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Preview do logo"
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                <Upload size={24} className="text-slate-400" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleLogoUpload}
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">
                Formatos aceitos: JPG, PNG, GIF, WebP (máx. 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Campos do formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nome">Nome da Empresa *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => onInputChange("nome", e.target.value)}
              placeholder="Digite o nome da empresa"
              required
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => onInputChange("cnpj", e.target.value)}
              placeholder="00.000.000/0000-00"
              required
              maxLength={18}
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="empresa@exemplo.com"
              required
              maxLength={254}
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => onInputChange("telefone", e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => onInputChange("endereco", e.target.value)}
              placeholder="Rua, Avenida, número"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.cidade}
              onChange={(e) => onInputChange("cidade", e.target.value)}
              placeholder="Nome da cidade"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              value={formData.estado}
              onChange={(e) => onInputChange("estado", e.target.value)}
              placeholder="UF"
              maxLength={2}
            />
          </div>

          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => onInputChange("cep", e.target.value)}
              placeholder="00000-000"
              maxLength={9}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => onInputChange("observacoes", e.target.value)}
              placeholder="Informações adicionais sobre a empresa"
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => { 
              console.log("Cancel form button clicked");
              onCancel(); 
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {editingEmpresa ? "Atualizar" : "Cadastrar"} Empresa
          </Button>
        </div>
      </form>
    </>
  );
};

export default EmpresaForm;
