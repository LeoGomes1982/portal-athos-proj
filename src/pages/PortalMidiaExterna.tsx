import { useState, useRef, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Upload, Play, Pause, Monitor, Image, Video, Music, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface Midia {
  id: string;
  nome: string;
  tipo: 'imagem' | 'video' | 'audio';
  url: string;
  tempoExibicao: number; // em segundos
  visivel: boolean;
  dataUpload: string;
}

// Componente da TV 3D
function TelevisionModel({ midias, playlistAtiva, midiaAtual }: { midias: Midia[], playlistAtiva: boolean, midiaAtual: number }) {
  const midiasVisiveis = midias.filter(m => m.visivel);
  const midiaAtiva = midiasVisiveis[midiaAtual];
  
  return (
    <group>
      {/* Base da TV */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Tela da TV */}
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[3.6, 2.1, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Conteúdo da tela */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[3.4, 1.9, 0.01]} />
        <meshStandardMaterial 
          color={playlistAtiva && midiasVisiveis.length > 0 ? "#1e40af" : "#374151"}
        />
      </mesh>
      
      {/* Miniatura da mídia atual quando playlist estiver ativa */}
      {playlistAtiva && midiaAtiva && (
        <>
          {/* Fundo da miniatura */}
          <mesh position={[0, 0, 0.17]}>
            <boxGeometry args={[2.5, 1.4, 0.005]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          
          {/* Indicador do tipo de mídia */}
          <mesh position={[0, 0, 0.175]}>
            <boxGeometry args={[2.2, 1.1, 0.005]} />
            <meshStandardMaterial 
              color={
                midiaAtiva.tipo === 'imagem' ? "#10b981" :
                midiaAtiva.tipo === 'video' ? "#f59e0b" : "#8b5cf6"
              }
            />
          </mesh>
          
          {/* Texto da mídia (representado por retângulos) */}
          <mesh position={[0, 0.3, 0.18]}>
            <boxGeometry args={[1.8, 0.1, 0.002]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          
          <mesh position={[0, 0.1, 0.18]}>
            <boxGeometry args={[1.5, 0.08, 0.002]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
          
          {/* Barra de progresso */}
          <mesh position={[0, -0.4, 0.18]}>
            <boxGeometry args={[2.0, 0.05, 0.002]} />
            <meshStandardMaterial color="#e5e7eb" />
          </mesh>
          
          <mesh position={[-0.5, -0.4, 0.182]}>
            <boxGeometry args={[1.0, 0.05, 0.002]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </>
      )}
      
      {/* Playlist em miniatura no canto da tela quando ativa */}
      {playlistAtiva && midiasVisiveis.length > 1 && (
        <>
          {/* Container da playlist */}
          <mesh position={[1.2, 0.5, 0.17]}>
            <boxGeometry args={[0.8, 1.2, 0.005]} />
            <meshStandardMaterial color="#000000" opacity={0.8} transparent />
          </mesh>
          
          {/* Itens da playlist */}
          {midiasVisiveis.slice(0, 4).map((_, index) => (
            <mesh key={index} position={[1.2, 0.8 - (index * 0.25), 0.175]}>
              <boxGeometry args={[0.6, 0.15, 0.002]} />
              <meshStandardMaterial 
                color={index === midiaAtual ? "#3b82f6" : "#4b5563"}
                opacity={index === midiaAtual ? 1 : 0.6}
                transparent
              />
            </mesh>
          ))}
          
          {/* Indicador de mais itens */}
          {midiasVisiveis.length > 4 && (
            <mesh position={[1.2, -0.4, 0.175]}>
              <boxGeometry args={[0.4, 0.08, 0.002]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
          )}
        </>
      )}
      
      {/* Base de apoio */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Pé da TV */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[1.2, 0.1, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

export default function PortalMidiaExterna() {
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
    if (!playlistAtiva) {
      setMidiaAtual(0); // Reiniciar do primeiro item
    }
    toast({
      title: playlistAtiva ? "Playlist pausada" : "Playlist iniciada",
      description: playlistAtiva ? "A exibição foi pausada" : "Iniciando reprodução das mídias"
    });
  };

  const midiasVisiveis = midias.filter(m => m.visivel);

  // Gerenciar progressão automática da playlist
  useEffect(() => {
    if (!playlistAtiva || midiasVisiveis.length === 0) return;

    const midiaAtiva = midiasVisiveis[midiaAtual];
    if (!midiaAtiva) return;

    const timer = setTimeout(() => {
      setMidiaAtual(prev => {
        const proximoIndex = (prev + 1) % midiasVisiveis.length;
        return proximoIndex;
      });
    }, midiaAtiva.tempoExibicao * 1000);

    return () => clearTimeout(timer);
  }, [playlistAtiva, midiaAtual, midiasVisiveis]);

  // Resetar mídia atual quando playlist for pausada
  useEffect(() => {
    if (!playlistAtiva) {
      setMidiaAtual(0);
    }
  }, [playlistAtiva]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
            <Monitor size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal de Mídia Externa
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gerencie e exiba conteúdo multimídia em displays externos. Configure playlists com imagens, vídeos e áudios.
          </p>
        </div>

        {/* TV Preview Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor size={20} />
              Preview da Exibição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* 3D TV Model */}
              <div className="lg:w-1/2">
                <div className="h-96 w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Carregando modelo 3D...</div>
                      </div>
                    }>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <TelevisionModel midias={midias} playlistAtiva={playlistAtiva} midiaAtual={midiaAtual} />
                      <OrbitControls enablePan={false} enableZoom={false} />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
              
              {/* Playlist Preview */}
              <div className="lg:w-1/2">
                <h3 className="font-semibold mb-4">Playlist Ativa ({midiasVisiveis.length} itens)</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {midiasVisiveis.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Image size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma mídia ativa</p>
                    </div>
                  ) : (
                    midiasVisiveis.map((midia, index) => (
                      <div
                        key={midia.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          index === midiaAtual && playlistAtiva ? 'bg-primary/10 border-primary' : 'bg-background'
                        }`}
                      >
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          {midia.tipo === 'imagem' && <Image size={16} />}
                          {midia.tipo === 'video' && <Video size={16} />}
                          {midia.tipo === 'audio' && <Music size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{midia.nome}</p>
                          <p className="text-xs text-muted-foreground">{midia.tempoExibicao}s</p>
                        </div>
                        {index === midiaAtual && playlistAtiva && (
                          <Play size={16} className="text-primary" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
          © 2024 Grupo Athos. Portal de Mídia Externa v1.0
        </div>
      </div>
    </div>
  );
}