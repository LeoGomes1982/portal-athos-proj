-- Atualizar políticas para histórico e documentos de funcionários
DROP POLICY IF EXISTS "Authenticated users can view historico" ON funcionario_historico;
DROP POLICY IF EXISTS "Admins can manage historico" ON funcionario_historico;
DROP POLICY IF EXISTS "Authenticated users can view documentos" ON funcionario_documentos;
DROP POLICY IF EXISTS "Admins can manage documentos" ON funcionario_documentos;

-- Criar políticas públicas para desenvolvimento
CREATE POLICY "Public can view historico" ON funcionario_historico FOR SELECT USING (true);
CREATE POLICY "Public can manage historico" ON funcionario_historico FOR ALL USING (true);

CREATE POLICY "Public can view documentos" ON funcionario_documentos FOR SELECT USING (true);
CREATE POLICY "Public can manage documentos" ON funcionario_documentos FOR ALL USING (true);