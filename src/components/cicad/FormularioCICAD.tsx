import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormularioCICAD, Denuncia } from "@/types/cicad";
import { tipoConfig, urgenciaConfig } from "@/config/cicadStatus";
import { useToast } from "@/hooks/use-toast";

interface FormularioCICADProps {
  onSubmit: (formulario: FormularioCICAD) => void;
  isFormularioPublico?: boolean;
}

export function FormularioCICADComponent({ onSubmit, isFormularioPublico = false }: FormularioCICADProps) {
  const { toast } = useToast();
  const [formulario, setFormulario] = useState<FormularioCICAD>({
    tipo: "outro",
    assunto: "",
    descricao: "",
    setor: "",
    dataOcorrencia: "",
    urgencia: "media"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulario.assunto || !formulario.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o assunto e a descrição.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formulario);
    
    // Reset form
    setFormulario({
      tipo: "outro",
      assunto: "",
      descricao: "",
      setor: "",
      dataOcorrencia: "",
      urgencia: "media"
    });

    toast({
      title: "Denúncia enviada",
      description: "Sua denúncia foi enviada de forma anônima. Obrigado por nos ajudar a melhorar o ambiente de trabalho."
    });
  };

  return (
    <Card className="modern-card max-w-2xl mx-auto">
      <CardHeader className="card-header">
        <CardTitle className="section-title text-center">
          {isFormularioPublico ? "Canal Anônimo de Denúncias" : "Novo Relato CICAD"}
        </CardTitle>
        {isFormularioPublico && (
          <p className="text-center text-sm text-muted-foreground">
            Este canal é 100% anônimo. Suas informações não serão rastreadas.
          </p>
        )}
      </CardHeader>
      <CardContent className="card-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="tipo">Tipo de Relato *</Label>
            <Select value={formulario.tipo} onValueChange={(value: Denuncia['tipo']) => setFormulario({...formulario, tipo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tipoConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="urgencia">Nível de Urgência *</Label>
            <Select value={formulario.urgencia} onValueChange={(value: Denuncia['urgencia']) => setFormulario({...formulario, urgencia: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a urgência" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(urgenciaConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formulario.assunto}
              onChange={(e) => setFormulario({...formulario, assunto: e.target.value})}
              placeholder="Descreva brevemente o assunto"
              required
            />
          </div>

          <div>
            <Label htmlFor="setor">Setor (Opcional)</Label>
            <Input
              id="setor"
              value={formulario.setor}
              onChange={(e) => setFormulario({...formulario, setor: e.target.value})}
              placeholder="Ex: Vendas, TI, Administrativo..."
            />
          </div>

          <div>
            <Label htmlFor="dataOcorrencia">Data da Ocorrência (Opcional)</Label>
            <Input
              id="dataOcorrencia"
              type="date"
              value={formulario.dataOcorrencia}
              onChange={(e) => setFormulario({...formulario, dataOcorrencia: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição Detalhada *</Label>
            <Textarea
              id="descricao"
              value={formulario.descricao}
              onChange={(e) => setFormulario({...formulario, descricao: e.target.value})}
              placeholder="Descreva detalhadamente a situação, incluindo contexto, pessoas envolvidas (sem nomes se preferir) e impactos observados..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="primary-btn w-full">
            Enviar Relato Anônimo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}