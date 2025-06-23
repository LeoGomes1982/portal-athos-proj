
export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'field';
  content: string;
  style: {
    fontSize: number;
    color: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
  position: { x: number; y: number };
  size?: { width: number; height: number };
  fieldType?: string;
  fieldKey?: string;
  rotation?: number;
}

export interface Template {
  id: string;
  name: string;
  elements: TemplateElement[];
  orientation: 'portrait' | 'landscape';
  totalPages: number;
}

export interface TemplateEditorProps {
  tipo: 'proposta' | 'contrato';
}
