export interface Denuncia {
  id: string;
  tipo: "denuncia_chefia" | "denuncia_colega" | "comunicacao_interna" | "assedio" | "discriminacao" | "outro";
  assunto: string;
  descricao: string;
  setor?: string;
  dataOcorrencia?: string;
  status: "em_investigacao" | "encerrado" | "arquivado";
  resolucao?: string;
  dataSubmissao: string;
  urgencia: "baixa" | "media" | "alta";
}

export interface FormularioCICAD {
  tipo: Denuncia['tipo'];
  assunto: string;
  descricao: string;
  setor?: string;
  dataOcorrencia?: string;
  urgencia: Denuncia['urgencia'];
}