import type { Locale } from './config';

type UIStrings = {
  nav: {
    home: string;
    blog: string;
    about: string;
    projects: string;
    contact: string;
  };
  footer: {
    copyright: string;
  };
  home: {
    heroIntro: string;
    heroRoleNow: string;
    heroRoleNext: string;
    ctaBlog: string;
    ctaAbout: string;
  };
  about: {
    title: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    downloadCV: string;
  };
  blog: {
    title: string;
    readingTimeSuffix: string;
    tagsLabel: string;
    empty: string;
    tableOfContents: string;
    previous: string;
    next: string;
    pageXofY: string;
    paginationLabel: string;
  };
  projects: {
    title: string;
    empty: string;
    readPost: string;
  };
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    githubLabel: string;
    linkedinLabel: string;
  };
  common: {
    switchLang: string;
    switchLangAria: string;
    skipToContent: string;
    themeToggleAria: string;
    menuToggleAria: string;
    search: string;
    searchAria: string;
    searchPlaceholder: string;
    searchInitial: string;
    searchNoResults: string;
    searchUnavailable: string;
    close: string;
  };
  notFound: {
    heading: string;
    description: string;
    backHome: string;
  };
};

export const translations: Record<Locale, UIStrings> = {
  es: {
    nav: {
      home: 'Inicio',
      blog: 'Blog',
      about: 'Sobre mí',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    footer: {
      copyright: '© {year} Santiago Duque',
    },
    home: {
      heroIntro: 'Hola, soy',
      heroRoleNow: 'Tech Lead en Bold',
      heroRoleNext: 'serverless · event-driven · AI-native systems',
      ctaBlog: 'Leer el blog',
      ctaAbout: 'Sobre mí',
    },
    about: {
      title: 'Sobre mí',
      summary: 'Resumen',
      experience: 'Experiencia',
      education: 'Educación',
      skills: 'Habilidades',
      certifications: 'Certificaciones',
      downloadCV: 'Descargar CV (PDF)',
    },
    blog: {
      title: 'Blog',
      readingTimeSuffix: 'min de lectura',
      tagsLabel: 'Tags',
      empty: 'Todavía no hay posts publicados.',
      tableOfContents: 'Tabla de contenido',
      previous: 'Anterior',
      next: 'Siguiente',
      pageXofY: 'Página {x} de {y}',
      paginationLabel: 'Paginación de posts',
    },
    projects: {
      title: 'Proyectos',
      empty: 'Todavía no hay proyectos publicados.',
      readPost: 'leer post',
    },
    contact: {
      title: 'Contacto',
      intro:
        'Para consultas técnicas, oportunidades de trabajo o cualquier conversación de ingeniería: la vía más rápida es email. También respondo en LinkedIn y GitHub.',
      emailLabel: 'email',
      githubLabel: 'github',
      linkedinLabel: 'linkedin',
    },
    common: {
      switchLang: 'EN',
      switchLangAria: 'Cambiar a inglés',
      skipToContent: 'Saltar al contenido',
      themeToggleAria: 'Cambiar entre modo claro y oscuro',
      menuToggleAria: 'Abrir menú de navegación',
      search: 'Buscar',
      searchAria: 'Abrir búsqueda',
      searchPlaceholder: 'Buscar en el sitio…',
      searchInitial: 'Empezá a tipear para buscar.',
      searchNoResults: 'No hay resultados.',
      searchUnavailable:
        'La búsqueda no está disponible en dev. Probá `pnpm build && pnpm preview`.',
      close: 'Cerrar',
    },
    notFound: {
      heading: 'Página no encontrada',
      description: 'La URL que buscás no existe o se movió.',
      backHome: 'Volver al inicio',
    },
  },
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
    },
    footer: {
      copyright: '© {year} Santiago Duque',
    },
    home: {
      heroIntro: "I'm",
      heroRoleNow: 'Tech Lead at Bold',
      heroRoleNext: 'serverless · event-driven · AI-native systems',
      ctaBlog: 'Read the blog',
      ctaAbout: 'About me',
    },
    about: {
      title: 'About me',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      certifications: 'Certifications',
      downloadCV: 'Download CV (PDF)',
    },
    blog: {
      title: 'Blog',
      readingTimeSuffix: 'min read',
      tagsLabel: 'Tags',
      empty: 'No posts published yet.',
      tableOfContents: 'Table of contents',
      previous: 'Previous',
      next: 'Next',
      pageXofY: 'Page {x} of {y}',
      paginationLabel: 'Posts pagination',
    },
    projects: {
      title: 'Projects',
      empty: 'No projects published yet.',
      readPost: 'read post',
    },
    contact: {
      title: 'Contact',
      intro:
        'For technical inquiries, work opportunities, or any engineering conversation: email is the fastest path. I also reply on LinkedIn and GitHub.',
      emailLabel: 'email',
      githubLabel: 'github',
      linkedinLabel: 'linkedin',
    },
    common: {
      switchLang: 'ES',
      switchLangAria: 'Switch to Spanish',
      skipToContent: 'Skip to content',
      themeToggleAria: 'Toggle light and dark theme',
      menuToggleAria: 'Open navigation menu',
      search: 'Search',
      searchAria: 'Open search',
      searchPlaceholder: 'Search the site…',
      searchInitial: 'Start typing to search.',
      searchNoResults: 'No results.',
      searchUnavailable: 'Search is unavailable in dev. Try `pnpm build && pnpm preview`.',
      close: 'Close',
    },
    notFound: {
      heading: 'Page not found',
      description: "The URL you're looking for doesn't exist or has moved.",
      backHome: 'Back to home',
    },
  },
};

export type { UIStrings };
