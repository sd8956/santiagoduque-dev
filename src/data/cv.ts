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
    es: 'Tech Lead con 5+ años construyendo sistemas cloud a escala. Especializado en AWS serverless y arquitecturas event-driven. Actualmente lidero un equipo técnico en Bold (fintech colombiano). Foco en sistemas mission-critical, seguridad y developer experience.',
    en: 'Tech Lead with 5+ years building scalable cloud systems. Specialized in AWS serverless and event-driven architectures. Currently leading a technical team at Bold (Colombian fintech). Focus on mission-critical systems, security, and developer experience.',
  },
  experience: [
    {
      company: 'Bold',
      role: 'Tech Lead & Senior Software Engineer',
      start: '2026-01',
      end: null,
      location: 'Remote, Colombia',
      highlights: [
        {
          es: 'Lideré la entrega de una feature crítica de Merchant Cash Advance en 2 meses con cero defectos al lanzamiento, diseñando reconciliación de balances intra-day con backup recovery y optimizando escrituras de DB para operaciones de cierre.',
          en: 'Led delivery of a critical merchant cash advance feature in 2 months with zero launch defects, designing intra-day balance reconciliation with backup recovery and optimizing database writes for closing operations.',
        },
        {
          es: 'Dirijo decisiones técnicas y arquitectónicas para el producto de Merchant Cash Advance.',
          en: 'Lead technical direction and architectural decisions for the merchant cash advance product.',
        },
        {
          es: 'Defino el roadmap técnico junto con producto y represento ingeniería en discusiones estratégicas cross-funcionales.',
          en: 'Define technical roadmap in collaboration with product and represent engineering in cross-functional strategic discussions.',
        },
        {
          es: 'Mentoreo a engineers en design reviews y 1:1s, y establezco coding standards y prácticas de ingeniería para el equipo.',
          en: 'Mentor engineers through design reviews and 1:1s, and establish coding standards and engineering best practices for the team.',
        },
      ],
    },
    {
      company: 'Bold',
      role: 'Senior Software Engineer',
      start: '2020-09',
      end: '2026-01',
      location: 'Remote, Colombia',
      highlights: [
        {
          es: 'Diseñé y lideré el desarrollo del producto de crédito desde cero aplicando Domain-Driven Design; integré 3 servicios third-party para credit scoring, KYC y procesamiento de pagos.',
          en: 'Designed and led development of the credit product from scratch applying Domain-Driven Design; integrated 3 third-party services for credit scoring, KYC, and payment processing.',
        },
        {
          es: 'Reduje errores de reportería regulatoria en 99% diseñando una pipeline ETL robusta con validación de datos multi-capa, asegurando precisión de compliance y reduciendo overhead de revisión manual.',
          en: 'Reduced regulatory reporting errors by 99% by designing a robust ETL pipeline with multi-layer data validation, ensuring compliance accuracy and reducing manual review overhead.',
        },
        {
          es: 'Reduje errores recurrentes en producción en 60% mediante análisis sistemático de logs y remediación de root cause, recortando alertas operacionales en 80% y mejorando la confiabilidad del sistema.',
          en: 'Reduced recurrent production errors by 60% through systematic log analysis and root cause remediation, cutting operational alerts by 80% and improving system reliability.',
        },
        {
          es: 'Logré una reducción del 20% en el gasto mensual de AWS profilando y aplicando right-sizing de configuraciones de memoria en una flota grande de Lambdas, y dando de baja workloads ociosos en dev/staging.',
          en: 'Drove 20% reduction in monthly AWS spend by profiling and right-sizing memory configurations across a large Lambda fleet, and decommissioning idle workloads in dev/staging environments.',
        },
        {
          es: 'Lideré el rediseño del flujo de onboarding, reduciendo el tiempo de registro en 30% mediante simplificación de procesos.',
          en: 'Led onboarding flow redesign, reducing registration time by 30% through process simplification.',
        },
      ],
    },
    {
      company: 'SysCafe Colombia',
      role: 'Software Engineer',
      start: '2019-12',
      end: '2020-06',
      location: 'Colombia',
      highlights: [
        {
          es: 'Desarrollo backend con C# y SQL Server; modernicé componentes legacy y optimicé queries de base de datos para mejor performance.',
          en: 'Backend development with C# and SQL Server; modernized legacy components and optimized database queries for improved performance.',
        },
      ],
    },
  ],
  education: [
    {
      institution: 'UNIR — Universidad Internacional de La Rioja',
      degree: {
        es: 'Ingeniería Informática — esperado diciembre 2026',
        en: 'Systems Engineering — expected December 2026',
      },
      start: '2022',
      end: '2026',
    },
    {
      institution: 'Platzi',
      degree: { es: 'Platzi Master Program', en: 'Platzi Master Program' },
      start: '2020',
      end: '2022',
    },
    {
      institution: 'SENA',
      degree: {
        es: 'Tecnólogo en Análisis y Desarrollo de Sistemas de Información',
        en: 'Technologist in Information Systems Analysis and Development',
      },
      start: '2018',
      end: '2020',
    },
  ],
  skills: [
    {
      category: { es: 'Cloud & Infraestructura', en: 'Cloud & Infrastructure' },
      items: [
        'AWS Lambda',
        'AWS ECS',
        'DynamoDB',
        'API Gateway',
        'CloudWatch',
        'Athena',
        'Step Functions',
        'AWS CDK',
        'Terraform',
      ],
    },
    {
      category: { es: 'Lenguajes', en: 'Languages' },
      items: ['Python (expert)', 'TypeScript', 'C#', 'SQL'],
    },
    {
      category: { es: 'Arquitectura', en: 'Architecture' },
      items: ['Serverless', 'Event-Driven', 'Domain-Driven Design (DDD)', 'Microservices', 'CQRS'],
    },
    {
      category: { es: 'Prácticas', en: 'Practices' },
      items: [
        'Infrastructure as Code',
        'CI/CD',
        'Technical Mentoring',
        'Design Reviews',
        'Technical Decision Making',
      ],
    },
    {
      category: { es: 'Bases de datos', en: 'Databases' },
      items: ['DynamoDB', 'SQL Server', 'PostgreSQL'],
    },
    {
      category: { es: 'Herramientas', en: 'Tools' },
      items: ['Grafana', 'CloudWatch', 'Git', 'Linux'],
    },
  ],
  certifications: [
    {
      name: 'AWS Solutions Architect Professional — in progress',
      issuer: 'Amazon Web Services',
      date: '2026-06',
    },
  ],
};
