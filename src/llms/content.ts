// Shared data for /llms.txt, /llms-full.txt and the per-page .md files.
// The header text must stay in line with the StackPort README.
import { getCollection, type CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;

export const LLMS_HEADER = `# StackPort

> StackPort is an open-source (MIT) web console for local AWS emulators and real AWS accounts. It connects to MiniStack, Floci, LocalStack, Moto, or any AWS-compatible endpoint over the standard AWS API and lets you browse, inspect, and manage resources across 35 AWS services.

Key facts:

- Install with \`pip install stackport\` (Python 3.10+) and run \`stackport\`, or run the Docker image \`davireis/stackport\`. The UI is served on http://localhost:8080.
- Point it at an emulator with \`AWS_ENDPOINT_URL\`, for example \`AWS_ENDPOINT_URL=http://localhost:4566 stackport\`. When it is unset, StackPort uses real AWS through the standard credential chain. Several endpoints, each with its own region and credentials, can be configured at once.
- StackPort is not an emulator. It does not emulate AWS itself; it is a client that talks to an emulator or to AWS with boto3. Nothing is installed inside the emulator.
- Supported emulators are documented side by side: MiniStack, Floci, LocalStack, Moto. No emulator is preferred. Any other endpoint that speaks the AWS API also works.
- 13 services have dedicated views (S3, DynamoDB, Lambda, SQS, SNS, IAM, EC2, RDS, CloudWatch Logs, CloudWatch metrics and alarms, Secrets Manager, KMS, Step Functions). The remaining services get a generic, searchable resource table.
- Writes (S3 uploads, DynamoDB item edits, SQS messages, SNS publishes, and others) are on by default, including against real AWS. \`STACKPORT_ALLOW_WRITES=false\` turns on read-only mode, in which the server refuses every write (Lambda Invoke stays available).
- Also included: guided lessons that check real resource state, tag editing, JSON/CSV export, and a CLI (\`serve\`, \`status\`, \`list\`, \`describe\`, \`export\`).
- Backend: Python, FastAPI, boto3. Frontend: React with the Cloudscape Design System.
- StackPort is a community project and is not affiliated with Amazon Web Services or with any of the emulator projects.

Every page listed below is plain Markdown. The same page in HTML lives at the same path without \`.md\` and with a trailing slash.`;

/** Sections in reading order. A page goes in the first section whose prefix matches its id. */
export const SECTIONS: Array<{ title: string; match: (id: string) => boolean }> = [
	{ title: 'Getting started', match: (id) => ['docs/introduction', 'docs/installation', 'docs/quickstart'].includes(id) },
	{ title: 'Emulator guides', match: (id) => id.startsWith('docs/guides/') },
	{ title: 'Configuration', match: (id) => id.startsWith('docs/configuration/') },
	{ title: 'Service views', match: (id) => id.startsWith('docs/services/') },
	{ title: 'Guided lessons', match: (id) => id.startsWith('docs/learn/') },
	{ title: 'CLI', match: (id) => id.startsWith('docs/cli/') },
];

export const OPTIONAL_LINKS = [
	'- [GitHub repository](https://github.com/DaviReisVieira/stackport): source code, README, issues, and CONTRIBUTING',
	'- [PyPI package](https://pypi.org/project/stackport/): release history and supported Python versions',
	'- [Docker image](https://hub.docker.com/r/davireis/stackport): the single-container distribution',
];

// Pages listed here come first, in this order; everything else follows alphabetically.
// Emulator pages keep the fixed order from CONTRIBUTING.md#supported-emulators
// (MiniStack, Floci, LocalStack, Moto), so never let them fall back to alphabetical.
const FIXED_ORDER = [
	'docs/introduction',
	'docs/installation',
	'docs/quickstart',
	'docs/guides/ministack',
	'docs/guides/floci',
	'docs/guides/localstack',
	'docs/guides/moto',
	'docs/guides/local-s3-dynamodb',
	// Configuration and service pages follow the sidebar order in astro.config.mjs.
	'docs/configuration/environment-variables',
	'docs/configuration/docker',
	'docs/configuration/emulators',
	'docs/configuration/endpoints',
	'docs/configuration/real-aws',
	'docs/services/overview',
	'docs/services/s3',
	'docs/services/dynamodb',
	'docs/services/lambda',
	'docs/services/sqs',
	'docs/services/sns',
	'docs/services/ec2',
	'docs/services/iam',
	'docs/services/rds',
	'docs/services/kms',
	'docs/services/step-functions',
	'docs/services/cloudwatch-logs',
	'docs/services/cloudwatch-metrics',
	'docs/services/secrets-manager',
];

function sortKey(id: string): string {
	const i = FIXED_ORDER.indexOf(id);
	return i === -1 ? `1-${id}` : `0-${String(i).padStart(3, '0')}`;
}

/** All docs pages except the landing page, grouped by section, in reading order. */
export async function getSectionedDocs(): Promise<Array<{ title: string; entries: DocEntry[] }>> {
	const entries = (await getCollection('docs', (e) => e.id !== 'index' && !e.data.draft)).sort((a, b) =>
		sortKey(a.id).localeCompare(sortKey(b.id)),
	);
	const sections = SECTIONS.map((s) => ({ title: s.title, entries: entries.filter((e) => s.match(e.id)) }));
	const placed = new Set(sections.flatMap((s) => s.entries.map((e) => e.id)));
	const rest = entries.filter((e) => !placed.has(e.id));
	if (rest.length) sections.push({ title: 'Other pages', entries: rest });
	return sections.filter((s) => s.entries.length > 0);
}

/** One page as standalone Markdown. */
export function toMarkdown(entry: DocEntry, site: URL): string {
	const parts = [`# ${entry.data.title}`];
	if (entry.data.description) parts.push(`> ${entry.data.description}`);
	parts.push(`Source: ${new URL(`/${entry.id}/`, site).href}`);
	parts.push((entry.body ?? '').trim());
	return parts.join('\n\n') + '\n';
}

export const markdownResponse = (body: string) =>
	new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
