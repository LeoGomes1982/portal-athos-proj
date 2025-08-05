import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from 'xlsx';

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
    // Criar dados de exemplo com nome obrigatório e outros opcionais
    const dadosExemplo = [
      {
        nome: "João Silva",
        cargo: "Desenvolvedor",
        setor: "TI",
        empresaContratante: "Empresa ABC Ltda"
      },
      {
        nome: "Maria Santos",
        cargo: "Analista",
        setor: "Financeiro",
        empresaContratante: "Empresa XYZ Ltda"
      }
    ];

    // Criar workbook Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dadosExemplo);
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funcionários");
    
    // Fazer download do arquivo Excel
    XLSX.writeFile(workbook, 'modelo_funcionarios.xlsx');
    
    toast({
      title: "Modelo baixado",
      description: "Arquivo modelo Excel baixado com sucesso!",
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
      let dados: any[] = [];
      
      // Verificar se é arquivo Excel ou CSV
      if (arquivo.name.endsWith('.xlsx') || arquivo.name.endsWith('.xls')) {
        // Processar arquivo Excel
        const arrayBuffer = await arquivo.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        dados = XLSX.utils.sheet_to_json(firstSheet);
      } else if (arquivo.name.endsWith('.csv')) {
        // Processar arquivo CSV
        const texto = await arquivo.text();
        const linhas = texto.split('\n').filter(linha => linha.trim() !== '');
        
        if (linhas.length < 2) {
          throw new Error('Arquivo deve ter pelo menos uma linha de dados além do cabeçalho');
        }

        const cabecalho = linhas[0].split(',').map(col => col.trim());
        dados = [];
        
        for (let i = 1; i < linhas.length; i++) {
          const valores = linhas[i].split(',').map(val => val.trim());
          const obj: any = {};
          cabecalho.forEach((col, index) => {
            obj[col] = valores[index] || '';
          });
          dados.push(obj);
        }
      } else {
        throw new Error('Formato de arquivo não suportado. Use .xlsx, .xls ou .csv');
      }

      if (dados.length === 0) {
        throw new Error('Arquivo não contém dados válidos');
      }

      const funcionarios = [];
      const detalhes = [];
      let sucesso = 0;
      let erro = 0;

      for (let i = 0; i < dados.length; i++) {
        try {
          const linha = dados[i];
          
          // Extrair dados das 4 colunas obrigatórias (com variações de nomes)
          // Normalizar chaves do objeto removendo espaços e convertendo para lowercase
          const normalizedLine: any = {};
          Object.keys(linha).forEach(key => {
            const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '');
            normalizedLine[normalizedKey] = linha[key];
          });

          const nome = linha.nome || linha.Nome || linha.NOME || normalizedLine.nome || '';
          const cargo = linha.cargo || linha.Cargo || linha.CARGO || normalizedLine.cargo || '';
          const setor = linha.setor || linha.Setor || linha.SETOR || normalizedLine.setor || '';
          const empresaContratante = linha.empresaContratante || 
                                   linha['empresa contratante'] || 
                                   linha.EmpresaContratante || 
                                   linha['Empresa Contratante'] || 
                                   linha.EMPRESACONTRATANTE ||
                                   linha['Empresa contratante'] ||
                                   linha['EMPRESA CONTRATANTE'] ||
                                   normalizedLine.empresacontratante ||
                                   normalizedLine.empresacontrat ||
                                   normalizedLine.empresa || 
                                   '';

          // Validações básicas - apenas nome é obrigatório
          if (!nome) {
            throw new Error(`Linha ${i + 2}: Nome é obrigatório`);
          }

          const funcionario = {
            id: Date.now() + i, // ID único baseado em timestamp
            nome: nome.trim(),
            cargo: cargo ? cargo.trim() : "A definir",
            setor: setor ? setor.trim() : "Geral",
            empresaContratante: empresaContratante ? empresaContratante.trim() : "Empresa Padrão",
            dataAdmissao: new Date().toISOString().split('T')[0], // Data atual
            telefone: "",
            email: "",
            foto: "👤", // Emoji padrão
            status: "ativo" as const,
          };

          funcionarios.push(funcionario);
          sucesso++;
          detalhes.push(`✓ ${funcionario.nome} - importado com sucesso`);
          
        } catch (error) {
          erro++;
          detalhes.push(`✗ Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // Salvar funcionários no localStorage
      if (funcionarios.length > 0) {
        const funcionariosExistentes = JSON.parse(localStorage.getItem('funcionarios') || '[]');
        const todosFuncionarios = [...funcionariosExistentes, ...funcionarios];
        localStorage.setItem('funcionarios', JSON.stringify(todosFuncionarios));
        
        // Disparar evento para atualizar outras partes da aplicação
        window.dispatchEvent(new Event('funcionariosUpdated'));
        
        // Adicionar sugestão para migrar para o banco de dados
        detalhes.push(`\n💡 Dica: Vá para "Gestão de Funcionários" para migrar estes dados para o banco de dados e evitar perda de dados.`);
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
                    Baixar Modelo Excel
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

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Campo obrigatório:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Nome (obrigatório)</li>
                  </ul>
                  <p className="text-sm text-green-600 mt-2">
                    Outros campos como cargo, setor e empresa contratante são opcionais e receberão valores padrão se não informados.
                  </p>
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