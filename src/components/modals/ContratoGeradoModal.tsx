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
    const doc = new jsPDF();
    
    // Configurações da página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const maxWidth = pageWidth - 2 * margin;
    let currentY = margin;
    let pageNumber = 1;

    // Função para adicionar cabeçalho oficial
    const addHeader = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      // Linha superior
      doc.line(margin, margin, pageWidth - margin, margin);
      currentY += 10;
      
      // Título principal centralizado
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const title = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, currentY);
      currentY += 15;
      
      // Linha inferior do cabeçalho
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 20;
    };

    // Função para adicionar rodapé
    const addFooter = () => {
      const footerY = pageHeight - 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Linha do rodapé
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      // Número da página centralizado
      const pageText = `Página ${pageNumber}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      const pageTextX = (pageWidth - pageTextWidth) / 2;
      doc.text(pageText, pageTextX, footerY);
    };

    // Função para verificar se precisa de nova página
    const checkNewPage = (neededSpace: number = 30) => {
      if (currentY + neededSpace > pageHeight - 40) {
        addFooter();
        doc.addPage();
        pageNumber++;
        addHeader();
      }
    };

    // Função para adicionar texto justificado
    const addJustifiedText = (text: string, fontSize: number, isBold: boolean = false, isTitle: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        checkNewPage();
        
        const line = lines[i];
        if (i === lines.length - 1 || line.trim() === '') {
          // Última linha ou linha vazia - não justificar
          if (isTitle) {
            // Centralizar títulos
            const lineWidth = doc.getTextWidth(line);
            const titleX = (pageWidth - lineWidth) / 2;
            doc.text(line, titleX, currentY);
          } else {
            doc.text(line, margin, currentY);
          }
        } else {
          // Justificar linha
          const words = line.split(' ');
          if (words.length > 1 && !isTitle) {
            const lineWidth = doc.getTextWidth(words.join(' '));
            const spaceWidth = (maxWidth - lineWidth) / (words.length - 1);
            let x = margin;
            
            for (let j = 0; j < words.length; j++) {
              doc.text(words[j], x, currentY);
              if (j < words.length - 1) {
                x += doc.getTextWidth(words[j]) + doc.getTextWidth(' ') + spaceWidth;
              }
            }
          } else {
            if (isTitle) {
              // Centralizar títulos
              const lineWidth = doc.getTextWidth(line);
              const titleX = (pageWidth - lineWidth) / 2;
              doc.text(line, titleX, currentY);
            } else {
              doc.text(line, margin, currentY);
            }
          }
        }
        currentY += fontSize * 1.2;
      }
      currentY += isTitle ? 10 : 5; // Espaço extra após parágrafo
    };

    // Adicionar primeira página com cabeçalho
    addHeader();

    // Dividir o texto em seções
    const sections = contratoTexto.split('\n\n');
    
    sections.forEach((section) => {
      if (section.trim()) {
        const lines = section.split('\n');
        const firstLine = lines[0].trim();
        
        // Verificar se é um título (linhas curtas que são títulos)
        const isTitleSection = ['Contratante', 'Contratada', 'Objeto', 'Obrigações da Contratada', 'Obrigações da Contratante', 'Financeiro', 'LGPD', 'Prazos e validades'].includes(firstLine);
        
        if (isTitleSection) {
          addJustifiedText(firstLine, 16, true);
          if (lines.length > 1) {
            const content = lines.slice(1).join('\n');
            addJustifiedText(content, 14);
          }
        } else {
          addJustifiedText(section, 14);
        }
      }
    });

    // Adicionar seção de assinaturas oficial
    checkNewPage(120);
    currentY += 30;
    
    // Título da seção de assinaturas
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const signTitle = "ASSINATURAS";
    const signTitleWidth = doc.getTextWidth(signTitle);
    const signTitleX = (pageWidth - signTitleWidth) / 2;
    doc.text(signTitle, signTitleX, currentY);
    currentY += 25;

    // Linha decorativa
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 25;

    // Data do documento
    const hoje = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dataText = `Local e Data: ________________, ${hoje}`;
    doc.text(dataText, margin, currentY);
    currentY += 35;

    // Campo de assinatura do contratante
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATANTE:", margin, currentY);
    currentY += 25;
    
    // Linha para assinatura do contratante
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(nomeCliente, margin, currentY);
    currentY += 8;
    
    // Extrair CPF do contratante do texto do contrato
    const cpfContratanteMatch = contratoTexto.match(/CPF[:\s]+([0-9.-]+)/);
    const cpfContratante = cpfContratanteMatch ? cpfContratanteMatch[1] : "";
    if (cpfContratante) {
      doc.text(`CPF: ${cpfContratante}`, margin, currentY);
    }
    currentY += 40;

    // Campo de assinatura da contratada
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATADA:", margin, currentY);
    currentY += 25;
    
    // Linha para assinatura da contratada
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;
    
    // Extrair dados da contratada do texto do contrato
    const contratadaMatch = contratoTexto.match(/Contratada\s*\n([^\n]+)/);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "CONTRATADA";
    
    // Extrair representante legal
    const representanteMatch = contratoTexto.match(/Representante[:\s]+([^\n,]+)/);
    const representante = representanteMatch ? representanteMatch[1].trim() : "";
    
    // Extrair CPF do representante
    const cpfRepresentanteMatch = contratoTexto.match(/(?:Representante[^C]*CPF[:\s]+([0-9.-]+))|(?:CPF[:\s]+([0-9.-]+)[^C]*Representante)/);
    const cpfRepresentante = cpfRepresentanteMatch ? (cpfRepresentanteMatch[1] || cpfRepresentanteMatch[2]) : "";
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(nomeContratada, margin, currentY);
    currentY += 8;
    
    if (representante) {
      doc.text(`Representante Legal: ${representante}`, margin, currentY);
      currentY += 8;
    }
    
    if (cpfRepresentante) {
      doc.text(`CPF: ${cpfRepresentante}`, margin, currentY);
    }

    // Adicionar rodapé na última página
    addFooter();

    // Salvar o PDF
    doc.save(`Contrato_${nomeCliente.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
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