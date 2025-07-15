-- Criar tabelas para persistir dados do sistema

-- Tabela de compromissos da agenda
CREATE TABLE public.compromissos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  participantes TEXT[] NOT NULL DEFAULT '{}',
  tipo VARCHAR(50) NOT NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  criado_por TEXT NOT NULL,
  prioridade VARCHAR(20) NOT NULL DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vagas
CREATE TABLE public.vagas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  cidade TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  salario TEXT,
  descricao TEXT,
  requisitos TEXT,
  beneficios TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ativa',
  criado_por TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de candidaturas
CREATE TABLE public.candidaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco TEXT NOT NULL,
  email TEXT NOT NULL,
  curriculo TEXT,
  sobre_mim TEXT,
  experiencias TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de funcionarios
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  data_admissao DATE,
  salario DECIMAL(10,2),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.compromissos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso público (para simplicidade inicial)
CREATE POLICY "Permitir leitura pública de compromissos" 
ON public.compromissos FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de compromissos" 
ON public.compromissos FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de compromissos" 
ON public.compromissos FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de compromissos" 
ON public.compromissos FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de vagas" 
ON public.vagas FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de vagas" 
ON public.vagas FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de vagas" 
ON public.vagas FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de vagas" 
ON public.vagas FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de candidaturas" 
ON public.candidaturas FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de candidaturas" 
ON public.candidaturas FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de candidaturas" 
ON public.candidaturas FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de candidaturas" 
ON public.candidaturas FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de funcionarios" 
ON public.funcionarios FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de funcionarios" 
ON public.funcionarios FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de funcionarios" 
ON public.funcionarios FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de funcionarios" 
ON public.funcionarios FOR DELETE USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_compromissos_updated_at
  BEFORE UPDATE ON public.compromissos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vagas_updated_at
  BEFORE UPDATE ON public.vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidaturas_updated_at
  BEFORE UPDATE ON public.candidaturas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_funcionarios_updated_at
  BEFORE UPDATE ON public.funcionarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();