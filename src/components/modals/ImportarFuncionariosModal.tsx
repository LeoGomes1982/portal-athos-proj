import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportarFuncionariosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportarFuncionariosModal({ isOpen, onClose }: ImportarFuncionariosModalProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [resultados, setResultados] = useState<{sucesso: number, erro: number, detalhes: string[]} | null>(null);
  const { toast } = useToast();

  const baixarModelo = () => {
    // Criar dados de exemplo
    const dadosExemplo = [
      {
        nome: "João Silva",
        cargo: "Desenvolvedor",
        setor: "TI",
        dataAdmissao: "2024-01-15",
        telefone: "(11) 99999-9999",
        email: "joao.silva@empresa.com",
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        salario: "5000.00",
        empresaContratante: "Minha Empresa Ltda"
      },
      {
        nome: "Maria Santos",
        cargo: "Analista",
        setor: "Financeiro",
        dataAdmissao: "2024-02-01",
        telefone: "(11) 88888-8888",
        email: "maria.santos@empresa.com",
        cpf: "987.654.321-00",
        rg: "98.765.432-1",
        salario: "4500.00",
        empresaContratante: "Minha Empresa Ltda"
      }
    ];

    // Converter para CSV
    const cabecalho = Object.keys(dadosExemplo[0]).join(',');
    const linhas = dadosExemplo.map(item => Object.values(item).join(','));
    const csv = [cabecalho, ...linhas].join('\n');

    // Fazer download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_funcionarios.csv';
    link.click();
    
    toast({
      title: "Modelo baixado",
      description: "Arquivo modelo baixado com sucesso!",
    });
  };

  const processarArquivo = async () => {
    if (!arquivo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo",
        variant: "destructive"
      });
      return;
    }

    setProcessando(true);
    
    try {
      const texto = await arquivo.text();
      const linhas = texto.split('\n').filter(linha => linha.trim() !== '');
      
      if (linhas.length < 2) {
        throw new Error('Arquivo deve ter pelo menos uma linha de dados além do cabeçalho');
      }

      const cabecalho = linhas[0].split(',');
      const funcionarios = [];
      const detalhes = [];
      let sucesso = 0;
      let erro = 0;

      for (let i = 1; i < linhas.length; i++) {
        try {
          const valores = linhas[i].split(',');
          
          if (valores.length !== cabecalho.length) {
            throw new Error(`Linha ${i + 1}: Número de colunas incorreto`);
          }

          const funcionario = {
            id: Date.now() + i, // ID único baseado em timestamp
            nome: valores[0]?.trim(),
            cargo: valores[1]?.trim(),
            setor: valores[2]?.trim(),
            dataAdmissao: valores[3]?.trim(),
            telefone: valores[4]?.trim(),
            email: valores[5]?.trim(),
            foto: "👤", // Emoji padrão
            status: "ativo" as const,
            cpf: valores[6]?.trim(),
            rg: valores[7]?.trim(),
            salario: valores[8]?.trim(),
            empresaContratante: valores[9]?.trim(),
          };

          // Validações básicas
          if (!funcionario.nome || !funcionario.cargo || !funcionario.setor) {
            throw new Error(`Linha ${i + 1}: Nome, cargo e setor são obrigatórios`);
          }

          funcionarios.push(funcionario);
          sucesso++;
          detalhes.push(`✓ ${funcionario.nome} - importado com sucesso`);
          
        } catch (error) {
          erro++;
          detalhes.push(`✗ Linha ${i + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // Salvar funcionários no localStorage
      if (funcionarios.length > 0) {
        const funcionariosExistentes = JSON.parse(localStorage.getItem('funcionarios') || '[]');
        const todosFuncionarios = [...funcionariosExistentes, ...funcionarios];
        localStorage.setItem('funcionarios', JSON.stringify(todosFuncionarios));
        
        // Disparar evento para atualizar outras partes da aplicação
        window.dispatchEvent(new Event('funcionariosUpdated'));
      }

      setResultados({ sucesso, erro, detalhes });

      toast({
        title: "Importação concluída",
        description: `${sucesso} funcionário(s) importado(s) com sucesso. ${erro} erro(s).`,
      });

    } catch (error) {
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
    
    setProcessando(false);
  };

  const resetarModal = () => {
    setArquivo(null);
    setResultados(null);
    setProcessando(false);
  };

  const handleClose = () => {
    resetarModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Funcionários em Massa</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!resultados ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Baixe o modelo Excel/CSV, preencha com os dados dos funcionários e faça o upload do arquivo.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>1. Baixar modelo</Label>
                  <Button 
                    onClick={baixarModelo}
                    variant="outline" 
                    className="w-full mt-2"
                  >
                    <Download size={16} className="mr-2" />
                    Baixar Modelo CSV
                  </Button>
                </div>

                <div>
                  <Label>2. Selecionar arquivo preenchido</Label>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {arquivo && (
                    <p className="text-sm text-green-600 mt-1">
                      Arquivo selecionado: {arquivo.name}
                    </p>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Campos obrigatórios:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Nome</li>
                    <li>• Cargo</li>
                    <li>• Setor</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  onClick={processarArquivo}
                  disabled={!arquivo || processando}
                  className="flex-1"
                >
                  {processando ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Importar Funcionários
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Alert className={resultados.erro === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Importação concluída: {resultados.sucesso} sucesso(s), {resultados.erro} erro(s)
                </AlertDescription>
              </Alert>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {resultados.detalhes.map((detalhe, index) => (
                  <div 
                    key={index} 
                    className={`text-sm p-2 rounded ${
                      detalhe.startsWith('✓') 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {detalhe}
                  </div>
                ))}
              </div>

              <Button onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}