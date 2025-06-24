
import React from "react";
import { Building2, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface EmpresaCardProps {
  empresa: Empresa;
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: string) => void;
}

const EmpresaCard = ({ empresa, onEdit, onDelete }: EmpresaCardProps) => {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {empresa.logo ? (
            <img 
              src={empresa.logo} 
              alt={`Logo ${empresa.nome}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-slate-800">{empresa.nome}</h4>
            <p className="text-sm text-slate-600">CNPJ: {empresa.cnpj}</p>
            <p className="text-sm text-slate-600">{empresa.email}</p>
            <p className="text-sm text-slate-600">{empresa.telefone}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Edit button clicked for:", empresa.nome);
              onEdit(empresa);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Delete button clicked for:", empresa.nome);
              onDelete(empresa.id);
            }}
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmpresaCard;
