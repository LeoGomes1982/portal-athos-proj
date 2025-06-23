
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface TextEditingToolbarProps {
  selectedElement: any;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onBoldToggle: () => void;
  onItalicToggle: () => void;
  onUnderlineToggle: () => void;
  onAlignmentChange: (alignment: string) => void;
  currentFontSize: number;
  currentFontFamily: string;
  currentColor: string;
  currentBackgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  currentAlignment: string;
}

export default function TextEditingToolbar({
  selectedElement,
  onFontSizeChange,
  onFontFamilyChange,
  onColorChange,
  onBackgroundColorChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  onAlignmentChange,
  currentFontSize,
  currentFontFamily,
  currentColor,
  currentBackgroundColor,
  isBold,
  isItalic,
  isUnderline,
  currentAlignment
}: TextEditingToolbarProps) {
  if (!selectedElement || selectedElement.elementType !== 'text') {
    return null;
  }

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
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Fonte */}
        <div className="flex items-center gap-2">
          <Type size={16} className="text-gray-600" />
          <Select value={currentFontFamily} onValueChange={onFontFamilyChange}>
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

        {/* Tamanho da fonte */}
        <div className="flex items-center gap-1">
          <Select value={currentFontSize.toString()} onValueChange={(value) => onFontSizeChange(Number(value))}>
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

        {/* Formatação */}
        <div className="flex items-center gap-1">
          <Button
            variant={isBold ? "default" : "outline"}
            size="sm"
            onClick={onBoldToggle}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant={isItalic ? "default" : "outline"}
            size="sm"
            onClick={onItalicToggle}
          >
            <Italic size={16} />
          </Button>
          <Button
            variant={isUnderline ? "default" : "outline"}
            size="sm"
            onClick={onUnderlineToggle}
          >
            <Underline size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Cores */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Palette size={16} className="text-gray-600" />
            <Input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
              title="Cor do texto"
            />
          </div>
          <div className="flex items-center gap-1">
            <Label className="text-xs text-gray-600">Fundo:</Label>
            <Input
              type="color"
              value={currentBackgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-12 h-8 p-1 border rounded"
              title="Cor de fundo"
            />
          </div>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alinhamento */}
        <div className="flex items-center gap-1">
          <Button
            variant={currentAlignment === 'left' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('left')}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant={currentAlignment === 'center' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('center')}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant={currentAlignment === 'right' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('right')}
          >
            <AlignRight size={16} />
          </Button>
          <Button
            variant={currentAlignment === 'justify' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('justify')}
          >
            <AlignJustify size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
