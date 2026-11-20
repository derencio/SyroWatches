export type Locale = 'en' | 'pt'

export interface DictionaryContent {
  tagline: string
  aboutLink: string
  backLink: string
  themeToDay: string
  themeToNight: string
  etymology: {
    word: string
    phonetic: string
    origin: string
    definition: string
    statementPrefix: string
    droppedPrefix: string
    brandName: string
  }
  about: {
    heading: string
    paragraphs: string[]
  }
  teasers: {
    paletteLabel: string
    dayNightLabel: string
  }
}

export const DICTIONARY: Record<Locale, DictionaryContent> = {
  en: {
    tagline: 'Time is ticking',
    aboutLink: 'About us',
    backLink: 'Back',
    themeToDay: 'Switch to day version',
    themeToNight: 'Switch to night version',
    etymology: {
      word: 'Pysyrõ',
      phonetic: '/py·sy·rõ/',
      origin: 'verb · Old Tupi',
      definition:
        'to set free, to liberate, to break away from constraints.',
      statementPrefix: 'We are',
      droppedPrefix: 'Py',
      brandName: 'Syro.',
    },
    about: {
      heading: 'About us',
      paragraphs: [
        'Syro was born from the desire to create original watches free from labels, borders, or pre-set formulas. We respect watchmaking tradition, yet our gaze is always set forward—because the time that truly matters is what we build from here on.',
        'We believe glancing at your wrist should be an invitation to appreciate the value of every single minute. That is why we craft versatile collections in colors, shapes, and details designed to match your mood, rhythm, and every occasion. At Syro, each timepiece is an extension of your state of mind and a reminder that time is a personal expression.',
      ],
    },
    teasers: {
      paletteLabel: 'Upcoming color-driven collection',
      dayNightLabel: 'Upcoming dual-face day & night concept',
    },
  },
  pt: {
    tagline: 'O tempo está passando',
    aboutLink: 'Sobre nós',
    backLink: 'Voltar',
    themeToDay: 'Mudar para versão dia',
    themeToNight: 'Mudar para versão noite',
    etymology: {
      word: 'Pysyrõ',
      phonetic: '/py·sy·rõ/',
      origin: 'verbo · Tupi antigo',
      definition:
        'libertar-se, soltar-se, desprender-se de amarras.',
      statementPrefix: 'We are',
      droppedPrefix: 'Py',
      brandName: 'Syro.',
    },
    about: {
      heading: 'Sobre nós',
      paragraphs: [
        'A Syro nasceu da vontade de criar relógios autorais livres de rótulos, fronteiras ou fórmulas pré-definidas. Honramos a tradição da relojoaria, mas nosso olhar aponta sempre para frente — porque o tempo que importa é o que construímos daqui em diante.',
        'Acreditamos que olhar para o pulso deve ser um convite para perceber o valor de cada minuto. Por isso, desenvolvemos coleções versáteis em cores, formas e detalhes, pensadas para acompanhar o seu humor, o seu ritmo e cada ocasião. Na Syro, cada relógio é uma extensão do seu estado de espírito e um lembrete de que o tempo é uma escolha pessoal.',
      ],
    },
    teasers: {
      paletteLabel: 'Nova coleção guiada pelas cores',
      dayNightLabel: 'Novo conceito dupla-face dia e noite',
    },
  },
}
