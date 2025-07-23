-- Criar tabela para documentos de funcionários
CREATE TABLE IF NOT EXISTS public.funcionario_documentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    funcionario_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    arquivo_nome TEXT NOT NULL,
    arquivo_url TEXT NOT NULL,
    arquivo_tipo TEXT NOT NULL,
    arquivo_tamanho INTEGER,
    tem_validade BOOLEAN DEFAULT false,
    data_validade DATE,
    origem TEXT DEFAULT 'manual', -- 'portal', 'manual', 'historico'
    visualizado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.funcionario_documentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas para documentos de funcionários
CREATE POLICY "Documentos são visíveis para todos" 
ON public.funcionario_documentos 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir documentos" 
ON public.funcionario_documentos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar documentos" 
ON public.funcionario_documentos 
FOR UPDATE 
USING (true);

CREATE POLICY "Qualquer um pode deletar documentos" 
ON public.funcionario_documentos 
FOR DELETE 
USING (true);

-- Criar bucket para documentos de funcionários se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('funcionario-documentos', 'funcionario-documentos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas para o bucket de documentos de funcionários
CREATE POLICY "Documentos de funcionários são públicos para leitura" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'funcionario-documentos');

CREATE POLICY "Qualquer um pode fazer upload de documentos de funcionários" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'funcionario-documentos');

CREATE POLICY "Qualquer um pode atualizar documentos de funcionários" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'funcionario-documentos');

CREATE POLICY "Qualquer um pode deletar documentos de funcionários" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'funcionario-documentos');

-- Criar trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_funcionario_documentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_funcionario_documentos_updated_at
    BEFORE UPDATE ON public.funcionario_documentos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_funcionario_documentos_updated_at();