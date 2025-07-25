-- Remove all insecure public RLS policies and implement proper security

-- First, create a profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT,
  email TEXT,
  cargo TEXT,
  departamento TEXT,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Update profiles table policies
DROP POLICY IF EXISTS "Perfis são visíveis para todos" ON public.profiles;
DROP POLICY IF EXISTS "Qualquer um pode atualizar perfis" ON public.profiles;
DROP POLICY IF EXISTS "Qualquer um pode inserir perfis" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- Update funcionarios table policies
DROP POLICY IF EXISTS "Permitir leitura pública de funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir inserção pública de funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir atualização pública de funcionarios" ON public.funcionarios;
DROP POLICY IF EXISTS "Permitir exclusão pública de funcionarios" ON public.funcionarios;

CREATE POLICY "Authenticated users can view funcionarios" ON public.funcionarios
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage funcionarios" ON public.funcionarios
  FOR ALL TO authenticated USING (public.is_admin());

-- Update funcionarios_sync table policies
DROP POLICY IF EXISTS "Permitir leitura pública de funcionarios_sync" ON public.funcionarios_sync;
DROP POLICY IF EXISTS "Permitir inserção pública de funcionarios_sync" ON public.funcionarios_sync;
DROP POLICY IF EXISTS "Permitir atualização pública de funcionarios_sync" ON public.funcionarios_sync;
DROP POLICY IF EXISTS "Permitir exclusão pública de funcionarios_sync" ON public.funcionarios_sync;

CREATE POLICY "Authenticated users can view funcionarios_sync" ON public.funcionarios_sync
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage funcionarios_sync" ON public.funcionarios_sync
  FOR ALL TO authenticated USING (public.is_admin());

-- Update compromissos table policies
DROP POLICY IF EXISTS "Permitir leitura pública de compromissos" ON public.compromissos;
DROP POLICY IF EXISTS "Permitir inserção pública de compromissos" ON public.compromissos;
DROP POLICY IF EXISTS "Permitir atualização pública de compromissos" ON public.compromissos;
DROP POLICY IF EXISTS "Permitir exclusão pública de compromissos" ON public.compromissos;

-- Add user_id column to compromissos if it doesn't exist
ALTER TABLE public.compromissos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE POLICY "Users can view their own compromissos" ON public.compromissos
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    auth.uid()::text = ANY(participantes) OR 
    public.is_admin()
  );

CREATE POLICY "Users can create compromissos" ON public.compromissos
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own compromissos" ON public.compromissos
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can delete their own compromissos" ON public.compromissos
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- Update avaliacoes_desempenho table policies
DROP POLICY IF EXISTS "Permitir leitura pública de avaliações" ON public.avaliacoes_desempenho;
DROP POLICY IF EXISTS "Permitir inserção pública de avaliações" ON public.avaliacoes_desempenho;
DROP POLICY IF EXISTS "Permitir atualização pública de avaliações" ON public.avaliacoes_desempenho;
DROP POLICY IF EXISTS "Permitir exclusão pública de avaliações" ON public.avaliacoes_desempenho;

-- Add user_id column to avaliacoes_desempenho if it doesn't exist
ALTER TABLE public.avaliacoes_desempenho ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE POLICY "Authenticated users can view avaliacoes" ON public.avaliacoes_desempenho
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage avaliacoes" ON public.avaliacoes_desempenho
  FOR ALL TO authenticated USING (public.is_admin());

-- Update cargos table policies
DROP POLICY IF EXISTS "Permitir leitura pública de cargos" ON public.cargos;
DROP POLICY IF EXISTS "Permitir inserção pública de cargos" ON public.cargos;
DROP POLICY IF EXISTS "Permitir atualização pública de cargos" ON public.cargos;
DROP POLICY IF EXISTS "Permitir exclusão pública de cargos" ON public.cargos;

CREATE POLICY "Authenticated users can view cargos" ON public.cargos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage cargos" ON public.cargos
  FOR ALL TO authenticated USING (public.is_admin());

