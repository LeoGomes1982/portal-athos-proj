-- CRITICAL SECURITY FIX: Remove dangerous public policies and implement proper authentication-based RLS

-- 1. Drop all existing dangerous "public" policies
DROP POLICY IF EXISTS "Public can view funcionarios" ON funcionarios_sync;
DROP POLICY IF EXISTS "Public can manage funcionarios" ON funcionarios_sync;
DROP POLICY IF EXISTS "Public can view documentos" ON funcionario_documentos;
DROP POLICY IF EXISTS "Public can manage documentos" ON funcionario_documentos;
DROP POLICY IF EXISTS "Public can view historico" ON funcionario_historico;
DROP POLICY IF EXISTS "Public can manage historico" ON funcionario_historico;
DROP POLICY IF EXISTS "Public can view cargos" ON cargos;
DROP POLICY IF EXISTS "Public can manage cargos" ON cargos;
DROP POLICY IF EXISTS "Public can view avaliacoes" ON avaliacoes_desempenho;
DROP POLICY IF EXISTS "Public can manage avaliacoes" ON avaliacoes_desempenho;
DROP POLICY IF EXISTS "Public can view compromissos" ON compromissos;
DROP POLICY IF EXISTS "Public can manage compromissos" ON compromissos;

-- 2. Create secure authenticated-only policies for funcionarios_sync
CREATE POLICY "Authenticated users can view funcionarios"
ON funcionarios_sync
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage funcionarios"
ON funcionarios_sync
FOR ALL
TO authenticated
USING (is_admin());

-- 3. Create secure policies for funcionario_documentos
CREATE POLICY "Authenticated users can view documentos"
ON funcionario_documentos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and managers can manage documentos"
ON funcionario_documentos
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 4. Create secure policies for funcionario_historico
CREATE POLICY "Authenticated users can view historico"
ON funcionario_historico
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and managers can manage historico"
ON funcionario_historico
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 5. Create secure policies for cargos
CREATE POLICY "Authenticated users can view cargos"
ON cargos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage cargos"
ON cargos
FOR ALL
TO authenticated
USING (is_admin());

-- 6. Create secure policies for avaliacoes_desempenho
CREATE POLICY "Authenticated users can view avaliacoes"
ON avaliacoes_desempenho
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and managers can manage avaliacoes"
ON avaliacoes_desempenho
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 7. Create secure policies for compromissos
CREATE POLICY "Users can view their own compromissos"
ON compromissos
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can manage their own compromissos"
ON compromissos
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR is_admin())
WITH CHECK (user_id = auth.uid() OR is_admin());

-- 8. Secure profiles table - prevent role escalation
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own profile (except role)"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  (
    -- Prevent users from changing their own role unless they're admin
    (OLD.role = NEW.role) OR is_admin()
  )
);

-- 9. Add policy to prevent non-admins from creating admin accounts
CREATE POLICY "Only admins can create admin profiles"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  (role != 'admin' OR is_admin())
);