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

export interface search_channel {
	channelId: string;
	title: string;
	thumbnailDetails: ThumbnailDetails;
	metric: Metric;
	timeCreatedSeconds: string;
	isNameVerified: boolean;
	channelHandle: string;
}

export interface Metric {
	subscriberCount: string;
	videoCount: string;
	totalVideoViewCount: string;
}

export interface ThumbnailDetails {
	thumbnails: Thumbnail[];
}

export interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

import client from 'https';

import fs from 'fs';
function downloadImage(url: string, filepath: string) {
	return new Promise((resolve, reject) => {
		client.get(url, (res) => {
			if (res.statusCode === 200) {
				res
					.pipe(fs.createWriteStream(filepath))
					//.on('error', reject)
					.once('close', () => resolve(filepath));
			} else {
				console.log('not found!', res.statusCode, url, filepath);
				// Consume response data to free up memory
				res.resume();
				reject(
					new Error(`Request Failed With a Status Code: ${res.statusCode}`),
				);
			}
		});
	});
}
import { topColoursHex } from '@colour-extractor/colour-extractor';

function getBrightestColors(colorArray: string[]) {
	var brighests: any = [];
	let brightestColor = null;

	let maxBrightness = Number.NEGATIVE_INFINITY;

	for (const color of colorArray) {
		// Remove "#" if present
		const hexColor = color.startsWith('#') ? color.slice(1) : color;

		// Convert hex color to integer
		const num = parseInt(hexColor, 16);

		// Calculate brightness (sum of RGB values)
		const r = (num >> 16) & 0xff;
		const g = (num >> 8) & 0xff;
		const b = num & 0xff;
		const brightness = r + g + b;

		// Update brightest color if current brightness is higher
		brighests.push([brightness, color]);
	}

	return brighests.sort((a: any, b: any) => b[0] - a[0]);
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
		'/youtube/channels/search/:query',
		async ({
			params,
			set,
		}: {
			params: { query: string };
			set: { status: number };
		}) => {
			const get: search_channel[] = await fetch(
				'https://youtubecrap.nia-statistics.com/studio/searchchannel/' +
					params.query +
					'/10',
			)
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
				var themes: any = {};
				for await (let channel of get) {
					var spesID = Date.now();
					try {
						if (channel?.thumbnailDetails?.thumbnails?.[0]?.url) {
							await downloadImage(
								channel?.thumbnailDetails?.thumbnails?.[0]?.url,
								spesID + '_' + channel.channelId + 'make_userpfp.jpg',
							).catch(console.error);
							const getColor: any = await topColoursHex(
								spesID + '_' + channel.channelId + 'make_userpfp.jpg',
							);
							themes[channel.channelId] = getBrightestColors(getColor).map(
								(a: any) => a[1],
							);
						}
					} catch (e) {
						console.error(e);
					} finally {
						try {
							await fs.promises.unlink(
								spesID + '_' + channel.channelId + 'make_userpfp.jpg',
							);
						} catch (e) {
							console.error(e);
						}
					}
				}
				return {
					success: true,
					data: get.map((channel) => {
						return [
							channel.channelId,
							channel.thumbnailDetails.thumbnails[0].url,
							channel.title,
							channel.channelHandle,
							channel.isNameVerified,
							new Date(
								parseInt(channel.timeCreatedSeconds) * 1000,
							).toISOString(),
							channel.metric.subscriberCount,
							themes?.[channel.channelId],
						];
					}),
				};
			}
		},
	)
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
