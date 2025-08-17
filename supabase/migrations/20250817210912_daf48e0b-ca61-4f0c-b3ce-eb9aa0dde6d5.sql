-- Remover política insegura existente
DROP POLICY IF EXISTS "Allow all" ON public.candidaturas;

-- Criar política segura para candidaturas
CREATE POLICY "User can view own candidaturas" 
ON public.candidaturas 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "User can create own candidaturas" 
ON public.candidaturas 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can update own candidaturas" 
ON public.candidaturas 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "User can delete own candidaturas" 
ON public.candidaturas 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());