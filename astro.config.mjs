// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://stackport.cloud',
	integrations: [
		starlight({
			title: 'StackPort',
			logo: {
				src: './public/logo.svg',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/DaviReisVieira/stackport' },
			],
			customCss: ['./src/styles/landing.css'],
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
					label: 'Configuration',
					items: [
						{ label: 'Environment Variables', slug: 'docs/configuration/environment-variables' },
						{ label: 'Docker', slug: 'docs/configuration/docker' },
						{ label: 'Emulators', slug: 'docs/configuration/emulators' },
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
						{ label: 'EC2', slug: 'docs/services/ec2' },
						{ label: 'IAM', slug: 'docs/services/iam' },
						{ label: 'CloudWatch Logs', slug: 'docs/services/cloudwatch-logs' },
						{ label: 'Secrets Manager', slug: 'docs/services/secrets-manager' },
					],
				},
				{
					label: 'CLI',
					items: [
						{ label: 'Commands', slug: 'docs/cli/commands' },
					],
				},
			],
		}),
	],
});
