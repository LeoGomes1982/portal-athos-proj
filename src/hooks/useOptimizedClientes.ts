import { useState, useEffect, useCallback, useMemo } from 'react';

export interface ClienteFornecedor {
  id: string;
  nome: string;
  tipo: 'cliente' | 'fornecedor';
  email?: string;
  telefone?: string;
  endereco?: string;
  cnpj?: string;
  cpf?: string;
  inscricaoEstadual?: string;
  observacoes?: string;
  ativo: boolean;
  dataCreacao: string;
}

export function useOptimizedClientes() {
  const [clientes, setClientes] = useState<ClienteFornecedor[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = useCallback(() => {
    try {
      const savedClients = localStorage.getItem('clientesFornecedores');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        setClientes(clients);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(carregarClientes, 0);
    return () => clearTimeout(timeoutId);
  }, [carregarClientes]);

  const totalClientes = useMemo(() => 
    clientes.filter(c => c.tipo === 'cliente').length, 
    [clientes]
  );

  const totalFornecedores = useMemo(() => 
    clientes.filter(c => c.tipo === 'fornecedor').length, 
    [clientes]
  );

  const clientesAtivos = useMemo(() => 
    clientes.filter(c => c.tipo === 'cliente' && c.ativo), 
    [clientes]
  );

  const fornecedoresAtivos = useMemo(() => 
    clientes.filter(c => c.tipo === 'fornecedor' && c.ativo), 
    [clientes]
  );

  return {
    clientes,
    totalClientes,
    totalFornecedores,
    clientesAtivos,
    fornecedoresAtivos,
    loading,
    refetch: carregarClientes
  };
}