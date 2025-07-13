-- Criar tabela para denúncias CICAD
CREATE TABLE public.denuncias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  assunto TEXT NOT NULL,
  setor VARCHAR(100) NOT NULL,
  data_ocorrencia DATE,
  nome_envolvido TEXT,
  testemunhas TEXT,
  descricao TEXT NOT NULL,
  consequencias TEXT,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  resolucao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção pública (formulário anônimo)
CREATE POLICY "Permitir inserção pública de denúncias" 
ON public.denuncias 
FOR INSERT 
WITH CHECK (true);

-- Criar política para leitura pública (para visualização na empresa)
CREATE POLICY "Permitir leitura pública de denúncias" 
ON public.denuncias 
FOR SELECT 
USING (true);

-- Criar política para atualização pública (para resolver casos)
CREATE POLICY "Permitir atualização pública de denúncias" 
ON public.denuncias 
FOR UPDATE 
USING (true);

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualização automática de timestamps
CREATE TRIGGER update_denuncias_updated_at
BEFORE UPDATE ON public.denuncias
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.denuncias;