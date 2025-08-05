-- Habilitar realtime para sincronização entre PWA e site publicado
ALTER TABLE funcionarios_sync REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE funcionarios_sync;

ALTER TABLE avaliacoes_desempenho REPLICA IDENTITY FULL;  
ALTER PUBLICATION supabase_realtime ADD TABLE avaliacoes_desempenho;

ALTER TABLE funcionario_documentos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE funcionario_documentos;

ALTER TABLE funcionario_historico REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE funcionario_historico;