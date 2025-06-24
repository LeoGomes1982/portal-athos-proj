
import React from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmpresaCard from "./EmpresaCard";

interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
  logo?: string;
  ativo: boolean;
}

interface EmpresasListProps {
  empresas: Empresa[];
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const EmpresasList = ({ empresas, onEdit, onDelete, onAddNew }: EmpresasListProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Empresas Cadastradas</h3>
        <Button onClick={() => {
          console.log("Nova Empresa button clicked");
          onAddNew();
        }}>
          <Building2 size={16} className="mr-2" />
          Nova Empresa
        </Button>
      </div>

      <div className="space-y-4">
        {empresas.map((empresa) => (
          <EmpresaCard
            key={empresa.id}
            empresa={empresa}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default EmpresasList;
