import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Funcionario {
  id: number;
  funcionario_id: number;
  nome: string;
  cargo: string;
  setor: string;
  telefone: string;
  email: string;
  foto: string;
  status: string;
  dataAdmissao: string;
  cpf?: string;
  rg?: string;
  orgaoEmissorRG?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  numero?: string;
  complemento?: string;
  salario?: string;
  dataFimExperiencia?: string;
  dataFimAvisoPrevio?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  naturalidade?: string;
  nomePai?: string;
  nomeMae?: string;
  nomeConjuge?: string;
  racaEtnia?: string;
  ctpsNumero?: string;
  ctpsSerie?: string;
  ctpsEstado?: string;
  valeTransporte?: string;
  valorValeTransporte?: string;
  quantidadeVales?: string;
  possuiValeAlimentacao?: string;
  valorValeAlimentacao?: string;
  possuiAuxilioMoradia?: string;
  valorAuxilioMoradia?: string;
  dataInativacao?: string;
  motivoInativacao?: string;
}

export function useOptimizedFuncionarioSync() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapSupabaseToFuncionario = useCallback((data: any): Funcionario => ({
    id: data.id,
    funcionario_id: data.funcionario_id,
    nome: data.nome,
    cargo: data.cargo,
    setor: data.setor || 'N/A',
    telefone: data.telefone || '',
    email: data.email || '',
    foto: data.foto || '',
    status: data.status || 'ativo',
    dataAdmissao: data.data_admissao || '',
    cpf: data.cpf,
    rg: data.rg,
    orgaoEmissorRG: data.orgao_emissor_rg,
    endereco: data.endereco,
    cep: data.cep,
    cidade: data.cidade,
    estado: data.estado,
    bairro: data.bairro,
    numero: data.numero,
    complemento: data.complemento,
    salario: data.salario,
    dataFimExperiencia: data.data_fim_experiencia,
    dataFimAvisoPrevio: data.data_fim_aviso_previo,
    dataNascimento: data.data_nascimento,
    estadoCivil: data.estado_civil,
    nacionalidade: data.nacionalidade,
    naturalidade: data.naturalidade,
    nomePai: data.nome_pai,
    nomeMae: data.nome_mae,
    nomeConjuge: data.nome_conjuge,
    racaEtnia: data.raca_etnia,
    ctpsNumero: data.ctps_numero,
    ctpsSerie: data.ctps_serie,
    ctpsEstado: data.ctps_estado,
    valeTransporte: data.vale_transporte,
    valorValeTransporte: data.valor_vale_transporte,
    quantidadeVales: data.quantidade_vales,
    possuiValeAlimentacao: data.possui_vale_alimentacao,
    valorValeAlimentacao: data.valor_vale_alimentacao,
    possuiAuxilioMoradia: data.possui_auxilio_moradia,
    valorAuxilioMoradia: data.valor_auxilio_moradia,
    dataInativacao: data.data_inativacao,
    motivoInativacao: data.motivo_inativacao,
  }), []);

  const buscarFuncionarios = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('funcionarios_sync')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        throw error;
      }

      const funcionariosMapeados = data?.map(mapSupabaseToFuncionario) || [];
      setFuncionarios(funcionariosMapeados);
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  }, [mapSupabaseToFuncionario]);

  useEffect(() => {
    let isMounted = true;
    
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        buscarFuncionarios();
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [buscarFuncionarios]);

  const funcionariosAtivos = useMemo(() => 
    funcionarios.filter(f => f.status === 'ativo'), 
    [funcionarios]
  );

  const funcionariosInativos = useMemo(() => 
    funcionarios.filter(f => f.status === 'inativo'), 
    [funcionarios]
  );

  return {
    funcionarios,
    funcionariosAtivos,
    funcionariosInativos,
    loading,
    error,
    refetch: buscarFuncionarios
  };
}