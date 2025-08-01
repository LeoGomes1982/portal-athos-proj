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
    
    // Configurações da página para formato cartorial
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let currentY = margin;
    let pageNumber = 1;

    // Função para adicionar cabeçalho cartorial
    const addHeader = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Cabeçalho oficial estilo cartório
      const headerText = "REPÚBLICA FEDERATIVA DO BRASIL";
      const headerWidth = doc.getTextWidth(headerText);
      const headerX = (pageWidth - headerWidth) / 2;
      doc.text(headerText, headerX, currentY);
      currentY += 8;
      
      // Título principal
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const title = "CONTRATO DE PRESTAÇÃO DE SERVIÇOS";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, currentY);
      currentY += 15;
      
      // Linha separadora
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;
    };

    // Função para adicionar rodapé cartorial
    const addFooter = () => {
      const footerY = pageHeight - 10;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      
      // Linha do rodapé
      doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
      
      // Número da página
      const pageText = `- ${pageNumber} -`;
      const pageTextWidth = doc.getTextWidth(pageText);
      const pageTextX = (pageWidth - pageTextWidth) / 2;
      doc.text(pageText, pageTextX, footerY);
    };

    // Função para verificar se precisa de nova página (apenas para página 2)
    const checkNewPage = (neededSpace: number = 20) => {
      if (pageNumber === 1 && currentY + neededSpace > pageHeight - 80) {
        addFooter();
        doc.addPage();
        pageNumber++;
        addHeader();
      }
    };

    // Função para adicionar texto justificado com espaçamento de ofício
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
        // Espaçamento de ofício (mais compacto)
        currentY += fontSize * 1.05;
      }
      // Espaçamento entre parágrafos mínimo
      currentY += isTitle ? 3 : 1;
    };

    // Adicionar primeira página com cabeçalho
    addHeader();

    // Dividir o texto em seções e processar com tamanhos menores
    const sections = contratoTexto.split('\n\n');
    
    sections.forEach((section) => {
      if (section.trim()) {
        const lines = section.split('\n');
        const firstLine = lines[0].trim();
        
        // Verificar se é um título
        const isTitleSection = ['Contratante', 'Contratada', 'Objeto', 'Obrigações da Contratada', 'Obrigações da Contratante', 'Financeiro', 'LGPD', 'Prazos e validades'].includes(firstLine);
        
        if (isTitleSection) {
          addJustifiedText(firstLine, 12, true, true); // Títulos menores
          if (lines.length > 1) {
            const content = lines.slice(1).join('\n');
            addJustifiedText(content, 10); // Texto menor
          }
        } else {
          addJustifiedText(section, 10); // Texto menor
        }
      }
    });

    // Garantir que a seção de assinaturas fique na página 2
    if (pageNumber === 1) {
      addFooter();
      doc.addPage();
      pageNumber++;
      addHeader();
    }
    
    currentY += 15;
    
    // Título da seção de assinaturas estilo cartorial
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const signTitle = "ASSINATURAS E QUALIFICAÇÕES";
    const signTitleWidth = doc.getTextWidth(signTitle);
    const signTitleX = (pageWidth - signTitleWidth) / 2;
    doc.text(signTitle, signTitleX, currentY);
    currentY += 15;

    // Linha separadora
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;

    // Data e local estilo cartorial
    const hoje = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dataText = `Por este instrumento particular, as partes abaixo identificadas e qualificadas:`;
    doc.text(dataText, margin, currentY);
    currentY += 15;

    // Contratante
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATANTE:", margin, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(nomeCliente, margin, currentY);
    currentY += 8;
    
    // Extrair CPF do contratante
    const cpfContratanteMatch = contratoTexto.match(/CPF[:\s]+([0-9.-]+)/);
    const cpfContratante = cpfContratanteMatch ? cpfContratanteMatch[1] : "";
    if (cpfContratante) {
      doc.text(`CPF nº ${cpfContratante}`, margin, currentY);
    }
    currentY += 20;
    
    // Linha para assinatura do contratante
    doc.text("_".repeat(50), margin, currentY);
    currentY += 5;
    doc.text("(assinatura)", margin, currentY);
    currentY += 25;

    // Contratada
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATADA:", margin, currentY);
    currentY += 10;
    
    // Extrair dados da contratada
    const contratadaMatch = contratoTexto.match(/Contratada\s*\n([^\n]+)/);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "CONTRATADA";
    
    // Extrair representante legal e CPF
    const representanteMatch = contratoTexto.match(/Representante[:\s]+([^\n,]+)/);
    const representante = representanteMatch ? representanteMatch[1].trim() : "";
    
    const cpfRepresentanteMatch = contratoTexto.match(/(?:Representante[^C]*CPF[:\s]+([0-9.-]+))|(?:CPF[:\s]+([0-9.-]+)[^C]*Representante)/);
    const cpfRepresentante = cpfRepresentanteMatch ? (cpfRepresentanteMatch[1] || cpfRepresentanteMatch[2]) : "";
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(nomeContratada, margin, currentY);
    currentY += 8;
    
    if (representante && cpfRepresentante) {
      doc.text(`Por seu representante legal: ${representante}`, margin, currentY);
      currentY += 8;
      doc.text(`CPF nº ${cpfRepresentante}`, margin, currentY);
    }
    currentY += 20;
    
    // Linha para assinatura da contratada
    doc.text("_".repeat(50), margin, currentY);
    currentY += 5;
    doc.text("(assinatura)", margin, currentY);
    currentY += 25;

    // Parágrafo final estilo cartorial
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const finalText = `Firmam o presente contrato em duas vias de igual teor e forma, na presença de duas testemunhas que também o subscrevem, para que produza seus jurídicos e legais efeitos.`;
    const finalLines = doc.splitTextToSize(finalText, maxWidth);
    
    finalLines.forEach((line: string) => {
      doc.text(line, margin, currentY);
      currentY += 10;
    });
    
    currentY += 15;
    
    // Local e data final
    doc.text(`________________, ${hoje}`, margin, currentY);

    // Adicionar rodapé na última página
    addFooter();

    // Salvar o PDF
    doc.save(`Contrato_${nomeCliente.replace(/\s+/g, '_')}_${hoje.replace(/\//g, '-')}.pdf`);
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