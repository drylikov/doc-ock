import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

interface DocumentMetadata {
	editCode?: string;
}

export const load: PageServerLoad = async ({ params, platform, url }) => {
	const id = params.id;
	const editCode = url.searchParams.get('editCode');

	if (!id) {
		throw error(400, 'Document ID is required');
	}

	const kv = platform?.env.DOC_OCK_KV;
	if (!kv) {
		throw error(500, 'KV storage not available');
	}

	const result = await kv.getWithMetadata<DocumentMetadata>(id);
	if (!result?.value) {
		throw error(404, 'Document not found');
	}

	// Verify edit code if provided
	if (editCode && result.metadata?.editCode !== editCode) {
		throw error(403, 'Invalid edit code');
	}

	return {
		id,
		markdownContent: result.value,
		requiresEditCode: !editCode
	};
};
