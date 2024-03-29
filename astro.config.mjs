/** @format */

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import compress from 'compress-astro';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://nia-statistics.com',
	prefetch: true,
	integrations: [
		tailwind(),
		react({
			//experimentalReactChildren: true,
		}),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
		compress(),
		robotsTxt({
			sitemap: ['https://nia-statistics.com/sitemap-index.xml'],
		}),
		sitemap(),
		mdx(),
	],
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
});
