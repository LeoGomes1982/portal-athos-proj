import { Denuncia } from "@/types/cicad";

export const statusConfig: Record<Denuncia['status'], { label: string; color: string; textColor: string }> = {
  em_investigacao: { label: "Em Investigação", color: "bg-yellow-500", textColor: "text-yellow-700" },
  encerrado: { label: "Encerrado", color: "bg-green-500", textColor: "text-green-700" },
  arquivado: { label: "Arquivado", color: "bg-gray-500", textColor: "text-gray-700" }
};

export const tipoConfig: Record<Denuncia['tipo'], { label: string; color: string }> = {
  denuncia_chefia: { label: "Denúncia - Chefia", color: "bg-red-100 text-red-800" },
  denuncia_colega: { label: "Denúncia - Colega", color: "bg-orange-100 text-orange-800" },
  comunicacao_interna: { label: "Comunicação Interna", color: "bg-blue-100 text-blue-800" },
  assedio: { label: "Assédio", color: "bg-purple-100 text-purple-800" },
  discriminacao: { label: "Discriminação", color: "bg-pink-100 text-pink-800" },
  outro: { label: "Outro", color: "bg-gray-100 text-gray-800" }
};

export const urgenciaConfig: Record<Denuncia['urgencia'], { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "bg-green-100 text-green-800" },
  media: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
  alta: { label: "Alta", color: "bg-red-100 text-red-800" }
};