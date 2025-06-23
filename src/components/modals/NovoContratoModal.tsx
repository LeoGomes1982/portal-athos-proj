import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, FileText } from "lucide-react";
import GerarContratoTemplateModal from "./GerarContratoTemplateModal";

interface NovoContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contrato: {
    cliente: string;
    empresa: string;
    servicos: Array<{ descricao: string; valor: number }>;
    valorTotal: number;
    status: 'ativo';
  }) => void;
}

interface Servico {
  descricao: string;
  valor: number;
}

export default function NovoContratoModal({ isOpen, onClose, onSubmit }: NovoContratoModalProps) {
  const [cliente, setCliente] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([{ descricao: "", valor: 0 }]);
  const [showGerarTemplate, setShowGerarTemplate] = useState(false);

  // Mock de clientes ativos - em produção viria de uma API
  const clientesAtivos = [
    "Empresa ABC Ltda",
    "Tech Solutions Ltd", 
    "Inovação Digital S.A.",
    "Consultoria Moderna Ltda",
    "Desenvolvimento Web Inc"
  ];

  const empresas = ["GA SERVIÇOS", "GOMES E GUIDOTTI"];

  const adicionarServico = () => {
    setServicos([...servicos, { descricao: "", valor: 0 }]);
  };

  const removerServico = (index: number) => {
    if (servicos.length > 1) {
      setServicos(servicos.filter((_, i) => i !== index));
    }
  };

  const atualizarServico = (index: number, campo: keyof Servico, valor: string | number) => {
    const novosServicos = [...servicos];
    if (campo === 'valor') {
      novosServicos[index][campo] = Number(valor);
    } else {
      novosServicos[index][campo] = valor as string;
    }
    setServicos(novosServicos);
  };

  const valorTotal = servicos.reduce((total, servico) => total + servico.valor, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cliente || !empresa || servicos.some(s => !s.descricao || s.valor <= 0)) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit({
      cliente,
      empresa,
      servicos: servicos.filter(s => s.descricao && s.valor > 0),
      valorTotal,
      status: 'ativo'
    });

    // Reset form
    setCliente("");
    setEmpresa("");
    setServicos([{ descricao: "", valor: 0 }]);
    onClose();
  };

  const handleClose = () => {
    setCliente("");
    setEmpresa("");
    setServicos([{ descricao: "", valor: 0 }]);
    onClose();
  };

  const handleGerarComTemplate = () => {
    if (!cliente || !empresa || servicos.some(s => !s.descricao || s.valor <= 0)) {
      alert("Por favor, preencha todos os campos antes de gerar o contrato.");
      return;
    }
    setShowGerarTemplate(true);
  };

  const contratoData = {
    cliente,
    empresa,
    servicos: servicos.filter(s => s.descricao && s.valor > 0),
    valorTotal,
    status: 'ativo' as const
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-600">
              Novo Contrato
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente ativo" />
                </SelectTrigger>
                <SelectContent>
                  {clientesAtivos.map((clienteItem) => (
                    <SelectItem key={clienteItem} value={clienteItem}>
                      {clienteItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Empresa Contratada */}
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa Contratada *</Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresaItem) => (
                    <SelectItem key={empresaItem} value={empresaItem}>
                      {empresaItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Serviços */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Serviços Contratados *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarServico}
                >
                  <Plus size={16} />
                  Adicionar Serviço
                </Button>
              </div>

              {servicos.map((servico, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`descricao-${index}`}>Descrição do Serviço</Label>
                    <Input
                      id={`descricao-${index}`}
                      value={servico.descricao}
                      onChange={(e) => atualizarServico(index, 'descricao', e.target.value)}
                      placeholder="Ex: Assessoria Jurídica"
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`valor-${index}`}>Valor (R$)</Label>
                    <Input
                      id={`valor-${index}`}
                      type="number"
                      value={servico.valor || ''}
                      onChange={(e) => atualizarServico(index, 'valor', e.target.value)}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {servicos.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerServico(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Valor Total */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Valor Total:</Label>
                <span className="text-2xl font-bold text-orange-600">
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              {/* Botão para gerar com template */}
              <Button
                type="button"
                onClick={handleGerarComTemplate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!cliente || !empresa || servicos.some(s => !s.descricao || s.valor <= 0)}
              >
                <FileText size={16} />
                Gerar Contrato com Template
              </Button>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Criar Contrato
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <GerarContratoTemplateModal
        isOpen={showGerarTemplate}
        onClose={() => setShowGerarTemplate(false)}
        contratoData={contratoData}
      />
    </>
  );
}
