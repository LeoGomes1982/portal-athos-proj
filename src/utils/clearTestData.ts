// Utilitário para limpar dados de teste do localStorage
export const clearTestData = () => {
  // Limpar dados da agenda
  localStorage.removeItem('agenda_compromissos');
  localStorage.removeItem('agenda_last_check');
  
  // Limpar dados dos funcionários
  localStorage.removeItem('funcionarios');
  localStorage.removeItem('funcionarios_last_check');
  
  // Limpar dados do CICAD
  localStorage.removeItem('cicad_last_check');
  
  // Limpar outros dados relacionados
  localStorage.removeItem('documentos');
  localStorage.removeItem('contratos');
  localStorage.removeItem('vagas');
  localStorage.removeItem('candidatos');
  localStorage.removeItem('empresas');
  localStorage.removeItem('cargos');
  
  console.log('Dados de teste limpos com sucesso!');
};

// Executar automaticamente quando importado
if (typeof window !== 'undefined') {
  clearTestData();
}