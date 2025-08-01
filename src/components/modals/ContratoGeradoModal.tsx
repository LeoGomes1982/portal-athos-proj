import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, X } from "lucide-react";
import jsPDF from 'jspdf';

interface ContratoGeradoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoTexto: string;
  nomeCliente: string;
}

export default function ContratoGeradoModal({ 
  isOpen, 
  onClose, 
  contratoTexto, 
  nomeCliente 
}: ContratoGeradoModalProps) {
  const handleDownload = () => {
    const pdf = new jsPDF();
    
    // Configurações do documento seguindo as imagens
    pdf.setFont("times", "normal");
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    
    let currentY = margin;
    
    // Função para adicionar texto justificado
    const addJustifiedText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFont("times", isBold ? "bold" : "normal");
      pdf.setFontSize(fontSize);
      
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = margin;
      }
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      for (let i = 0; i < lines.length; i++) {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = margin;
        }
        
        const line = lines[i];
        
        // Justificar todas as linhas exceto a última
        if (i < lines.length - 1 && line.trim().length > 0) {
          const words = line.split(' ');
          if (words.length > 1) {
            const totalTextWidth = words.reduce((sum, word) => sum + pdf.getTextWidth(word), 0);
            const availableSpace = maxWidth - totalTextWidth;
            const extraSpace = availableSpace / (words.length - 1);
            
            let x = margin;
            words.forEach((word, index) => {
              pdf.text(word, x, currentY);
              if (index < words.length - 1) {
                x += pdf.getTextWidth(word) + pdf.getTextWidth(' ') + extraSpace;
              }
            });
          } else {
            pdf.text(line, margin, currentY);
          }
        } else {
          pdf.text(line, margin, currentY);
        }
        
        currentY += 14;
      }
      currentY += 6;
    };
    
    // Função para títulos de seção
    const addSectionTitle = (title: string, fontSize: number = 12) => {
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = margin;
      }
      
      currentY += 8;
      pdf.setFont("times", "bold");
      pdf.setFontSize(fontSize);
      pdf.text(title, margin, currentY);
      currentY += 10;
    };
    
    // CABEÇALHO - Título centralizado
    pdf.setFont("times", "bold");
    pdf.setFontSize(16);
    const title = "Contrato de prestação de Serviços";
    const titleWidth = pdf.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    pdf.text(title, titleX, currentY);
    currentY += 20;
    
    // Logo GA (simulado com texto por enquanto - você pode adicionar logo depois)
    pdf.setFont("times", "bold");
    pdf.setFontSize(24);
    const logoText = "GA";
    const logoWidth = pdf.getTextWidth(logoText);
    const logoX = (pageWidth - logoWidth) / 2;
    pdf.setTextColor(41, 98, 169); // Cor azul do logo
    pdf.text(logoText, logoX, currentY);
    pdf.setTextColor(0, 0, 0); // Voltar para preto
    currentY += 30;
    
    // SEÇÃO CONTRATANTE
    addSectionTitle("Contratante");
    
    // Extrair dados do contratante do texto do contrato
    const contratanteData = `${nomeCliente}
32.525.145/0001-00
Endereço: Rua Suzana Cortês Balreira 290 – Areal Pelotas RS
Representado neste instrumento por: Andre Fam Beiler.`;
    
    addJustifiedText(contratanteData);
    currentY += 10;
    
    // SEÇÃO CONTRATADA
    addSectionTitle("Contratada");
    
    const contratadaData = `GA Serviços Terceirizados
46.784.651/0001-10
Endereço: Avenida Dois. número 105, sala 606, Edifício Flow Work, Parque Una Pelotas, RS
Representado neste instrumento por: Aline Guidotti Furtado Gomes e Silva.`;
    
    addJustifiedText(contratadaData);
    currentY += 10;
    
    // SEÇÃO OBJETO
    addSectionTitle("Objeto");
    
    const objetoText = `A contratada é a empresa de prestação de serviço e pelo presente instrumento e na melhor forma de direito, que se obriga a executar para o contratante os seguintes serviços: Guarda Patrimonial 180h em regime 12x36 noturno de segunda a segunda das 19:00 as 07:00

Os serviços contratados seguros os definidos e derivados mencionados, são para controle de fluxos de pessoas e mercadorias, controle das normas internas, cadastro de fornecedores, prestadores de serviços e cuidado com a segurança privada do parque e dos arredores. A contratada prestará os serviços constantes do caput desta cláusula sem qualquer exclusividade, desempenhando atividades para terceiros em geral incluindo local de igual teor e finalidade do contratante desde que não haja conflito entre os serviços contratados. Os serviços serão prestados pela contratada através de profissional da área específica ao tipo serviço de destina e conforme compatibilidade.

O complemento do quadro geral para cobrir férias, afastamentos, faltas e atrasos poderá ser executado por funcionários do grupo empresarial da contratada, desde que esteja devidamente contratado e apto para tal serviço e siga as normas vigentes da CBO de seu cargo e Sindicato da categoria. Os vínculos trabalhistas de segurança e saúde no trabalho serão sob nossa tutela e exclusiva responsabilidade (pela contratada) e ao assinar este contrato de prestação de serviços, assumimos total e irrestrita responsabilidade pelos direitos e deveres trabalhistas sob seus contratados. A contratada se responsabiliza perante acidentes ou avarias nas dependências do local de trabalho e das garagens e adjacências assim como ressarcimento de equipamentos e utensílios, mobília, obras de arte, veículos e periféricos e materiais particulares, uma vez que estejam seus funcionários executando os serviços a que se destinam os objetos deste contrato, executando tarefas, ordens diretas e ordens de serviços oriundas diretamente e exclusivamente da empresa ao qual Ihes contrata (GA SERVIÇOS).`;
    
    addJustifiedText(objetoText);
    
    // SEÇÃO OBRIGAÇÕES DA CONTRATADA
    addSectionTitle("Obrigações da Contratada");
    
    const obrigacoesContratadaText = `A contratada se compromete a colaborar a qualquer tempo com auditorias e monitoramentos para verificar o cumprimento das obrigações contratuais e padrões de qualidade, fornecendo todos os acessos a documentos e informações para realização das auditorias assim como colaborar com os auditores e demais responsáveis designados pelo contratante.`;
    
    addJustifiedText(obrigacoesContratadaText);
    
    // Texto longo das obrigações da contratada (da segunda imagem)
    const obrigacoesContratadaLongText = `A contratada se responsabiliza por cobrir todos os gastos com despesas e trâmites trabalhistas de seus funcionários tais como: Salário, férias com adicional de ⅓, 13º salário, depósito de FGTS, recolhimento de previdência e despesas referente a verbas rescisórias e sindicais, assim como com as despesas de admissão e substituição permanente ou temporária de qualquer de seus colaboradores. A contratada se compromete em prestar contas mensalmente referente aos pagamentos de salários, recolhimentos de FGTS e INSS, rescisões e admissões assim como pagamento de vales transportes e qualquer pagamento adicional, sob pena de não o fazendo dar-se-á pausado o pagamento mensal do mês subsequente.

A contratada estabelece que o envio dos documentos se dará entre os dias 05 e 10 do mês subsequente ao da prestação do serviço e está condicionado ao pagamento por parte da contratante nas datas corretas do vencimento mensal da prestação do serviço. A contratada se compromete a manter os colaboradores uniformizados, podendo a qualquer momento substituir o uniforme, logo, cores e padrão com prévia concordância entre contratante e contratada. Prestar os serviços contratados na forma e modo ajustados, dentro das normas e especificações técnicas aplicáveis à espécie, dando plena e total garantia deles;

Executar os serviços contratados em todo perímetro do CONTRATANTE, utilizando a melhor técnica e visando sempre atingir o melhor resultado, sob sua exclusiva responsabilidade, sendo-lhe vedada a transferência dos mesmos a terceiros, sem prévia e expressa concordância do contratante. Fica estabelecido que tesa a mão de obra, maquinários, equipamentos e EPls necessários para o desenvolvimento dos serviços deverão ser fornecidos pela CONTRATADA e estão inclusos no valor da presente contratação. A falta de entrega de algum EPI, documento ou equipamento essencial para a prestação de serviço acarretará em aviso de penalidade e no recebimento do mesmo o acréscimo de 10 dias para regularização das pendências, ao acúmulo no mesmo mês de três penalidades haverá a dispensa de aviso prévio para rescisão entre as partes.

A presente prestação de serviço de Guarda Patrimonial não requer treinamento técnico ou certificações específicas para a função, sendo assim todo treinamento específico para atuação objetiva do Guarda patrimonial deverá ser coordenado e negociado a parte entre contratante e contratado.`;
    
    addJustifiedText(obrigacoesContratadaLongText);
    
    // SEÇÃO OBRIGAÇÕES DA CONTRATANTE
    addSectionTitle("Obrigações da Contratante");
    
    const obrigacoesContratanteText = `O (A) CONTRATANTE se obriga: Efetuar o pagamento na forma e modo aprazados. Comunicar a contratada sobre as reclamações feitas contra seus empregados/prepostos, bem como com relação a danos por eles causados. Não efetuar ordens de serviço aos colaboradores diretamente sem a consciência da contratada, assim como troca de jornada e função, excluindo-se orientações acerca de modo de operacionalidade de sistemas, softwares, ferramentas e locais. Instalar e proporcionar recursos mínimos para instalação do colaborador para que supram necessidades de acomodações, de almoço e de necessidades básicas de higiene pessoais e profissionais.`;
    
    addJustifiedText(obrigacoesContratanteText);
    
    // SEÇÃO FINANCEIRO
    addSectionTitle("Financeiro");
    
    const financeiroText = `Guarda Patrimonial 12h noturno 12x36 R$ (2 pessoas) valor unitário R$ 5.400,00
Valor mensal do contrato R$ 10.800,00

O presente contrato não implica em qualquer vínculo empregatício do contrato pelos serviços prestados ao contratante. A contratada fará um reajuste no valor bruto do contrato de prestação de serviços e seus valores referente ao dissídio da categoria que se dá todo dia 01º de cada janeiro, e o pagamento que se der posterior ao mês de janeiro será cumulativo.

A contratada efetuará o pagamento da remuneração de seus empregados/prepostos, sendo responsável por todos e quaisquer ônus e encargos decorrentes da legislação trabalhista, fiscal e previdenciária, além dos impostos, taxas, obrigações assumidas neste contrato;

O cumprimento de todas as determinações impostas pelas autoridades públicas competentes, relativas aos serviços aqui contratados, bem como o pagamento de todos os tributos federais, estaduais e municipais que incidam ou venham a incidir sobre ele;

Munir o contratante dos documentos trabalhistas, fiscais e previdenciários, anexando os documentos por parte da contratada uma vez ao mês nas plataformas digitais do contratante ou através de portais exclusivos do contratado. A contratada faturará mensalmente o valor contratual mediante 2 confecções de notas fiscais mensais, sendo uma relativa a prestação de serviços e outra referente a administração de serviços.`;
    
    addJustifiedText(financeiroText);
    
    // SEÇÃO LGPD  
    addSectionTitle("LGPD");
    
    const lgpdText = `A CONTRATANTE informa que é de sua responsabilidade a administração dos controles internos adotados pelos nossos colaboradores e que nós estás adequados ao tipo de atividade e volume de transações que; Não realizará nenhum tipo de operação que possa ser considerada ilegal, frente à legislação vigente; No que toca aos dados, a CONTRATADA possui processos internos de governança para a proteção dos dados eventualmente armazenados em razão da execução e utilização em seus negócios relacionados aos serviços contratados, devendo a CONTRATANTE observar a LGPD e as permissas de governança com seus colaboradores e prestadores de serviços regularmente aceitos no tratamento dos dados incluídos.

Os dados apresentados para acesso as dependências do prédio estão condicionadas as regras do software ou aplicativo que opera com tais informações e que a CONTRATANTE escolhe, porém, os colaboradores que acessam o sistema ou trabalham com a digitação dos dados são responsáveis pelo sigilo e respondem trabalhista e civilmente pelas quedas do processo de falha da comunicação de acordo com a lei. As Partes declaram-se cientes dos direitos, obrigações e penalidades aplicáveis constantes da Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018) ("LGPD"), e obrigam-se a adotar todas as medidas razoáveis para garantir, por si, bem como seu pessoal, colaboradores, empregados e subcontratados que utilizem os Dados Protegidos na extensão autorizada na referida LGPD.`;
    
    addJustifiedText(lgpdText);
    
    // SEÇÃO PRAZOS E VALIDADES
    addSectionTitle("Prazos e validades");
    
    const prazosText = `01/04/2025

O presente contrato tem validade de 12 meses a partir da data de início (acima), com prorrogação automática desde que não haja demonstração de interesse no cancelamento por uma das partes. A extinção desse contrato pode ser feito sem multa somente após os três primeiros meses, antes desse período o valor da multa é o valor contratual de três meses do contrato independentemente de aviso prévio. Já o encerramento nos demais períodos se dará por um aviso prévio de 30 dias antes do último dia previsto.

Para firmeza e como prova de haverem contratado os termos, adendos e anexos apresentados e firmam este documento, impresso ou via assinatura online em duas vias de igual teor e forma, assinado pelas partes contratantes e pelas testemunhas abaixo.

PARÁGRAFO ÚNICO. Em caso de impasse, as partes submeteram a solução do conflito a procedimento arbitral nos termos da Lei n.º 9.307/96.

Para o Foro da comarca de Pelotas, para nele serem dirimidos toda e qualquer dúvida ou questão oriundas do presente contrato, renunciando as partes, a qualquer outro por mais especial e privilegiado que seja.`;
    
    addJustifiedText(prazosText);
    
    // SEÇÃO DE ASSINATURAS
    currentY += 20;
    
    addJustifiedText("Assinatura eletrônica contratada:", 11, false);
    currentY += 30;
    
    addJustifiedText("Assinatura eletrônica contratante:", 11, false);
    currentY += 50;
    
    // Data final
    const hoje = new Date().toLocaleDateString('pt-BR');
    pdf.setFont("times", "normal");
    pdf.setFontSize(11);
    pdf.text(hoje, margin, currentY);
    
    // Salvar o PDF
    const fileName = `Contrato_${nomeCliente.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Contrato Gerado - {nomeCliente}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handleDownload} size="sm">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] w-full">
          <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-muted rounded-md">
            {contratoTexto}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}