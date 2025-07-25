-- Criar tabela de avaliações de desempenho
CREATE TABLE public.avaliacoes_desempenho (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id TEXT NOT NULL,
  funcionario_nome TEXT NOT NULL,
  tipo_avaliacao TEXT NOT NULL CHECK (tipo_avaliacao IN ('colega', 'chefia', 'responsavel')),
  avaliador_nome TEXT NOT NULL,
  data_avaliacao DATE NOT NULL,
  perguntas_marcadas JSONB NOT NULL DEFAULT '{}',
  perguntas_descritivas JSONB NOT NULL DEFAULT '{}',
  recomendacoes JSONB DEFAULT '{}',
  sugestoes JSONB DEFAULT '{}',
  feedback TEXT,
  pontuacao_total INTEGER NOT NULL DEFAULT 0,
  resultado TEXT NOT NULL CHECK (resultado IN ('POSITIVO', 'NEGATIVO', 'NEUTRO')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.avaliacoes_desempenho ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso público
CREATE POLICY "Permitir leitura pública de avaliações" 
ON public.avaliacoes_desempenho 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública de avaliações" 
ON public.avaliacoes_desempenho 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de avaliações" 
ON public.avaliacoes_desempenho 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão pública de avaliações" 
ON public.avaliacoes_desempenho 
FOR DELETE 
USING (true);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_avaliacoes_desempenho_updated_at
BEFORE UPDATE ON public.avaliacoes_desempenho
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();