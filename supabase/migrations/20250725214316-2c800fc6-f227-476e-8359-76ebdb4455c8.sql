-- Reabilitar RLS e criar políticas de acesso público para desenvolvimento
ALTER TABLE funcionarios_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_desempenho ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compromissos ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas que dependem de autenticação
DROP POLICY IF EXISTS "Authenticated users can view funcionarios_sync" ON funcionarios_sync;
DROP POLICY IF EXISTS "Admins can manage funcionarios_sync" ON funcionarios_sync;
DROP POLICY IF EXISTS "Authenticated users can view avaliacoes" ON avaliacoes_desempenho;
DROP POLICY IF EXISTS "Admins can manage avaliacoes" ON avaliacoes_desempenho;
DROP POLICY IF EXISTS "Authenticated users can view cargos" ON cargos;
DROP POLICY IF EXISTS "Admins can manage cargos" ON cargos;

-- Criar políticas públicas para desenvolvimento
CREATE POLICY "Public can view funcionarios" ON funcionarios_sync FOR SELECT USING (true);
CREATE POLICY "Public can manage funcionarios" ON funcionarios_sync FOR ALL USING (true);

CREATE POLICY "Public can view avaliacoes" ON avaliacoes_desempenho FOR SELECT USING (true);
CREATE POLICY "Public can manage avaliacoes" ON avaliacoes_desempenho FOR ALL USING (true);

CREATE POLICY "Public can view cargos" ON cargos FOR SELECT USING (true);
CREATE POLICY "Public can manage cargos" ON cargos FOR ALL USING (true);

-- Manter as políticas de compromissos como estão pois já funcionam