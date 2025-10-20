


# Doc-Ock



Doc-Ock is a web-to-markdown tool built with SvelteKit that allows you to parse any website into markdown, edit the content, and publish it for easy sharing. The published markdown can be imported into AI editors as context simply by pasting the URL.

## Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Deployment to Cloudflare Pages

1. Push your code to a GitHub/GitLab repository
2. Go to Cloudflare Pages dashboard
3. Select your repository
4. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
5. Click "Deploy"

For more details, refer to [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-site/).
