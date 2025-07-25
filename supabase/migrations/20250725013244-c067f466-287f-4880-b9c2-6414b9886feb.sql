-- Criar tabela para links de avaliação externa
CREATE TABLE public.avaliacao_externa_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id TEXT NOT NULL,
  funcionario_nome TEXT NOT NULL,
  tipo_avaliacao TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  criado_por TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT false,
  avaliacao_id UUID REFERENCES public.avaliacoes_desempenho(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.avaliacao_externa_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Links são visíveis para todos" 
ON public.avaliacao_externa_links 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir links" 
ON public.avaliacao_externa_links 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar links" 
ON public.avaliacao_externa_links 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_avaliacao_externa_links_updated_at
BEFORE UPDATE ON public.avaliacao_externa_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();