import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, X } from "lucide-react";

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
    const element = document.createElement('a');
    const file = new Blob([contratoTexto], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Contrato_${nomeCliente}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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