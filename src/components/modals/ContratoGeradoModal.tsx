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
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let currentY = margin;

    // Função para adicionar texto justificado
    const addJustifiedText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        if (currentY + fontSize > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        
        const line = lines[i];
        if (i === lines.length - 1 || line.trim() === '') {
          // Última linha ou linha vazia - não justificar
          doc.text(line, margin, currentY);
        } else {
          // Justificar linha
          const words = line.split(' ');
          if (words.length > 1) {
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
            doc.text(line, margin, currentY);
          }
        }
        currentY += fontSize * 1.2;
      }
      currentY += 5; // Espaço extra após parágrafo
    };

    // Título principal
    addJustifiedText("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", 16, true);
    currentY += 10;

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

    // Adicionar campos de assinatura
    currentY += 30;
    
    if (currentY + 100 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }

    // Campo de assinatura do contratante
    addJustifiedText("Assinatura eletrônica contratante:", 14, true);
    currentY += 20;
    
    // Linha para assinatura
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;
    addJustifiedText(`${nomeCliente}`, 12);
    addJustifiedText("CONTRATANTE", 12);
    currentY += 20;

    // Campo de assinatura da contratada
    addJustifiedText("Assinatura eletrônica contratada:", 14, true);
    currentY += 20;
    
    // Linha para assinatura
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;
    
    // Extrair nome da contratada do texto do contrato
    const contratadaMatch = contratoTexto.match(/Contratada\s*\n([^\n]+)/);
    const nomeContratada = contratadaMatch ? contratadaMatch[1].trim() : "CONTRATADA";
    
    addJustifiedText(nomeContratada, 12);
    addJustifiedText("CONTRATADA", 12);

    // Data
    currentY += 20;
    const hoje = new Date().toLocaleDateString('pt-BR');
    addJustifiedText(`Data: ${hoje}`, 12);

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