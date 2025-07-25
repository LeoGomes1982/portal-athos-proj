-- Atualizar compromissos de avaliação de desempenho para prioridade muito_importante
UPDATE public.compromissos 
SET prioridade = 'muito-importante' 
WHERE titulo ILIKE '%avaliação%' OR titulo ILIKE '%avaliacao%' OR tipo = 'avaliacao';