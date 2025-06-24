
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, User } from "lucide-react";

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
}

interface PessoasModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteNome: string;
}

const PessoasModal = ({ isOpen, onClose, clienteNome }: PessoasModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados mockados - em produção viriam de uma API
  const [funcionarios] = useState<Funcionario[]>([
    {
      id: "1",
      nome: "João Silva",
      cargo: "Gerente",
      email: "joao.silva@empresa.com",
      telefone: "(11) 99999-9999",
      status: "ativo"
    },
    {
      id: "2",
      nome: "Maria Santos",
      cargo: "Coordenadora",
      email: "maria.santos@empresa.com", 
      telefone: "(11) 88888-8888",
      status: "ativo"
    }
  ]);

  const filteredFuncionarios = funcionarios.filter(funcionario =>
    funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pessoas - {clienteNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus size={16} className="mr-2" />
              Adicionar Funcionário
            </Button>
          </div>

          <div className="space-y-3">
            {filteredFuncionarios.map((funcionario) => (
              <div key={funcionario.id} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{funcionario.nome}</h4>
                      <p className="text-sm text-slate-600">{funcionario.cargo}</p>
                      <p className="text-sm text-slate-500">{funcionario.email}</p>
                      <p className="text-sm text-slate-500">{funcionario.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      funcionario.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {funcionario.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFuncionarios.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum funcionário encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PessoasModal;
