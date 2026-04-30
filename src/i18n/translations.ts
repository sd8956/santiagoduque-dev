import type { Locale } from './config';

type UIStrings = {
  nav: {
    home: string;
    blog: string;
    about: string;
    projects: string;
  };
  footer: {
    copyright: string;
    builtWith: string;
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
  };
  common: {
    switchLang: string;
    switchLangAria: string;
    skipToContent: string;
  };
};

export const translations: Record<Locale, UIStrings> = {
  es: {
    nav: {
      home: 'Inicio',
      blog: 'Blog',
      about: 'Sobre mí',
      projects: 'Proyectos',
    },
    footer: {
      copyright: '© {year} Santiago Duque',
      builtWith: 'Construido con Astro y TailwindCSS',
    },
    home: {
      heroIntro: 'Hola, soy',
      heroRoleNow: 'Senior Software Engineer',
      heroRoleNext: 'transicionando a Security Architect',
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
    },
    common: {
      switchLang: 'EN',
      switchLangAria: 'Cambiar a inglés',
      skipToContent: 'Saltar al contenido',
    },
  },
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
      projects: 'Projects',
    },
    footer: {
      copyright: '© {year} Santiago Duque',
      builtWith: 'Built with Astro and TailwindCSS',
    },
    home: {
      heroIntro: "I'm",
      heroRoleNow: 'Senior Software Engineer',
      heroRoleNext: 'transitioning to Security Architect',
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
    },
    common: {
      switchLang: 'ES',
      switchLangAria: 'Switch to Spanish',
      skipToContent: 'Skip to content',
    },
  },
};

export type { UIStrings };
