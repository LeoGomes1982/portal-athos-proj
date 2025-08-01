export interface ContratoData {
  // Contratante
  contratanteNome: string;
  contratanteCnpj: string;
  contratanteEndereco: string;
  contratanteRepresentante: string;
  
  // Contratada
  contratadaNome: string;
  contratadaCnpj: string;
  contratadaEndereco: string;
  contratadaRepresentante: string;
  
  // Serviços
  servicoDescricao: string;
  servicoJornada: string;
  servicoHorario: string;
  servicoRegime: string;
  
  // Financeiro
  valorUnitario: number;
  quantidade: number;
  valorMensal: number;
  
  // Prazos
  dataInicio: string;
  duracao: number;
  avisoPrevo: number;
  
  // Data de assinatura
  dataAssinatura: string;
}

export const generateContrato = (data: ContratoData): string => {
  return `Contrato de prestação de Serviços

 
 


Contratante
${data.contratanteNome}
${data.contratanteCnpj}
Endereço: ${data.contratanteEndereco}
Representado neste instrumento por: ${data.contratanteRepresentante}.
 
 
Contratada
${data.contratadaNome}
${data.contratadaCnpj}
Endereço: ${data.contratadaEndereco}
Representado neste instrumento por: ${data.contratadaRepresentante}.
 
 
Objeto
A contratada é a empresa de prestação de serviço e pelo presente instrumento e na melhor forma de direito, que se obriga a executar para o contratante os seguintes serviços: ${data.servicoDescricao} ${data.servicoJornada} em regime ${data.servicoRegime} ${data.servicoHorario}
Os serviços contratados seguem os definidos e derivados mencionados, são para controle de fluxos de pessoas e mercadorias, controle das normas internas, cadastro de fornecedores, prestadores de serviços e cuidado com a segurança privada do parque e dos arredores. A contratada prestará os serviços constantes do caput desta cláusula sem qualquer exclusividade, desempenhando atividades para terceiros em geral incluindo local de igual teor e finalidade do contratante desde que não haja conflito entre os serviços contratados. Os serviços serão prestados pela contratada através de profissional da área específica ao qual o serviço se destina e conforme compatibilidade. O complemento do quadro geral para cobrir férias, afastamentos, faltas e atrasos poderá ser executado por funcionários do grupo empresarial da contratada, desde que esteja devidamente contratado e apto para tal serviço e siga as normas vigentes da CBO de seu cargo e Sindicato da categoria. Os vínculos trabalhistas de segurança e saúde no trabalho serão sob nossa inteira e exclusiva responsabilidade (da contratada) e ao assinar este contrato de prestação de serviços, assumimos total e irrestrita responsabilidade pelos direitos e deveres trabalhistas sob seus contratados. A contratada se responsabiliza perante acidentes ou avarias nas dependências do local de trabalho e das garagens e adjacências assim como ressarcimento de equipamentos e utensílios, mobília, obras de arte, veículos e periféricos e materiais particulares, uma vez que estejam seus funcionários executando os serviços a que se destinam os objetos deste contrato, executando tarefas, ordens diretas e ordens de serviços oriundas diretamente e exclusivamente da empresa ao qual lhes contrata (GA SERVIÇOS).  
 
Obrigações da Contratada
A contratada se compromete a colaborar a qualquer tempo com auditorias e monitoramentos para verificar o cumprimento das obrigações contratuais e padrões de qualidade, fornecendo todos os acessos a documentos e informações para realização das auditarias assim como colaborar com os auditores e demais responsáveis designados pelo contratante. 





A contratada se responsabiliza por cobrir todos os gastos com despesas e trâmites trabalhistas de seus funcionários tais como: Salário, férias com adicional de ⅓, 13º salário, depósito de FGTS, recolhimento de previdência e despesas referentes a verbas rescisórias e sindicais, assim como com as despesas de admissão e demissão, substituição permanente ou temporária de qualquer de seus colaboradores. A contratada se compromete em prestar contas mensalmente referente aos pagamentos de salários, recolhimentos de FGTS e INSS, rescisões e admissões assim como pagamento de vales transportes e qualquer pagamento adicional, sob pena de não o fazendo dar-se por pausado o pagamento mensal do mês subsequente. 
A contratada estabelece que o envio dos documentos se dará entre os dias 05 e 10 do mês subsequente ao da prestação do serviço e está condicionado ao pagamento por parte da contratante nas datas corretas do vencimento mensal da prestação do serviço. A contratada se compromete a manter os colaboradores uniformizados, podendo a qualquer momento substituir o uniforme, logo, cores e padrão com prévia concordância entre contratante e contratada. Prestar os serviços contratados na forma e modo ajustados, dentro das normas e especificações técnicas aplicáveis à espécie, dando plena e total garantia deles; 
Executar os serviços contratados em todo perímetro do CONTRATANTE, utilizando a melhor técnica e visando sempre atingir o melhor resultado, sob sua exclusiva responsabilidade, sendo-lhe vedada a transferência dos mesmos a terceiros, sem prévia e expressa concordância do contratante. Fica estabelecido que toda a mão de obra, maquinários, equipamentos e EPIs necessários para o desenvolvimento dos serviços deverão ser fornecidos pela CONTRATADA e estão inclusos no valor da presente contratação. A falta de entrega de algum EPI, documento ou equipamento essencial para a prestação de serviço acarretará em aviso de penalidade e no recebimento do mesmo o acréscimo de 10 dias para regularização das pendências, ao acúmulo no mesmo mês de três penalidades haverá a dispensa de aviso prévio para a rescisão entre as partes.  
A presente prestação de serviço de Guarda Patrimonial não requer treinamento técnico ou certificações específicas para a função, sendo assim todo treinamento específico para atuação objetiva do Guarda patrimonial deverá ser coordenado e negociado a parte entre contratante e contratado. 
 
Obrigações da Contratante
O (A) CONTRATANTE se obriga: Efetuar o pagamento na forma e modo aprazados. Comunicar a contratada sobre as reclamações feitas contra seus empregados/prepostos, bem como com relação a danos por eles causados. Não efetuar ordens de serviço aos colaboradores diretamente sem a consciência da contratada, assim como troca de jornada e função, excluindo-se orientações acerca de modo de operacionalidade de sistemas, softwares, ferramentas e locais. Instalar e proporcionar recursos mínimos para instalação do colaborador para que supram necessidades de acomodações, de almoço e de necessidades básicas de higiene pessoais e profissionais.  
 
Financeiro
${data.servicoDescricao} ${data.servicoJornada} ${data.servicoRegime} R$ (${data.quantidade} pessoas) valor unitário R$ ${data.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Valor mensal do contrato R$ ${data.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
O presente contrato não implica em qualquer vínculo empregatício do contrato pelos serviços prestados ao contratante. A contratada fará um reajuste no valor bruto do contrato de prestação de serviços e seus valores referente ao dissídio da categoria que se dá todo dia 01º de cada janeiro, e o pagamento que se der posterior ao mês de janeiro será cumulativo. 
A contratada efetuará o pagamento da remuneração de seus empregados/prepostos, sendo responsável por todos e quaisquer ônus e encargos decorrentes da legislação trabalhista, fiscal e previdenciária, além dos impostos, taxas, obrigações assumidas neste contrato;  
O cumprimento de todas as determinações impostas pelas autoridades públicas competentes, relativas aos serviços aqui contratados, bem como o pagamento de todos os tributos federais, estaduais e municipais que incidam ou venham a incidir sobre ele;  
Munir o contratante dos documentos trabalhistas, fiscais e previdenciários, anexando os documentos por parte da contratada uma vez ao mês nas plataformas digitais do contratante ou através de portais exclusivos do contratado.  A contratada faturará mensalmente o valor contratual mediante 2 confecções de notas fiscais mensais, sendo uma relativa a prestação de serviços e outra referente a administração de serviços.  
 




LGPD
A CONTRATANTE informa que é de sua responsabilidade a administração dos controles internos adotados pelos nossos colaboradores e que eles estão adequados ao tipo de atividade e volume de transações que; Não realizará nenhum tipo de operação que possa ser considerada ilegal, frente a legislação vigente; No que toca aos dados, a CONTRATADA possui processos internos de governança para a proteção dos dados eventualmente armazenados em razão da execução e utilização em seus negócios relacionados aos serviços contratados, devendo a CONTRATANTE observar a LGPD e as premissas de governança com seus colaboradores e prestadores de serviços regularmente aceitas no tratamento dos dados obtidos.
Os dados apresentados para acesso as dependências do prédio estão condicionadas as regras do software ou aplicativo que opera com tais informações e que a CONTRATANTE escolhe, porém, os colaboradores que acessam o sistema ou trabalham com a digitação dos dados são responsáveis pelo sigilo e respondem trabalhista e civilmente pela quebra do processo de falha da comunicação de acordo com a lei. As Partes declaram-se cientes dos direitos, obrigações e penalidades aplicáveis constantes da Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018) ("LGPD"), e obrigam-se a adotar todas as medidas razoáveis para garantir, por si, bem como seu pessoal, colaboradores, empregados e subcontratados que utilizem os Dados Protegidos na extensão autorizada na referida LGPD. 
 
 
Prazos e validades

${data.dataInicio}
O presente contrato tem validade de ${data.duracao} meses a partir da data de início (acima), com prorrogação automática desde que não haja demonstração de interesse no cancelamento por uma das partes. A extinção desse contrato pode ser feito sem multa somente após os três primeiros meses, antes desse período o valor da multa é o valor contratual de três meses do valor de contrato independentemente de aviso prévio. Já o encerramento nos demais períodos se dará por um aviso prévio de ${data.avisoPrevo} dias antes do último dia previsto. 
Para firmeza e como prova de haverem contratado os termos, adendos e anexos apresentados e firmam este documento, impresso ou via assinatura online em duas vias de igual teor e forma, assinado pelas partes contratantes e pelas testemunhas abaixo. 
PARÁGRAFO ÚNICO. Em caso de impasse, as partes submeterão a solução do conflito a procedimento arbitral nos termos da Lei n.º 9.307/96. 
Para o Foro da comarca de Pelotas, para nele serem dirimidos toda e qualquer dúvida ou questão oriundas do presente contrato, renunciando as partes, a qualquer outro por mais especial e privilegiado que seja. 
 
 
 
Assinatura eletrônica contratada: 
 
 
 
 
 
 
Assinatura eletrônica contratante: 
 
 
 
 
 
 
 
${data.dataAssinatura}`;
};