import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, DollarSign, Edit, Trash2, Plus, Clock, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import NovaPropostaModal from "@/components/modals/NovaPropostaModal";
import NovoContratoModal from "@/components/modals/NovoContratoModal";
import VisualizacaoContratoPropostaModal from "@/components/modals/VisualizacaoContratoPropostaModal";
import { generateContrato, ContratoData } from "@/templates/contratoTemplate";
import jsPDF from 'jspdf';

interface Proposta {
  id: string;
  cliente: string;
  empresa: string;
  servicos: Array<{
    descricao: string;
    jornada: string;
    horario: string;
    valor: number;
  }>;
  valorTotal: number;
  status: 'ativa' | 'inativa';
  data: string;
  tipo: 'proposta';
}

interface Contrato {
  id: string;
  cliente: string;
  empresa: string;
  servicos: Array<{
    descricao: string;
    jornada: string;
    horario: string;
    valor: number;
  }>;
  valorTotal: number;
  dataInicio: string;
  duracao: string;
  avisoPrevo: number;
  status: 'ativo' | 'inativo';
  data: string;
  tipo: 'contrato';
}

const ContratosPropostas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNovaPropostaOpen, setIsNovaPropostaOpen] = useState(false);
  const [isNovoContratoOpen, setIsNovoContratoOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Proposta | Contrato | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedPropostas = localStorage.getItem('propostas');
    const savedContratos = localStorage.getItem('contratos');
    
    if (savedPropostas) {
      setPropostas(JSON.parse(savedPropostas));
    } else {
      // Dados iniciais se não houver dados salvos
      const initialPropostas: Proposta[] = [
        {
          id: "1",
          cliente: "Empresa ABC Ltda",
          empresa: "GA SERVIÇOS",
          servicos: [
            { descricao: "Consultoria em RH", jornada: "8 horas", horario: "08:00-17:00", valor: 5000 },
            { descricao: "Treinamento", jornada: "4 horas", horario: "14:00-18:00", valor: 2000 }
          ],
          valorTotal: 7000,
          status: 'ativa',
          data: "2024-01-15",
          tipo: 'proposta'
        }
      ];
      setPropostas(initialPropostas);
      localStorage.setItem('propostas', JSON.stringify(initialPropostas));
    }

    if (savedContratos) {
      setContratos(JSON.parse(savedContratos));
    } else {
      const initialContratos: Contrato[] = [
        {
          id: "1",
          cliente: "Tech Solutions Ltd",
          empresa: "GOMES E GUIDOTTI",
          servicos: [
            { descricao: "Assessoria Jurídica", jornada: "8 horas", horario: "08:00-17:00", valor: 8000 },
            { descricao: "Consultoria Tributária", jornada: "4 horas", horario: "09:00-13:00", valor: 3000 }
          ],
          valorTotal: 11000,
          dataInicio: "2024-01-10",
          duracao: "12 meses",
          avisoPrevo: 30,
          status: 'ativo',
          data: "2024-01-10",
          tipo: 'contrato'
        }
      ];
      setContratos(initialContratos);
      localStorage.setItem('contratos', JSON.stringify(initialContratos));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (propostas.length > 0) {
      localStorage.setItem('propostas', JSON.stringify(propostas));
    }
  }, [propostas]);

  useEffect(() => {
    if (contratos.length > 0) {
      localStorage.setItem('contratos', JSON.stringify(contratos));
    }
  }, [contratos]);

  const totalContratos = contratos.filter(c => c.status === 'ativo').length;
  const totalPropostas = propostas.filter(p => p.status === 'ativa').length;

  const todosItens = [...propostas, ...contratos].sort((a, b) => {
    if (a.status === 'ativa' || a.status === 'ativo') return -1;
    if (b.status === 'ativa' || b.status === 'ativo') return 1;
    return 0;
  });

  const filteredItems = todosItens.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.cliente.toLowerCase().includes(searchTermLower) ||
      item.empresa.toLowerCase().includes(searchTermLower) ||
      item.servicos.some(s => s.descricao.toLowerCase().includes(searchTermLower));

    if (filterType === "todos") {
      return matchesSearch;
    } else {
      return item.tipo === filterType && matchesSearch;
    }
  });

  const handleView = (item: Proposta | Contrato) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleNovaProposta = (novaProposta: Omit<Proposta, 'id' | 'data' | 'tipo'>) => {
    const proposta: Proposta = {
      ...novaProposta,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      tipo: 'proposta'
    };
    setPropostas([...propostas, proposta]);
    
    toast({
      title: "Sucesso",
      description: "Proposta criada com sucesso!",
    });
  };

  const handleNovoContrato = (novoContrato: Omit<Contrato, 'id' | 'data' | 'tipo'>) => {
    const contrato: Contrato = {
      ...novoContrato,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      tipo: 'contrato'
    };
    setContratos([...contratos, contrato]);
    
    toast({
      title: "Sucesso",
      description: "Contrato criado com sucesso!",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleDownloadContrato = (contrato: Contrato, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Evitar que o clique abra o modal
    }

    // Dados básicos para gerar o contrato
    const contratoData: ContratoData = {
      contratanteNome: contrato.cliente,
      contratanteCnpj: "00.000.000/0001-00", // Valor padrão
      contratanteEndereco: "Endereço não informado",
      contratanteRepresentante: "Representante não informado",
      contratanteRepresentanteCpf: "000.000.000-00",
      contratadaNome: contrato.empresa === "GA SERVIÇOS" ? "GA Serviços Terceirizados Ltda" : "Gomes e Guidotti ME Ltda",
      contratadaCnpj: contrato.empresa === "GA SERVIÇOS" ? "46.784.651/0001-10" : "21.066.530/0001-02",
      contratadaEndereco: "Avenida Dois. número 105, sala 606, Edifício Flow Work, Parque Una Pelotas, RS",
      contratadaRepresentante: contrato.empresa === "GA SERVIÇOS" ? "Aline Guidotti Furtado Gomes e Silva" : "Leandro da Silva Gomes e Silva",
      contratadaRepresentanteCpf: contrato.empresa === "GA SERVIÇOS" ? "995.647.340.53" : "006.587.620.28",
      servicoDescricao: contrato.servicos[0]?.descricao || 'Prestação de Serviços',
      servicoJornada: contrato.servicos[0]?.jornada || '8 horas',
      servicoHorario: contrato.servicos[0]?.horario || '08:00-17:00',
      servicoRegime: '12x36 noturno de segunda a segunda',
      valorUnitario: contrato.servicos[0]?.valor || 0,
      quantidade: 1,
      valorMensal: contrato.valorTotal,
      dataInicio: contrato.dataInicio,
      duracao: parseInt(contrato.duracao) || 12,
      avisoPrevo: contrato.avisoPrevo,
      dataAssinatura: new Date().toLocaleDateString('pt-BR')
    };

    const contratoTexto = generateContrato(contratoData);
    downloadContratoAsPDF(contratoTexto, contrato.cliente);

    toast({
      title: "Download iniciado",
      description: "O contrato está sendo baixado...",
    });
  };

  const downloadContratoAsPDF = (contratoTexto: string, nomeCliente: string) => {
    const doc = new jsPDF();
    
    // Configurações da página seguindo especificações (margens 2.5cm = ~70.87 pontos)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 70.87; // 2.5cm em pontos
    const maxWidth = pageWidth - 2 * margin;
    let currentY = margin;
    let pageNumber = 1;

    // Função para adicionar cabeçalho oficial
    const addHeader = () => {
      // Cabeçalho oficial (título principal - 14pt, negrito, centralizado)
      doc.setFontSize(14);
      doc.setFont("times", "bold");
      
      const headerText = "REPÚBLICA FEDERATIVA DO BRASIL";
      const headerWidth = doc.getTextWidth(headerText);
      const headerX = (pageWidth - headerWidth) / 2;
      doc.text(headerText, headerX, currentY);
      currentY += 21; // 1.5x o tamanho da fonte para espaçamento
      
      // Título principal do contrato (14pt, negrito, centralizado)
      const title = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, currentY);
      currentY += 28; // Espaço maior após título principal
    };

    // Função para adicionar rodapé com numeração à direita
    const addFooter = () => {
      const footerY = pageHeight - margin + 20;
      doc.setFontSize(10);
      doc.setFont("times", "normal");
      
      // Número da página alinhado à direita
      const pageText = `${pageNumber}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      const pageTextX = pageWidth - margin - pageTextWidth;
      doc.text(pageText, pageTextX, footerY);
    };

    // Função para verificar se precisa de nova página
    const checkNewPage = (neededSpace: number = 25) => {
      if (currentY + neededSpace > pageHeight - margin - 30) {
        addFooter();
        doc.addPage();
        pageNumber++;
        currentY = margin;
      }
    };

    // Função para adicionar texto com formatação específica
    const addFormattedText = (
      text: string, 
      fontSize: number, 
      isBold: boolean = false, 
      alignment: 'left' | 'center' | 'justify' = 'justify',
      isMainTitle: boolean = false,
      isSectionTitle: boolean = false
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont("times", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, maxWidth);
      const lineSpacing = fontSize * 1.5; // Espaçamento de linha 1.5
      
      for (let i = 0; i < lines.length; i++) {
        checkNewPage();
        
        const line = lines[i];
        let x = margin;
        
        if (alignment === 'center' || isMainTitle) {
          // Centralizar
          const lineWidth = doc.getTextWidth(line);
          x = (pageWidth - lineWidth) / 2;
          doc.text(line, x, currentY);
        } else if (alignment === 'justify' && i < lines.length - 1 && line.trim() !== '' && !isSectionTitle) {
          // Justificar (exceto última linha e títulos de seção)
          const words = line.split(' ');
          if (words.length > 1) {
            const totalWordsWidth = words.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
            const totalSpaces = words.length - 1;
            const extraSpace = (maxWidth - totalWordsWidth) / totalSpaces;
            
            let currentX = margin;
            for (let j = 0; j < words.length; j++) {
              doc.text(words[j], currentX, currentY);
              if (j < words.length - 1) {
                currentX += doc.getTextWidth(words[j]) + doc.getTextWidth(' ') + extraSpace;
              }
            }
          } else {
            doc.text(line, margin, currentY);
          }
        } else {
          // Alinhamento à esquerda
          doc.text(line, margin, currentY);
        }
        
        currentY += lineSpacing;
      }
      
      // Espaçamento após parágrafos (12pt)
      if (isMainTitle) {
        currentY += 18; // Mais espaço após títulos principais
      } else if (isSectionTitle) {
        currentY += 12; // Espaço médio após títulos de seção
      } else {
        currentY += 12; // 12pt após parágrafos normais
      }
    };

    // Adicionar primeira página com cabeçalho
    addHeader();

    // Dividir o texto em seções e processar seguindo as especificações
    const sections = contratoTexto.split('\n\n');
    
    sections.forEach((section) => {
      if (section.trim()) {
        const lines = section.split('\n');
        const firstLine = lines[0].trim();
        
        // Verificar se é um título de seção
        const isTitleSection = ['Contratante', 'Contratada', 'Objeto', 'Obrigações da Contratada', 'Obrigações da Contratante', 'Financeiro', 'LGPD', 'Prazos e validades'].includes(firstLine);
        
        if (isTitleSection) {
          // Título de seção: 12pt, negrito, alinhado à esquerda
          addFormattedText(firstLine, 12, true, 'left', false, true);
          if (lines.length > 1) {
            const content = lines.slice(1).join('\n');
            // Corpo do texto: 10pt, justificado
            addFormattedText(content, 10, false, 'justify');
          }
        } else {
          // Corpo do texto: 10pt, justificado
          addFormattedText(section, 10, false, 'justify');
        }
      }
    });

    // Garantir que a seção de assinaturas fique na segunda página
    checkNewPage(100); // Espaço para seção de assinaturas
    
    // Título da seção de assinaturas (título de seção: 12pt, negrito, alinhado à esquerda)
    addFormattedText("ASSINATURAS E QUALIFICAÇÕES", 12, true, 'left', false, true);
    
    // Linha separadora
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 18;

    // Data e local (corpo do texto: 10pt, justificado)
    const hoje = new Date().toLocaleDateString('pt-BR');
    const dataText = `Por este instrumento particular, as partes abaixo identificadas e qualificadas:`;
    addFormattedText(dataText, 10, false, 'justify');

    // Contratante (título em negrito)
    addFormattedText("CONTRATANTE:", 10, true, 'left', false, true);
    addFormattedText(nomeCliente, 10, false, 'left');
    
    currentY += 6; // Pequeno espaço antes da linha de assinatura
    
    // Linha para assinatura do contratante
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("_".repeat(50), margin, currentY);
    currentY += 15;
    doc.text("(assinatura do contratante)", margin, currentY);
    currentY += 24;

    // Contratada (título em negrito)
    addFormattedText("CONTRATADA:", 10, true, 'left', false, true);
    addFormattedText("GA Serviços Terceirizados Ltda", 10, false, 'left');
    
    currentY += 6; // Pequeno espaço antes da linha de assinatura
    
    // Linha para assinatura da contratada
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("_".repeat(50), margin, currentY);
    currentY += 15;
    doc.text("(assinatura da contratada)", margin, currentY);
    currentY += 24;

    // Parágrafo final (corpo do texto: 10pt, justificado)
    const finalText = `Firmam o presente contrato em duas vias de igual teor e forma, na presença de duas testemunhas que também o subscrevem, para que produza seus jurídicos e legais efeitos.`;
    addFormattedText(finalText, 10, false, 'justify');
    
    // Local e data final
    const localDataText = `________________, ${hoje}`;
    addFormattedText(localDataText, 10, false, 'left');

    // Adicionar rodapé na última página
    addFooter();

    // Salvar o PDF
    doc.save(`Contrato_${nomeCliente.replace(/\s+/g, '_')}_${hoje.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen">
      <div className="content-wrapper animate-fade-in bg-orange-100/80 rounded-lg shadow-lg m-6 p-8">
        {/* Navigation Button */}
        <div className="navigation-button">
          <button 
            onClick={() => navigate("/comercial")}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header-centered">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h1 className="page-title mb-0">Contratos e Propostas</h1>
            <p className="text-description">Gerencie propostas comerciais e contratos de clientes e fornecedores</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-slide-up">
          <div className="modern-card bg-white border-gray-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalContratos}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Contratos</div>
              <div className="text-xs text-gray-500 font-medium">
                Contratos ativos
              </div>
            </div>
          </div>

          <div className="modern-card bg-white border-gray-200">
            <div className="card-content text-center p-4">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-bold text-gray-700">
                {totalPropostas}
              </div>
              <div className="text-sm text-gray-600 mb-1">Total de Propostas</div>
              <div className="text-xs text-gray-500 font-medium">
                Propostas ativas
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <Button
            onClick={() => setIsNovaPropostaOpen(true)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12"
          >
            <Plus size={20} />
            Nova Proposta
          </Button>
          <Button
            onClick={() => setIsNovoContratoOpen(true)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12"
          >
            <Plus size={20} />
            Novo Contrato
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              type="search"
              placeholder="Buscar por cliente, empresa ou serviço..."
              className="w-full md:max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setFilterType("todos")}
                variant={filterType === "todos" ? "default" : "outline"}
                size="sm"
              >
                Todos
              </Button>
              <Button
                onClick={() => setFilterType("contrato")}
                variant={filterType === "contrato" ? "default" : "outline"}
                size="sm"
              >
                Contratos
              </Button>
              <Button
                onClick={() => setFilterType("proposta")}
                variant={filterType === "proposta" ? "default" : "outline"}
                size="sm"
              >
                Propostas
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Contratos e Propostas */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Contratos e Propostas</h2>
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-orange-200 cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleView(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.tipo === 'proposta' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.tipo === 'proposta' ? 'Proposta' : 'Contrato'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (item.status === 'ativa' || item.status === 'ativo')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status === 'ativa' || item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {item.cliente}
                    </h3>
                    <p className="text-slate-600 mb-1">Empresa: {item.empresa}</p>
                    <p className="text-sm text-slate-500">
                      {item.servicos.length} serviço(s) • {new Date(item.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-slate-800">
                      R$ {item.valorTotal.toLocaleString('pt-BR')}
                    </p>
                    {item.tipo === 'contrato' && (
                      <Button
                        onClick={(e) => handleDownloadContrato(item as Contrato, e)}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Download size={14} />
                        Baixar PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-slate-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-slate-500">
            © 2024 Grupo Athos. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de Visualização */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Visualizar {selectedItem?.tipo === "contrato" ? "Contrato" : "Proposta"}
              </DialogTitle>
              {selectedItem?.tipo === 'contrato' && (
                <Button
                  onClick={() => handleDownloadContrato(selectedItem as Contrato)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Baixar PDF
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cliente</Label>
                  <p className="text-slate-700 font-medium">{selectedItem.cliente}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-slate-700 font-medium">{selectedItem.empresa}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <p className="text-slate-700 font-medium capitalize">{selectedItem.tipo}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-slate-700 font-medium capitalize">{selectedItem.status}</p>
                </div>
                {selectedItem.tipo === 'contrato' && 'dataInicio' in selectedItem && (
                  <>
                    <div>
                      <Label>Data de Início</Label>
                      <p className="text-slate-700 font-medium">
                        {new Date(selectedItem.dataInicio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <Label>Duração</Label>
                      <p className="text-slate-700 font-medium">{selectedItem.duracao}</p>
                    </div>
                    <div>
                      <Label>Aviso Prévio</Label>
                      <p className="text-slate-700 font-medium">{selectedItem.avisoPrevo} dias</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label>Serviços</Label>
                <div className="mt-2 space-y-2">
                  {selectedItem.servicos.map((servico, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">{servico.descricao}</p>
                      <p className="text-sm text-gray-600">
                        Jornada: {servico.jornada} • Horário: {servico.horario} • 
                        Valor: R$ {servico.valor.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Valor Total:</Label>
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {selectedItem.valorTotal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modais */}
      <NovaPropostaModal
        isOpen={isNovaPropostaOpen}
        onClose={() => setIsNovaPropostaOpen(false)}
        onSubmit={handleNovaProposta}
      />

      <NovoContratoModal
        isOpen={isNovoContratoOpen}
        onClose={() => setIsNovoContratoOpen(false)}
        onSubmit={handleNovoContrato}
      />
    </div>
  );
};

export default ContratosPropostas;