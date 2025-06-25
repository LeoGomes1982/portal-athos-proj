import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { History, Plus, Calendar } from "lucide-react";

interface RegistroHistorico {
  id: string;
  data: string;
  tipo: 'positivo' | 'neutro' | 'negativo';
  titulo: string;
  descricao: string;
  usuario: string;
}

interface HistoricoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteNome: string;
  clienteId: string;
}

const HistoricoModal = ({ isOpen, onClose, clienteNome, clienteId }: HistoricoModalProps) => {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    tipo: 'neutro' as 'positivo' | 'neutro' | 'negativo',
    titulo: '',
    descricao: ''
  });

  const [historicos, setHistoricos] = useState<RegistroHistorico[]>([]);

  // Carregar históricos do localStorage
  useEffect(() => {
    const historicosKey = `historico_cliente_${clienteId}`;
    const savedHistoricos = localStorage.getItem(historicosKey);
    if (savedHistoricos) {
      setHistoricos(JSON.parse(savedHistoricos));
    } else {
      // Dados iniciais se não houver dados salvos
      const historicosIniciais = [
        {
          id: "1",
          data: "2024-01-15",
          tipo: "positivo" as const,
          titulo: "Pagamento em dia",
          descricao: "Cliente efetuou pagamento antes do vencimento",
          usuario: "João Admin"
        },
        {
          id: "2", 
          data: "2024-01-10",
          tipo: "neutro" as const,
          titulo: "Contato comercial",
          descricao: "Cliente solicitou informações sobre novos serviços",
          usuario: "Maria Vendas"
        }
      ];
      setHistoricos(historicosIniciais);
      localStorage.setItem(historicosKey, JSON.stringify(historicosIniciais));
    }
  }, [clienteId]);

  // Salvar históricos no localStorage sempre que mudar
  useEffect(() => {
    if (historicos.length > 0) {
      const historicosKey = `historico_cliente_${clienteId}`;
      localStorage.setItem(historicosKey, JSON.stringify(historicos));
    }
  }, [historicos, clienteId]);

  const handleAddRecord = () => {
    if (newRecord.titulo && newRecord.descricao) {
      const registro: RegistroHistorico = {
        id: Date.now().toString(),
        data: new Date().toISOString().split('T')[0],
        tipo: newRecord.tipo,
        titulo: newRecord.titulo,
        descricao: newRecord.descricao,
        usuario: "Usuário Atual"
      };
      
      setHistoricos(prev => [registro, ...prev]);
      setNewRecord({ tipo: 'neutro', titulo: '', descricao: '' });
      setIsAddingRecord(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'positivo': return 'bg-green-100 text-green-800';
      case 'negativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico - {clienteNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registros do Cliente</h3>
            <Button onClick={() => setIsAddingRecord(true)}>
              <Plus size={16} className="mr-2" />
              Novo Registro
            </Button>
          </div>

          {isAddingRecord && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold">Adicionar Novo Registro</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <select
                    id="tipo"
                    value={newRecord.tipo}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, tipo: e.target.value as any }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="positivo">Positivo</option>
                    <option value="neutro">Neutro</option>
                    <option value="negativo">Negativo</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={newRecord.titulo}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Título do registro"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newRecord.descricao}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição detalhada do registro"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddRecord}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {historicos.map((registro) => (
              <div key={registro.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(registro.tipo)}`}>
                        {registro.tipo}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(registro.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-1">{registro.titulo}</h4>
                    <p className="text-slate-600 mb-2">{registro.descricao}</p>
                    <p className="text-xs text-slate-500">Por: {registro.usuario}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {historicos.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <History size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricoModal;
