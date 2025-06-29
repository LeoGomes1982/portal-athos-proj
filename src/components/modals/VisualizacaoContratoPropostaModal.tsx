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
    console.log(`Status alterado para: ${checked ? 'ativo' : 'inativo'}`);
  };

  const handleEdit = () => {
    console.log('Editar item:', item.id);
    // Fechar modal antes de abrir edição
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir esta ${item.tipo}?`)) {
      console.log('Excluir item:', item.id);
      onClose();
    }
  };

  const handleShare = () => {
    try {
      const texto = `${item.tipo === 'proposta' ? 'Proposta Comercial' : 'Contrato'} - ${item.cliente}\n\nEmpresa: ${item.empresa}\nValor Total: R$ ${item.valorTotal.toLocaleString('pt-BR')}\n\nServiços:\n${item.servicos.map(s => `• ${s.descricao}: R$ ${s.valor.toLocaleString('pt-BR')}`).join('\n')}`;
      
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao compartilhar. Tente novamente.');
    }
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
      
      let yPosition = margin;
      
      // Adicionar caixa de fundo azul serenity transparente para o logo
      pdf.setFillColor(147, 197, 253, 0.1); // Azul serenity com transparência
      pdf.rect(margin, yPosition, 25, 25, 'F'); // Caixa de fundo
      
      // Adicionar logo da empresa com cores invertidas
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = '/lovable-uploads/98b16d4a-c3b8-4aa7-938b-8b2b5c4fbc57.png';
        
        await new Promise((resolve, reject) => {
          logoImg.onload = () => resolve(logoImg);
          logoImg.onerror = reject;
        });
        
        // Criar canvas para inverter cores e trocar laranja por azul serenity
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = logoImg.width;
        canvas.height = logoImg.height;
        
        // Desenhar imagem original
        ctx.drawImage(logoImg, 0, 0);
        
        // Obter dados dos pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Processar cada pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Verificar se é laranja (aproximadamente)
          if (r > 200 && g > 100 && g < 200 && b < 100) {
            // Substituir por azul serenity (147, 197, 253)
            data[i] = 147;     // R
            data[i + 1] = 197; // G
            data[i + 2] = 253; // B
          }
          // Inverter cores: branco para preto e preto para branco
          else if (r > 200 && g > 200 && b > 200) {
            // Branco para preto
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
          }
          else if (r < 50 && g < 50 && b < 50) {
            // Preto para branco
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
          }
        }
        
        // Aplicar mudanças
        ctx.putImageData(imageData, 0, 0);
        
        // Converter canvas para imagem
        const modifiedImageData = canvas.toDataURL('image/png');
        
        // Adicionar logo modificado com tamanho padrão dentro da caixa
        const logoSize = 20;
        pdf.addImage(modifiedImageData, 'PNG', margin + 2.5, yPosition + 2.5, logoSize, logoSize);
      } catch (error) {
        console.log('Erro ao carregar logo, continuando sem logo:', error);
      }
      
      yPosition += 30; // Espaço após o logo
      
      // Título alinhado à esquerda (mesma posição que "INFORMAÇÕES DO CLIENTE")
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 197, 253); // Cor azul serenity
      const titulo = item.tipo === 'proposta' ? 'PROPOSTA COMERCIAL' : 'CONTRATO';
      pdf.text(titulo, margin, yPosition);
      yPosition += 15; // Reduzido de 25 para 15
      
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
      
      // Cabeçalho da tabela com azul serenity
      pdf.setFillColor(147, 197, 253);
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
      
      // Valor total com azul serenity (alinhado com os valores acima)
      pdf.setFillColor(147, 197, 253);
      pdf.rect(margin, yPosition - 5, contentWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VALOR TOTAL:', margin + 5, yPosition + 5);
      pdf.text(`R$ ${item.valorTotal.toLocaleString('pt-BR')}`, pageWidth - margin - 40, yPosition + 5);
      yPosition += 25;
      
      // Rodapé com copyright e data lado a lado
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      
      const copyrightText = '© 2024 Grupo Athos. Todos os direitos reservados.';
      const dataText = `Data: ${new Date(item.data).toLocaleDateString('pt-BR')}`;
      
      pdf.text(copyrightText, margin, pageHeight - 20);
      pdf.text(dataText, margin + pdf.getTextWidth(copyrightText) + 10, pageHeight - 20);
      
      // Salvar o PDF
      const fileName = `${item.tipo}-${item.cliente.replace(/\s+/g, '-')}-${item.data}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF gerado com sucesso');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  // Função para fechar modal de forma segura
  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      console.error('Erro ao fechar modal:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                type="button"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
                type="button"
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
                type="button"
              >
                <Share className="h-4 w-4" />
                Compartilhar WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                type="button"
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
