# Cloudflare deployment

This deploys Juice Shop as a public Worker backed by a Cloudflare Container. It is not a Cloudflare Pages or Expo build.

Requirements: Docker running locally and a Cloudflare Workers Paid plan with Containers enabled.

From the repository root:

```sh
npx wrangler login
npx wrangler deploy
```

Use the resulting `workers.dev` URL as the unauthenticated pentest target. Stop or delete the Worker when testing is done.
