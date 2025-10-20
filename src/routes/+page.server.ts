import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	parse: async ({ request, platform, url }) => {
		const kv = platform?.env.DOC_OCK_KV;
		if (!kv) {
			throw error(500, 'DOC_OCK_KV not available');
		}

		const data = await request.formData();
		const siteUrl = data.get('url')?.toString();
		if (!siteUrl) {
			throw error(400, 'URL is required');
		}

		const parserUrl = new URL(url);
		parserUrl.pathname = '/api/parse';
		const encodedUrl = btoa(siteUrl);
		parserUrl.searchParams.set('url', encodedUrl);

		const response = await fetch(parserUrl.toString());
		if (!response.ok) {
			console.error('Parser error:', await response.text());
			throw error(500, 'Failed to parse URL');
		}

		const markdown = await response.text();
		return {
			markdown
		};
	}
};
