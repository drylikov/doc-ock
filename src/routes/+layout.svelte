<script>
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	let { children } = $props();
</script>

<Toaster />
<main class="container mx-auto p-4">
	{@render children?.()}
</main>
