// /llms.txt: header, then one Markdown link per docs page (https://llmstxt.org/)
import type { APIRoute } from 'astro';
import { LLMS_HEADER, OPTIONAL_LINKS, getSectionedDocs } from '../llms/content';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL('https://stackport.cloud');
	const out = [LLMS_HEADER];
	out.push(
		[
			'## Full documentation',
			'',
			`- [llms-full.txt](${new URL('/llms-full.txt', base).href}): every page below in one Markdown file`,
		].join('\n'),
	);
	for (const section of await getSectionedDocs()) {
		const lines = section.entries.map((e) => {
			const url = new URL(`/${e.id}.md`, base).href;
			return `- [${e.data.title}](${url})${e.data.description ? `: ${e.data.description}` : ''}`;
		});
		out.push([`## ${section.title}`, '', ...lines].join('\n'));
	}
	out.push(['## Optional', '', ...OPTIONAL_LINKS].join('\n'));
	return new Response(out.join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
