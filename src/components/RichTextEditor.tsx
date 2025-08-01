import React, { useRef, useEffect, useState } from 'react';
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

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

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
    <div className="border rounded-lg">
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

      {/* Helper Text */}
      {!value && (
        <div className="absolute top-16 left-4 text-slate-400 pointer-events-none">
          {placeholder || 'Digite aqui o modelo do contrato...'}
        </div>
      )}
    </div>
  );
};