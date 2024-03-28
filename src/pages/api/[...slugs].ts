/** @format */

// pages/api/[...slugs].ts
import { Elysia, t, type ElysiaConfig, type RouteSchema } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

interface streamboard_channel {
	channel_id: string;
	name: string;
	avatar: string;
	points: number;
	getPoint: boolean;
	time: number;
	messages: number;
	lastMessage: number;
	onSystem: number;
	diamonds: number;
	xp: number;
	stars: number;
	coins: number;
	lastXP: number;
	level: number;
	getCoin: boolean;
	getDiamonds: boolean;
	getStar: boolean;
}

const app = new Elysia({ prefix: '/api' })
	.use(cors())
	.use(swagger())
	.onError(({ code, error, set }) => {
		if (code === 'NOT_FOUND') {
			set.status = 404;

			return 'Not Found :(';
		}
	})
	.get('/', () => 'hi')
	.get(
		'/estimations/get/:id',
		async ({
			params,
			set,
		}: {
			params: { id: string };
			set: { status: number };
		}) => {
			if (params.id.startsWith('UC') == false) {
				set.status = 400;
				return {
					success: false,
					error: "params.id.startsWith('UC') == false",
				};
			} else if (params.id.length != 24) {
				set.status = 400;
				return {
					success: false,
					error: 'params.id.length != 24',
				};
			}
			const getEstimationData = await fetch(
				'http://localhost:80/api/get?platform=youtube&type=channel&id=' +
					params.id,
			)
				.then((resp) => resp.json())
				.catch(console.error);
			if (!getEstimationData) {
				set.status = 500;
				return {
					success: false,
					error: 'getEstimationData is undefined',
				};
			} else if (!getEstimationData?.snippet) {
				set.status = 500;
				return {
					success: false,
					error: 'getEstimationData.snippet is undefined',
				};
			} else {
				set.status = 200;
				return {
					success: true,
					...(getEstimationData?.snippet ?? {}),
					subscribers_api: getEstimationData?.apiSubCount,
					videos_api: getEstimationData?.apiVideoCount,
					views_api: getEstimationData?.apiViewCount,
					subscribers_estimated: getEstimationData?.estSubCount,
					views_estimated: getEstimationData?.estViewCount,
				};
			}
		},
	)
	.get('/mrbeastsubcount', async ({ set }: { set: { status: number } }) => {
		const get = await fetch('http://localhost:3844/')
			.then((resp) => resp.json())
			.catch(console.error);
		if (!get) {
			set.status = 500;
			return {
				success: false,
				error: 'get is undefined',
			};
		} else if ((get ?? []).length == 0) {
			set.status = 500;
			return {
				success: false,
				error: '(get ?? []).length == 0',
			};
		} else {
			set.status = 200;
			return {
				success: true,
				data: get,
			};
		}
	})
	.get(
		'/streamboard',
		async ({
			query,
			set,
		}: {
			query: {
				maxResults: string | number;
				page: string | number;
				orderBy?:
					| 'coins'
					| 'diamonds'
					| 'level'
					| 'messages'
					| 'points'
					| 'stars'
					| 'time'
					| 'xp'
					| 'lastMessage'
					| 'lastXP'
					| 'onSystem';
				sortType?: 'asc' | 'desc';
				channels: string[];
			};
			set: { status: number };
		}) => {
			let get: streamboard_channel[] = await fetch('http://localhost:5632/list')
				.then((resp) => resp.json())
				.catch(console.error);
			if (!get) {
				set.status = 500;
				return {
					success: false,
					error: 'get is undefined',
				};
			} else if ((get ?? []).length == 0) {
				set.status = 500;
				return {
					success: false,
					error: '(get ?? []).length == 0',
				};
			} else {
				if (query?.channels != null)
					get.filter(
						(channel) => query.channels.indexOf(channel.channel_id) != -1,
					);

				if (typeof query?.orderBy == 'string') {
					const key: keyof streamboard_channel = query.orderBy;
					get.sort((a, b) => b[key] - a[key]);
				}
				if (query.sortType == 'asc') get.reverse();
				set.status = 200;
				console.log(query.maxResults);
				query.maxResults = parseInt(`${query?.maxResults}`);
				query.page = parseInt(`${query?.page}`);
				const page = (query?.page ?? 0) * (query?.maxResults ?? 50);
				return {
					success: true,
					page: {
						firstNumber: page,
						lastNumber: page + (query?.maxResults ?? 50),
						nextPage: (query?.page ?? 0) + 1,
						currentPage: query?.page ?? 0,
					},
					data: get.slice(page, page + (query?.maxResults ?? 50)),
				};
			}
		},
		{
			query: t.Partial(
				t.Object({
					maxResults: t.Union([
						t.String({
							minimum: 1,
							maxLength: 2,
						}),
						t.Literal('100'),
					]),
					page: t.String(),
					orderBy: t.Union([
						t.Literal('coins'),
						t.Literal('diamonds'),
						t.Literal('level'),
						t.Literal('messages'),
						t.Literal('points'),
						t.Literal('stars'),
						t.Literal('time'),
						t.Literal('xp'),
						t.Literal('lastMessage'),
						t.Literal('lastXP'),
						t.Literal('onSystem'),
					]),
					sortType: t.Union([t.Literal('asc'), t.Literal('desc')]),
					channels: t.Array(t.String(), {
						minItems: 1,
						maxItems: 50,
					}),
				}),
			),
		},
	);

const handle = ({ request }: { request: Request }) => app.handle(request);

export const GET = handle;
export const POST = handle;
