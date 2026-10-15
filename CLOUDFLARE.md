# Deploy to Cloudflare

Requires Docker and a Cloudflare Workers Paid plan with Containers enabled.

From the repository root, run:

```sh
npx wrangler login
npx wrangler deploy
```

Wrangler builds the root `Dockerfile` and deploys the Worker and Juice Shop container. The resulting `workers.dev` URL is public; use it only for authorized security training.
