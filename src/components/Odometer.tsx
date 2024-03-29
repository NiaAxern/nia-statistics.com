/** @format */

import React, { useEffect, useRef, useState } from 'react';
import './Odometer.css';
import { motion } from 'framer-motion';
const Odometer = ({
	count = 0,
	height,
	youtubeChannelID,
	typeToUse = 'subscribers_estimated',
	interval = 2000,
}: {
	count: number;
	height: number | string;
	youtubeChannelID?: string;
	typeToUse?: string;
	interval?: number;
}) => {
	const [counts, setCounts] = useState<any>({
		isNegative: false,
		addCommas: [],
	});
	const [currentCount, setCurrent] = useState(count);
	let numbers = useRef<any>({});
	let oldNumber = useRef<any>(0);
	useEffect(() => {
		// @ts-ignore
		Array.prototype.max = function () {
			return Math.max.apply(null, this);
		};
		// @ts-ignore
		Array.prototype.min = function () {
			return Math.min.apply(null, this);
		};
		var newCounts: any = [];
		var idx: any = -1;
		for (let i of currentCount.toString().split('').reverse()) {
			idx++;
			const c = parseInt(i);
			var newNumber = false;
			if (!numbers.current[idx]) {
				newNumber = true;
				numbers.current[idx] = {
					count: oldNumber.current,
					lastCount: '',
				};
			}
			const lastUpd = numbers.current[idx];
			const difBetweenLast = currentCount - lastUpd.count;
			if (newNumber == true) {
				const getDivision = 10 ** idx;
				var lastSaved = null;
				var news: any = ['‎'];
				const toSkip =
					Math.floor(currentCount / getDivision) -
					Math.floor(lastUpd.count / getDivision);
				var added = 0;
				var addCount = 1;
				var rm = toSkip;
				if (Math.abs(toSkip) >= 50) {
					addCount = toSkip / 50;
				}
				for (
					let calcNumbers = Math.floor(lastUpd.count / getDivision);
					calcNumbers <= Math.floor(currentCount / getDivision);
					calcNumbers += addCount
				) {
					added++;
					const nuNumber = calcNumbers.toString().split('').reverse()[0];
					if (lastSaved != nuNumber) {
						news.push(nuNumber);
						lastSaved = nuNumber;
					}
				}
				if (
					news[news.length - 1] !=
					Math.floor(currentCount / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						...news,
						Math.floor(currentCount / getDivision)
							.toString()
							.split('')
							.reverse()[0],
					];
				newCounts.push(news);
			} else if (difBetweenLast > 0 && c == lastUpd.lastCount) {
				newCounts.push([c]);
			} else if (difBetweenLast < 0 && c == lastUpd.lastCount) {
				newCounts.push([c]);
			} else if (difBetweenLast > 0) {
				const getDivision = 10 ** idx;
				var lastSaved = null;
				var news: any = [];
				const toSkip =
					Math.floor(currentCount / getDivision) -
					Math.floor(lastUpd.count / getDivision);
				var added = 0;
				var addCount = 1;
				var rm = toSkip;
				if (toSkip >= 50) {
					addCount = toSkip / 50;
				}
				for (
					let calcNumbers = Math.floor(lastUpd.count / getDivision);
					calcNumbers <= Math.floor(currentCount / getDivision);
					calcNumbers += addCount
				) {
					added++;
					const nuNumber = Math.floor(calcNumbers)
						.toString()
						.split('')
						.reverse()[0];
					if (lastSaved != nuNumber) {
						news.push(nuNumber);
						lastSaved = nuNumber;
					}
				}
				if (
					news[0] !=
					Math.floor(lastUpd.count / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						Math.floor(lastUpd.count / getDivision)
							.toString()
							.split('')
							.reverse()[0],
						...news,
					];
				if (
					news[news.length - 1] !=
					Math.floor(currentCount / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						...news,
						Math.floor(currentCount / getDivision)
							.toString()
							.split('')
							.reverse()[0],
					];
				newCounts.push(news);
			} else if (difBetweenLast < 0) {
				const getDivision = 10 ** idx;
				var lastSaved = null;
				var news: any = [];
				const toSkip =
					Math.floor(currentCount / getDivision) -
					Math.floor(lastUpd.count / getDivision);
				var added = 0;
				var addCount = 1;
				var rm = toSkip;
				if (toSkip <= -50) {
					addCount = Math.abs(toSkip / 50);
				}
				for (
					let calcNumbers = Math.floor(currentCount / getDivision);
					calcNumbers <= Math.floor(lastUpd.count / getDivision);
					calcNumbers += addCount
				) {
					added++;
					const nuNumber = Math.floor(calcNumbers)
						.toString()
						.split('')
						.reverse()[0];
					if (lastSaved != nuNumber) {
						news.push(nuNumber);
						lastSaved = nuNumber;
					}
				}
				if (
					news[0] !=
					Math.floor(currentCount / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						Math.floor(currentCount / getDivision)
							.toString()
							.split('')
							.reverse()[0],
						...news,
					];
				if (
					news[news.length - 1] !=
					Math.floor(lastUpd.count / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						...news,
						Math.floor(lastUpd.count / getDivision)
							.toString()
							.split('')
							.reverse()[0],
					];
				newCounts.push(news);
			}
			numbers.current[idx] = {
				count: currentCount,
				lastCount: c,
			};
		}
		for (let key in numbers.current) {
			const data = numbers.current[key];
			console.log(data?.count);
			if (data?.count != currentCount && numbers.current?.[key] != null) {
				const getDivision = 10 ** idx;
				var lastSaved = null;
				var news: any = ['‎'];
				const toSkip =
					Math.floor(currentCount / getDivision) -
					Math.floor(data.count / getDivision);
				var added = 0;
				var addCount = 1;
				var rm = toSkip;
				if (Math.abs(toSkip) >= 50) {
					addCount = toSkip / 50;
				}
				for (
					let calcNumbers = Math.floor(data.count / getDivision);
					calcNumbers <= Math.floor(currentCount / getDivision);
					calcNumbers += addCount
				) {
					added++;
					const nuNumber = calcNumbers.toString().split('').reverse()[0];
					if (lastSaved != nuNumber) {
						news.push(nuNumber);
						lastSaved = nuNumber;
					}
				}
				if (
					news[news.length - 1] !=
					Math.floor(currentCount / getDivision)
						.toString()
						.split('')
						.reverse()[0]
				)
					news = [
						...news,
						Math.floor(currentCount / getDivision)
							.toString()
							.split('')
							.reverse()[0],
					];
				news = [...news, ''];
				newCounts.push(news);
				numbers.current[key] = null;
			} else {
				// do nothing, it probably already does something right now!
			}
		}
		var addCommas = [];
		const b = newCounts;
		for (let i = 0; i < b.length; i++) {
			if (i % 3 == 0 && i != 0) {
				addCommas.push([',']);
			}
			addCommas.push(b[i]);
		}
		const dfv = oldNumber.current;
		oldNumber.current = currentCount;
		setCounts({
			isNegative: currentCount - dfv < 0,
			addCommas: addCommas.reverse(),
		});
	}, [currentCount]);
	useEffect(() => {
		const setI = setInterval(() => {
			if (youtubeChannelID != null) {
				fetch('/api/estimations/bigdb/' + youtubeChannelID) // UCeGCG8SYUIgFO13NyOe6reQ // UCX6OQ3DkcsbYNE6H8uQQuVA // UCIPPMRA040LQr5QPyJEbmXA // UCbCmjCuTUZos6Inko4u57UQ
					.then((resp) => resp.json())
					.then((d) => setCurrent(parseInt(d[typeToUse])));
			}
		}, interval);
		return () => clearInterval(setI);
	}, []);
	useEffect(() => {
		if (typeof window != 'undefined')
			(window as Window & typeof globalThis & { increase: any }).increase = (
				count: number,
			) => {
				setCurrent(count);
			};
	}, []);
	return (
		<>
			<div
				style={{ maxHeight: height }}
				className='flex text-clip overflow-y-hidden line-clamp-1 items-start overflow-clip justify-center odometer'
				key={currentCount + '_' + counts.isNegative}>
				{counts.addCommas.map((a: any, idx: number) => {
					const zero = '0%';
					const toLel =
						a.length == 1
							? 0
							: a.length == 2
							? -50 + '%'
							: -((a.length - 1) / a.length) * 100 + '%';
					return (
						<motion.div
							key={idx}
							className='flex flex-col items-start overflow-hidden relative z-10 odometer-container'
							initial={{
								y: counts.isNegative == true ? toLel : zero,
							}}
							//style={{ height: (1 / a.length) * 100 + '%' }}
							animate={{
								y: counts.isNegative == true ? zero : toLel,
							}}
							transition={{
								duration: 2,
								ease: 'easeOut',
							}}>
							{a.map((b: any) => (
								<div className='relative odometer-digit'>{b}</div>
							))}
						</motion.div>
					);
				})}
			</div>
		</>
	);
};

export default Odometer;
