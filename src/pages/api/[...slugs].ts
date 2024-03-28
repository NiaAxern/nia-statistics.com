/** @format */

// pages/api/[...slugs].ts
import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

const app = new Elysia({ prefix: '/api' })
	.use(cors())
	.use(swagger())
	.get('/', () => 'hi')
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
		}),
	});

const handle = ({ request }: { request: Request }) => app.handle(request);

export const GET = handle;
export const POST = handle;
