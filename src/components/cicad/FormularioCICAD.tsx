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
  
  const [nomeEnvolvido, setNomeEnvolvido] = useState("");
  const [testemunhas, setTestemunhas] = useState("");
  const [consequencias, setConsequencias] = useState("");
  
  const necessitaNome = formulario.tipo === "denuncia_chefia" || formulario.tipo === "denuncia_colega";

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

    if (necessitaNome && !nomeEnvolvido.trim()) {
      toast({
        title: "Nome necessário",
        description: "Para denúncias envolvendo pessoas específicas, é necessário informar o nome para investigação.",
        variant: "destructive"
      });
      return;
    }

    // Adicionar informações extras na descrição
    let descricaoCompleta = formulario.descricao;
    if (nomeEnvolvido.trim()) {
      descricaoCompleta += `\n\nPessoa envolvida: ${nomeEnvolvido}`;
    }
    if (testemunhas.trim()) {
      descricaoCompleta += `\n\nTestemunhas: ${testemunhas}`;
    }
    if (consequencias.trim()) {
      descricaoCompleta += `\n\nConsequências observadas: ${consequencias}`;
    }

    onSubmit({
      ...formulario,
      descricao: descricaoCompleta,
      urgencia: "media" // Urgência será definida pela empresa
    });
    
    // Reset form
    setFormulario({
      tipo: "outro",
      assunto: "",
      descricao: "",
      setor: "",
      dataOcorrencia: "",
      urgencia: "media"
    });
    setNomeEnvolvido("");
    setTestemunhas("");
    setConsequencias("");

    toast({
      title: "Denúncia enviada",
      description: "Sua denúncia foi enviada de forma anônima. Obrigado por nos ajudar a melhorar o ambiente de trabalho."
    });
  };

  return (
    <Card className="modern-card w-full mx-auto">
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
        <form onSubmit={handleSubmit} className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
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

          <div className="md:col-span-1">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formulario.assunto}
              onChange={(e) => setFormulario({...formulario, assunto: e.target.value})}
              placeholder="Descreva brevemente o assunto"
              required
            />
          </div>

          <div className="md:col-span-1">
            <Label htmlFor="setor">Setor (Opcional)</Label>
            <Input
              id="setor"
              value={formulario.setor}
              onChange={(e) => setFormulario({...formulario, setor: e.target.value})}
              placeholder="Ex: Vendas, TI, Administrativo..."
            />
          </div>

          <div className="md:col-span-1">
            <Label htmlFor="dataOcorrencia">Data da Ocorrência (Opcional)</Label>
            <Input
              id="dataOcorrencia"
              type="date"
              value={formulario.dataOcorrencia}
              onChange={(e) => setFormulario({...formulario, dataOcorrencia: e.target.value})}
            />
          </div>

          {necessitaNome && (
            <div className="md:col-span-1">
              <Label htmlFor="nomeEnvolvido">Nome da Pessoa Envolvida *</Label>
              <Input
                id="nomeEnvolvido"
                value={nomeEnvolvido}
                onChange={(e) => setNomeEnvolvido(e.target.value)}
                placeholder="Nome completo da pessoa"
                required={necessitaNome}
              />
            </div>
          )}

          <div className="md:col-span-1">
            <Label htmlFor="testemunhas">Testemunhas (Opcional)</Label>
            <Input
              id="testemunhas"
              value={testemunhas}
              onChange={(e) => setTestemunhas(e.target.value)}
              placeholder="Nomes de possíveis testemunhas"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="descricao">Descrição Detalhada *</Label>
            <Textarea
              id="descricao"
              value={formulario.descricao}
              onChange={(e) => setFormulario({...formulario, descricao: e.target.value})}
              placeholder="Descreva detalhadamente a situação, incluindo contexto, o que aconteceu, quando, onde e como isso afetou você ou outros..."
              rows={6}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="consequencias">Consequências Observadas (Opcional)</Label>
            <Textarea
              id="consequencias"
              value={consequencias}
              onChange={(e) => setConsequencias(e.target.value)}
              placeholder="Quais foram os impactos ou consequências observadas? Como isso afetou o ambiente de trabalho?"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="primary-btn w-full">
              Enviar Relato Anônimo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}