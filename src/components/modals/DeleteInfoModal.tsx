import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarioId: number;
  funcionarioNome: string;
}

export function DeleteInfoModal({ isOpen, onClose, funcionarioId, funcionarioNome }: DeleteInfoModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: senha, 2: formulário
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteInfo, setDeleteInfo] = useState({
    tipo: "",
    motivo: ""
  });

  const handlePasswordSubmit = () => {
    if (password === "delet") {
      setStep(2);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta. Tente novamente.");
      setPassword("");
    }
  };

  const handleDeleteSubmit = () => {
    if (!deleteInfo.tipo || !deleteInfo.motivo.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    // Salvar o registro de exclusão no localStorage
    const deleteRecord = {
      id: Date.now().toString(),
      funcionarioId,
      funcionarioNome,
      tipo: deleteInfo.tipo,
      motivo: deleteInfo.motivo,
      usuario: localStorage.getItem('currentUser') || 'sistema@empresa.com',
      data: new Date().toISOString()
    };

    const existingRecords = JSON.parse(localStorage.getItem('delete_records') || '[]');
    existingRecords.push(deleteRecord);
    localStorage.setItem('delete_records', JSON.stringify(existingRecords));

    toast({
      title: "Exclusão registrada",
      description: "O registro de exclusão foi salvo com sucesso",
    });

    // Reset e fechar
    setStep(1);
    setPassword("");
    setDeleteInfo({ tipo: "", motivo: "" });
    setPasswordError("");
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setPassword("");
    setDeleteInfo({ tipo: "", motivo: "" });
    setPasswordError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 size={20} />
              <h2 className="text-lg font-bold">
                {step === 1 ? "Autenticação Necessária" : "Deletar Informações"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-1"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            // Tela de senha
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Para deletar informações de <strong>{funcionarioNome}</strong>, 
                  é necessário inserir a senha de autorização.
                </p>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha de Autorização
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className="mt-1"
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handlePasswordSubmit}
                  disabled={!password}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          ) : (
            // Formulário de exclusão
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Especifique qual informação será deletada e o motivo.
                </p>
              </div>

              <div>
                <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
                  Qual informação deletar?
                </Label>
                <Select
                  value={deleteInfo.tipo}
                  onValueChange={(value) => setDeleteInfo({...deleteInfo, tipo: value})}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Selecione o tipo de informação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dependente">Dependente</SelectItem>
                    <SelectItem value="documento">Documento</SelectItem>
                    <SelectItem value="uniforme">Uniforme/EPI</SelectItem>
                    <SelectItem value="historico">Registro do Histórico</SelectItem>
                    <SelectItem value="dados-pessoais">Dados Pessoais</SelectItem>
                    <SelectItem value="dados-profissionais">Dados Profissionais</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="motivo" className="text-sm font-medium text-gray-700">
                  Motivo da exclusão
                </Label>
                <Textarea
                  id="motivo"
                  value={deleteInfo.motivo}
                  onChange={(e) => setDeleteInfo({...deleteInfo, motivo: e.target.value})}
                  placeholder="Descreva o motivo para a exclusão desta informação..."
                  className="mt-1 resize-none"
                  rows={4}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Esta ação será registrada para auditoria.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDeleteSubmit}
                  disabled={!deleteInfo.tipo || !deleteInfo.motivo.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Registrar Exclusão
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}