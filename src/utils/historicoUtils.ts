interface RegistroHistorico {
  id: string;
  data: string;
  tipo: 'positivo' | 'neutro' | 'negativo';
  titulo: string;
  descricao: string;
  usuario: string;
}

export const adicionarRegistroHistorico = (
  clienteId: string,
  titulo: string,
  descricao: string,
  tipo: 'positivo' | 'neutro' | 'negativo' = 'neutro',
  usuario: string = 'Sistema'
) => {
  const historicosKey = `historico_cliente_${clienteId}`;
  
  // Carregar históricos existentes
  let historicos: RegistroHistorico[] = [];
  const savedHistoricos = localStorage.getItem(historicosKey);
  
  if (savedHistoricos) {
    try {
      historicos = JSON.parse(savedHistoricos);
    } catch (error) {
      console.error('Erro ao carregar históricos:', error);
      historicos = [];
    }
  }
  
  // Criar novo registro
  const novoRegistro: RegistroHistorico = {
    id: Date.now().toString(),
    data: new Date().toISOString().split('T')[0],
    tipo,
    titulo,
    descricao,
    usuario
  };
  
  // Adicionar no início da lista
  const novosHistoricos = [novoRegistro, ...historicos];
  
  // Salvar no localStorage
  try {
    localStorage.setItem(historicosKey, JSON.stringify(novosHistoricos));
    console.log(`Registro adicionado ao histórico do cliente ${clienteId}:`, novoRegistro);
    return true;
  } catch (error) {
    console.error('Erro ao salvar registro no histórico:', error);
    return false;
  }
};