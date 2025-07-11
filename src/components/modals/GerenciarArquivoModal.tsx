import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, UserX, FileText, Search } from "lucide-react";

interface GerenciarArquivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GerenciarArquivoModal({ isOpen, onClose }: GerenciarArquivoModalProps) {
  const opcoes = [
    {
      id: 'consultar-historico',
      titulo: 'Consultar Histórico',
      descricao: 'Visualizar histórico completo de funcionários',
      icone: <Search className="w-6 h-6" />,
      cor: 'text-blue-600',
      fundo: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'arquivar-funcionario',
      titulo: 'Arquivar Funcionário',
      descricao: 'Mover funcionário ativo para arquivo',
      icone: <UserX className="w-6 h-6" />,
      cor: 'text-orange-600',
      fundo: 'bg-orange-50 hover:bg-orange-100'
    },
    {
      id: 'gerar-relatorio',
      titulo: 'Gerar Relatório',
      descricao: 'Relatório de funcionários arquivados',
      icone: <FileText className="w-6 h-6" />,
      cor: 'text-green-600',
      fundo: 'bg-green-50 hover:bg-green-100'
    }
  ];

  const handleOpcao = (opcaoId: string) => {
    // Aqui você pode implementar a lógica para cada opção
    console.log('Opção selecionada:', opcaoId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Archive className="w-5 h-5 text-white" />
            </div>
            Gerenciar Arquivo de RH
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid gap-3">
            {opcoes.map((opcao) => (
              <Button
                key={opcao.id}
                variant="ghost"
                className={`h-auto p-4 justify-start ${opcao.fundo} border border-transparent hover:border-slate-200 transition-all duration-200`}
                onClick={() => handleOpcao(opcao.id)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`${opcao.cor} flex-shrink-0`}>
                    {opcao.icone}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-slate-800">{opcao.titulo}</div>
                    <div className="text-sm text-slate-600">{opcao.descricao}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}