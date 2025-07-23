-- Criar tabela para histórico de funcionários
CREATE TABLE public.funcionario_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('positivo', 'neutro', 'negativo')),
  usuario TEXT NOT NULL DEFAULT 'Sistema',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funcionario_historico ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Histórico é visível para todos" 
ON public.funcionario_historico 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir histórico" 
ON public.funcionario_historico 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar histórico" 
ON public.funcionario_historico 
FOR UPDATE 
USING (true);

CREATE POLICY "Qualquer um pode deletar histórico" 
ON public.funcionario_historico 
FOR DELETE 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_funcionario_historico_updated_at
BEFORE UPDATE ON public.funcionario_historico
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.funcionario_historico;