-- Atualizar políticas da tabela compromissos para permitir acesso público
DROP POLICY IF EXISTS "Users can view their own compromissos" ON compromissos;
DROP POLICY IF EXISTS "Users can create compromissos" ON compromissos;
DROP POLICY IF EXISTS "Users can update their own compromissos" ON compromissos;
DROP POLICY IF EXISTS "Users can delete their own compromissos" ON compromissos;

-- Criar políticas públicas para desenvolvimento
CREATE POLICY "Public can view compromissos" ON compromissos FOR SELECT USING (true);
CREATE POLICY "Public can manage compromissos" ON compromissos FOR ALL USING (true);