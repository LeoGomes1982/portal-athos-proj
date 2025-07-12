import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface DocumentoFuncionario {
  id: number;
  nome: string;
  arquivo: File;
  nomeArquivo: string;
  temValidade: boolean;
  dataValidade?: string;
  funcionarioId: number;
  dataUpload: string;
  visualizado: boolean;
}

interface AdicionarDocumentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documento: DocumentoFuncionario) => void;
  funcionarioId: number;
}

export function AdicionarDocumentoModal({ isOpen, onClose, onSave, funcionarioId }: AdicionarDocumentoModalProps) {
  console.log("AdicionarDocumentoModal renderizado - isOpen:", isOpen);
  
  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [temValidade, setTemValidade] = useState(false);
  const [dataValidade, setDataValidade] = useState<Date>();

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
      if (!nome) {
        setNome(file.name.split('.')[0]); // Nome sem extensão
      }
    }
  };

  const handleSave = () => {
    if (!nome || !arquivo) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome e selecione um arquivo.",
        variant: "destructive",
      });
      return;
    }

    if (temValidade && !dataValidade) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a data de vencimento.",
        variant: "destructive",
      });
      return;
    }

    const documento: DocumentoFuncionario = {
      id: Date.now(),
      nome,
      arquivo,
      nomeArquivo: arquivo.name,
      temValidade,
      dataValidade: dataValidade ? format(dataValidade, "yyyy-MM-dd") : undefined,
      funcionarioId,
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      visualizado: false,
    };

    onSave(documento);
    
    // Resetar form
    setNome("");
    setArquivo(null);
    setTemValidade(false);
    setDataValidade(undefined);
    
    toast({
      title: "Sucesso",
      description: "Documento adicionado com sucesso!",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[60]">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="arquivo">Arquivo *</Label>
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
              >
                <Upload className="mr-2 h-4 w-4" />
                {arquivo ? arquivo.name : "Selecionar arquivo (PDF ou Imagem)"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="nome">Nome do Documento *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: RG, CPF, Carteira de Trabalho..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="validade"
              checked={temValidade}
              onCheckedChange={setTemValidade}
            />
            <Label htmlFor="validade">Este documento tem data de vencimento?</Label>
          </div>

          {temValidade && (
            <div>
              <Label>Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataValidade && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataValidade ? format(dataValidade, "dd/MM/yyyy") : "Selecione a data de vencimento"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[70]" align="start">
                  <Calendar
                    mode="single"
                    selected={dataValidade}
                    onSelect={setDataValidade}
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1">
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}