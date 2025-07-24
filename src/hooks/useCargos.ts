import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Cargo {
  id: string;
  nome: string;
  nivel: "I" | "II" | "III";
  salarioBase: string;
  beneficios: string[];
  habilidadesEspecificas: string[];
  habilidadesEsperadas: string[];
  responsabilidades: string[];
  carencia: number;
  status: "ativo" | "inativo";
  criadoEm: string;
  informacoesAdicionais?: string;
}

interface CargoDatabase {
  id: string;
  nome: string;
  nivel: string;
  salario_base: string;
  beneficios: string[];
  habilidades_especificas: string[];
  habilidades_esperadas: string[];
  responsabilidades: string[];
  carencia: number;
  status: string;
  created_at: string;
  updated_at: string;
  informacoes_adicionais?: string;
}

export function useCargos() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Converter do formato do banco para o formato da aplicação
  const formatFromDatabase = (dbRecord: CargoDatabase): Cargo => ({
    id: dbRecord.id,
    nome: dbRecord.nome,
    nivel: dbRecord.nivel as "I" | "II" | "III",
    salarioBase: dbRecord.salario_base,
    beneficios: dbRecord.beneficios || [],
    habilidadesEspecificas: dbRecord.habilidades_especificas || [],
    habilidadesEsperadas: dbRecord.habilidades_esperadas || [],
    responsabilidades: dbRecord.responsabilidades || [],
    carencia: dbRecord.carencia,
    status: dbRecord.status as "ativo" | "inativo",
    criadoEm: dbRecord.created_at.split('T')[0],
    informacoesAdicionais: dbRecord.informacoes_adicionais
  });

  // Converter do formato da aplicação para o formato do banco
  const formatToDatabase = (cargo: Omit<Cargo, 'id' | 'criadoEm'>) => ({
    nome: cargo.nome,
    nivel: cargo.nivel,
    salario_base: cargo.salarioBase,
    beneficios: cargo.beneficios,
    habilidades_especificas: cargo.habilidadesEspecificas,
    habilidades_esperadas: cargo.habilidadesEsperadas,
    responsabilidades: cargo.responsabilidades,
    carencia: cargo.carencia,
    status: cargo.status,
    informacoes_adicionais: cargo.informacoesAdicionais
  });

  // Carregar cargos do banco
  const loadCargos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cargos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao carregar cargos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os cargos",
          variant: "destructive"
        });
        return;
      }

      const cargosFormatados = data.map(formatFromDatabase);
      setCargos(cargosFormatados);
    } catch (error) {
      console.error('Erro ao carregar cargos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar novo cargo
  const adicionarCargo = async (novoCargo: Omit<Cargo, 'id' | 'criadoEm'>) => {
    try {
      const { data, error } = await supabase
        .from('cargos')
        .insert([formatToDatabase(novoCargo)])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar cargo:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o cargo",
          variant: "destructive"
        });
        return false;
      }

      const cargoFormatado = formatFromDatabase(data);
      setCargos(prev => [...prev, cargoFormatado]);
      
      toast({
        title: "Sucesso",
        description: "Cargo adicionado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar cargo:', error);
      return false;
    }
  };

  // Atualizar cargo existente
  const atualizarCargo = async (cargoAtualizado: Cargo) => {
    try {
      const { data, error } = await supabase
        .from('cargos')
        .update(formatToDatabase(cargoAtualizado))
        .eq('id', cargoAtualizado.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cargo:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o cargo",
          variant: "destructive"
        });
        return false;
      }

      const cargoFormatado = formatFromDatabase(data);
      setCargos(prev => prev.map(cargo => 
        cargo.id === cargoAtualizado.id ? cargoFormatado : cargo
      ));
      
      toast({
        title: "Sucesso",
        description: "Cargo atualizado com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error);
      return false;
    }
  };

  // Excluir cargo
  const excluirCargo = async (cargoId: string) => {
    try {
      const { error } = await supabase
        .from('cargos')
        .delete()
        .eq('id', cargoId);

      if (error) {
        console.error('Erro ao excluir cargo:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o cargo",
          variant: "destructive"
        });
        return false;
      }

      setCargos(prev => prev.filter(cargo => cargo.id !== cargoId));
      
      toast({
        title: "Sucesso",
        description: "Cargo excluído com sucesso!"
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir cargo:', error);
      return false;
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadCargos();
  }, []);

  return {
    cargos,
    isLoading,
    adicionarCargo,
    atualizarCargo,
    excluirCargo,
    recarregarCargos: loadCargos
  };
}