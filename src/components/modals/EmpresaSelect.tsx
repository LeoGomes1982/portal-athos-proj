import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Empresa {
  id: string;
  nome: string;
}

interface EmpresaSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmpresaSelect({ value, onChange }: EmpresaSelectProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const empresasSalvas = localStorage.getItem('empresas');
    if (empresasSalvas) {
      setEmpresas(JSON.parse(empresasSalvas));
    }
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="mt-1">
        <SelectValue placeholder="Selecione a empresa" />
      </SelectTrigger>
      <SelectContent>
        {empresas.map((empresa) => (
          <SelectItem key={empresa.id} value={empresa.nome}>
            {empresa.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}