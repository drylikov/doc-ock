import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const GET: RequestHandler = async ({ params, platform }) => {
	const kv = platform?.env.DOC_OCK_KV;
	if (!kv) {
		throw error(500, 'DOC_OCK_KV not available');
	}

	const id = params.id;
	if (!id) {
		throw error(400, 'ID is required');
	}

	const value = await kv.get(id);
	if (!value) {
		throw error(404, 'Document not found');
	}

	return json({
		markdown: value
	});
};

const markdownSchema = z.object({
	markdown: z.string()
});

export const PUT: RequestHandler = async ({ params, platform, request }) => {
	const kv = platform?.env.DOC_OCK_KV;
	if (!kv) {
		throw error(500, 'DOC_OCK_KV not available');
	}

	const id = params.id;
	if (!id) {
		throw error(400, 'ID is required');
	}

	const editCode = request.headers.get('X-Edit-Code');
	if (!editCode) {
		throw error(401, 'Edit code is required');
	}

	const existing = await kv.getWithMetadata<{ editCode: string }>(id);
	if (!existing) {
		throw error(404, 'Document not found');
	}

	if (existing.metadata?.editCode !== editCode) {
		throw error(403, 'Invalid edit code');
	}

	const result = markdownSchema.safeParse(await request.json());
	if (!result.success) {
		throw error(400, 'Invalid markdown content');
	}

	const { markdown } = result.data;
	await kv.put(id, markdown, { metadata: { editCode } });

	return json({
		success: true
	});
};
