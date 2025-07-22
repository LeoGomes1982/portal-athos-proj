-- Adicionar os novos campos para vale alimentação e auxílio moradia
ALTER TABLE public.funcionarios_sync 
ADD COLUMN IF NOT EXISTS possui_vale_alimentacao text,
ADD COLUMN IF NOT EXISTS valor_vale_alimentacao text,
ADD COLUMN IF NOT EXISTS possui_auxilio_moradia text,
ADD COLUMN IF NOT EXISTS valor_auxilio_moradia text;