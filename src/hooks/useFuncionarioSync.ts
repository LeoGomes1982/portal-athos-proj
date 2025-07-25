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
  }, []);

  const loadFuncionarios = async () => {
    try {
      console.log('Carregando funcionários...');
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao carregar funcionários:', error);
        setFuncionarios([]);
      } else if (data && data.length > 0) {
        console.log('Funcionários carregados:', data.length);
        const funcionariosFormatted = data.map(formatFromDatabase);
        setFuncionarios(funcionariosFormatted);
        localStorage.setItem('funcionarios_list', JSON.stringify(funcionariosFormatted));
      } else {
        console.log('Nenhum funcionário encontrado');
        setFuncionarios([]);
      }
    } catch (error) {
      console.error('Erro ao conectar com Supabase:', error);
      setFuncionarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
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
          loadFuncionarios(); // Recarregar dados quando houver mudanças
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
    motivoInativacao: dbRecord.motivo_inativacao
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
    motivo_inativacao: funcionario.motivoInativacao
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