-- Adicionar constraint UNIQUE para funcionario_id na tabela funcionarios_sync
-- Isso é necessário para que o UPSERT funcione corretamente

-- Primeiro, verificar se já existe dados duplicados e remover se necessário
DELETE FROM funcionarios_sync 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM funcionarios_sync 
    GROUP BY funcionario_id
);

-- Adicionar a constraint UNIQUE
ALTER TABLE funcionarios_sync 
ADD CONSTRAINT funcionarios_sync_funcionario_id_unique 
UNIQUE (funcionario_id);