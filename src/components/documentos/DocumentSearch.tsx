import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DocumentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function DocumentSearch({ searchTerm, onSearchChange }: DocumentSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Buscar documentos por nome, tipo ou funcionário..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}