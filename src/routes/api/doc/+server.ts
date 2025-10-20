import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const markdownSchema = z.object({
	markdown: z.string()
});

export const POST: RequestHandler = async ({ platform, request }) => {
	const kv = platform?.env.DOC_OCK_KV;
	if (!kv) {
		throw error(500, 'DOC_OCK_KV not available');
	}

	const result = markdownSchema.safeParse(await request.json());
	if (!result.success) {
		throw error(400, 'Invalid markdown content');
	}

	const { markdown } = result.data;
	const id = crypto.randomUUID();
	const editCode = crypto.randomUUID();

	await kv.put(id, markdown, { metadata: { editCode } });

	return json({
		success: true,
		documentId: id,
		editCode
	});
};
