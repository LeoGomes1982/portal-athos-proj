import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Dependente {
  id: number;
  nome: string;
  grauParentesco: string;
  dataNascimento: string;
  cpf: string;
  arquivo?: File;
  nomeArquivo?: string;
}

interface AdicionarDependenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dependente: Dependente) => void;
  funcionarioId: number;
}

export function AdicionarDependenteModal({ isOpen, onClose, onSave, funcionarioId }: AdicionarDependenteModalProps) {
  const [nome, setNome] = useState("");
  const [grauParentesco, setGrauParentesco] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date>();
  const [cpf, setCpf] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const getDocumentoTipo = (grau: string) => {
    switch (grau) {
      case "filho":
      case "filha":
        return "Certidão de Nascimento";
      case "conjuge":
        return "Certidão de Casamento";
      default:
        return "Identidade";
    }
  };

  const handleSave = () => {
    if (!nome || !grauParentesco || !dataNascimento || !cpf) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const dependente: Dependente = {
      id: Date.now(),
      nome,
      grauParentesco,
      dataNascimento: format(dataNascimento, "dd/MM/yyyy"),
      cpf,
      arquivo: arquivo || undefined,
      nomeArquivo: arquivo?.name,
    };

    onSave(dependente);
    
    // Resetar form
    setNome("");
    setGrauParentesco("");
    setDataNascimento(undefined);
    setCpf("");
    setArquivo(null);
    
    toast({
      title: "Sucesso",
      description: "Dependente adicionado com sucesso!",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Dependente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo do dependente"
            />
          </div>

          <div>
            <Label htmlFor="grau">Grau de Parentesco *</Label>
            <Select value={grauParentesco} onValueChange={setGrauParentesco}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grau de parentesco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filho">Filho(a)</SelectItem>
                <SelectItem value="conjuge">Cônjuge</SelectItem>
                <SelectItem value="enteado">Enteado(a)</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data de Nascimento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataNascimento && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataNascimento}
                  onSelect={setDataNascimento}
                  disabled={(date) => date > new Date()}
                  className="pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          {grauParentesco && (
            <div>
              <Label htmlFor="arquivo">{getDocumentoTipo(grauParentesco)}</Label>
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
                  {arquivo ? arquivo.name : `Selecionar ${getDocumentoTipo(grauParentesco)}`}
                </Button>
              </div>
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