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
  { emoji: "👱‍♂️", name: "Homem Loiro", category: "normal-masculino" },
  { emoji: "👨‍🦰", name: "Homem Ruivo", category: "normal-masculino" },
  { emoji: "👨‍🦱", name: "Homem Cacheado", category: "normal-masculino" },
  { emoji: "👨‍🦲", name: "Homem Careca", category: "normal-masculino" },
  
  // Normal - Feminino  
  { emoji: "👩", name: "Mulher", category: "normal-feminino" },
  { emoji: "👱‍♀️", name: "Mulher Loira", category: "normal-feminino" },
  { emoji: "👩‍🦰", name: "Mulher Ruiva", category: "normal-feminino" },
  { emoji: "👩‍🦱", name: "Mulher Cacheada", category: "normal-feminino" },
  { emoji: "👩‍🦲", name: "Mulher Careca", category: "normal-feminino" },
  { emoji: "🧕", name: "Mulher com Hijab", category: "normal-feminino" },
  
  // Expressões - Masculino
  { emoji: "😀", name: "Feliz", category: "expressoes-masculino" },
  { emoji: "😂", name: "Rindo", category: "expressoes-masculino" },
  { emoji: "😎", name: "Cool", category: "expressoes-masculino" },
  { emoji: "🤓", name: "Nerd", category: "expressoes-masculino" },
  { emoji: "😴", name: "Sonolento", category: "expressoes-masculino" },
  { emoji: "🥳", name: "Festeiro", category: "expressoes-masculino" },
  { emoji: "🤔", name: "Pensativo", category: "expressoes-masculino" },
  { emoji: "😘", name: "Beijinho", category: "expressoes-masculino" },
  
  // Expressões - Feminino
  { emoji: "😊", name: "Feliz", category: "expressoes-feminino" },
  { emoji: "🤣", name: "Rindo", category: "expressoes-feminino" },
  { emoji: "😍", name: "Apaixonada", category: "expressoes-feminino" },
  { emoji: "🤗", name: "Abraçando", category: "expressoes-feminino" },
  { emoji: "😴", name: "Sonolenta", category: "expressoes-feminino" },
  { emoji: "🥳", name: "Festeira", category: "expressoes-feminino" },
  { emoji: "🤔", name: "Pensativa", category: "expressoes-feminino" },
  { emoji: "😘", name: "Beijinho", category: "expressoes-feminino" },
  
  // Profissões - Masculino
  { emoji: "👨‍💼", name: "Executivo", category: "profissoes-masculino" },
  { emoji: "👨‍⚕️", name: "Médico", category: "profissoes-masculino" },
  { emoji: "👨‍🏫", name: "Professor", category: "profissoes-masculino" },
  { emoji: "👨‍💻", name: "Programador", category: "profissoes-masculino" },
  { emoji: "👨‍🔧", name: "Mecânico", category: "profissoes-masculino" },
  { emoji: "👨‍🍳", name: "Chef", category: "profissoes-masculino" },
  { emoji: "👨‍🎨", name: "Artista", category: "profissoes-masculino" },
  { emoji: "👨‍🚒", name: "Bombeiro", category: "profissoes-masculino" },
  
  // Profissões - Feminino
  { emoji: "👩‍💼", name: "Executiva", category: "profissoes-feminino" },
  { emoji: "👩‍⚕️", name: "Médica", category: "profissoes-feminino" },
  { emoji: "👩‍🏫", name: "Professora", category: "profissoes-feminino" },
  { emoji: "👩‍💻", name: "Programadora", category: "profissoes-feminino" },
  { emoji: "👩‍🔧", name: "Mecânica", category: "profissoes-feminino" },
  { emoji: "👩‍🍳", name: "Chef", category: "profissoes-feminino" },
  { emoji: "👩‍🎨", name: "Artista", category: "profissoes-feminino" },
  { emoji: "👩‍🚒", name: "Bombeira", category: "profissoes-feminino" },
  
  // Animais - Masculino
  { emoji: "🐶", name: "Cachorro", category: "animais-masculino" },
  { emoji: "🐱", name: "Gato", category: "animais-masculino" },
  { emoji: "🐸", name: "Sapo", category: "animais-masculino" },
  { emoji: "🦁", name: "Leão", category: "animais-masculino" },
  { emoji: "🐺", name: "Lobo", category: "animais-masculino" },
  { emoji: "🦊", name: "Raposa", category: "animais-masculino" },
  { emoji: "🐯", name: "Tigre", category: "animais-masculino" },
  { emoji: "🦆", name: "Pato", category: "animais-masculino" },
  
  // Animais - Feminino
  { emoji: "🐰", name: "Coelha", category: "animais-feminino" },
  { emoji: "🐨", name: "Coala", category: "animais-feminino" },
  { emoji: "🐼", name: "Panda", category: "animais-feminino" },
  { emoji: "🦄", name: "Unicórnio", category: "animais-feminino" },
  { emoji: "🐷", name: "Porquinha", category: "animais-feminino" },
  { emoji: "🐮", name: "Vaca", category: "animais-feminino" },
  { emoji: "🦋", name: "Borboleta", category: "animais-feminino" },
  { emoji: "🐝", name: "Abelha", category: "animais-feminino" },
  
  // Roqueiro - Masculino
  { emoji: "🤘", name: "Roqueiro", category: "roqueiro-masculino" },
  { emoji: "🎸", name: "Guitarrista", category: "roqueiro-masculino" },
  { emoji: "🥁", name: "Baterista", category: "roqueiro-masculino" },
  { emoji: "🎤", name: "Vocalista", category: "roqueiro-masculino" },
  
  // Roqueiro - Feminino
  { emoji: "🎵", name: "Musicista", category: "roqueiro-feminino" },
  { emoji: "🎶", name: "Cantora", category: "roqueiro-feminino" },
  { emoji: "🎼", name: "Compositora", category: "roqueiro-feminino" },
  { emoji: "🎹", name: "Pianista", category: "roqueiro-feminino" },
  
  // Astronauta - Masculino
  { emoji: "👨‍🚀", name: "Astronauta", category: "astronauta-masculino" },
  { emoji: "🚀", name: "Piloto Espacial", category: "astronauta-masculino" },
  { emoji: "🛸", name: "Alienígena", category: "astronauta-masculino" },
  { emoji: "🌌", name: "Explorador Cósmico", category: "astronauta-masculino" },
  
  // Astronauta - Feminino
  { emoji: "👩‍🚀", name: "Astronauta", category: "astronauta-feminino" },
  { emoji: "⭐", name: "Estrela", category: "astronauta-feminino" },
  { emoji: "🌙", name: "Lua", category: "astronauta-feminino" },
  { emoji: "☄️", name: "Cometa", category: "astronauta-feminino" },
  
  // Hippie - Masculino
  { emoji: "🕺", name: "Hippie Dançarino", category: "hippie-masculino" },
  { emoji: "🌻", name: "Flower Power", category: "hippie-masculino" },
  { emoji: "☮️", name: "Paz e Amor", category: "hippie-masculino" },
  { emoji: "🌿", name: "Natureza", category: "hippie-masculino" },
  
  // Hippie - Feminino
  { emoji: "💃", name: "Hippie Dançarina", category: "hippie-feminino" },
  { emoji: "🌈", name: "Espírito Livre", category: "hippie-feminino" },
  { emoji: "🦋", name: "Alma Livre", category: "hippie-feminino" },
  { emoji: "🌸", name: "Flor", category: "hippie-feminino" },
  
  // Esportes - Masculino
  { emoji: "⚽", name: "Futebol", category: "esportes-masculino" },
  { emoji: "🏀", name: "Basquete", category: "esportes-masculino" },
  { emoji: "🏋️‍♂️", name: "Musculação", category: "esportes-masculino" },
  { emoji: "🏃‍♂️", name: "Corredor", category: "esportes-masculino" },
  { emoji: "🚴‍♂️", name: "Ciclista", category: "esportes-masculino" },
  { emoji: "🏊‍♂️", name: "Nadador", category: "esportes-masculino" },
  { emoji: "🧗‍♂️", name: "Escalador", category: "esportes-masculino" },
  { emoji: "🏄‍♂️", name: "Surfista", category: "esportes-masculino" },
  
  // Esportes - Feminino
  { emoji: "🏐", name: "Vôlei", category: "esportes-feminino" },
  { emoji: "🎾", name: "Tênis", category: "esportes-feminino" },
  { emoji: "🏋️‍♀️", name: "Musculação", category: "esportes-feminino" },
  { emoji: "🏃‍♀️", name: "Corredora", category: "esportes-feminino" },
  { emoji: "🚴‍♀️", name: "Ciclista", category: "esportes-feminino" },
  { emoji: "🏊‍♀️", name: "Nadadora", category: "esportes-feminino" },
  { emoji: "🧗‍♀️", name: "Escaladora", category: "esportes-feminino" },
  { emoji: "🏄‍♀️", name: "Surfista", category: "esportes-feminino" },
  
  // Comida - Masculino
  { emoji: "🍕", name: "Pizza", category: "comida-masculino" },
  { emoji: "🍔", name: "Hamburger", category: "comida-masculino" },
  { emoji: "🌭", name: "Hot Dog", category: "comida-masculino" },
  { emoji: "🥓", name: "Bacon", category: "comida-masculino" },
  { emoji: "🍖", name: "Carne", category: "comida-masculino" },
  { emoji: "🍺", name: "Cerveja", category: "comida-masculino" },
  { emoji: "☕", name: "Café", category: "comida-masculino" },
  { emoji: "🥩", name: "Churrasco", category: "comida-masculino" },
  
  // Comida - Feminino
  { emoji: "🍰", name: "Bolo", category: "comida-feminino" },
  { emoji: "🧁", name: "Cupcake", category: "comida-feminino" },
  { emoji: "🍫", name: "Chocolate", category: "comida-feminino" },
  { emoji: "🍓", name: "Morango", category: "comida-feminino" },
  { emoji: "🥗", name: "Salada", category: "comida-feminino" },
  { emoji: "🍷", name: "Vinho", category: "comida-feminino" },
  { emoji: "🧋", name: "Bubble Tea", category: "comida-feminino" },
  { emoji: "🍵", name: "Chá", category: "comida-feminino" },
  
  // Objetos - Masculino
  { emoji: "⚡", name: "Raio", category: "objetos-masculino" },
  { emoji: "🔥", name: "Fogo", category: "objetos-masculino" },
  { emoji: "💎", name: "Diamante", category: "objetos-masculino" },
  { emoji: "👑", name: "Coroa", category: "objetos-masculino" },
  { emoji: "🎯", name: "Alvo", category: "objetos-masculino" },
  { emoji: "🎮", name: "Gamer", category: "objetos-masculino" },
  { emoji: "🚗", name: "Carro", category: "objetos-masculino" },
  { emoji: "✈️", name: "Avião", category: "objetos-masculino" },
  
  // Objetos - Feminino
  { emoji: "💖", name: "Coração", category: "objetos-feminino" },
  { emoji: "🌟", name: "Estrela", category: "objetos-feminino" },
  { emoji: "💫", name: "Brilho", category: "objetos-feminino" },
  { emoji: "🦄", name: "Unicórnio", category: "objetos-feminino" },
  { emoji: "🎀", name: "Laço", category: "objetos-feminino" },
  { emoji: "💄", name: "Batom", category: "objetos-feminino" },
  { emoji: "👜", name: "Bolsa", category: "objetos-feminino" },
  { emoji: "💍", name: "Anel", category: "objetos-feminino" },
];

const categories = [
  { id: "normal", label: "Normal", masculine: "normal-masculino", feminine: "normal-feminino" },
  { id: "expressoes", label: "Expressões", masculine: "expressoes-masculino", feminine: "expressoes-feminino" },
  { id: "profissoes", label: "Profissões", masculine: "profissoes-masculino", feminine: "profissoes-feminino" },
  { id: "animais", label: "Animais", masculine: "animais-masculino", feminine: "animais-feminino" },
  { id: "roqueiro", label: "Roqueiro", masculine: "roqueiro-masculino", feminine: "roqueiro-feminino" },
  { id: "astronauta", label: "Astronauta", masculine: "astronauta-masculino", feminine: "astronauta-feminino" },
  { id: "hippie", label: "Hippie", masculine: "hippie-masculino", feminine: "hippie-feminino" },
  { id: "esportes", label: "Esportes", masculine: "esportes-masculino", feminine: "esportes-feminino" },
  { id: "comida", label: "Comida", masculine: "comida-masculino", feminine: "comida-feminino" },
  { id: "objetos", label: "Objetos", masculine: "objetos-masculino", feminine: "objetos-feminino" },
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
      <DialogContent className="max-w-md aspect-square rounded-2xl">
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