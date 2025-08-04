import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Image, 
  Table, 
  Grid,
  Type,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const VARIAVEIS_DISPONIVEIS = [
  { key: '{contratanteNome}', label: 'Nome do Contratante' },
  { key: '{contratanteCnpj}', label: 'CNPJ do Contratante' },
  { key: '{contratanteEndereco}', label: 'Endereço do Contratante' },
  { key: '{contratanteRepresentante}', label: 'Representante do Contratante' },
  { key: '{contratanteRepresentanteCpf}', label: 'CPF do Representante (Contratante)' },
  { key: '{contratadaNome}', label: 'Nome da Contratada' },
  { key: '{contratadaCnpj}', label: 'CNPJ da Contratada' },
  { key: '{contratadaEndereco}', label: 'Endereço da Contratada' },
  { key: '{contratadaRepresentante}', label: 'Representante da Contratada' },
  { key: '{contratadaRepresentanteCpf}', label: 'CPF do Representante (Contratada)' },
  { key: '{servicoDescricao}', label: 'Descrição do Serviço' },
  { key: '{servicoJornada}', label: 'Jornada do Serviço' },
  { key: '{servicoHorario}', label: 'Horário do Serviço' },
  { key: '{servicoRegime}', label: 'Regime de Trabalho' },
  { key: '{valorUnitario}', label: 'Valor Unitário' },
  { key: '{quantidade}', label: 'Quantidade' },
  { key: '{valorMensal}', label: 'Valor Mensal' },
  { key: '{dataInicio}', label: 'Data de Início' },
  { key: '{duracao}', label: 'Duração (meses)' },
  { key: '{avisoPrevo}', label: 'Aviso Prévio (dias)' },
  { key: '{dataAssinatura}', label: 'Data de Assinatura' }
];

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  
  // Estados para o dropdown de variáveis
  const [showVariables, setShowVariables] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [vvPosition, setVvPosition] = useState<{node: Node, offset: number} | null>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      // Sanitize HTML content before setting it
      const sanitizedValue = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'div', 'span', 'img'],
        ALLOWED_ATTR: ['style', 'src', 'alt', 'border', 'width', 'height', 'class'],
        ALLOW_DATA_ATTR: false
      });
      editorRef.current.innerHTML = sanitizedValue;
    }
  }, [value]);

  const handleContentChange = () => {
    if (editorRef.current) {
      // Sanitize content before passing it to onChange
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'div', 'span', 'img'],
        ALLOWED_ATTR: ['style', 'src', 'alt', 'border', 'width', 'height', 'class'],
        ALLOW_DATA_ATTR: false
      });
      onChange(sanitizedContent);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    // Só verificar VV após uma tecla ser liberada, não durante a digitação
    if (e.key === 'V') {
      setTimeout(() => checkForVV(), 100);
    }
  };

  const checkForVV = () => {
    if (showVariables) return; // Não verificar se o dropdown já está aberto
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (textNode.nodeType === Node.TEXT_NODE) {
      const text = textNode.textContent || '';
      const cursorPosition = range.startOffset;
      
      // Verificar se há "VV" exatamente antes do cursor
      if (cursorPosition >= 2) {
        const beforeCursor = text.substring(cursorPosition - 2, cursorPosition);
        if (beforeCursor === 'VV') {
          // Posição onde "VV" começa
          setVvPosition({
            node: textNode,
            offset: cursorPosition - 2
          });
          
          // Calcular posição do dropdown de forma mais precisa
          const rect = editorRef.current?.getBoundingClientRect();
          if (rect) {
            setDropdownPosition({
              x: rect.left + 20,
              y: rect.top + 100
            });
          }
          
          setShowVariables(true);
          return;
        }
      }
    }
  };

  const handleVariableSelect = (variable: string) => {
    if (!vvPosition) return;
    
    const { node, offset } = vvPosition;
    
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const textContent = node.textContent;
      // Substituir "VV" pela variável selecionada
      const newText = textContent.substring(0, offset) + variable + textContent.substring(offset + 2);
      
      // Criar um novo nó de texto para evitar problemas de cursor
      const newTextNode = document.createTextNode(newText);
      node.parentNode?.replaceChild(newTextNode, node);
      
      // Posicionar cursor após a variável inserida
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(newTextNode, offset + variable.length);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Atualizar conteúdo
      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 10);
    }
    
    setShowVariables(false);
    setVvPosition(null);
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVariables && editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowVariables(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVariables]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    executeCommand('fontSize', '3');
    // Apply custom font size via CSS
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const span = document.createElement('span');
      span.style.fontSize = newSize + 'px';
      try {
        selection.getRangeAt(0).surroundContents(span);
      } catch (e) {
        // If selection spans multiple elements, just apply to current element
        executeCommand('fontSize', newSize);
      }
    }
    handleContentChange();
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    executeCommand('fontName', family);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgHtml = `<img src="${e.target?.result}" style="max-width: 300px; height: auto; margin: 10px; display: inline-block;" />`;
        
        // Focar no editor antes de inserir
        editorRef.current?.focus();
        
        // Inserir a imagem na posição do cursor
        executeCommand('insertHTML', imgHtml);
        
        // Limpar o input para permitir reuploads do mesmo arquivo
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const insertTable = () => {
    const table = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">Célula 1</td>
          <td style="padding: 8px; border: 1px solid #ccc;">Célula 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ccc;">Célula 3</td>
          <td style="padding: 8px; border: 1px solid #ccc;">Célula 4</td>
        </tr>
      </table>
    `;
    executeCommand('insertHTML', table);
  };

  const insertGrid = () => {
    const grid = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
        <div style="padding: 10px; border: 1px solid #ddd;">Item 1</div>
        <div style="padding: 10px; border: 1px solid #ddd;">Item 2</div>
        <div style="padding: 10px; border: 1px solid #ddd;">Item 3</div>
        <div style="padding: 10px; border: 1px solid #ddd;">Item 4</div>
      </div>
    `;
    executeCommand('insertHTML', grid);
  };

  return (
    <div className="border rounded-lg relative">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-slate-50">
        {/* Font Family */}
        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times New Roman">Times</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <Select value={fontSize} onValueChange={handleFontSizeChange}>
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="28">28</SelectItem>
          </SelectContent>
        </Select>

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <Palette size={16} />
          <Input
            type="color"
            value={textColor}
            onChange={(e) => handleTextColorChange(e.target.value)}
            className="w-8 h-8 p-0 border-0"
          />
        </div>

        <div className="h-6 w-px bg-slate-300" />

        {/* Format Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('bold')}
          className="p-2"
        >
          <Bold size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('italic')}
          className="p-2"
        >
          <Italic size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('underline')}
          className="p-2"
        >
          <Underline size={16} />
        </Button>

        <div className="h-6 w-px bg-slate-300" />

        {/* Alignment Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyLeft')}
          className="p-2"
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyCenter')}
          className="p-2"
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyRight')}
          className="p-2"
        >
          <AlignRight size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => executeCommand('justifyFull')}
          className="p-2"
        >
          <AlignJustify size={16} />
        </Button>

        <div className="h-6 w-px bg-slate-300" />

        {/* Insert Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="p-2"
        >
          <Image size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={insertTable}
          className="p-2"
        >
          <Table size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={insertGrid}
          className="p-2"
        >
          <Grid size={16} />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyUp={handleKeyUp}
        onBlur={handleContentChange}
        className="min-h-[200px] p-4 focus:outline-none"
        style={{ fontFamily: fontFamily, fontSize: fontSize + 'px', color: textColor }}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Dropdown de Variáveis */}
      {showVariables && (
        <div 
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto w-72"
          style={{
            left: dropdownPosition.x,
            top: dropdownPosition.y
          }}
        >
          <div className="p-2 border-b bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Selecione uma variável:</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {VARIAVEIS_DISPONIVEIS.map((variavel) => (
              <button
                key={variavel.key}
                onClick={() => handleVariableSelect(variavel.key)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div className="font-mono text-sm text-blue-600">{variavel.key}</div>
                <div className="text-xs text-gray-500">{variavel.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!value && (
        <div className="absolute top-16 left-4 text-slate-400 pointer-events-none">
          {placeholder || 'Digite aqui o modelo do contrato...'}
        </div>
      )}
    </div>
  );
};