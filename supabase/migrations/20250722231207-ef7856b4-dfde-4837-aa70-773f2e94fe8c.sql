-- Criar tabela para planos de cargos e salários
CREATE TABLE IF NOT EXISTS public.cargos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('I', 'II', 'III')),
  salario_base TEXT NOT NULL,
  beneficios TEXT[] NOT NULL DEFAULT '{}',
  habilidades_especificas TEXT[] NOT NULL DEFAULT '{}',
  habilidades_esperadas TEXT[] NOT NULL DEFAULT '{}',
  responsabilidades TEXT[] NOT NULL DEFAULT '{}',
  carencia INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir leitura pública de cargos" 
ON public.cargos 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública de cargos" 
ON public.cargos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de cargos" 
ON public.cargos 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão pública de cargos" 
ON public.cargos 
FOR DELETE 
USING (true);

-- Criar trigger para updated_at
CREATE TRIGGER update_cargos_updated_at
BEFORE UPDATE ON public.cargos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.cargos (nome, nivel, salario_base, beneficios, habilidades_especificas, habilidades_esperadas, responsabilidades, carencia, status)
VALUES 
  (
    'Analista de Sistemas',
    'I',
    'R$ 4.500,00',
    ARRAY['Vale Refeição', 'Plano de Saúde', 'Vale Transporte'],
    ARRAY['JavaScript', 'React', 'Node.js'],
    ARRAY['Trabalho em equipe', 'Comunicação', 'Proatividade'],
    ARRAY['Desenvolver sistemas', 'Manutenção de código', 'Testes unitários'],
    6,
    'ativo'
  ),
  (
    'Analista de Sistemas',
    'II',
    'R$ 6.000,00',
    ARRAY['Vale Refeição', 'Plano de Saúde', 'Vale Transporte', 'Participação nos Lucros'],
    ARRAY['JavaScript', 'React', 'Node.js', 'Liderança técnica'],
    ARRAY['Trabalho em equipe', 'Comunicação', 'Proatividade', 'Mentoria'],
    ARRAY['Desenvolver sistemas', 'Manutenção de código', 'Testes unitários', 'Orientar júnior'],
    18,
    'ativo'
  )
ON CONFLICT DO NOTHING;