<script lang="ts">
	import { page } from '$app/state';
	import { marked } from 'marked';
	import { Button } from '$lib/components/ui/button';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	let markdownContent = $state(data.markdown);
	let error = $state<string | null>(null);

	const id = page.params.id;

	function exportMarkdown() {
		const blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `document-${id}.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<div class="container mx-auto min-h-screen bg-background p-4 dark:bg-background-dark">
	{#if error}
		<div class="alert alert-error rounded-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	<div class="prose max-w-none rounded-lg bg-surface p-6 dark:prose-invert dark:bg-surface-dark">
		{@html marked.parse(markdownContent)}
	</div>

	<div class="mt-4 flex gap-2">
		<Button variant="default" onclick={exportMarkdown}>Export</Button>
		<Button variant="outline" href={`/edit/${id}`}>Edit</Button>
	</div>
</div>
