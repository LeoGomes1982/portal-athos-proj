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
        if (pageNumber === 2) {
          // Não adicionar cabeçalho na segunda página, só continuar
        }
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
    
    // Nome do contratante
    addFormattedText(nomeCliente, 10, false, 'left');
    
    // Extrair CPF do contratante
    const cpfContratanteMatch = contratoTexto.match(/CPF[:\s]+([0-9.-]+)/);
    const cpfContratante = cpfContratanteMatch ? cpfContratanteMatch[1] : "";
    if (cpfContratante) {
      addFormattedText(`CPF nº ${cpfContratante}`, 10, false, 'left');
    }
    
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
    
    // Extrair dados da contratada
    const contratadaMatch = contratoTexto.match(/Contratada\s*\n([^\n]+)/);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "CONTRATADA";
    
    // Extrair representante legal e CPF
    const representanteMatch = contratoTexto.match(/Representante[:\s]+([^\n,]+)/);
    const representante = representanteMatch ? representanteMatch[1].trim() : "";
    
    const cpfRepresentanteMatch = contratoTexto.match(/(?:Representante[^C]*CPF[:\s]+([0-9.-]+))|(?:CPF[:\s]+([0-9.-]+)[^C]*Representante)/);
    const cpfRepresentante = cpfRepresentanteMatch ? (cpfRepresentanteMatch[1] || cpfRepresentanteMatch[2]) : "";
    
    // Nome da contratada
    addFormattedText(nomeContratada, 10, false, 'left');
    
    if (representante && cpfRepresentante) {
      addFormattedText(`Por seu representante legal: ${representante}`, 10, false, 'left');
      addFormattedText(`CPF nº ${cpfRepresentante}`, 10, false, 'left');
    }
    
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