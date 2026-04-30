import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(200),
    pubDate: z.coerce.date(),
    language: z.enum(['es', 'en']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
    translatedTo: z.string().optional(),
    translatedFrom: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    blogPostSlug: z.string().optional(),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
  }),
});

export const collections = { blog, projects };
