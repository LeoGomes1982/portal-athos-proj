import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, X } from "lucide-react";
import jsPDF from 'jspdf';

interface ContratoGeradoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoTexto: string;
  nomeCliente: string;
}

export default function ContratoGeradoModal({ 
  isOpen, 
  onClose, 
  contratoTexto, 
  nomeCliente 
}: ContratoGeradoModalProps) {
  const handleDownload = () => {
    const pdf = new jsPDF();
    
    // Configurações exatas da imagem
    pdf.setFont("times", "normal");
    
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    
    let currentY = margin;
    
    // Adicionar texto justificado como na imagem
    const addJustifiedParagraph = (text: string, fontSize: number = 11) => {
      pdf.setFont("times", "normal");
      pdf.setFontSize(fontSize);
      
      const lines = pdf.splitTextToSize(text.trim(), maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        // Verificar quebra de página
        if (currentY > pageHeight - 40) {
          pdf.addPage();
          currentY = margin;
        }
        
        const line = lines[i].trim();
        if (line) {
          // Justificar todas as linhas exceto a última do parágrafo
          if (i < lines.length - 1) {
            const words = line.split(' ');
            if (words.length > 1) {
              const totalTextWidth = words.reduce((sum, word) => sum + pdf.getTextWidth(word), 0);
              const availableSpace = maxWidth - totalTextWidth;
              const extraSpace = availableSpace / (words.length - 1);
              
              let x = margin;
              words.forEach((word, index) => {
                pdf.text(word, x, currentY);
                if (index < words.length - 1) {
                  x += pdf.getTextWidth(word) + pdf.getTextWidth(' ') + extraSpace;
                }
              });
            } else {
              pdf.text(line, margin, currentY);
            }
          } else {
            // Última linha não justificada
            pdf.text(line, margin, currentY);
          }
        }
        
        currentY += 14; // Espaçamento entre linhas
      }
      
      currentY += 8; // Espaço entre parágrafos
    };
    
    // Adicionar títulos em negrito como na imagem
    const addBoldTitle = (title: string) => {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = margin;
      }
      
      currentY += 12;
      pdf.setFont("times", "bold");
      pdf.setFontSize(11);
      pdf.text(title, margin, currentY);
      currentY += 6;
      pdf.setFont("times", "normal");
    };
    
    // Processar o conteúdo seguindo a estrutura da imagem
    const text = contratoTexto;
    
    // Dividir em parágrafos
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    let inObrigacoes = false;
    let inFinanceiro = false;
    
    paragraphs.forEach((paragraph) => {
      const trimmedParagraph = paragraph.trim();
      
      // Detectar início das seções
      if (trimmedParagraph.toLowerCase().includes('obrigações') && trimmedParagraph.toLowerCase().includes('contratante')) {
        addBoldTitle("Obrigações da Contratante");
        inObrigacoes = true;
        inFinanceiro = false;
        
        // Adicionar o texto após o título se houver
        const content = trimmedParagraph.replace(/obrigações.*contratante/i, '').trim();
        if (content) {
          addJustifiedParagraph(content);
        }
      } else if (trimmedParagraph.toLowerCase().startsWith('financeiro')) {
        addBoldTitle("Financeiro");
        inObrigacoes = false;
        inFinanceiro = true;
        
        // Adicionar o texto após o título se houver
        const content = trimmedParagraph.replace(/^financeiro/i, '').trim();
        if (content) {
          addJustifiedParagraph(content);
        }
      } else if (!trimmedParagraph.toLowerCase().includes('assinatura')) {
        // Texto normal justificado
        if (trimmedParagraph.length > 0) {
          addJustifiedParagraph(trimmedParagraph);
        }
      }
    });
    
    // Adicionar seção de assinaturas como na imagem
    currentY += 20;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    pdf.setFont("times", "normal");
    pdf.setFontSize(11);
    pdf.text(`Local e Data: _________________, ${hoje}`, margin, currentY);
    currentY += 30;
    
    // Assinatura do contratante
    pdf.text("_".repeat(50), margin, currentY);
    currentY += 8;
    pdf.setFont("times", "bold");
    pdf.text("CONTRATANTE", margin, currentY);
    currentY += 6;
    pdf.setFont("times", "normal");
    pdf.text(nomeCliente, margin, currentY);
    currentY += 25;
    
    // Assinatura da contratada
    pdf.text("_".repeat(50), margin, currentY);
    currentY += 8;
    pdf.setFont("times", "bold");
    pdf.text("CONTRATADA", margin, currentY);
    currentY += 6;
    pdf.setFont("times", "normal");
    
    // Extrair nome da contratada do texto
    const contratadaMatch = text.match(/contratada[:\s]*([^\n]*)/i);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "EMPRESA CONTRATADA LTDA";
    pdf.text(nomeContratada, margin, currentY);
    
    // Salvar o PDF
    const fileName = `Contrato_${nomeCliente.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Contrato Gerado - {nomeCliente}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handleDownload} size="sm">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] w-full">
          <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-md">
            {contratoTexto}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}