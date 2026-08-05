/**
 * Fonte única de verdade dos serviços do site.
 *
 * Usada por tools/build.js para gerar:
 *   - a página de cada técnica (/<slug>/index.html)
 *   - o grid de serviços e a lista do rodapé em index.html
 *   - sitemap.xml
 *   - docs/google-ads-sitelinks.md e .csv (textos prontos para a campanha)
 *
 * Limites do Google Ads respeitados no campo `sitelink`:
 *   texto do sitelink  -> 25 caracteres
 *   linhas de descrição -> 35 caracteres cada
 * O build valida esses limites e falha se algum campo passar.
 */

const SITE = {
  url: "https://terezinharamos.com.br",
  name: "Terezinha Ramos Massoterapeuta",
  phone: "+5551989582730",
  phoneLabel: "(51) 98958-2730",
  street: "R. José de Alencar, 658/306",
  district: "Menino Deus",
  city: "Porto Alegre",
  state: "RS",
  zip: "90880-480"
};

/** Depoimentos reais do perfil da Terezinha no Google (5,0 ★ · 28 avaliações). */
const REVIEWS = {
  ana: {
    quote:
      "Teka é uma pessoa muito capacitada, muito atenciosa e sempre aberta para atender da melhor maneira sua clientela. Os resultados são comprovados após o tratamento escolhido em comum acordo com a cliente.",
    author: "Ana Moraes",
    initial: "A",
    color: "#8e6b4f"
  },
  raquel: {
    quote:
      "Experiência maravilhosa! Foi eliminado minhas dores no corpo todo. Ambiente relaxante, acolhedor e terapêutico. Teca é uma terapeuta competente, diferenciada de muita sabedoria e luz. Recomendo muito! É qualidade de vida.",
    author: "Raquel Louzada",
    initial: "R",
    color: "#5c7a6b"
  },
  sidnei: {
    quote:
      "Fazer massagem com a Terezinha te deixa novo em folha, relaxado e pronto para as batalhas cotidianas da vida. Se chegar lá com alguma dor no corpo, é só avisar que sairá aliviado. Faço massoterapia com ela há vários anos e continuo cliente.",
    author: "Sidnei Schneider",
    initial: "S",
    color: "#4a6fa5"
  },
  matheus: {
    quote:
      "Tenho a coluna operada e, praticando levantamento de peso e Muay Thai, já fui salvo algumas vezes pela Terezinha com lesões e dores na coluna e nas pernas. Realmente diferenciado o tratamento e atendimento. Indico fortemente.",
    author: "Matheus Sturari",
    initial: "M",
    color: "#a5544a"
  },
  tais: {
    quote:
      "Melhor profissional que conheço! Sou cliente desde 2011, e recomendo muito. Massagem e tratamentos estéticos, drenagem pós-operatória, massagem terapêutica — todos os protocolos são maravilhosos e com resultado muito bom. Atendimento excelente!",
    author: "Taís Fagundes",
    initial: "T",
    color: "#7a5ca5"
  },
  bruna: {
    quote:
      "Sou cliente da Terezinha desde 2009 e recomendo o trabalho dela com total segurança. A Terezinha tem um cuidado muito especial com cada pessoa, é um atendimento humanizado de verdade. Hoje, não fico sem — é um trabalho sério, feito com muito carinho e profissionalismo.",
    author: "Bruna Peralta",
    initial: "B",
    color: "#4f8e7d"
  }
};

