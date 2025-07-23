-- Corrigir função para ter search_path imutável
DROP FUNCTION IF EXISTS public.update_funcionario_documentos_updated_at();

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