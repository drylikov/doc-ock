import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
	const id = params.id;

	if (!id) {
		throw error(400, 'Document ID is required');
	}

	const kv = platform?.env.DOC_OCK_KV;
	if (!kv) {
		throw error(500, 'KV storage not available');
	}

	const result = await kv.get(id);
	if (!result) {
		throw error(404, 'Document not found');
	}

	return {
		markdown: result
	};
};
