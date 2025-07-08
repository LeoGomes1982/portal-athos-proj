import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Upload, Play, Pause, Monitor, Image, Video, Music, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Midia {
  id: string;
  nome: string;
  tipo: 'imagem' | 'video' | 'audio';
  url: string;
  tempoExibicao: number; // em segundos
  visivel: boolean;
  dataUpload: string;
}

export default function PortalMidiaInterna() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [midias, setMidias] = useState<Midia[]>([]);
  const [playlistAtiva, setPlaylistAtiva] = useState(false);
  const [midiaAtual, setMidiaAtual] = useState<number>(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      let tipo: 'imagem' | 'video' | 'audio' = 'imagem';
      
      if (file.type.startsWith('video/')) tipo = 'video';
      else if (file.type.startsWith('audio/')) tipo = 'audio';

      const novaMidia: Midia = {
        id: Date.now().toString() + Math.random(),
        nome: file.name,
        tipo,
        url,
        tempoExibicao: tipo === 'audio' ? 30 : 10,
        visivel: true,
        dataUpload: new Date().toISOString()
      };

      setMidias(prev => [...prev, novaMidia]);
    });

    toast({
      title: "Mídia adicionada",
      description: `${files.length} arquivo(s) adicionado(s) à playlist`
    });
  };

  const removeMidia = (id: string) => {
    setMidias(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Mídia removida",
      description: "Arquivo removido da playlist"
    });
  };

  const updateMidia = (id: string, updates: Partial<Midia>) => {
    setMidias(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const togglePlaylist = () => {
    setPlaylistAtiva(!playlistAtiva);
    toast({
      title: playlistAtiva ? "Playlist pausada" : "Playlist iniciada",
      description: playlistAtiva ? "A exibição foi pausada" : "Iniciando reprodução das mídias"
    });
  };

  const midiasVisiveis = midias.filter(m => m.visivel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Monitor size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal de Mídia Interna
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gerencie e exiba conteúdo multimídia em displays internos. Configure playlists com imagens, vídeos e áudios.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Upload de Mídias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto"
              >
                <Upload size={16} className="mr-2" />
                Selecionar Arquivos
              </Button>
              <div className="text-sm text-muted-foreground">
                Suporte para imagens, vídeos e áudios
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor size={20} />
              Controles da Playlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlaylist}
                  variant={playlistAtiva ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  {playlistAtiva ? <Pause size={16} /> : <Play size={16} />}
                  {playlistAtiva ? "Pausar" : "Iniciar"} Playlist
                </Button>
                <div className="text-sm text-muted-foreground">
                  {midiasVisiveis.length} mídia(s) ativa(s)
                </div>
              </div>
              {playlistAtiva && (
                <div className="text-sm text-muted-foreground">
                  Reproduzindo: {midiasVisiveis[midiaAtual]?.nome || "Nenhuma mídia"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media List */}
        <Card>
          <CardHeader>
            <CardTitle>Playlist de Mídias ({midias.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {midias.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma mídia adicionada ainda</p>
                <p className="text-sm">Faça upload dos seus arquivos para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {midias.map((midia) => (
                  <div
                    key={midia.id}
                    className={`p-4 border rounded-lg transition-all ${
                      midia.visivel ? 'bg-background' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Preview */}
                      <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {midia.tipo === 'imagem' && <Image size={20} className="text-muted-foreground" />}
                        {midia.tipo === 'video' && <Video size={20} className="text-muted-foreground" />}
                        {midia.tipo === 'audio' && <Music size={20} className="text-muted-foreground" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium truncate">{midia.nome}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{midia.tipo}</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Tempo de Exibição (segundos)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="300"
                            value={midia.tempoExibicao}
                            onChange={(e) => updateMidia(midia.id, { tempoExibicao: parseInt(e.target.value) || 10 })}
                            className="h-8"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={midia.visivel}
                              onCheckedChange={(checked) => updateMidia(midia.id, { visivel: checked })}
                            />
                            <Label className="text-xs flex items-center gap-1">
                              {midia.visivel ? <Eye size={12} /> : <EyeOff size={12} />}
                              {midia.visivel ? "Visível" : "Oculto"}
                            </Label>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMidia(midia.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          © 2024 Grupo Athos. Portal de Mídia Interna v1.0
        </div>
      </div>
    </div>
  );
}