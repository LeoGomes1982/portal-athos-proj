import { DocumentoCompleto } from "@/hooks/useDocumentNotifications";

// Lista de funcionários
export const funcionarios = [
  { id: 1, nome: "Ana Silva", cargo: "Analista de Sistemas", status: "ativo" },
  { id: 2, nome: "João Santos", cargo: "Desenvolvedor", status: "ferias" },
  { id: 3, nome: "Maria Costa", cargo: "Gerente de Vendas", status: "ativo" },
  { id: 4, nome: "Carlos Oliveira", cargo: "Analista Financeiro", status: "experiencia" },
  { id: 5, nome: "Patricia Fernandes", cargo: "Assistente Administrativo", status: "aviso" }
];

// Lista de locais para associar documentos
export const locais = [
  { id: 1, nome: "Sede Principal" },
  { id: 2, nome: "Filial Norte" },
  { id: 3, nome: "Filial Sul" },
  { id: 4, nome: "Escritório Regional" },
  { id: 5, nome: "Almoxarifado Central" }
];

// Documentos mockados com sistema de validade
export const documentosMockCompletos: DocumentoCompleto[] = [
  {
    id: 1,
    nome: "Contrato_Ana_Silva.pdf",
    tipo: "Contrato",
    funcionario: "Ana Silva",
    local: null,
    dataUpload: "2024-06-15",
    tamanho: "2.5 MB",
    thumbnail: "📄",
    temValidade: false,
    visualizado: false
  },
  {
    id: 2,
    nome: "Manual_Funcionario_2024.pdf",
    tipo: "Manual",
    funcionario: null,
    local: "Sede Principal",
    dataUpload: "2024-06-10",
    tamanho: "8.2 MB",
    thumbnail: "📚",
    temValidade: true,
    dataValidade: "2024-12-31",
    visualizado: false
  },
  {
    id: 3,
    nome: "Exame_Medico_Joao.pdf",
    tipo: "Exame Médico",
    funcionario: "João Santos",
    local: null,
    dataUpload: "2024-06-08",
    tamanho: "1.8 MB",
    thumbnail: "🏥",
    temValidade: true,
    dataValidade: "2025-01-15", // Vence em 2 dias para teste
    visualizado: false
  },
  {
    id: 4,
    nome: "Politica_Empresa.pdf",
    tipo: "Política",
    funcionario: null,
    local: "Sede Principal",
    dataUpload: "2024-06-05",
    tamanho: "3.1 MB",
    thumbnail: "📋",
    temValidade: false,
    visualizado: false
  }
];