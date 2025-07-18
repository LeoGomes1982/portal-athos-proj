
-- Criar tabela para funcionários no Supabase
CREATE TABLE public.funcionarios_sync (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  setor TEXT,
  data_admissao DATE,
  telefone TEXT,
  email TEXT,
  foto TEXT,
  status TEXT DEFAULT 'ativo',
  cpf TEXT,
  rg TEXT,
  orgao_emissor_rg TEXT,
  endereco TEXT,
  cep TEXT,
  cidade TEXT,
  estado TEXT,
  bairro TEXT,
  numero TEXT,
  complemento TEXT,
  salario TEXT,
  data_fim_experiencia DATE,
  data_fim_aviso_previo DATE,
  data_nascimento DATE,
  estado_civil TEXT,
  nacionalidade TEXT DEFAULT 'Brasileiro',
  naturalidade TEXT,
  nome_pai TEXT,
  nome_mae TEXT,
  nome_conjuge TEXT,
  raca_etnia TEXT,
  ctps_numero TEXT,
  ctps_serie TEXT,
  ctps_estado TEXT,
  vale_transporte TEXT,
  valor_vale_transporte TEXT,
  quantidade_vales TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ativar Row Level Security
ALTER TABLE public.funcionarios_sync ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (como os dados já são gerenciados localmente)
CREATE POLICY "Permitir leitura pública de funcionarios_sync" 
  ON public.funcionarios_sync 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserção pública de funcionarios_sync" 
  ON public.funcionarios_sync 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de funcionarios_sync" 
  ON public.funcionarios_sync 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir exclusão pública de funcionarios_sync" 
  ON public.funcionarios_sync 
  FOR DELETE 
  USING (true);

-- Ativar realtime para sincronização automática
ALTER TABLE public.funcionarios_sync REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.funcionarios_sync;

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_funcionarios_sync_updated_at 
    BEFORE UPDATE ON public.funcionarios_sync 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
