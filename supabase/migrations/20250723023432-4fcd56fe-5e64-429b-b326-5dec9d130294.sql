-- Criar bucket para arquivos do histórico
INSERT INTO storage.buckets (id, name, public) VALUES ('historico-arquivos', 'historico-arquivos', true);

-- Criar políticas para o bucket de arquivos do histórico
CREATE POLICY "Arquivos de histórico são públicos para leitura" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'historico-arquivos');

CREATE POLICY "Qualquer um pode fazer upload de arquivos de histórico" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'historico-arquivos');

CREATE POLICY "Qualquer um pode atualizar arquivos de histórico" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'historico-arquivos');

CREATE POLICY "Qualquer um pode deletar arquivos de histórico" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'historico-arquivos');

-- Atualizar tabela funcionario_historico para incluir campos de arquivo
ALTER TABLE public.funcionario_historico 
ADD COLUMN arquivo_nome TEXT,
ADD COLUMN arquivo_url TEXT,
ADD COLUMN arquivo_tipo TEXT,
ADD COLUMN arquivo_tamanho INTEGER;