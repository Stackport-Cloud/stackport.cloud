// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE = 'https://stackport.cloud';
const OG_IMAGE = `${SITE}/images/dashboard.png`;
const OG_IMAGE_ALT = 'The StackPort dashboard listing AWS services with live resource counts';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	integrations: [
		starlight({
			title: 'StackPort',
			description:
				'Open-source web console for local AWS emulators (MiniStack, Floci, LocalStack, Moto) and real AWS accounts. Browse 35 services, with dedicated views for S3, DynamoDB, Lambda, SQS and more.',
			logo: {
				src: './public/logo.svg',
			},
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/DaviReisVieira/stackport' },
			],
			editLink: {
				baseUrl: 'https://github.com/Stackport-Cloud/stackport.cloud/edit/main/',
			},
			customCss: ['./src/styles/landing.css'],
			routeMiddleware: './src/routeData.ts',
			head: [
				{ tag: 'link', attrs: { rel: 'describedby', type: 'text/markdown', href: '/llms.txt', title: 'llms.txt' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: OG_IMAGE } },
				{ tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: OG_IMAGE_ALT } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: OG_IMAGE } },
				{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: OG_IMAGE_ALT } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#0f172a' } },
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'docs/introduction' },
						{ label: 'Installation', slug: 'docs/installation' },
						{ label: 'Quick Start', slug: 'docs/quickstart' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'With MiniStack', slug: 'docs/guides/ministack' },
						{ label: 'With Floci', slug: 'docs/guides/floci' },
						{ label: 'With LocalStack', slug: 'docs/guides/localstack' },
						{ label: 'With Moto', slug: 'docs/guides/moto' },
						{ label: 'Local S3 and DynamoDB', slug: 'docs/guides/local-s3-dynamodb' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Environment Variables', slug: 'docs/configuration/environment-variables' },
						{ label: 'Docker', slug: 'docs/configuration/docker' },
						{ label: 'Emulators', slug: 'docs/configuration/emulators' },
						{ label: 'Multiple Endpoints', slug: 'docs/configuration/endpoints' },
						{ label: 'Real AWS and Read-only', slug: 'docs/configuration/real-aws' },
					],
				},
				{
					label: 'Service Browsers',
					items: [
						{ label: 'Overview', slug: 'docs/services/overview' },
						{ label: 'S3', slug: 'docs/services/s3' },
						{ label: 'DynamoDB', slug: 'docs/services/dynamodb' },
						{ label: 'Lambda', slug: 'docs/services/lambda' },
						{ label: 'SQS', slug: 'docs/services/sqs' },
						{ label: 'SNS', slug: 'docs/services/sns' },
						{ label: 'EC2', slug: 'docs/services/ec2' },
						{ label: 'IAM', slug: 'docs/services/iam' },
						{ label: 'RDS', slug: 'docs/services/rds' },
						{ label: 'KMS', slug: 'docs/services/kms' },
						{ label: 'Step Functions', slug: 'docs/services/step-functions' },
						{ label: 'CloudWatch Logs', slug: 'docs/services/cloudwatch-logs' },
						{ label: 'CloudWatch Metrics', slug: 'docs/services/cloudwatch-metrics' },
						{ label: 'Secrets Manager', slug: 'docs/services/secrets-manager' },
					],
				},
				{
					label: 'Learn',
					items: [{ label: 'Guided lessons', slug: 'docs/learn/guided-lessons' }],
				},
				{
					label: 'CLI',
					items: [{ label: 'Commands', slug: 'docs/cli/commands' }],
				},
			],
		}),
	],
});
