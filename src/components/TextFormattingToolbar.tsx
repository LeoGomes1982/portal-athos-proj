
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette
} from "lucide-react";

export default function TextFormattingToolbar() {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const event = new Event('selectionchange');
        document.dispatchEvent(event);
      }
    }, 10);
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(Number(newSize));
    applyFormatting('fontSize', '7');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = newSize + 'px';
        try {
          range.surroundContents(span);
        } catch (e) {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    applyFormatting('fontName', family);
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    applyFormatting('foreColor', color);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    applyFormatting('backColor', color);
  };

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Calibri',
    'Roboto',
    'Open Sans'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Type size={16} className="text-gray-600" />
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Select value={fontSize.toString()} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('bold')}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('italic')}
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('underline')}
          >
            <Underline size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Palette size={16} className="text-gray-600" />
            <Input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
              title="Cor do texto"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Fundo:</span>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
              title="Cor de fundo"
            />
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('justifyLeft')}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('justifyCenter')}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('justifyRight')}
          >
            <AlignRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFormatting('justifyFull')}
          >
            <AlignJustify size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
