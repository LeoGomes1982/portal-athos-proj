
import { useState, useCallback } from 'react';

export interface DynamicField {
  id: string;
  label: string;
  key: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone';
  category: 'cliente' | 'fornecedor' | 'empresa';
  required: boolean;
}

export const useDynamicFields = () => {
  const [fields, setFields] = useState<DynamicField[]>(() => {
    const stored = localStorage.getItem('dynamicFields');
    return stored ? JSON.parse(stored) : [
      // Campos padrão para clientes
      { id: '1', label: 'Nome do Cliente', key: 'cliente.nome', type: 'text', category: 'cliente', required: true },
      { id: '2', label: 'CNPJ/CPF', key: 'cliente.documento', type: 'text', category: 'cliente', required: true },
      { id: '3', label: 'Email', key: 'cliente.email', type: 'email', category: 'cliente', required: false },
      { id: '4', label: 'Telefone', key: 'cliente.telefone', type: 'phone', category: 'cliente', required: false },
      { id: '5', label: 'Endereço', key: 'cliente.endereco', type: 'text', category: 'cliente', required: false },
      
      // Campos padrão para fornecedores
      { id: '6', label: 'Nome do Fornecedor', key: 'fornecedor.nome', type: 'text', category: 'fornecedor', required: true },
      { id: '7', label: 'CNPJ', key: 'fornecedor.cnpj', type: 'text', category: 'fornecedor', required: true },
      { id: '8', label: 'Email', key: 'fornecedor.email', type: 'email', category: 'fornecedor', required: false },
      
      // Campos padrão para empresas
      { id: '9', label: 'Razão Social', key: 'empresa.razaoSocial', type: 'text', category: 'empresa', required: true },
      { id: '10', label: 'CNPJ', key: 'empresa.cnpj', type: 'text', category: 'empresa', required: true },
      { id: '11', label: 'Endereço', key: 'empresa.endereco', type: 'text', category: 'empresa', required: false },
    ];
  });

  const saveFields = useCallback((newFields: DynamicField[]) => {
    setFields(newFields);
    localStorage.setItem('dynamicFields', JSON.stringify(newFields));
  }, []);

  const addField = useCallback((field: Omit<DynamicField, 'id'>) => {
    const newField = {
      ...field,
      id: Date.now().toString(),
    };
    const newFields = [...fields, newField];
    saveFields(newFields);
  }, [fields, saveFields]);

  const updateField = useCallback((id: string, updates: Partial<DynamicField>) => {
    const newFields = fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    saveFields(newFields);
  }, [fields, saveFields]);

  const deleteField = useCallback((id: string) => {
    const newFields = fields.filter(field => field.id !== id);
    saveFields(newFields);
  }, [fields, saveFields]);

  const getFieldsByCategory = useCallback((category: 'cliente' | 'fornecedor' | 'empresa') => {
    return fields.filter(field => field.category === category);
  }, [fields]);

  return {
    fields,
    addField,
    updateField,
    deleteField,
    getFieldsByCategory,
    saveFields
  };
};
