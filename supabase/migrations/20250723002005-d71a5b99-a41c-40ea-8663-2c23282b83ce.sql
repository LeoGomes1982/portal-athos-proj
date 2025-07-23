-- Adicionar campos para capturar informações de inativação
ALTER TABLE public.funcionarios_sync 
ADD COLUMN data_inativacao DATE,
ADD COLUMN motivo_inativacao TEXT;

-- Comentar os campos para documentação
COMMENT ON COLUMN public.funcionarios_sync.data_inativacao IS 'Data em que o funcionário foi inativado';
COMMENT ON COLUMN public.funcionarios_sync.motivo_inativacao IS 'Motivo da inativação: Final de contrato 1º período, Final de contrato 2º período, Demissão normal após aviso prévio, Demissão normal sem aviso prévio, Demissão por justa causa, Acordo entre empresa e empregado, Pedido de demissão';