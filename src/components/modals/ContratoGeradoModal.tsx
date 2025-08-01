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
    
    // Configurações seguindo o layout da imagem
    pdf.setFont("times", "normal");
    pdf.setFontSize(11);
    
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    
    let currentY = margin + 10;
    
    // Função para adicionar rodapé
    const addFooter = (pageNum: number) => {
      pdf.setFont("times", "normal");
      pdf.setFontSize(9);
      const footerY = pageHeight - 15;
      pdf.text(`${pageNum}`, pageWidth - margin, footerY, { align: 'right' });
    };
    
    // Função para texto justificado
    const addJustifiedText = (text: string, fontSize: number = 11) => {
      pdf.setFont("times", "normal");
      pdf.setFontSize(fontSize);
      
      const paragraphs = text.split('\n\n');
      
      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          const lines = pdf.splitTextToSize(paragraph.trim(), maxWidth);
          
          for (let i = 0; i < lines.length; i++) {
            if (currentY > pageHeight - 40) {
              addFooter(pdf.getNumberOfPages());
              pdf.addPage();
              currentY = margin + 10;
            }
            
            if (i < lines.length - 1 && lines[i].trim().length > 0) {
              const words = lines[i].trim().split(' ');
              if (words.length > 1) {
                const totalTextWidth = words.reduce((width, word) => width + pdf.getTextWidth(word), 0);
                const totalSpaces = words.length - 1;
                const availableSpace = maxWidth - totalTextWidth;
                const spaceWidth = availableSpace / totalSpaces;
                
                let x = margin;
                for (let j = 0; j < words.length; j++) {
                  pdf.text(words[j], x, currentY);
                  x += pdf.getTextWidth(words[j]) + spaceWidth;
                }
              } else {
                pdf.text(lines[i], margin, currentY);
              }
            } else {
              pdf.text(lines[i], margin, currentY);
            }
            
            currentY += fontSize * 0.4 + 2;
          }
          currentY += 8;
        }
      });
    };
    
    // Função para títulos de seção
    const addSectionTitle = (title: string) => {
      if (currentY > pageHeight - 60) {
        addFooter(pdf.getNumberOfPages());
        pdf.addPage();
        currentY = margin + 10;
      }
      
      currentY += 10;
      pdf.setFont("times", "bold");
      pdf.setFontSize(12);
      pdf.text(title, margin, currentY);
      currentY += 8;
    };
    
    // Processar o texto do contrato seguindo o layout da imagem
    const fullText = contratoTexto;
    
    // Separar seções específicas
    const obrigacoesMatch = fullText.match(/OBRIGAÇÕES[\s\S]*?(?=FINANCEIRO|ASSINATURA|$)/i);
    const financeiroMatch = fullText.match(/FINANCEIRO[\s\S]*?(?=ASSINATURA|$)/i);
    const assinaturaMatch = fullText.match(/ASSINATURA[\s\S]*$/i);
    
    // Texto principal (antes das seções)
    let mainText = fullText;
    if (obrigacoesMatch) {
      mainText = fullText.substring(0, fullText.toLowerCase().indexOf('obrigações'));
    }
    
    if (mainText.trim()) {
      addJustifiedText(mainText.trim());
    }
    
    // Seção Obrigações da Contratante
    if (obrigacoesMatch) {
      addSectionTitle("Obrigações da Contratante");
      let obrigacoesText = obrigacoesMatch[0].replace(/^OBRIGAÇÕES[^\n]*\n?/i, '').trim();
      
      // Remove seção financeiro se estiver incluída
      if (obrigacoesText.toLowerCase().includes('financeiro')) {
        obrigacoesText = obrigacoesText.substring(0, obrigacoesText.toLowerCase().indexOf('financeiro'));
      }
      
      if (obrigacoesText.trim()) {
        addJustifiedText(obrigacoesText.trim());
      }
    }
    
    // Seção Financeiro
    if (financeiroMatch) {
      addSectionTitle("Financeiro");
      let financeiroText = financeiroMatch[0].replace(/^FINANCEIRO[^\n]*\n?/i, '').trim();
      
      // Remove seção assinatura se estiver incluída
      if (financeiroText.toLowerCase().includes('assinatura')) {
        financeiroText = financeiroText.substring(0, financeiroText.toLowerCase().indexOf('assinatura'));
      }
      
      if (financeiroText.trim()) {
        addJustifiedText(financeiroText.trim());
      }
    }
    
    // Seção de Assinaturas
    currentY += 30;
    
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    pdf.setFont("times", "normal");
    pdf.setFontSize(11);
    pdf.text(`Local e Data: _________________, ${hoje}`, margin, currentY);
    currentY += 25;
    
    // Assinatura do contratante
    pdf.text("_".repeat(50), margin, currentY);
    currentY += 6;
    pdf.setFont("times", "bold");
    pdf.text("CONTRATANTE", margin, currentY);
    currentY += 5;
    pdf.setFont("times", "normal");
    pdf.text(nomeCliente, margin, currentY);
    currentY += 20;
    
    // Assinatura da contratada
    pdf.text("_".repeat(50), margin, currentY);
    currentY += 6;
    pdf.setFont("times", "bold");
    pdf.text("CONTRATADA", margin, currentY);
    currentY += 5;
    pdf.setFont("times", "normal");
    
    // Extrair nome da contratada
    const contratadaMatch = fullText.match(/Contratada[:\s]*([^\n]+)/i);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "CONTRATADA";
    pdf.text(nomeContratada, margin, currentY);
    
    // Adicionar rodapé final
    addFooter(pdf.getNumberOfPages());
    
    // Download
    const fileName = nomeCliente ? `Contrato_${nomeCliente.replace(/\s+/g, '_')}.pdf` : 'Contrato.pdf';
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