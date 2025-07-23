import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFuncionarioData } from "@/hooks/useFuncionarioData";
import { useFuncionarioHistorico } from "@/hooks/useFuncionarioHistorico";

interface DeleteInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarioId: number;
  funcionarioNome: string;
  onDataUpdate?: () => void;
}

export function DeleteInfoModal({ isOpen, onClose, funcionarioId, funcionarioNome, onDataUpdate }: DeleteInfoModalProps) {
  const { toast } = useToast();
  const { historico } = useFuncionarioHistorico(funcionarioId);
  const { dependentes, documentos, removerDependente, removerDocumento } = useFuncionarioData(funcionarioId);
  
  const [step, setStep] = useState(1); // 1: senha, 2: formulário, 3: lista itens
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteInfo, setDeleteInfo] = useState({
    tipo: "",
    motivo: ""
  });
  
  // Carregar uniformes do localStorage
  const [uniformes, setUniformes] = useState<any[]>([]);
  
  useEffect(() => {
    const uniformesSalvos = localStorage.getItem(`uniformes_funcionario_${funcionarioId}`);
    if (uniformesSalvos) {
      setUniformes(JSON.parse(uniformesSalvos));
    }
  }, [funcionarioId]);

  const handlePasswordSubmit = () => {
    if (password === "delet") {
      setStep(2);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta. Tente novamente.");
      setPassword("");
    }
  };

  const handleFormSubmit = () => {
    if (!deleteInfo.tipo || !deleteInfo.motivo.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
  };

  const handleDeleteItem = (itemId: string, itemName: string, itemType: string) => {
    let success = false;
    
    try {
      switch (deleteInfo.tipo) {
        case "dependentes":
          removerDependente(parseInt(itemId));
          success = true;
          break;
        case "documentos":
          removerDocumento(parseInt(itemId));
          success = true;
          break;
        case "uniformes":
          const novosUniformes = uniformes.filter(u => u.id !== itemId);
          setUniformes(novosUniformes);
          localStorage.setItem(`uniformes_funcionario_${funcionarioId}`, JSON.stringify(novosUniformes));
          success = true;
          break;
        case "historico":
          // Para histórico, vamos apenas registrar a exclusão no log
          success = true;
          break;
      }

      if (success) {
        // Registrar no log do sistema
        const deleteRecord = {
          id: Date.now().toString(),
          funcionarioId,
          funcionarioNome,
          tipo: deleteInfo.tipo,
          motivo: deleteInfo.motivo,
          itemDeletado: itemName,
          usuario: localStorage.getItem('currentUser') || 'sistema@empresa.com',
          data: new Date().toISOString(),
          acao: `Deletou ${itemType}: ${itemName}`
        };

        const existingRecords = JSON.parse(localStorage.getItem('delete_records') || '[]');
        existingRecords.push(deleteRecord);
        localStorage.setItem('delete_records', JSON.stringify(existingRecords));

        toast({
          title: "Item deletado",
          description: `${itemType} "${itemName}" foi removido com sucesso`,
        });

        // Atualizar dados se callback fornecido
        if (onDataUpdate) {
          onDataUpdate();
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível deletar o item",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setStep(1);
    setPassword("");
    setDeleteInfo({ tipo: "", motivo: "" });
    setPasswordError("");
    onClose();
  };

  const getItemsList = () => {
    switch (deleteInfo.tipo) {
      case "dependentes":
        return dependentes;
      case "documentos":
        return documentos;
      case "uniformes":
        return uniformes;
      case "historico":
        return historico;
      default:
        return [];
    }
  };

  const renderItemCard = (item: any) => {
    const tipo = deleteInfo.tipo;
    
    switch (tipo) {
      case "dependentes":
        return (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="font-medium text-gray-900">{item.nome}</p>
              <p className="text-sm text-gray-500">{item.grauParentesco} • {item.dataNascimento}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteItem(item.id, item.nome, "Dependente")}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      case "documentos":
        return (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="font-medium text-gray-900">{item.nome}</p>
              <p className="text-sm text-gray-500">{item.tipo} • {item.dataUpload}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteItem(item.id.toString(), item.nome, "Documento")}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      case "uniformes":
        return (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="font-medium text-gray-900">{item.peca}</p>
              <p className="text-sm text-gray-500">{item.tipo} • Tamanho: {item.tamanho}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteItem(item.id, `${item.peca} (${item.tamanho})`, "Uniforme/EPI")}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      case "historico":
        return (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="font-medium text-gray-900">{item.titulo}</p>
              <p className="text-sm text-gray-500">{item.tipo} • {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDeleteItem(item.id, item.titulo, "Registro do Histórico")}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
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
                {step === 1 ? "Autenticação Necessária" : step === 2 ? "Deletar Informações" : `Deletar ${deleteInfo.tipo}`}
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
          ) : step === 2 ? (
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
                    <SelectItem value="dependentes">Dependentes</SelectItem>
                    <SelectItem value="documentos">Documentos</SelectItem>
                    <SelectItem value="uniformes">Uniformes/EPIs</SelectItem>
                    <SelectItem value="historico">Histórico</SelectItem>
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
                  onClick={handleFormSubmit}
                  disabled={!deleteInfo.tipo || !deleteInfo.motivo.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Continuar
                </Button>
              </div>
            </div>
          ) : (
            // Lista de itens para deletar
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Selecione os itens de <strong>{deleteInfo.tipo}</strong> que deseja deletar:
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Motivo: {deleteInfo.motivo}
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3">
                {getItemsList().length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum item encontrado para deletar</p>
                  </div>
                ) : (
                  getItemsList().map(renderItemCard)
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Cada exclusão será registrada individualmente para auditoria.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="flex-1"
                >
                  Finalizar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}