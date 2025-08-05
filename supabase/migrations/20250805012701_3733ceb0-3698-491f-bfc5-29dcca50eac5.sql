-- Corrigir as políticas de avaliação de desempenho para funcionar no site publicado

-- Remover políticas existentes
DROP POLICY IF EXISTS "Authenticated users can view avaliacoes" ON public.avaliacoes_desempenho;
DROP POLICY IF EXISTS "Admins and managers can manage avaliacoes" ON public.avaliacoes_desempenho;

-- Criar política mais permissiva para usuários autenticados visualizarem avaliações
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
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Política para criação de avaliações (para links externos)
CREATE POLICY "External evaluations can be created" 
ON public.avaliacoes_desempenho 
FOR INSERT 
TO authenticated 
WITH CHECK (true);