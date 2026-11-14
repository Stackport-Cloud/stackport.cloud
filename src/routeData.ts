// For each docs page: a <link rel="alternate" type="text/markdown"> pointing at the Markdown
// copy produced by src/pages/[...slug].md.ts, and BreadcrumbList structured data. The
// breadcrumb is Home > page: sidebar groups have no page of their own to link to.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	if (route.id === 'index' || route.entry.data.template === 'splash') return;
	route.head.push({
		tag: 'link',
		attrs: { rel: 'alternate', type: 'text/markdown', href: `/${route.id}.md` },
	});

	const site = context.site ?? new URL('https://stackport.cloud');
	route.head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'StackPort', item: new URL('/', site).href },
				{ '@type': 'ListItem', position: 2, name: route.entry.data.title, item: new URL(context.url.pathname, site).href },
			],
		}),
	});
});
