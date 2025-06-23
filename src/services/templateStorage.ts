
import { Template } from '@/types/template';

const TEMPLATES_STORAGE_KEY = 'saved_templates';

export interface SavedTemplate extends Template {
  createdAt: string;
  updatedAt: string;
  tipo: 'proposta' | 'contrato';
}

export const templateStorage = {
  save: (template: Template, tipo: 'proposta' | 'contrato'): void => {
    const templates = templateStorage.getAll();
    const now = new Date().toISOString();
    
    const existingIndex = templates.findIndex(t => t.id === template.id && t.tipo === tipo);
    
    const savedTemplate: SavedTemplate = {
      ...template,
      tipo,
      createdAt: existingIndex >= 0 ? templates[existingIndex].createdAt : now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      templates[existingIndex] = savedTemplate;
    } else {
      templates.push(savedTemplate);
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  },

  getAll: (): SavedTemplate[] => {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getByType: (tipo: 'proposta' | 'contrato'): SavedTemplate[] => {
    return templateStorage.getAll().filter(t => t.tipo === tipo);
  },

  delete: (id: string, tipo: 'proposta' | 'contrato'): void => {
    const templates = templateStorage.getAll();
    const filtered = templates.filter(t => !(t.id === id && t.tipo === tipo));
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
  },

  saveAll: (templates: Template[], tipo: 'proposta' | 'contrato'): void => {
    templates.forEach(template => {
      templateStorage.save(template, tipo);
    });
  }
};
