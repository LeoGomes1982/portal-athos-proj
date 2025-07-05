import { Denuncia } from "@/types/cicad";

export const denunciasIniciais: Denuncia[] = [
  {
    id: "1",
    tipo: "denuncia_chefia",
    assunto: "Tratamento inadequado da chefia",
    descricao: "Relato de comportamento inadequado por parte do supervisor direto, incluindo gritos e desrespeito constante durante reuniões.",
    setor: "Vendas",
    dataOcorrencia: "2024-01-10",
    status: "em_investigacao",
    dataSubmissao: "2024-01-15",
    urgencia: "alta"
  },
  {
    id: "2", 
    tipo: "assedio",
    assunto: "Assédio moral no ambiente de trabalho",
    descricao: "Situação de constrangimento e humilhação por parte de colega de trabalho do mesmo nível hierárquico.",
    setor: "Administrativo",
    dataOcorrencia: "2024-01-08",
    status: "encerrado",
    resolucao: "Após investigação, foram tomadas as medidas disciplinares necessárias. O caso foi resolvido com advertência formal ao funcionário envolvido.",
    dataSubmissao: "2024-01-12",
    urgencia: "alta"
  },
  {
    id: "3",
    tipo: "comunicacao_interna",
    assunto: "Falta de comunicação sobre mudanças",
    descricao: "As mudanças nos processos não estão sendo comunicadas adequadamente para a equipe, causando confusão e retrabalho.",
    setor: "TI",
    dataOcorrencia: "2024-01-05",
    status: "arquivado",
    resolucao: "Implementado novo processo de comunicação interna com reuniões semanais.",
    dataSubmissao: "2024-01-08",
    urgencia: "media"
  }
];