import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText } from "lucide-react";
import GerarContratoTemplateModal from "./GerarContratoTemplateModal";
import ContratoGeradoModal from "./ContratoGeradoModal";
import { generateContrato, ContratoData } from "@/templates/contratoTemplate";

interface NovoContratoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contrato: {
    cliente: string;
    empresa: string;
    servicos: Array<{ descricao: string; jornada: string; horario: string; valor: number }>;
    valorTotal: number;
    dataInicio: string;
    duracao: string;
    avisoPrevo: number;
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
  const [dataInicio, setDataInicio] = useState("");
  const [duracao, setDuracao] = useState("");
  const [avisoPrevo, setAvisoPrevo] = useState<number>(30);
  const [showGerarTemplate, setShowGerarTemplate] = useState(false);
  const [clientesFornecedores, setClientesFornecedores] = useState<ClienteFornecedor[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [showContratoGerado, setShowContratoGerado] = useState(false);
  const [contratoGerado, setContratoGerado] = useState('');
  
  // Novos campos para o template
  const [contratanteNome, setContratanteNome] = useState('');
  const [contratanteCnpj, setContratanteCnpj] = useState('');
  const [contratanteEndereco, setContratanteEndereco] = useState('');
  const [contratanteRepresentante, setContratanteRepresentante] = useState('');
  const [contratadaNome, setContratadaNome] = useState('GA Serviços Terceirizados');
  const [contratadaCnpj, setContratadaCnpj] = useState('46.784.651/0001-10');
  const [contratadaEndereco, setContratadaEndereco] = useState('Avenida Dois. número 105, sala 606, Edifício Flow Work, Parque Una Pelotas, RS');
  const [contratadaRepresentante, setContratadaRepresentante] = useState('Aline Guidotti Furtado Gomes e Silva');
  const [servicoRegime, setServicoRegime] = useState('12x36 noturno de segunda a segunda');
  const [quantidade, setQuantidade] = useState(2);

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
    
    if (!cliente || !empresa || !dataInicio || !duracao || servicos.some(s => !s.descricao || !s.jornada || !s.horario || s.valor <= 0)) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSubmit({
      cliente,
      empresa,
      servicos: servicos.filter(s => s.descricao && s.valor > 0),
      valorTotal,
      dataInicio,
      duracao,
      avisoPrevo,
      status: 'ativo'
    });

    // Reset form
    setCliente("");
    setEmpresa("");
    setServicos([{ descricao: "", jornada: "", horario: "", valor: 0 }]);
    setDataInicio("");
    setDuracao("");
    setAvisoPrevo(30);
    onClose();
  };

  const handleClose = () => {
    setCliente("");
    setEmpresa("");
    setServicos([{ descricao: "", jornada: "", horario: "", valor: 0 }]);
    setDataInicio("");
    setDuracao("");
    setAvisoPrevo(30);
    setShowGerarTemplate(false);
    setShowContratoGerado(false);
    setContratoGerado('');
    // Reset novos campos
    setContratanteNome('');
    setContratanteCnpj('');
    setContratanteEndereco('');
    setContratanteRepresentante('');
    setServicoRegime('12x36 noturno de segunda a segunda');
    setQuantidade(2);
    onClose();
  };