-- Update vagas table policies
DROP POLICY IF EXISTS "Permitir leitura pública de vagas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir inserção pública de vagas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir atualização pública de vagas" ON public.vagas;
DROP POLICY IF EXISTS "Permitir exclusão pública de vagas" ON public.vagas;

CREATE POLICY "Public can view active vagas" ON public.vagas
  FOR SELECT USING (status = 'ativa');

CREATE POLICY "Admins can manage vagas" ON public.vagas
  FOR ALL TO authenticated USING (public.is_admin());

-- Update candidaturas table policies (keep public for job applications)
DROP POLICY IF EXISTS "Permitir leitura pública de candidaturas" ON public.candidaturas;
DROP POLICY IF EXISTS "Permitir inserção pública de candidaturas" ON public.candidaturas;
DROP POLICY IF EXISTS "Permitir atualização pública de candidaturas" ON public.candidaturas;
DROP POLICY IF EXISTS "Permitir exclusão pública de candidaturas" ON public.candidaturas;

CREATE POLICY "Public can create candidaturas" ON public.candidaturas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view candidaturas" ON public.candidaturas
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can manage candidaturas" ON public.candidaturas
  FOR ALL TO authenticated USING (public.is_admin());

-- Update denuncias table policies (keep public for reporting)
DROP POLICY IF EXISTS "Permitir leitura pública de denúncias" ON public.denuncias;
DROP POLICY IF EXISTS "Permitir inserção pública de denúncias" ON public.denuncias;
DROP POLICY IF EXISTS "Permitir atualização pública de denúncias" ON public.denuncias;

CREATE POLICY "Public can create denuncias" ON public.denuncias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view denuncias" ON public.denuncias
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update denuncias" ON public.denuncias
  FOR UPDATE TO authenticated USING (public.is_admin());

-- Secure funcionario_documentos and funcionario_historico
DROP POLICY IF EXISTS "Documentos são visíveis para todos" ON public.funcionario_documentos;
DROP POLICY IF EXISTS "Qualquer um pode atualizar documentos" ON public.funcionario_documentos;
DROP POLICY IF EXISTS "Qualquer um pode deletar documentos" ON public.funcionario_documentos;
DROP POLICY IF EXISTS "Qualquer um pode inserir documentos" ON public.funcionario_documentos;

CREATE POLICY "Authenticated users can view documentos" ON public.funcionario_documentos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage documentos" ON public.funcionario_documentos
  FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Histórico é visível para todos" ON public.funcionario_historico;
DROP POLICY IF EXISTS "Qualquer um pode atualizar histórico" ON public.funcionario_historico;
DROP POLICY IF EXISTS "Qualquer um pode deletar histórico" ON public.funcionario_historico;
DROP POLICY IF EXISTS "Qualquer um pode inserir histórico" ON public.funcionario_historico;

CREATE POLICY "Authenticated users can view historico" ON public.funcionario_historico
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage historico" ON public.funcionario_historico
  FOR ALL TO authenticated USING (public.is_admin());

-- Secure external evaluation links with proper token validation
DROP POLICY IF EXISTS "Links são visíveis para todos" ON public.avaliacao_externa_links;
DROP POLICY IF EXISTS "Qualquer um pode atualizar links" ON public.avaliacao_externa_links;
DROP POLICY IF EXISTS "Qualquer um pode inserir links" ON public.avaliacao_externa_links;

CREATE POLICY "Public can view valid evaluation links" ON public.avaliacao_externa_links
  FOR SELECT USING (data_expiracao > now() AND NOT usado);

CREATE POLICY "Public can update evaluation links" ON public.avaliacao_externa_links
  FOR UPDATE USING (data_expiracao > now());

CREATE POLICY "Admins can manage evaluation links" ON public.avaliacao_externa_links
  FOR ALL TO authenticated USING (public.is_admin());

-- Create trigger for profiles updated_at
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profiles_updated_at();