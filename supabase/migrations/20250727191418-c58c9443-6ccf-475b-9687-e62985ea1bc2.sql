-- Criar tabela para serviços extras
CREATE TABLE public.servicos_extras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_pessoa TEXT NOT NULL,
  local_servico TEXT NOT NULL,
  data_servico DATE NOT NULL,
  quantidade_horas INTEGER NOT NULL,
  motivo_servico TEXT NOT NULL,
  chave_pix TEXT NOT NULL,
  fiscal_responsavel TEXT NOT NULL,
  valor DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.servicos_extras ENABLE ROW LEVEL SECURITY;

-- Criar políticas para serviços extras
CREATE POLICY "Admins can manage servicos extras" 
ON public.servicos_extras 
FOR ALL 
USING (is_admin());

CREATE POLICY "Authenticated users can view servicos extras" 
ON public.servicos_extras 
FOR SELECT 
USING (true);

-- Criar tabela para fiscalizações
CREATE TABLE public.fiscalizacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'posto_servico' ou 'colaborador'
  titulo TEXT NOT NULL,
  data_fiscalizacao DATE NOT NULL,
  fiscalizador_nome TEXT NOT NULL,
  local TEXT,
  colaborador_nome TEXT,
  perguntas_marcadas JSONB NOT NULL DEFAULT '{}'::jsonb,
  perguntas_descritivas JSONB NOT NULL DEFAULT '{}'::jsonb,
  observacoes TEXT,
  resultado TEXT NOT NULL,
  pontuacao_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fiscalizacoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas para fiscalizações
CREATE POLICY "Admins can manage fiscalizacoes" 
ON public.fiscalizacoes 
FOR ALL 
USING (is_admin());

CREATE POLICY "Authenticated users can view fiscalizacoes" 
ON public.fiscalizacoes 
FOR SELECT 
USING (true);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_servicos_extras_updated_at
BEFORE UPDATE ON public.servicos_extras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fiscalizacoes_updated_at
BEFORE UPDATE ON public.fiscalizacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();