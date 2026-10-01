// /llms-full.txt: the header plus every docs page as Markdown, in reading order
import type { APIRoute } from 'astro';
import { LLMS_HEADER, getSectionedDocs, toMarkdown } from '../llms/content';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL('https://stackport.cloud');
	const pages = (await getSectionedDocs()).flatMap((s) => s.entries).map((e) => toMarkdown(e, base));
	return new Response([LLMS_HEADER, ...pages].join('\n\n---\n\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
