import { DurableObject } from "cloudflare:workers";

interface Env {
	JUICE_SHOP: DurableObjectNamespace<JuiceShop>;
}

export class JuiceShop extends DurableObject<Env> {
	private starting: Promise<void> | undefined;

	async fetch(request: Request): Promise<Response> {
		this.starting ??= this.startAndWaitForPort().finally(() => {
			this.starting = undefined;
		});
		await this.starting;

		const url = new URL(request.url);
		url.protocol = "http:";
		url.host = "container";
		const forwarded = new Request(url, request);
		forwarded.headers.delete("host");
		return this.ctx.container!.getTcpPort(3000).fetch(forwarded);
	}

	private async startAndWaitForPort(): Promise<void> {
		const container = this.ctx.container!;
		if (!container.running) {
			container.start({
				image: container.images.app,
				instance: "lite",
			});
		}

		const port = container.getTcpPort(3000);
		let lastError: unknown;
		for (let attempt = 0; attempt < 100; attempt++) {
			try {
				const response = await port.fetch("http://container/", {
					signal: AbortSignal.timeout(1000),
				});
				await response.body?.cancel();
				if (response.status < 500) return;
				throw new Error(`Juice Shop returned ${response.status} during startup`);
			} catch (error) {
				lastError = error;
				await scheduler.wait(250);
			}
		}
		throw new Error("Juice Shop container did not become ready", { cause: lastError });
	}
}

export default {
	fetch(request: Request, env: Env): Promise<Response> {
		return env.JUICE_SHOP.getByName("juice-shop").fetch(request);
	},
} satisfies ExportedHandler<Env>;
