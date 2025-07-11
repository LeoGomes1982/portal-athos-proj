import { UniformeModal } from "./UniformeModal";

interface EntregaUniformeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dados: { funcionarioId: number; funcionarioNome: string; item: string; categoria: "uniforme" | "epi"; tamanho: string; quantidade: number }) => void;
  estoque: Array<{ id: string; nome: string; categoria: "uniforme" | "epi"; quantidade: number; tamanhos: { [tamanho: string]: number } }>;
}

export function EntregaUniformeModal({ isOpen, onClose, onSubmit, estoque }: EntregaUniformeModalProps) {
  return (
    <UniformeModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      estoque={estoque}
    />
  );
}