import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubstituirDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  documento: any;
  onSuccess: () => void;
}

export function SubstituirDocumentoModal({ 
  isOpen, 
  onClose, 
  documento, 
  onSuccess 
}: SubstituirDocumentoModalProps) {
  const { toast } = useToast();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF e imagens (JPG, PNG) são permitidos.",
          variant: "destructive",
        });
        return;
      }
      
      setArquivo(file);
    }
  };

  const handleSubstituir = async () => {
    if (!arquivo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para substituição.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload do novo arquivo
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${documento.funcionario_id}_${documento.nome.replace(/\s+/g, '_')}_substituido_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('funcionario-documentos')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      // Obter URL público do novo arquivo
      const { data: urlData } = supabase.storage
        .from('funcionario-documentos')
        .getPublicUrl(fileName);

      // Atualizar registro na tabela
      const { error: updateError } = await supabase
        .from('funcionario_documentos')
        .update({
          arquivo_nome: arquivo.name,
          arquivo_url: urlData.publicUrl,
          arquivo_tipo: arquivo.type,
          arquivo_tamanho: arquivo.size,
          updated_at: new Date().toISOString()
        })
        .eq('id', documento.id);

      if (updateError) throw updateError;

      // Remover arquivo antigo do storage
      const oldFileName = documento.arquivo_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage
          .from('funcionario-documentos')
          .remove([oldFileName]);
      }

      toast({
        title: "Sucesso",
        description: "Documento substituído com sucesso!",
      });

      onSuccess();
      onClose();
      setArquivo(null);
    } catch (error) {
      console.error('Erro ao substituir documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao substituir documento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!documento) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-600" />
            Substituir Documento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Documento atual:</p>
            <p className="text-sm text-gray-600">{documento.nome}</p>
            <p className="text-xs text-gray-500">{documento.arquivo_nome}</p>
            {documento.tem_validade && documento.data_validade && (
              <p className="text-xs text-orange-600">
                Vence em: {new Date(documento.data_validade).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="arquivo">Novo arquivo *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="arquivo"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('arquivo')?.click()}
                className="w-full"
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {arquivo ? arquivo.name : "Selecionar novo arquivo (PDF ou Imagem)"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSubstituir} 
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={uploading || !arquivo}
            >
              {uploading ? "Substituindo..." : "Substituir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}