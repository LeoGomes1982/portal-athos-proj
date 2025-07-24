-- Adicionar coluna informacoes_adicionais à tabela cargos
ALTER TABLE public.cargos 
ADD COLUMN informacoes_adicionais TEXT;