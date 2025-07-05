// Função para verificar se está próximo do fim (3 dias ou menos)
export const isProximoDoFim = (dataFim: string): boolean => {
  const hoje = new Date();
  const dataLimite = new Date(dataFim);
  const diferenca = dataLimite.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diferenca / (1000 * 3600 * 24));
  return diasRestantes <= 3 && diasRestantes >= 0;
};

// Função para verificar se a data já passou
export const dataJaPassou = (dataFim: string): boolean => {
  const hoje = new Date();
  const dataLimite = new Date(dataFim);
  return dataLimite < hoje;
};