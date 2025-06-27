import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Edit, Trash2, Share, Download } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';

interface Item {
  id: string;
  cliente: string;
  empresa: string;
  servicos: Array<{
    descricao: string;
    valor: number;
  }>;
  valorTotal: number;
  status: 'ativa' | 'inativa' | 'ativo' | 'inativo';
  data: string;
  tipo: 'proposta' | 'contrato';
}

interface VisualizacaoContratoPropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
}

export default function VisualizacaoContratoPropostaModal({ 
  isOpen, 
  onClose, 
  item 
}: VisualizacaoContratoPropostaModalProps) {
  const [isActive, setIsActive] = useState(true);

  if (!item) return null;

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    // Aqui você implementaria a lógica para atualizar o status no backend
    console.log(`Status alterado para: ${checked ? 'ativo' : 'inativo'}`);
  };

  const handleEdit = () => {
    console.log('Editar item:', item.id);
    // Aqui você abriria o modal de edição
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir esta ${item.tipo}?`)) {
      console.log('Excluir item:', item.id);
      // Aqui você implementaria a lógica de exclusão
      onClose();
    }
  };

  const handleShare = () => {
    const texto = `${item.tipo === 'proposta' ? 'Proposta Comercial' : 'Contrato'} - ${item.cliente}\n\nEmpresa: ${item.empresa}\nValor Total: R$ ${item.valorTotal.toLocaleString('pt-BR')}\n\nServiços:\n${item.servicos.map(s => `• ${s.descricao}: R$ ${s.valor.toLocaleString('pt-BR')}`).join('\n')}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const handleDownload = async () => {
    try {
      // Criar nova instância do jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Configurações da página
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Adicionar logo da empresa
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = '/lovable-uploads/04ea6679-4d34-4222-8407-5528da6fbe52.png';
        
        await new Promise((resolve, reject) => {
          logoImg.onload = () => resolve(logoImg);
          logoImg.onerror = reject;
        });
        
        // Adicionar logo alinhado à esquerda com proporção padrão (quadrada)
        const logoSize = 20; // Tamanho padrão quadrado
        pdf.addImage(logoImg, 'PNG', margin, margin, logoSize, logoSize);
      } catch (error) {
        console.log('Erro ao carregar logo, continuando sem logo:', error);
      }
      
      let yPosition = margin + 25; // Posição ao lado do logo
      
      // Título (alinhado à esquerda, ao lado do logo)
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(251, 146, 60); // Cor laranja
      const titulo = item.tipo === 'proposta' ? 'PROPOSTA COMERCIAL' : 'CONTRATO';
      pdf.text(titulo, margin + 25, yPosition); // Posicionado ao lado do logo
      yPosition += 25;
      
      // Informações do cliente
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('INFORMAÇÕES DO CLIENTE', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Cliente: ${item.cliente}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Empresa Contratada: ${item.empresa}`, margin, yPosition);
      yPosition += 20;
      
      // Serviços
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`SERVIÇOS ${item.tipo === 'proposta' ? 'SOLICITADOS' : 'CONTRATADOS'}`, margin, yPosition);
      yPosition += 15;
      
      // Tabela de serviços
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // Cabeçalho da tabela
      pdf.setFillColor(251, 146, 60);
      pdf.rect(margin, yPosition - 5, contentWidth, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DESCRIÇÃO', margin + 5, yPosition + 2);
      pdf.text('VALOR', pageWidth - margin - 40, yPosition + 2);
      yPosition += 15;
      
      // Linhas dos serviços
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      item.servicos.forEach((servico, index) => {
        // Verificar se precisa de nova página
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Linha zebrada
        if (index % 2 === 0) {
          pdf.setFillColor(248, 248, 248);
          pdf.rect(margin, yPosition - 5, contentWidth, 10, 'F');
        }
        
        pdf.text(servico.descricao, margin + 5, yPosition + 2);
        pdf.text(`R$ ${servico.valor.toLocaleString('pt-BR')}`, pageWidth - margin - 40, yPosition + 2);
        yPosition += 12;
      });
      
      yPosition += 10;
      
      // Valor total (alinhado com os valores acima)
      pdf.setFillColor(251, 146, 60);
      pdf.rect(margin, yPosition - 5, contentWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VALOR TOTAL:', margin + 5, yPosition + 5);
      pdf.text(`R$ ${item.valorTotal.toLocaleString('pt-BR')}`, pageWidth - margin - 40, yPosition + 5);
      yPosition += 25;
      
      // Rodapé com data ao lado dos direitos reservados
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      
      const copyrightText = '© 2024 Grupo Athos. Todos os direitos reservados.';
      const dataText = `Data: ${new Date(item.data).toLocaleDateString('pt-BR')}`;
      
      pdf.text(copyrightText, margin, pageHeight - 20);
      pdf.text(dataText, pageWidth - margin - pdf.getTextWidth(dataText), pageHeight - 20);
      
      // Salvar o PDF
      const fileName = `${item.tipo}-${item.cliente.replace(/\s+/g, '-')}-${item.data}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF gerado com sucesso');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-orange-600">
              {item.tipo === 'proposta' ? 'Proposta Comercial' : 'Contrato'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isActive}
                onCheckedChange={handleStatusChange}
              />
              <Label htmlFor="status">
                Status: {isActive ? 'Ativo' : 'Inativo'}
              </Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-green-50 hover:bg-green-100 text-green-700"
              >
                <Share className="h-4 w-4" />
                Compartilhar WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Cliente</Label>
                <p className="text-lg font-semibold">{item.cliente}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Empresa Contratada</Label>
                <p className="text-lg font-semibold">{item.empresa}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Data</Label>
                <p className="text-lg font-semibold">
                  {new Date(item.data).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Valor Total</Label>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {item.valorTotal.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">
              Serviços {item.tipo === 'proposta' ? 'Solicitados' : 'Contratados'}
            </Label>
            <div className="space-y-3">
              {item.servicos.map((servico, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{servico.descricao}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      R$ {servico.valor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-lg font-semibold">Total de Serviços:</Label>
                <p className="text-sm text-gray-600">{item.servicos.length} item(ns)</p>
              </div>
              <div className="text-right">
                <Label className="text-lg font-semibold">Valor Total:</Label>
                <p className="text-3xl font-bold text-orange-600">
                  R$ {item.valorTotal.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