  const handleGerarComTemplate = () => {
    if (!contratanteNome || !contratanteCnpj || !contratanteEndereco || !contratanteRepresentante || !dataInicio) {
      alert('Por favor, preencha todos os campos obrigatórios antes de gerar o contrato.');
      return;
    }

    const contratoData: ContratoData = {
      contratanteNome,
      contratanteCnpj,
      contratanteEndereco,
      contratanteRepresentante,
      contratadaNome,
      contratadaCnpj,
      contratadaEndereco,
      contratadaRepresentante,
      servicoDescricao: servicos[0]?.descricao || '',
      servicoJornada: servicos[0]?.jornada || '',
      servicoHorario: servicos[0]?.horario || '',
      servicoRegime,
      valorUnitario: servicos[0]?.valor || 0,
      quantidade,
      valorMensal: servicos.reduce((acc, servico) => acc + servico.valor, 0) * quantidade,
      dataInicio,
      duracao: parseInt(duracao) || 12,
      avisoPrevo,
      dataAssinatura: new Date().toLocaleDateString('pt-BR')
    };

    const contratoTexto = generateContrato(contratoData);
    setContratoGerado(contratoTexto);
    setShowContratoGerado(true);
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
            {/* Dados do Contratante */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados do Contratante</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contratanteNome">Nome/Razão Social*</Label>
                  <Input 
                    id="contratanteNome"
                    value={contratanteNome} 
                    onChange={(e) => setContratanteNome(e.target.value)}
                    placeholder="Nome da empresa contratante"
                  />
                </div>
                <div>
                  <Label htmlFor="contratanteCnpj">CNPJ*</Label>
                  <Input 
                    id="contratanteCnpj"
                    value={contratanteCnpj} 
                    onChange={(e) => setContratanteCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contratanteEndereco">Endereço*</Label>
                <Textarea 
                  id="contratanteEndereco"
                  value={contratanteEndereco} 
                  onChange={(e) => setContratanteEndereco(e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
              <div>
                <Label htmlFor="contratanteRepresentante">Representante Legal*</Label>
                <Input 
                  id="contratanteRepresentante"
                  value={contratanteRepresentante} 
                  onChange={(e) => setContratanteRepresentante(e.target.value)}
                  placeholder="Nome do representante legal"
                />
              </div>
            </div>

            {/* Dados da Contratada (GA Serviços) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados da Contratada</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contratadaNome">Nome/Razão Social</Label>
                  <Input 
                    id="contratadaNome"
                    value={contratadaNome} 
                    onChange={(e) => setContratadaNome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contratadaCnpj">CNPJ</Label>
                  <Input 
                    id="contratadaCnpj"
                    value={contratadaCnpj} 
                    onChange={(e) => setContratadaCnpj(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contratadaEndereco">Endereço</Label>
                <Textarea 
                  id="contratadaEndereco"
                  value={contratadaEndereco} 
                  onChange={(e) => setContratadaEndereco(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contratadaRepresentante">Representante Legal</Label>
                <Input 
                  id="contratadaRepresentante"
                  value={contratadaRepresentante} 
                  onChange={(e) => setContratadaRepresentante(e.target.value)}
                />
              </div>
            </div>

            {/* Data de Início e Duração */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (meses) *</Label>
                <Input
                  id="duracao"
                  type="number"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                  placeholder="12"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avisoPrevo">Aviso Prévio (dias) *</Label>
                <Input
                  id="avisoPrevo"
                  type="number"
                  value={avisoPrevo}
                  onChange={(e) => setAvisoPrevo(Number(e.target.value))}
                  placeholder="30"
                  min="1"
                />
              </div>
            </div>

            {/* Serviços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Serviços</h3>
              <div className="flex items-center justify-between">
                <Label>Configurações de Serviço</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarServico}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servicoRegime">Regime de Trabalho</Label>
                  <Input
                    id="servicoRegime"
                    value={servicoRegime}
                    onChange={(e) => setServicoRegime(e.target.value)}
                    placeholder="Ex: 12x36 noturno de segunda a segunda"
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade de Pessoas</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
              </div>

              {servicos.map((servico, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Serviço {index + 1}</h4>
                    {servicos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerServico(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`descricao-${index}`}>Descrição</Label>
                      <Input
                        id={`descricao-${index}`}
                        value={servico.descricao}
                        onChange={(e) => atualizarServico(index, 'descricao', e.target.value)}
                        placeholder="Ex: Guarda Patrimonial"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`valor-${index}`}>Valor Unitário (R$)</Label>
                      <Input
                        id={`valor-${index}`}
                        type="number"
                        value={servico.valor}
                        onChange={(e) => atualizarServico(index, 'valor', parseFloat(e.target.value) || 0)}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`jornada-${index}`}>Jornada</Label>
                      <Input
                        id={`jornada-${index}`}
                        value={servico.jornada}
                        onChange={(e) => atualizarServico(index, 'jornada', e.target.value)}
                        placeholder="Ex: 180h"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`horario-${index}`}>Horário</Label>
                      <Input
                        id={`horario-${index}`}
                        value={servico.horario}
                        onChange={(e) => atualizarServico(index, 'horario', e.target.value)}
                        placeholder="Ex: das 19:00 às 07:00"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-right space-y-2">
                <div>
                  <Label className="text-sm">
                    Valor Total por Pessoa: R$ {servicos.reduce((acc, servico) => acc + servico.valor, 0).toFixed(2)}
                  </Label>
                </div>
                <div>
                  <Label className="text-lg font-semibold">
                    Valor Total Mensal: R$ {(servicos.reduce((acc, servico) => acc + servico.valor, 0) * quantidade).toFixed(2)}
                  </Label>
                </div>
              </div>
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
                disabled={!contratanteNome || !contratanteCnpj || !contratanteEndereco || !contratanteRepresentante || !dataInicio}
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
      
      <ContratoGeradoModal
        isOpen={showContratoGerado}
        onClose={() => setShowContratoGerado(false)}
        contratoTexto={contratoGerado}
        nomeCliente={contratanteNome}
      />
    </>
  );
}
