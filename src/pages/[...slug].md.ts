// /docs/<page>.md: a clean Markdown copy of each docs page, next to its HTML page
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, toMarkdown, type DocEntry } from '../llms/content';

export const prerender = true;

export const getStaticPaths = (async () => {
	const entries = await getCollection('docs', (e) => e.id !== 'index' && !e.data.draft);
	return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) =>
	markdownResponse(toMarkdown((props as { entry: DocEntry }).entry, site ?? new URL('https://stackport.cloud')));
