/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
/// <reference types="@cloudflare/workers-types" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			runtime: {
				env: {
					DOC_OCK_KV: KVNamespace;
				};
			};
		}
		// interface PageData {}
		interface Platform {
			env: {
				DOC_OCK_KV: KVNamespace;
			};
		}
	}

	namespace NodeJS {
		interface ProcessEnv {
			PUBLIC_DOC_OCK_KV_NAMESPACE: string;
			PUBLIC_PARSER_WORKER_URL: string;
		}
	}
}

export {};
