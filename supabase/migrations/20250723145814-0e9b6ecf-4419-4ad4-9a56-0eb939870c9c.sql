-- Remover trigger primeiro
DROP TRIGGER IF EXISTS update_funcionario_documentos_updated_at ON public.funcionario_documentos;

-- Remover função
DROP FUNCTION IF EXISTS public.update_funcionario_documentos_updated_at();

-- Recriar função com search_path imutável
CREATE OR REPLACE FUNCTION public.update_funcionario_documentos_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER update_funcionario_documentos_updated_at
    BEFORE UPDATE ON public.funcionario_documentos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_funcionario_documentos_updated_at();