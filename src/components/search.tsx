/** @format */

import { Button, Input, Skeleton } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { VscVerified } from 'react-icons/vsc';
const Search = () => {
	function search(query: any) {
		setErrors([]);
		if (!query) return;
		fetch(`/api/youtube/channels/search/${query.replace(/ /g, '+')}`)
			.then((resp) => resp.json())
			.then((data) => {
				if ((data?.data ?? [])?.length > 0) setResults(data.data);

				if ((data?.data ?? [])?.length == 0)
					setErrors([`Using term '${query}' cant find users.`]);
				if ((data?.data ?? [])?.length == 0) setResults([]);
			})
			.catch((e: any) => {
				setErrors([e.message]);
				setResults([]);
			})
			.finally(() => setSearching(false));
	}
	const [searchTerm, setSearchTerm] = useState('');
	const [searching, setSearching] = useState(false);
	const [results, setResults] = useState([]);
	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		console.log(searchTerm);
		const delayDebounceFn = setTimeout(() => {
			if (searchTerm != '') search(searchTerm);
		}, 500);
		if (searchTerm != '') setSearching(true);
		else setSearching(false);
		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);
	return (
		<>
			<div className='flex gap-2 justify-center items-center'>
				<Input
					onChange={(e) => {
						setSearchTerm(e.target.value);
					}}
					radius={'md'}
					size={'lg'}
					type='text'
					label='Query'
					placeholder='Enter something like... MrBeast'
					defaultValue=''
					className='max-w-[400px]'
				/>
				<Button
					color={'secondary'}
					size={'md'}
					isLoading={false}>
					Search
				</Button>
			</div>
			<div className='text-red-500 font-bold grid gap-1'>
				{errors.map((a: any) => {
					return a;
				})}
			</div>
			<div className='grid gap-1 max-h-96 overflow-y-auto overflow-x-hidden mt-2'>
				{(searching == true ? new Array(10).fill('') : results).map(
					(d: any, idx: number) => {
						const colors = d?.[7] ?? ['#fff'];
						return (
							<a
								style={{
									background: `linear-gradient(to right,${colors
										.slice(0, 1)
										?.join(', ')}, rgba(0,0,0,0.5))`,
									border: 'none',
									borderRadius: '0.5em',
								}}
								key={d?.[0] ?? idx}
								href={d != '' ? `/channels-project/channel/${d?.[0]}` : '#'}
								className='flex justify-start items-center gap-1 text-left bg-transparent'>
								<Skeleton
									isLoaded={searching == false}
									className='rounded-xl min-w-[64px]'>
									<img
										alt={d?.[2] ?? d?.[3] ?? 'Profile Picture'}
										src={d?.[1]?.replace('s48', 's100') ?? '/favicon.ico'}
										height={75}
										width={75}
										className='rounded-xl h-16 w-16'></img>
								</Skeleton>
								<div className='w-full'>
									<Skeleton
										isLoaded={searching == false}
										className='w-full'>
										<div
											style={{
												color: colors[0],
												textShadow:
													'-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
											}}
											className='text-3xl font-bold font-stretch w-full whitespace-nowrap overflow-hidden text-ellipsis'>
											&nbsp;{d?.[2] ?? d?.[3]}&nbsp;
											{d[4] && (
												<VscVerified className='inline-block h-6 w-6 self-center rounded-full bg-black bg-opacity-50' />
											)}
										</div>
									</Skeleton>
									<Skeleton
										isLoaded={searching == false}
										className='w-full'>
										<div className='text-sm opacity-75 w-full'>
											&nbsp;{d?.[3]} •{' '}
											{parseInt(d?.[6])?.toLocaleString('en-US')} subscriber
											{parseInt(d?.[6]) != 1 && 's'}
										</div>
									</Skeleton>
								</div>
							</a>
						);
					},
				)}
			</div>
		</>
	);
};
export default Search;
