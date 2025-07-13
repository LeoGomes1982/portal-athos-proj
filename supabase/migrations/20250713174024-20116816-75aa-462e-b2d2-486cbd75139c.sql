-- Inserir uma denúncia de teste
INSERT INTO public.denuncias (
  tipo,
  assunto,
  setor,
  data_ocorrencia,
  nome_envolvido,
  testemunhas,
  descricao,
  consequencias,
  status
) VALUES (
  'assedio',
  'Comportamento inadequado no escritório',
  'Vendas',
  '2024-01-13',
  'João Silva',
  'Maria Santos, Pedro Costa',
  'Relato de comportamento inadequado durante reuniões de equipe, incluindo comentários inapropriados e gestos que causaram desconforto aos colegas de trabalho.',
  'Ambiente de trabalho tenso, redução na produtividade da equipe',
  'pendente'
);