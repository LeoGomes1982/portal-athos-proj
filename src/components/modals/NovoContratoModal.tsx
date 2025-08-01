import { useState, useEffect } from "react";
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
    servicos: Array<{ descricao: string; jornada: string; horario: string; valor: number }>;
    valorTotal: number;
    status: 'ativo';
  }) => void;
}

interface Servico {
  descricao: string;
  jornada: string;
  horario: string;
  valor: number;
}

interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: "cliente" | "fornecedor";
}

interface Empresa {
  id: string;
  nome: string;
}

export default function NovoContratoModal({ isOpen, onClose, onSubmit }: NovoContratoModalProps) {
  const [cliente, setCliente] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [servicos, setServicos] = useState<Servico[]>([{ descricao: "", jornada: "", horario: "", valor: 0 }]);
  const [showGerarTemplate, setShowGerarTemplate] = useState(false);
  const [clientesFornecedores, setClientesFornecedores] = useState<ClienteFornecedor[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // Carregar clientes e fornecedores do localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('clientesFornecedores');
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      setClientesFornecedores(clients);
    }

    const savedEmpresas = localStorage.getItem('empresas');
    if (savedEmpresas) {
      const empresasData = JSON.parse(savedEmpresas);
      setEmpresas(empresasData);
    } else {
      // Empresas padrão se não houver dados salvos
      setEmpresas([
        { id: "1", nome: "GA SERVIÇOS" },
        { id: "2", nome: "GOMES E GUIDOTTI" }
      ]);
    }
  }, [isOpen]);

  const adicionarServico = () => {
    setServicos([...servicos, { descricao: "", jornada: "", horario: "", valor: 0 }]);
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
    
    if (!cliente || !empresa || servicos.some(s => !s.descricao || !s.jornada || !s.horario || s.valor <= 0)) {
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
    setServicos([{ descricao: "", jornada: "", horario: "", valor: 0 }]);
    onClose();
  };

  const handleClose = () => {
    setCliente("");
    setEmpresa("");
    setServicos([{ descricao: "", jornada: "", horario: "", valor: 0 }]);
    onClose();
  };

  const handleGerarComTemplate = () => {
    if (!cliente || !empresa || servicos.some(s => !s.descricao || !s.jornada || !s.horario || s.valor <= 0)) {
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
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientesFornecedores.map((clienteItem) => (
                    <SelectItem key={clienteItem.id} value={clienteItem.nome}>
                      {clienteItem.nome} ({clienteItem.tipo})
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
                    <SelectItem key={empresaItem.id} value={empresaItem.nome}>
                      {empresaItem.nome}
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
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Label htmlFor={`descricao-${index}`}>Descrição do Serviço *</Label>
                      <Input
                        id={`descricao-${index}`}
                        value={servico.descricao}
                        onChange={(e) => atualizarServico(index, 'descricao', e.target.value)}
                        placeholder="Ex: Assessoria Jurídica"
                      />
                    </div>
                    {servicos.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removerServico(index)}
                        className="text-red-600 hover:text-red-700 mt-6"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`jornada-${index}`}>Jornada *</Label>
                      <Input
                        id={`jornada-${index}`}
                        value={servico.jornada}
                        onChange={(e) => atualizarServico(index, 'jornada', e.target.value)}
                        placeholder="Ex: 8 horas diárias"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`horario-${index}`}>Horário *</Label>
                      <Input
                        id={`horario-${index}`}
                        value={servico.horario}
                        onChange={(e) => atualizarServico(index, 'horario', e.target.value)}
                        placeholder="Ex: 08:00 às 17:00"
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`valor-${index}`}>Valor (R$) *</Label>
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
                  </div>
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
                disabled={!cliente || !empresa || servicos.some(s => !s.descricao || !s.jornada || !s.horario || s.valor <= 0)}
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