const SERVICES = [
  {
    slug: "massagem-relaxante",
    name: "Massagem Relaxante",
    shortName: "Relaxante",
    h1: "Massagem Relaxante em Porto Alegre",
    title: "Massagem Relaxante em Porto Alegre | Terezinha Ramos",
    description:
      "Massagem relaxante no Menino Deus, Porto Alegre. Sessão individual, sem pressa, para aliviar o estresse e as tensões do dia a dia. Agende pelo WhatsApp.",
    cardText:
      "Alivia as tensões do dia a dia e proporciona relaxamento profundo do corpo e da mente.",
    heroSub:
      "Um tempo só seu: toque suave e ritmado, respiração mais calma e o corpo desacelerando de verdade — em um consultório reservado no Menino Deus.",
    image: "assets/img/massage-1.jpg",
    imageAlt: "Sessão de massagem relaxante com Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Massagem Relaxante.",
    intro: [
      "A massagem relaxante é o caminho mais direto para desacelerar. Movimentos suaves, contínuos e em ritmo constante ajudam o corpo a sair do estado de alerta em que a rotina costuma deixar a gente.",
      "No consultório da Terezinha, a sessão é individual e sem pressa. Antes de começar, vocês conversam sobre como você está chegando — cansaço, noites mal dormidas, tensão nos ombros — e a pressão do toque é ajustada ao que o seu corpo pede naquele dia."
    ],
    indications: [
      "Rotina acelerada, com muitas horas de tela e pouco descanso",
      "Dificuldade para desacelerar no fim do dia",
      "Tensão leve no pescoço, nos ombros e nas costas",
      "Cansaço acumulado da semana",
      "Quem nunca fez massagem e quer começar por algo suave"
    ],
    benefits: [
      {
        title: "Corpo mais leve",
        text: "O toque contínuo ajuda a soltar a musculatura que fica contraída sem a gente perceber."
      },
      {
        title: "Mente mais calma",
        text: "Uma pausa real no meio da rotina: sem telefone, sem pressa e sem interrupção."
      },
      {
        title: "Sono mais tranquilo",
        text: "Muita gente relata dormir melhor nas noites seguintes à sessão."
      }
    ],
    session: [
      {
        title: "Conversa inicial",
        text: "Você conta como está se sentindo e o que gostaria de trabalhar na sessão."
      },
      {
        title: "A sessão",
        text: "Ambiente reservado e tranquilo. A pressão do toque é ajustada ao seu conforto do início ao fim."
      },
      {
        title: "Depois",
        text: "Você se levanta no seu tempo e, se fizer sentido, a Terezinha sugere um intervalo para a próxima sessão."
      }
    ],
    faq: [
      {
        q: "Qual a diferença entre massagem relaxante e terapêutica?",
        a: "A relaxante trabalha o corpo todo com um toque mais suave e contínuo, com foco em desacelerar. A terapêutica é mais direcionada: age nos pontos de dor e tensão, com mais pressão e técnica específica. Na dúvida, a Terezinha indica a melhor opção para o seu caso."
      },
      {
        q: "Quanto custa a sessão?",
        a: "Os valores variam conforme a técnica e o protocolo combinado. É só chamar no WhatsApp que a Terezinha passa o valor certinho, sem compromisso."
      },
      {
        q: "Preciso levar alguma coisa?",
        a: "Não. Venha com uma roupa confortável e, se puder, reserve um tempinho depois da sessão para não sair correndo."
      }
    ],
    review: REVIEWS.sidnei,
    sitelink: {
      text: "Massagem Relaxante",
      desc1: "Alívio do estresse do dia a dia",
      desc2: "Sessão individual, sem pressa"
    }
  },

  {
    slug: "massagem-terapeutica",
    name: "Massagem Terapêutica",
    shortName: "Terapêutica",
    h1: "Massagem Terapêutica em Porto Alegre",
    title: "Massagem Terapêutica em Porto Alegre | Terezinha Ramos",
    description:
      "Massagem terapêutica no Menino Deus, Porto Alegre: trabalho direcionado aos pontos de dor e tensão muscular, com avaliação da sua queixa. Agende pelo WhatsApp.",
    cardText: "Foco em pontos de dor e tensão muscular, com técnica individualizada.",
    heroSub:
      "Para quando existe uma queixa clara: o pescoço que não solta, o ombro travado, a lombar que reclama no fim do dia. Trabalho direcionado, com pressão ajustada ao seu limite.",
    image: "assets/img/massage-4.jpg",
    imageAlt: "Massagem terapêutica aplicada por Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Massagem Terapêutica.",
    intro: [
      "A massagem terapêutica é a escolha quando existe uma queixa clara: aquela dor no pescoço que não passa, o ombro travado, a lombar que reclama depois de horas sentado.",
      "A sessão começa por uma conversa sobre a sua queixa — onde dói, há quanto tempo, o que piora e o que alivia. A partir daí, a Terezinha trabalha os pontos de tensão com pressão firme e progressiva, sempre dentro do que o seu corpo aguenta."
    ],
    indications: [
      "Dor e rigidez no pescoço e nos ombros",
      "Tensão na lombar por longos períodos sentado",
      "Contraturas e nós musculares",
      "Sobrecarga de treino ou esforço repetitivo",
      "Dores de cabeça ligadas à tensão muscular"
    ],
    benefits: [
      {
        title: "Alívio direcionado",
        text: "O trabalho é focado onde dói, e não apenas um relaxamento geral do corpo."
      },
      {
        title: "Mais liberdade de movimento",
        text: "Soltar a musculatura contraída costuma devolver amplitude para virar o pescoço, girar o ombro, agachar."
      },
      {
        title: "Acompanhamento ao longo do tempo",
        text: "Para queixas antigas, a Terezinha combina uma sequência de sessões em vez de um atendimento isolado."
      }
    ],
    session: [
      {
        title: "Avaliação da queixa",
        text: "Você conta onde dói, há quanto tempo e o que costuma piorar ou aliviar o desconforto."
      },
      {
        title: "Trabalho nos pontos de tensão",
        text: "Pressão firme e progressiva sobre a musculatura envolvida, com ajuste constante ao seu limite."
      },
      {
        title: "Orientações finais",
        text: "Dicas simples de postura, hidratação e cuidado para os dias seguintes à sessão."
      }
    ],
    note:
      "A massoterapia é um cuidado complementar e não substitui avaliação, diagnóstico ou tratamento médico. Se a dor for intensa, recente ou vier de uma lesão, procure também o seu profissional de saúde.",
    faq: [
      {
        q: "A massagem terapêutica dói?",
        a: "Pode ter momentos de desconforto ao trabalhar um ponto muito tensionado, mas não deve virar dor. A pressão é ajustada durante toda a sessão — é só avisar."
      },
      {
        q: "Quantas sessões vou precisar?",
        a: "Depende da queixa e de há quanto tempo ela existe. Alguns casos melhoram já nas primeiras sessões; outros pedem um acompanhamento mais regular. Isso é combinado com você."
      },
      {
        q: "Posso fazer se tenho problema de coluna?",
        a: "Muita gente atendida no consultório convive com dores e histórico de coluna. Comente o seu caso no primeiro contato e traga as orientações do seu médico ou fisioterapeuta — o trabalho é sempre adaptado a elas."
      }
    ],
    review: REVIEWS.matheus,
    sitelink: {
      text: "Massagem Terapêutica",
      desc1: "Foco nos pontos de dor e tensão",
      desc2: "Técnica ajustada à sua queixa"
    }
  },

  {
    slug: "drenagem-linfatica",
    name: "Drenagem Linfática",
    shortName: "Drenagem Linfática",
    h1: "Drenagem Linfática em Porto Alegre",
    title: "Drenagem Linfática em Porto Alegre | Terezinha Ramos",
    description:
      "Drenagem linfática manual no Menino Deus, Porto Alegre. Toque suave e ritmado para reduzir a sensação de inchaço e a retenção de líquidos. Agende pelo WhatsApp.",
    cardText: "Estimula a circulação e ajuda a reduzir o inchaço e a retenção de líquidos.",
    heroSub:
      "Toque leve, ritmo constante e a direção certa dos movimentos para ajudar o corpo a lidar com a retenção de líquidos e a sensação de inchaço.",
    image: "assets/img/massage-2.jpg",
    imageAlt: "Drenagem linfática manual realizada por Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Drenagem Linfática.",
    intro: [
      "A drenagem linfática é uma técnica de toque suave e ritmado que acompanha o caminho natural do sistema linfático, ajudando o corpo a lidar melhor com a retenção de líquidos.",
      "Nada de pressão forte: o que faz diferença aqui é a direção correta dos movimentos, a constância do ritmo e a sequência da sessão. Por isso a técnica de quem aplica importa tanto."
    ],
    indications: [
      "Sensação de inchaço nas pernas e nos pés",
      "Retenção de líquidos, principalmente no fim do dia",
      "Rotina com muitas horas em pé ou sentada na mesma posição",
      "Período pré-menstrual com inchaço",
      "Complemento a tratamentos estéticos"
    ],
    benefits: [
      {
        title: "Menos sensação de inchaço",
        text: "O trabalho ajuda a mobilizar o líquido retido e costuma trazer alívio já na saída da sessão."
      },
      {
        title: "Pernas mais leves",
        text: "Especialmente para quem passa o dia em pé ou sentado na mesma posição."
      },
      {
        title: "Sessão confortável",
        text: "O toque é leve e o ritmo é constante — é uma das técnicas mais tranquilas de receber."
      }
    ],
    session: [
      {
        title: "Conversa inicial",
        text: "Vocês combinam as regiões a trabalhar e você comenta qualquer questão de saúde relevante."
      },
      {
        title: "A sessão",
        text: "Movimentos leves, lentos e repetidos, seguindo o trajeto natural do sistema linfático."
      },
      {
        title: "Depois",
        text: "Vale beber bastante água e evitar ficar muito tempo parado logo depois do atendimento."
      }
    ],
    faq: [
      {
        q: "A drenagem linfática emagrece?",
        a: "Não. A drenagem trabalha a retenção de líquidos e a sensação de inchaço, não a gordura corporal. Para contorno corporal, a técnica indicada é a massagem modeladora — e muitas vezes as duas se complementam."
      },
      {
        q: "Com que frequência devo fazer?",
        a: "Varia conforme o objetivo. Para manutenção, costuma-se combinar uma frequência regular; para um período específico, um acompanhamento mais concentrado. A Terezinha orienta já no primeiro contato."
      },
      {
        q: "Preciso beber água depois?",
        a: "Sim. Beber bastante água ao longo do dia ajuda o corpo no processo e potencializa a sensação de leveza."
      }
    ],
    review: REVIEWS.ana,
    sitelink: {
      text: "Drenagem Linfática",
      desc1: "Ajuda a reduzir o inchaço",
      desc2: "Toque suave e ritmo constante"
    }
  },

  {
    slug: "drenagem-pos-operatoria",
    name: "Drenagem Pós-Operatória",
    shortName: "Pós-Operatória",
    h1: "Drenagem Pós-Operatória em Porto Alegre",
    title: "Drenagem Pós-Operatória em Porto Alegre | Terezinha Ramos",
    description:
      "Drenagem pós-operatória no Menino Deus, Porto Alegre. Acompanhamento delicado da sua recuperação, sempre com liberação da equipe médica. Agende pelo WhatsApp.",
    cardText:
      "Acompanhamento no pós-operatório para reduzir inchaço e acelerar a recuperação.",
    heroSub:
      "Um trabalho delicado para a fase de recuperação, feito com hora marcada, em ambiente reservado e sempre dentro da orientação da sua equipe médica.",
    image: "assets/img/massage-5.jpg",
    imageAlt: "Consultório de massoterapia preparado para atendimento pós-operatório",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Drenagem Pós-Operatória.",
    intro: [
      "Depois de uma cirurgia, o corpo precisa de tempo e de cuidado. A drenagem pós-operatória é um trabalho delicado, feito para acompanhar essa fase e ajudar a lidar com o inchaço e o desconforto da recuperação.",
      "O atendimento respeita integralmente a orientação da sua equipe médica: a liberação do cirurgião, o tempo de cada etapa e as regiões que podem ou não ser tocadas."
    ],
    indications: [
      "Pós-operatório de cirurgias plásticas",
      "Inchaço e sensação de peso na região operada",
      "Recuperação já liberada pela equipe médica",
      "Quem busca acompanhamento regular durante a fase de recuperação"
    ],
    benefits: [
      {
        title: "Acompanhamento contínuo",
        text: "A recuperação é um processo: a sessão isolada ajuda, mas é a regularidade que faz diferença."
      },
      {
        title: "Toque cuidadoso",
        text: "Trabalho delicado, respeitando cicatrizes, curativos, cintas e o seu limite de conforto."
      },
      {
        title: "Ambiente reservado",
        text: "Consultório tranquilo e privativo, num momento em que privacidade e calma importam muito."
      }
    ],
    session: [
      {
        title: "Orientações médicas",
        text: "Você traz o que foi orientado pela equipe que fez a cirurgia e vocês combinam o protocolo a partir disso."
      },
      {
        title: "A sessão",
        text: "Toque leve e cuidadoso nas regiões liberadas, com atenção constante ao seu conforto."
      },
      {
        title: "Sequência de atendimentos",
        text: "Como a recuperação é gradual, o mais comum é combinar uma série de sessões, com frequência maior no começo."
      }
    ],
    note:
      "É indispensável a liberação do cirurgião ou da equipe que acompanhou o seu procedimento. Traga as orientações recebidas: são elas que guiam todo o protocolo da sessão.",
    faq: [
      {
        q: "Quando posso começar depois da cirurgia?",
        a: "Quem define é a sua equipe médica. Assim que houver liberação, é só chamar no WhatsApp com as orientações recebidas para combinar o início."
      },
      {
        q: "Preciso de autorização médica?",
        a: "Sim. O atendimento pós-operatório só é feito com a liberação do profissional que realizou a cirurgia."
      },
      {
        q: "Quantas sessões são necessárias?",
        a: "Depende do procedimento e da orientação médica. Em geral é um acompanhamento em série, com sessões mais próximas no início da recuperação."
      }
    ],
    review: REVIEWS.tais,
    sitelink: {
      text: "Drenagem Pós-Operatória",
      desc1: "Cuidado na sua recuperação",
      desc2: "Com liberação da equipe médica"
    }
  },

  {
    slug: "massagem-modeladora",
    name: "Massagem Modeladora",
    shortName: "Modeladora",
    h1: "Massagem Modeladora em Porto Alegre",
    title: "Massagem Modeladora em Porto Alegre | Terezinha Ramos",
    description:
      "Massagem modeladora no Menino Deus, Porto Alegre. Movimentos firmes que ativam a circulação e trabalham o contorno corporal, com protocolo combinado. Agende pelo WhatsApp.",
    cardText: "Tratamento estético que ativa a circulação e trabalha o contorno corporal.",
    heroSub:
      "Movimentos firmes e vigorosos nas regiões combinadas com você, ativando a circulação local e trabalhando o contorno corporal sessão após sessão.",
    image: "assets/img/massage-3.jpg",
    imageAlt: "Massagem modeladora realizada por Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Massagem Modeladora.",
    intro: [
      "A massagem modeladora usa movimentos mais firmes e vigorosos sobre as regiões trabalhadas, ativando a circulação local e atuando no contorno corporal.",
      "É um trabalho estético e progressivo: os resultados aparecem com a constância das sessões e caminham junto com hábitos de alimentação, hidratação e movimento."
    ],
    indications: [
      "Objetivo de trabalhar o contorno corporal",
      "Regiões com acúmulo localizado",
      "Complemento à drenagem linfática",
      "Quem busca um acompanhamento estético regular"
    ],
    benefits: [
      {
        title: "Trabalho firme e direcionado",
        text: "Pressão mais intensa nas regiões definidas com você antes de a sessão começar."
      },
      {
        title: "Circulação ativada",
        text: "Os movimentos vigorosos estimulam a circulação local da área trabalhada."
      },
      {
        title: "Protocolo combinado",
        text: "Frequência e regiões definidas de acordo com o seu objetivo, e revistas ao longo do processo."
      }
    ],
    session: [
      {
        title: "Definição do objetivo",
        text: "Vocês conversam sobre o que você busca e quais regiões fazem sentido trabalhar."
      },
      {
        title: "A sessão",
        text: "Manobras firmes e ritmadas nas áreas combinadas, com a intensidade ajustada ao seu limite."
      },
      {
        title: "Constância",
        text: "Por ser um trabalho progressivo, o resultado depende da regularidade das sessões."
      }
    ],
    note:
      "Resultados estéticos variam de pessoa para pessoa e dependem de constância e de hábitos do dia a dia. A massagem modeladora não substitui acompanhamento nutricional ou médico.",
    faq: [
      {
        q: "Modeladora ou drenagem linfática?",
        a: "A drenagem trabalha a retenção de líquidos com toque leve; a modeladora é mais firme e foca no contorno corporal. É comum combinar as duas num mesmo protocolo — a Terezinha indica o melhor caminho para o seu objetivo."
      },
      {
        q: "A massagem modeladora deixa roxo?",
        a: "Não deve. A pressão é firme, mas ajustada ao seu limite. Marcas roxas são sinal de excesso, e não de eficácia."
      },
      {
        q: "Em quantas sessões vejo resultado?",
        a: "Varia de pessoa para pessoa. É um trabalho progressivo, que depende de regularidade e dos hábitos do dia a dia."
      }
    ],
    review: REVIEWS.bruna,
    sitelink: {
      text: "Massagem Modeladora",
      desc1: "Ativa a circulação e o contorno",
      desc2: "Protocolo combinado com você"
    }
  },

  {
    slug: "reflexologia-podal",
    name: "Reflexologia Podal",
    shortName: "Reflexologia",
    h1: "Reflexologia Podal em Porto Alegre",
    title: "Reflexologia Podal em Porto Alegre | Terezinha Ramos",
    description:
      "Reflexologia podal no Menino Deus, Porto Alegre. Estímulo dos pontos reflexos dos pés para relaxamento e bem-estar geral, sem precisar tirar a roupa. Agende pelo WhatsApp.",
    cardText: "Estímulo de pontos reflexos dos pés para equilíbrio e bem-estar geral.",
    heroSub:
      "Todo o trabalho acontece nos pés: pressão precisa, ponto a ponto, numa das técnicas mais discretas e restauradoras do consultório.",
    image: "assets/img/massage-1.jpg",
    imageAlt: "Atendimento de reflexologia podal com Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Reflexologia Podal.",
    intro: [
      "A reflexologia podal parte da ideia de que os pés concentram pontos reflexos ligados a diferentes regiões do corpo. A sessão trabalha esses pontos com pressão precisa, dedo a dedo, região a região.",
      "É uma técnica discreta e profundamente relaxante: não é preciso tirar a roupa e todo o trabalho acontece nos pés."
    ],
    indications: [
      "Cansaço de quem passa o dia em pé",
      "Vontade de relaxar sem massagem no corpo todo",
      "Pés doloridos e pesados no fim do dia",
      "Busca por uma pausa curta e restauradora"
    ],
    benefits: [
      {
        title: "Relaxamento geral",
        text: "Muita gente relata uma sensação de descanso que vai bem além dos pés."
      },
      {
        title: "Sessão discreta",
        text: "Não é preciso tirar a roupa durante o atendimento — só os pés ficam livres."
      },
      {
        title: "Alívio para pés cansados",
        text: "Ideal para quem passa horas em pé ou usa calçado apertado no trabalho."
      }
    ],
    session: [
      {
        title: "Acomodação",
        text: "Você se acomoda confortavelmente, sem precisar tirar a roupa."
      },
      {
        title: "O trabalho nos pontos",
        text: "Pressão firme e constante sobre os pontos reflexos, região por região, dos dedos ao calcanhar."
      },
      {
        title: "Fechamento",
        text: "A sessão termina com movimentos mais suaves, para uma saída tranquila."
      }
    ],
    faq: [
      {
        q: "Faz cócegas?",
        a: "No começo pode incomodar um pouco, mas a pressão usada na reflexologia é firme e constante — bem diferente do toque leve, que é o que costuma provocar cócegas."
      },
      {
        q: "Preciso tirar a roupa?",
        a: "Não. Na reflexologia podal não é preciso tirar a roupa: só os pés ficam livres durante o atendimento."
      },
      {
        q: "Posso combinar com outra técnica?",
        a: "Sim. É comum encaixar a reflexologia ao fim de uma sessão de massagem relaxante, por exemplo. Basta combinar no agendamento."
      }
    ],
    review: REVIEWS.raquel,
    sitelink: {
      text: "Reflexologia Podal",
      desc1: "Pontos reflexos dos pés",
      desc2: "Relaxamento e bem-estar geral"
    }
  },

  {
    slug: "massagem-pedras-quentes",
    name: "Massagem com Pedras Quentes",
    shortName: "Pedras Quentes",
    h1: "Massagem com Pedras Quentes em Porto Alegre",
    title: "Massagem com Pedras Quentes em Porto Alegre | Terezinha Ramos",
    description:
      "Massagem com pedras quentes no Menino Deus, Porto Alegre. Calor e toque terapêutico para um relaxamento muscular mais profundo. Agende pelo WhatsApp.",
    cardText: "Combina calor e toque terapêutico para um relaxamento ainda mais profundo.",
    heroSub:
      "Pedras aquecidas posicionadas sobre o corpo e deslizadas pela musculatura: o calor prepara, o toque finaliza e o relaxamento vai mais fundo.",
    image: "assets/img/massage-2.jpg",
    imageAlt: "Massagem com pedras quentes realizada por Terezinha Ramos",
    waMessage:
      "Olá, Terezinha! Vim pelo site e tenho interesse na Massagem com Pedras Quentes.",
    intro: [
      "Na massagem com pedras quentes, pedras aquecidas são posicionadas sobre o corpo e também deslizadas pela musculatura, junto com o trabalho das mãos.",
      "O calor faz metade do trabalho: ele ajuda a musculatura a se soltar antes mesmo de a pressão aumentar, o que torna o relaxamento mais profundo e a sessão bem mais confortável."
    ],
    indications: [
      "Musculatura tensa que não relaxa com facilidade",
      "Sensibilidade ao frio, principalmente no inverno",
      "Vontade de um relaxamento mais profundo",
      "Estresse acumulado com tensão nas costas"
    ],
    benefits: [
      {
        title: "Calor que solta a musculatura",
        text: "A temperatura prepara o tecido e permite um trabalho mais profundo com menos pressão."
      },
      {
        title: "Relaxamento profundo",
        text: "A combinação de calor e toque costuma levar a um estado de relaxamento mais intenso."
      },
      {
        title: "Sensação de aconchego",
        text: "Uma das sessões preferidas de quem sente frio com facilidade."
      }
    ],
    session: [
      {
        title: "Preparo das pedras",
        text: "As pedras são aquecidas e a temperatura é testada antes de qualquer contato com a pele."
      },
      {
        title: "A sessão",
        text: "Pedras posicionadas em pontos estratégicos e deslizadas pela musculatura, alternando com o toque das mãos."
      },
      {
        title: "Depois",
        text: "Vale um tempinho de descanso antes de voltar à rotina para aproveitar melhor a sensação."
      }
    ],
    faq: [
      {
        q: "As pedras queimam a pele?",
        a: "Não. A temperatura é controlada e testada antes do contato com a pele, e segue sendo ajustada ao seu conforto durante a sessão."
      },
      {
        q: "Serve para quem tem muita dor?",
        a: "O calor costuma ajudar bastante em musculatura tensionada. Se a sua queixa for uma dor específica e persistente, vale conversar sobre combinar com a massagem terapêutica."
      },
      {
        q: "Posso fazer no verão?",
        a: "Pode. A procura é maior no inverno, mas a técnica funciona o ano todo — o que muda é o tempo de contato do calor com o corpo."
      }
    ],
    review: REVIEWS.sidnei,
    sitelink: {
      text: "Pedras Quentes",
      desc1: "Calor e toque terapêutico",
      desc2: "Relaxamento muscular profundo"
    }
  },

  {
    slug: "ventosaterapia",
    name: "Ventosaterapia",
    shortName: "Ventosaterapia",
    h1: "Ventosaterapia em Porto Alegre",
    title: "Ventosaterapia em Porto Alegre | Terezinha Ramos",
    description:
      "Ventosaterapia no Menino Deus, Porto Alegre. Ventosas aplicadas sobre a pele para soltar a musculatura tensionada e estimular a circulação local. Agende pelo WhatsApp.",
    cardText:
      "Ventosas que soltam a musculatura tensionada e estimulam a circulação local.",
    heroSub:
      "A sucção das ventosas alcança a tensão que o toque sozinho demora a soltar — muito usada em costas e ombros, sozinha ou dentro de uma sessão terapêutica.",
    image: "assets/img/massage-4.jpg",
    imageAlt: "Aplicação de ventosaterapia por Terezinha Ramos",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse na Ventosaterapia.",
    intro: [
      "Na ventosaterapia, copos de vidro ou silicone criam uma sucção sobre a pele. Essa pressão negativa ajuda a soltar a musculatura tensionada e estimula a circulação local.",
      "As ventosas podem ficar paradas em pontos específicos ou deslizar pela região trabalhada. É uma técnica muito usada em costas e ombros, sozinha ou combinada com a massagem terapêutica."
    ],
    indications: [
      "Tensão persistente nas costas e nos ombros",
      "Musculatura endurecida por má postura",
      "Sobrecarga muscular por treino ou trabalho repetitivo",
      "Complemento à massagem terapêutica"
    ],
    benefits: [
      {
        title: "Alívio da tensão profunda",
        text: "A sucção alcança camadas que o toque sozinho demora mais a soltar."
      },
      {
        title: "Circulação estimulada",
        text: "O trabalho ativa a circulação local da região tratada."
      },
      {
        title: "Combina com outras técnicas",
        text: "Funciona muito bem como preparo ou complemento de uma sessão terapêutica."
      }
    ],
    session: [
      {
        title: "Avaliação da região",
        text: "Vocês combinam onde aplicar e você comenta qualquer questão de saúde relevante."
      },
      {
        title: "Aplicação das ventosas",
        text: "As ventosas são posicionadas ou deslizadas pela região, com a sucção ajustada ao seu conforto."
      },
      {
        title: "Finalização",
        text: "A sessão costuma terminar com um trabalho manual sobre a área tratada."
      }
    ],
    note:
      "É comum a ventosa deixar marcas arredondadas na pele, que costumam desaparecer em alguns dias. Se você tem algum quadro de saúde ou usa medicação contínua, comente antes da sessão.",
    faq: [
      {
        q: "A ventosa deixa marcas?",
        a: "Sim, é comum ficarem marcas arredondadas na região tratada. Elas não doem e costumam desaparecer em poucos dias."
      },
      {
        q: "Dói?",
        a: "A sensação é de puxada na pele, não de dor. A intensidade da sucção é ajustada ao seu conforto durante toda a aplicação."
      },
      {
        q: "Pode ser feita junto com a massagem?",
        a: "Sim, é uma combinação muito comum: a ventosa prepara a região e a massagem terapêutica finaliza o trabalho."
      }
    ],
    review: REVIEWS.matheus,
    sitelink: {
      text: "Ventosaterapia",
      desc1: "Ventosas soltam a musculatura",
      desc2: "Alívio de tensão nas costas"
    }
  },

  {
    slug: "reiki",
    name: "Reiki",
    shortName: "Reiki",
    h1: "Reiki em Porto Alegre",
    title: "Reiki em Porto Alegre | Terezinha Ramos",
    description:
      "Sessão de Reiki no Menino Deus, Porto Alegre. Terapia complementar de relaxamento, sozinha ou ao final de uma sessão de massagem. Agende pelo WhatsApp.",
    cardText: "Terapia energética complementar para equilíbrio físico e emocional.",
    heroSub:
      "Uma pausa silenciosa: sem pressão sobre o corpo, sem precisar tirar a roupa. Sozinha ou como fechamento de uma sessão de massagem.",
    image: "assets/img/massage-5.jpg",
    imageAlt: "Ambiente reservado para sessão de Reiki no consultório",
    waMessage: "Olá, Terezinha! Vim pelo site e tenho interesse no Reiki.",
    intro: [
      "O Reiki é uma prática de imposição das mãos, feita em silêncio ou com música suave, com a pessoa deitada e confortável.",
      "É um cuidado complementar, procurado por quem busca um momento de pausa e de reorganização interna — sozinho ou ao final de uma sessão de massagem."
    ],
    indications: [
      "Períodos de estresse e sobrecarga emocional",
      "Vontade de uma pausa silenciosa no meio da rotina",
      "Complemento a uma sessão de massagem",
      "Quem prefere um atendimento sem pressão sobre o corpo"
    ],
    benefits: [
      {
        title: "Momento de pausa",
        text: "Um tempo de silêncio e descanso, sem telefone e sem interrupção."
      },
      {
        title: "Sem pressão no corpo",
        text: "Não há manobras nem pressão muscular: as mãos são posicionadas sobre ou próximo ao corpo."
      },
      {
        title: "Complementar a outras técnicas",
        text: "Encaixa bem no fechamento de uma sessão de massagem relaxante."
      }
    ],
    session: [
      {
        title: "Acomodação",
        text: "Você se acomoda na maca, sem precisar tirar a roupa, em ambiente tranquilo."
      },
      {
        title: "A sessão",
        text: "As mãos são posicionadas em sequência, sobre ou próximo ao corpo, sem pressão."
      },
      {
        title: "Retorno tranquilo",
        text: "A saída é feita no seu tempo, sem pressa para voltar à rotina."
      }
    ],
    note:
      "O Reiki é uma prática complementar de relaxamento e não substitui tratamento médico ou psicológico.",
    faq: [
      {
        q: "Preciso acreditar para funcionar?",
        a: "Não é preciso nenhuma crença específica. A proposta é simples: um momento de silêncio e descanso, do jeito que fizer sentido para você."
      },
      {
        q: "Como é a sessão?",
        a: "Você se acomoda na maca, vestida e confortável. A terapeuta posiciona as mãos sobre ou próximo ao corpo, em sequência, sem pressão."
      },
      {
        q: "Posso combinar com massagem?",
        a: "Sim. Muita gente finaliza a sessão de massagem com alguns minutos de Reiki. Basta combinar no agendamento."
      }
    ],
    review: REVIEWS.bruna,
    sitelink: {
      text: "Reiki",
      desc1: "Terapia complementar de pausa",
      desc2: "Equilíbrio físico e emocional"
    }
  }
];

module.exports = { SITE, SERVICES };
