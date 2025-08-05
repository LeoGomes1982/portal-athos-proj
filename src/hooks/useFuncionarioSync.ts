import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/funcionario';

export function useFuncionarioSync() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadFuncionarios();
    setupRealtimeSubscription();

    // Escutar evento de funcionários importados
    const handleFuncionariosUpdated = () => {
      loadFuncionarios();
    };

    window.addEventListener('funcionariosUpdated', handleFuncionariosUpdated);

    return () => {
      window.removeEventListener('funcionariosUpdated', handleFuncionariosUpdated);
    };
  }, []);

  const loadFuncionarios = async () => {
    try {
      console.log('Carregando funcionários...');
      
      // Carregar funcionários do Supabase
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .select('*')
        .order('nome');

      let funcionariosSupabase: Funcionario[] = [];

      if (error) {
        console.error('Erro ao carregar funcionários:', error);
      } else if (data && data.length > 0) {
        console.log('Funcionários carregados do Supabase:', data.length);
        funcionariosSupabase = data.map(formatFromDatabase);
      }

      // Carregar funcionários importados do localStorage
      const funcionariosImportados = JSON.parse(localStorage.getItem('funcionarios') || '[]');
      console.log('Funcionários importados encontrados:', funcionariosImportados.length);

      // Combinar funcionários do Supabase com os importados
      const todosFuncionarios = [...funcionariosSupabase, ...funcionariosImportados];
      
      setFuncionarios(todosFuncionarios);
      localStorage.setItem('funcionarios_list', JSON.stringify(todosFuncionarios));
      
      console.log('Total de funcionários:', todosFuncionarios.length);
      
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      // Em caso de erro, carregar apenas os funcionários importados
      const funcionariosImportados = JSON.parse(localStorage.getItem('funcionarios') || '[]');
      setFuncionarios(funcionariosImportados);
    } finally {
      setIsLoading(false);
    }
  };

  const limparRegistrosAgenda = (funcionarioId: number) => {
    // Carregar compromissos da agenda do DP
    const savedCompromissos = localStorage.getItem('agenda_dp_compromissos');
    if (savedCompromissos) {
      const compromissos = JSON.parse(savedCompromissos);
      
      // Filtrar para remover compromissos relacionados a este funcionário
      const compromissosFiltrados = compromissos.filter((compromisso: any) => {
        const isMesmoFuncionario = compromisso.funcionarioId === funcionarioId.toString();
        const isAvisoRelacionado = ['aviso_documento', 'aviso_experiencia', 'aviso_previo'].includes(compromisso.tipo);
        
        // Manter o compromisso se NÃO for do mesmo funcionário OU NÃO for um aviso relacionado
        return !(isMesmoFuncionario && isAvisoRelacionado);
      });
      
      // Salvar compromissos filtrados
      localStorage.setItem('agenda_dp_compromissos', JSON.stringify(compromissosFiltrados));
      
      console.log(`Registros da agenda limpos para funcionário ${funcionarioId}. Removidos: ${compromissos.length - compromissosFiltrados.length} compromissos`);
      
      // Emitir evento para que outros componentes possam atualizar suas visualizações
      window.dispatchEvent(new CustomEvent('agendaLimpa', { 
        detail: { funcionarioId, removidos: compromissos.length - compromissosFiltrados.length } 
      }));
    }
  };

  const setupRealtimeSubscription = () => {
    // Configurar tabela para realtime
    supabase.from('funcionarios_sync').on('*', () => {}).subscribe();
    
    const channel = supabase
      .channel('funcionarios-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'funcionarios_sync' 
        },
        (payload) => {
          console.log('Funcionário atualizado em tempo real:', payload);
          
          // Verificar se houve mudança de status para "ativo"
          if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
            const statusAnterior = payload.old.status;
            const statusNovo = payload.new.status;
            const funcionarioId = payload.new.funcionario_id;
            
            if (statusNovo === 'ativo' && (statusAnterior === 'experiencia' || statusAnterior === 'aviso')) {
              console.log(`Funcionário ${funcionarioId} mudou de ${statusAnterior} para ${statusNovo} - limpando agenda`);
              limparRegistrosAgenda(funcionarioId);
            }
          }
          
          // Forçar reload completo dos dados
          setTimeout(() => {
            loadFuncionarios();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatFromDatabase = (dbRecord: any): Funcionario => ({
    id: dbRecord.funcionario_id,
    nome: dbRecord.nome,
    cargo: dbRecord.cargo,
    setor: dbRecord.setor || '',
    dataAdmissao: dbRecord.data_admissao || '',
    telefone: dbRecord.telefone || '',
    email: dbRecord.email || '',
    foto: dbRecord.foto || '',
    status: dbRecord.status || 'ativo',
    cpf: dbRecord.cpf,
    rg: dbRecord.rg,
    orgaoEmissorRG: dbRecord.orgao_emissor_rg,
    endereco: dbRecord.endereco,
    cep: dbRecord.cep,
    cidade: dbRecord.cidade,
    estado: dbRecord.estado,
    bairro: dbRecord.bairro,
    numero: dbRecord.numero,
    complemento: dbRecord.complemento,
    salario: dbRecord.salario,
    dataFimExperiencia: dbRecord.data_fim_experiencia,
    dataFimAvisoPrevio: dbRecord.data_fim_aviso_previo,
    dataNascimento: dbRecord.data_nascimento,
    estadoCivil: dbRecord.estado_civil,
    nacionalidade: dbRecord.nacionalidade,
    naturalidade: dbRecord.naturalidade,
    nomePai: dbRecord.nome_pai,
    nomeMae: dbRecord.nome_mae,
    nomeConjuge: dbRecord.nome_conjuge,
    racaEtnia: dbRecord.raca_etnia,
    ctpsNumero: dbRecord.ctps_numero,
    ctpsSerie: dbRecord.ctps_serie,
    ctpsEstado: dbRecord.ctps_estado,
    valeTransporte: dbRecord.vale_transporte,
    valorValeTransporte: dbRecord.valor_vale_transporte,
    quantidadeVales: dbRecord.quantidade_vales,
    possuiValeAlimentacao: dbRecord.possui_vale_alimentacao,
    valorValeAlimentacao: dbRecord.valor_vale_alimentacao,
    possuiAuxilioMoradia: dbRecord.possui_auxilio_moradia,
    valorAuxilioMoradia: dbRecord.valor_auxilio_moradia,
    dataInativacao: dbRecord.data_inativacao,
    motivoInativacao: dbRecord.motivo_inativacao,
    // Dados bancários
    banco: dbRecord.banco,
    agencia: dbRecord.agencia,
    contaBancaria: dbRecord.conta_bancaria,
    chavePix: dbRecord.chave_pix
  });

  const formatToDatabase = (funcionario: Funcionario) => ({
    funcionario_id: funcionario.id,
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    setor: funcionario.setor,
    data_admissao: funcionario.dataAdmissao,
    telefone: funcionario.telefone,
    email: funcionario.email,
    foto: funcionario.foto,
    status: funcionario.status,
    cpf: funcionario.cpf,
    rg: funcionario.rg,
    orgao_emissor_rg: funcionario.orgaoEmissorRG,
    endereco: funcionario.endereco,
    cep: funcionario.cep,
    cidade: funcionario.cidade,
    estado: funcionario.estado,
    bairro: funcionario.bairro,
    numero: funcionario.numero,
    complemento: funcionario.complemento,
    salario: funcionario.salario,
    data_fim_experiencia: funcionario.dataFimExperiencia,
    data_fim_aviso_previo: funcionario.dataFimAvisoPrevio,
    data_nascimento: funcionario.dataNascimento,
    estado_civil: funcionario.estadoCivil,
    nacionalidade: funcionario.nacionalidade,
    naturalidade: funcionario.naturalidade,
    nome_pai: funcionario.nomePai,
    nome_mae: funcionario.nomeMae,
    nome_conjuge: funcionario.nomeConjuge,
    raca_etnia: funcionario.racaEtnia,
    ctps_numero: funcionario.ctpsNumero,
    ctps_serie: funcionario.ctpsSerie,
    ctps_estado: funcionario.ctpsEstado,
    vale_transporte: funcionario.valeTransporte,
    valor_vale_transporte: funcionario.valorValeTransporte,
    quantidade_vales: funcionario.quantidadeVales,
    possui_vale_alimentacao: funcionario.possuiValeAlimentacao,
    valor_vale_alimentacao: funcionario.valorValeAlimentacao,
    possui_auxilio_moradia: funcionario.possuiAuxilioMoradia,
    valor_auxilio_moradia: funcionario.valorAuxilioMoradia,
    data_inativacao: funcionario.dataInativacao,
    motivo_inativacao: funcionario.motivoInativacao,
    // Dados bancários
    banco: funcionario.banco,
    agencia: funcionario.agencia,
    conta_bancaria: funcionario.contaBancaria,
    chave_pix: funcionario.chavePix
  });

  const updateFuncionario = async (funcionario: Funcionario) => {
    console.log('updateFuncionario chamado com:', funcionario.nome, funcionario.id, 'Status:', funcionario.status);
    try {
      const dbData = formatToDatabase(funcionario);
      console.log('Dados formatados para DB:', dbData);
      console.log('Status no dbData:', dbData.status);
      
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .upsert(dbData, { 
          onConflict: 'funcionario_id' 
        })
        .select();

      if (error) {
        console.error('Erro ao atualizar funcionário no Supabase:', error);
        // Fallback para localStorage
        setFuncionarios(prev => {
          const updated = prev.map(f => f.id === funcionario.id ? funcionario : f);
          localStorage.setItem('funcionarios_list', JSON.stringify(updated));
          return updated;
        });
      } else {
        console.log('Funcionário atualizado com sucesso no Supabase:', data);
        // Atualizar estado local imediatamente após sucesso
        setFuncionarios(prev => {
          const updated = prev.map(f => f.id === funcionario.id ? funcionario : f);
          localStorage.setItem('funcionarios_list', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      // Fallback para localStorage
      setFuncionarios(prev => {
        const updated = prev.map(f => f.id === funcionario.id ? funcionario : f);
        localStorage.setItem('funcionarios_list', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return {
    funcionarios,
    setFuncionarios,
    updateFuncionario,
    isLoading
  };
}