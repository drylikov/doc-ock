<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Textarea } from '$lib/components/ui/textarea';
	import { LoaderCircle, TriangleAlert } from 'lucide-svelte';
	import { marked } from 'marked';
	import MarkdownHowto from '../markdown-howto/markdown-howto.svelte';

	interface EditorProps {
		markdownContent: string;
		isPublishing: boolean;
		handleNavigateBack: () => void;
		handlePublish: () => void;
		handleExport: () => void;
	}

	let {
		markdownContent = $bindable(),
		isPublishing,
		handleNavigateBack,
		handlePublish,
		handleExport
	}: EditorProps = $props();
</script>

<div class="flex h-[calc(100vh-8rem)] flex-col space-y-4">
	<div>
		<Button variant="outline" onclick={handleNavigateBack}>Back</Button>
	</div>
	<Tabs.Root value="text" class="flex h-full flex-col">
		<Tabs.List class="rounded-b-none border-b-0 bg-muted/50">
			<Tabs.Trigger value="text">Text</Tabs.Trigger>
			<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
			<Tabs.Trigger value="how">How</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="text" class="mt-0 flex-1">
			<Textarea
				bind:value={markdownContent}
				class="h-full resize-none rounded-t-none border-t-0 bg-background [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
			/>
		</Tabs.Content>
		<Tabs.Content
			value="preview"
			class="h-full max-h-[calc(100vh-14rem)] overflow-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
		>
			<div class="prose h-full max-w-none p-4 dark:prose-invert">
				{@html marked.parse(markdownContent)}
			</div>
		</Tabs.Content>
		<Tabs.Content
			value="how"
			class="h-full max-h-[calc(100vh-14rem)] overflow-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2"
		>
			<MarkdownHowto />
		</Tabs.Content>
	</Tabs.Root>

	<div class="flex gap-4">
		<Button variant="default" onclick={handlePublish} disabled={isPublishing}>
			{#if isPublishing}
				<LoaderCircle class="mr-2 animate-spin" />
				Publishing...
			{:else}
				Publish
			{/if}
		</Button>
		<Button variant="outline" onclick={handleExport}>Export</Button>
	</div>
</div>
