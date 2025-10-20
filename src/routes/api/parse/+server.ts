import { error } from '@sveltejs/kit';
import * as cheerio from 'cheerio';
import htmlToMd from 'html-to-md';

export async function GET({ url }) {
	const encodedUrl = url.searchParams.get('url');
	if (!encodedUrl) {
		throw error(400, 'URL parameter is required');
	}

	try {
		const siteUrl = atob(encodedUrl);
		const response = await fetch(siteUrl);
		if (!response.ok) {
			throw error(500, `Failed to fetch URL: ${siteUrl} ${response.statusText}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);
		const markdown = htmlToMd($('body').html() || '');

		return new Response(markdown, {
			headers: {
				'Content-Type': 'text/markdown'
			}
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Unknown error occurred';
		throw error(500, `Failed to parse URL: ${message}`);
	}
}
