import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Shirt, HardHat } from "lucide-react";

interface Entrega {
  id: string;
  funcionarioId: number;
  funcionarioNome: string;
  item: string;
  categoria: "uniforme" | "epi";
  tamanho: string;
  quantidade: number;
  dataEntrega: string;
}

interface DetalhesEquipamentosFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionarioId: number | null;
  funcionarioNome: string;
  entregas: Entrega[];
}

export function DetalhesEquipamentosFuncionarioModal({
  isOpen,
  onClose,
  funcionarioId,
  funcionarioNome,
  entregas
}: DetalhesEquipamentosFuncionarioModalProps) {
  if (!funcionarioId) return null;

  const entregasFuncionario = entregas.filter(entrega => entrega.funcionarioId === funcionarioId);
  const uniformes = entregasFuncionario.filter(entrega => entrega.categoria === "uniforme");
  const epis = entregasFuncionario.filter(entrega => entrega.categoria === "epi");

  const getItemIcon = (item: string) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem.includes("capacete") || lowerItem.includes("luva") || lowerItem.includes("óculos")) {
      return "🛡️";
    } else if (lowerItem.includes("camisa") || lowerItem.includes("calça")) {
      return "👕";
    }
    return "📦";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Equipamentos de {funcionarioNome}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white flex items-center gap-1">
                <Shirt size={14} />
                {uniformes.length} Uniformes
              </Badge>
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <HardHat size={14} />
                {epis.length} EPIs
              </Badge>
            </div>
          </div>

          {/* Uniformes */}
          {uniformes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shirt className="text-blue-500" size={20} />
                Uniformes ({uniformes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uniformes.map((entrega) => (
                  <Card key={entrega.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getItemIcon(entrega.item)}</span>
                          <div>
                            <h4 className="font-medium">{entrega.item}</h4>
                            <p className="text-sm text-slate-600">
                              Tamanho {entrega.tamanho} • Qtd: {entrega.quantidade}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">{entrega.dataEntrega}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* EPIs */}
          {epis.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <HardHat className="text-green-500" size={20} />
                EPIs ({epis.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {epis.map((entrega) => (
                  <Card key={entrega.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getItemIcon(entrega.item)}</span>
                          <div>
                            <h4 className="font-medium">{entrega.item}</h4>
                            <p className="text-sm text-slate-600">
                              Tamanho {entrega.tamanho} • Qtd: {entrega.quantidade}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">{entrega.dataEntrega}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Caso não tenha equipamentos */}
          {entregasFuncionario.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Nenhum equipamento registrado para este funcionário.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}