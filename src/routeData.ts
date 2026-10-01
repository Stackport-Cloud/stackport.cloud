// Adds <link rel="alternate" type="text/markdown"> to each docs page, pointing at the
// Markdown copy produced by src/pages/[...slug].md.ts.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	if (route.id === 'index' || route.entry.data.template === 'splash') return;
	route.head.push({
		tag: 'link',
		attrs: { rel: 'alternate', type: 'text/markdown', href: `/${route.id}.md` },
	});
});
