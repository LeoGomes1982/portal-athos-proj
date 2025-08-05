-- Temporariamente tornar as políticas de avaliação mais permissivas para debug
-- e garantir que funcionem tanto no preview quanto no site publicado

-- Remover políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view avaliacoes" ON public.avaliacoes_desempenho;
DROP POLICY IF EXISTS "Admins and managers can manage avaliacoes" ON public.avaliacoes_desempenho;

-- Criar política mais permissiva para usuários autenticados
CREATE POLICY "Users can view all avaliacoes" 
ON public.avaliacoes_desempenho 
FOR SELECT 
TO authenticated 
USING (true);

-- Política para admins e managers gerenciarem
CREATE POLICY "Admins and managers can manage all avaliacoes" 
ON public.avaliacoes_desempenho 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Criar política para criação de avaliações externas (links públicos)
CREATE POLICY "External evaluations can be created" 
ON public.avaliacoes_desempenho 
FOR INSERT 
TO authenticated 
USING (true);

-- Garantir que a tabela de links de avaliação externa também funcione
DROP POLICY IF EXISTS "Public can view valid evaluation links" ON public.avaliacao_externa_links;
DROP POLICY IF EXISTS "Public can update evaluation links" ON public.avaliacao_externa_links;
DROP POLICY IF EXISTS "Admins can manage evaluation links" ON public.avaliacao_externa_links;

-- Políticas mais permissivas para links de avaliação
CREATE POLICY "Anyone can view valid evaluation links" 
ON public.avaliacao_externa_links 
FOR SELECT 
TO anon, authenticated
USING (
  data_expiracao > now() 
  AND NOT usado
);

CREATE POLICY "Anyone can update evaluation links when valid" 
ON public.avaliacao_externa_links 
FOR UPDATE 
TO anon, authenticated
USING (
  data_expiracao > now() 
  AND NOT usado
);

CREATE POLICY "Admins can manage all evaluation links" 
ON public.avaliacao_externa_links 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);