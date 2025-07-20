import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AvatarOption {
  emoji: string;
  name: string;
  category: string;
}

const avatarOptions: AvatarOption[] = [
  // Normal - Masculino
  { emoji: "👨", name: "Homem", category: "normal-masculino" },
  { emoji: "🧔", name: "Homem com Barba", category: "normal-masculino" },
  
  // Normal - Feminino  
  { emoji: "👩", name: "Mulher", category: "normal-feminino" },
  { emoji: "👱‍♀️", name: "Mulher Loira", category: "normal-feminino" },
  
  // Roqueiro - Masculino
  { emoji: "🤘", name: "Roqueiro", category: "roqueiro-masculino" },
  { emoji: "🎸", name: "Guitarrista", category: "roqueiro-masculino" },
  
  // Roqueiro - Feminino
  { emoji: "🎤", name: "Vocalista", category: "roqueiro-feminino" },
  { emoji: "🎵", name: "Musicista", category: "roqueiro-feminino" },
  
  // Astronauta - Masculino
  { emoji: "👨‍🚀", name: "Astronauta", category: "astronauta-masculino" },
  { emoji: "🚀", name: "Piloto Espacial", category: "astronauta-masculino" },
  
  // Astronauta - Feminino
  { emoji: "👩‍🚀", name: "Astronauta", category: "astronauta-feminino" },
  { emoji: "🛸", name: "Exploradora Espacial", category: "astronauta-feminino" },
  
  // Hippie - Masculino
  { emoji: "🕺", name: "Hippie Dançarino", category: "hippie-masculino" },
  { emoji: "🌻", name: "Flower Power", category: "hippie-masculino" },
  
  // Hippie - Feminino
  { emoji: "💃", name: "Hippie Dançarina", category: "hippie-feminino" },
  { emoji: "🌈", name: "Espírito Livre", category: "hippie-feminino" },
  
  // Meditativo - Masculino
  { emoji: "🧘‍♂️", name: "Meditador", category: "meditativo-masculino" },
  { emoji: "🕉️", name: "Zen Master", category: "meditativo-masculino" },
  
  // Meditativo - Feminino
  { emoji: "🧘‍♀️", name: "Meditadora", category: "meditativo-feminino" },
  { emoji: "☯️", name: "Alma Zen", category: "meditativo-feminino" },
  
  // Ansioso - Masculino
  { emoji: "😰", name: "Ansioso", category: "ansioso-masculino" },
  { emoji: "🤯", name: "Estressado", category: "ansioso-masculino" },
  
  // Ansioso - Feminino
  { emoji: "😅", name: "Ansiosa", category: "ansioso-feminino" },
  { emoji: "🤪", name: "Agitada", category: "ansioso-feminino" },
  
  // Sonolento - Masculino
  { emoji: "😴", name: "Sonolento", category: "sonolento-masculino" },
  { emoji: "🥱", name: "Bocejando", category: "sonolento-masculino" },
  
  // Sonolento - Feminino
  { emoji: "😪", name: "Sonolenta", category: "sonolento-feminino" },
  { emoji: "💤", name: "Dorminhoca", category: "sonolento-feminino" },
];

const categories = [
  { id: "normal", label: "Normal", masculine: "normal-masculino", feminine: "normal-feminino" },
  { id: "roqueiro", label: "Roqueiro", masculine: "roqueiro-masculino", feminine: "roqueiro-feminino" },
  { id: "astronauta", label: "Astronauta", masculine: "astronauta-masculino", feminine: "astronauta-feminino" },
  { id: "hippie", label: "Hippie", masculine: "hippie-masculino", feminine: "hippie-feminino" },
  { id: "meditativo", label: "Meditativo", masculine: "meditativo-masculino", feminine: "meditativo-feminino" },
  { id: "ansioso", label: "Ansioso", masculine: "ansioso-masculino", feminine: "ansioso-feminino" },
  { id: "sonolento", label: "Sonolento", masculine: "sonolento-masculino", feminine: "sonolento-feminino" },
];

interface AvatarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string;
  onSelectAvatar: (emoji: string) => void;
}

export function AvatarSelector({ open, onOpenChange, currentAvatar, onSelectAvatar }: AvatarSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("normal");
  const [selectedGender, setSelectedGender] = useState<"masculino" | "feminino">("masculino");

  const currentCategoryKey = `${selectedCategory}-${selectedGender}`;
  const filteredAvatars = avatarOptions.filter(avatar => avatar.category === currentCategoryKey);

  const handleSelectAvatar = (emoji: string) => {
    onSelectAvatar(emoji);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Seletor de Categoria */}
          <div>
            <label className="text-sm font-medium mb-2 block">Categoria:</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seletor de Gênero */}
          <div>
            <label className="text-sm font-medium mb-2 block">Gênero:</label>
            <div className="flex gap-2">
              <Badge
                variant={selectedGender === "masculino" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedGender("masculino")}
              >
                Masculino
              </Badge>
              <Badge
                variant={selectedGender === "feminino" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedGender("feminino")}
              >
                Feminino
              </Badge>
            </div>
          </div>

          {/* Grid de Avatares */}
          <div>
            <label className="text-sm font-medium mb-2 block">Escolha um avatar:</label>
            <div className="grid grid-cols-4 gap-3">
              {filteredAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(avatar.emoji)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    currentAvatar === avatar.emoji 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  title={avatar.name}
                >
                  <span className="text-2xl">{avatar.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}