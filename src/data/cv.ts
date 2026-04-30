import type { Locale } from '../i18n/config';

export type Bilingual = Record<Locale, string>;

export type CVExperience = {
  company: string;
  role: string;
  /** ISO 'YYYY-MM' */
  start: string;
  /** ISO 'YYYY-MM' or null when ongoing. */
  end: string | null;
  location?: string;
  highlights: Bilingual[];
};

export type CVEducation = {
  institution: string;
  degree: Bilingual;
  start: string;
  end: string;
  location?: string;
};

export type CVCertification = {
  name: string;
  issuer: string;
  /** ISO 'YYYY-MM' */
  date: string;
  url?: string;
};

export type CVSkillGroup = {
  category: Bilingual;
  items: string[];
};

export type CV = {
  summary: Bilingual;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkillGroup[];
  certifications: CVCertification[];
};

export const cv: CV = {
  summary: {
    es: 'Senior Software Engineer con foco en backend y AWS serverless. Actualmente transicionando hacia Security Architect, con énfasis en cloud security e identity.',
    en: 'Senior Software Engineer focused on backend and AWS serverless. Currently transitioning to Security Architect with emphasis on cloud security and identity.',
  },
  experience: [
    {
      company: 'Empresa Actual (placeholder)',
      role: 'Senior Software Engineer',
      start: '2022-01',
      end: null,
      highlights: [
        {
          es: 'Diseño y operación de servicios serverless en AWS (Lambda, EventBridge, DynamoDB).',
          en: 'Design and operation of serverless services on AWS (Lambda, EventBridge, DynamoDB).',
        },
        {
          es: 'Liderazgo técnico de iniciativas event-driven a escala.',
          en: 'Technical leadership of event-driven initiatives at scale.',
        },
      ],
    },
  ],
  education: [
    {
      institution: 'Universidad (placeholder)',
      degree: { es: 'Ingeniería en Sistemas', en: 'Systems Engineering' },
      start: '2010',
      end: '2015',
    },
  ],
  skills: [
    {
      category: { es: 'Cloud', en: 'Cloud' },
      items: ['AWS Lambda', 'EventBridge', 'DynamoDB', 'API Gateway', 'IAM', 'CDK'],
    },
    {
      category: { es: 'Lenguajes', en: 'Languages' },
      items: ['TypeScript', 'Python', 'Go'],
    },
    {
      category: { es: 'Arquitectura', en: 'Architecture' },
      items: ['Event-driven', 'Hexagonal', 'Serverless', 'Microservices'],
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect — Professional',
      issuer: 'Amazon Web Services',
      date: '2024-06',
    },
  ],
};
