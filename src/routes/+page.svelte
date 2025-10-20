<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle, TriangleAlert, Copy, CloudDownload } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionResult } from '@sveltejs/kit';
	import Editor from '../lib/components/editor/editor.svelte';
	import { toast } from 'svelte-sonner';

	let currentView = $state<'view1' | 'view2' | 'view3'>('view1');
	let url = $state('');
	let loading = $state(false);
	let isPublishing = $state(false);
	let editCode = $state<string | null>(null);
	let documentId = $state<string | null>(null);
	let markdownContent = $state('');

	interface PublishResponse {
		success: boolean;
		documentId: string;
		editCode: string;
	}

	const submit = () => {
		loading = true;
		return async ({ result }: { result: ActionResult }) => {
			loading = false;
			if (result.type === 'success') {
				markdownContent = result.data?.markdown || '';
				currentView = 'view2';
			} else if (result.type === 'error') {
				toast.error('Failed to parse URL');
			}
		};
	};

	function handleNavigateBack() {
		currentView = 'view1';
		url = '';
		markdownContent = '';
	}

	async function handlePublish() {
		isPublishing = true;
		const response = await fetch('/api/doc', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ markdown: markdownContent })
		});

		if (response.ok) {
			const data = (await response.json()) as PublishResponse;
			editCode = data.editCode;
			documentId = data.documentId;
			currentView = 'view3';
		} else {
			toast.error('Failed to publish document');
		}
		isPublishing = false;
	}

	function handleExport() {
		const blob = new Blob([markdownContent], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `document.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	async function copyToClipboard(text: string, message: string): Promise<void> {
		await navigator.clipboard.writeText(text);
		toast.success(message);
	}

	function getDocumentUrl(): string {
		if (!documentId) return '';
		return `${window.location.origin}/view/${documentId}`;
	}
</script>

<main class="container mx-auto max-w-3xl p-8">
	{#if currentView === 'view1'}
		<div class="mb-8 flex items-center justify-center gap-4">
			<h1
				class="text-5xl font-bold text-primary"
				style="font-family: 'Inter Variable', sans-serif;"
			>
				Doc Ock
			</h1>
			<CloudDownload class="h-10 w-10" />
		</div>
		<p class="mb-8 text-lg text-muted-foreground text-center">Convert any webpage to a clean markdown</p>

		<form method="POST" action="?/parse" use:enhance={submit} class="flex flex-col gap-6 items-center">
			<div class="w-full">
				<Label for="url">Enter URL</Label>
				<div class="flex gap-4">
					<Input
						type="url"
						id="url"
						name="url"
						bind:value={url}
						placeholder="https://www.example.com"
						required
					/>
					<Button type="submit" disabled={loading}>
					{#if loading}
						<LoaderCircle class="mr-2 animate-spin" />
						Parsing...
					{:else}
						Parse
					{/if}
				</Button>
				</div>
			</div>
		</form>
	{:else if currentView === 'view2'}
		<Editor
			bind:markdownContent
			{isPublishing}
			{handleNavigateBack}
			{handlePublish}
			{handleExport}
		/>
	{:else if currentView === 'view3'}
		{@const documentUrl = getDocumentUrl()}
		<div class="mt-8 space-y-6">
			<div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
				<h2 class="mb-4 text-xl font-semibold">Document Published Successfully! 🎉</h2>

				<div class="space-y-4">
					<div>
						<Label class="mb-2 block">Document URL</Label>
						<div class="flex items-center gap-2">
							<Input value={documentUrl} readonly />
							<Button
								variant="outline"
								size="icon"
								onclick={() => copyToClipboard(documentUrl, 'URL copied to clipboard!')}
							>
								<Copy class="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div>
						<Label class="mb-2 block">Edit Code</Label>
						<div class="flex items-center gap-2">
							<Input value={editCode} readonly />
							<Button
								variant="outline"
								size="icon"
								onclick={() => copyToClipboard(editCode || '', 'Edit code copied to clipboard!')}
							>
								<Copy class="h-4 w-4" />
							</Button>
						</div>
						<p class="mt-1 text-sm text-muted-foreground">
							Save this code to edit your document in the future
						</p>
					</div>

					<div class="flex gap-3 pt-2">
						<Button variant="default" href={`/view/${documentId}`}>View Document</Button>
						<Button variant="outline" onclick={handleExport}>
							<CloudDownload class="mr-2 h-4 w-4" />
							Export
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
