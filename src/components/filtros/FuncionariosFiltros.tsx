import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { Funcionario } from "@/types/funcionario";

interface FiltrosAtivos {
  fiscal: string;
  cidade: string;
  estado: string;
  empresaContratante: string;
  localServico: string;
}

interface FuncionariosFiltrosProps {
  funcionarios: Funcionario[];
  onFiltrosChange: (funcionariosFiltrados: Funcionario[]) => void;
}

export function FuncionariosFiltros({ funcionarios, onFiltrosChange }: FuncionariosFiltrosProps) {
  const [filtrosAtivos, setFiltrosAtivos] = useState<FiltrosAtivos>({
    fiscal: "",
    cidade: "",
    estado: "",
    empresaContratante: "",
    localServico: "",
  });

  // Obter valores únicos para os dropdowns
  const obterValoresUnicos = (campo: keyof Funcionario) => {
    const valores = funcionarios
      .map(f => f[campo] as string)
      .filter(valor => valor && valor.trim() !== "")
      .filter((valor, index, array) => array.indexOf(valor) === index)
      .sort();
    return valores;
  };

  const fiscais = obterValoresUnicos('fiscalResponsavel');
  const cidades = obterValoresUnicos('cidade');
  const estados = obterValoresUnicos('estado');
  const empresas = obterValoresUnicos('empresaContratante');
  const locaisServico = obterValoresUnicos('setor'); // usando 'setor' pois é o campo atual no type

  const aplicarFiltros = () => {
    let funcionariosFiltrados = [...funcionarios];

    Object.entries(filtrosAtivos).forEach(([campo, valor]) => {
      if (valor && valor !== "") {
        funcionariosFiltrados = funcionariosFiltrados.filter(funcionario => {
          switch (campo) {
            case 'fiscal':
              return funcionario.fiscalResponsavel?.toLowerCase().includes(valor.toLowerCase());
            case 'cidade':
              return funcionario.cidade?.toLowerCase().includes(valor.toLowerCase());
            case 'estado':
              return funcionario.estado?.toLowerCase().includes(valor.toLowerCase());
            case 'empresaContratante':
              return funcionario.empresaContratante?.toLowerCase().includes(valor.toLowerCase());
            case 'localServico':
              return funcionario.setor?.toLowerCase().includes(valor.toLowerCase());
            default:
              return true;
          }
        });
      }
    });

    onFiltrosChange(funcionariosFiltrados);
  };

  const limparFiltros = () => {
    setFiltrosAtivos({
      fiscal: "",
      cidade: "",
      estado: "",
      empresaContratante: "",
      localServico: "",
    });
    onFiltrosChange(funcionarios);
  };

  const handleFiltroChange = (campo: keyof FiltrosAtivos, valor: string) => {
    const novosFiltros = { ...filtrosAtivos, [campo]: valor };
    setFiltrosAtivos(novosFiltros);
  };

  const temFiltrosAtivos = Object.values(filtrosAtivos).some(valor => valor !== "");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative h-12">
          <Filter size={16} className="mr-2" />
          Filtrar
          {temFiltrosAtivos && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(filtrosAtivos).filter(v => v !== "").length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtros de Funcionários</SheetTitle>
          <SheetDescription>
            Use os filtros abaixo para encontrar funcionários específicos
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          {/* Filtro por Fiscal */}
          <div className="grid gap-2">
            <Label htmlFor="fiscal">Fiscal Responsável</Label>
            <Select 
              value={filtrosAtivos.fiscal} 
              onValueChange={(value) => handleFiltroChange('fiscal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fiscal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {fiscais.map((fiscal) => (
                  <SelectItem key={fiscal} value={fiscal}>{fiscal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Cidade */}
          <div className="grid gap-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Select 
              value={filtrosAtivos.cidade} 
              onValueChange={(value) => handleFiltroChange('cidade', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Estado */}
          <div className="grid gap-2">
            <Label htmlFor="estado">Estado</Label>
            <Select 
              value={filtrosAtivos.estado} 
              onValueChange={(value) => handleFiltroChange('estado', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Empresa Contratante */}
          <div className="grid gap-2">
            <Label htmlFor="empresaContratante">Empresa Contratante</Label>
            <Select 
              value={filtrosAtivos.empresaContratante} 
              onValueChange={(value) => handleFiltroChange('empresaContratante', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa} value={empresa}>{empresa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Local de Serviço */}
          <div className="grid gap-2">
            <Label htmlFor="localServico">Local de Serviço</Label>
            <Select 
              value={filtrosAtivos.localServico} 
              onValueChange={(value) => handleFiltroChange('localServico', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {locaisServico.map((local) => (
                  <SelectItem key={local} value={local}>{local}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={aplicarFiltros} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={limparFiltros}
            disabled={!temFiltrosAtivos}
          >
            <X size={16} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}