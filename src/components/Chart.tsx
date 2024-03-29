/** @format */

import React from 'react';
import {
	HighchartsChart,
	Chart,
	XAxis,
	YAxis,
	Title,
	LineSeries,
	PlotLine,
	Tooltip,
	HighchartsProvider,
} from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
interface DataArr {
	0: number;
	1: number;
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
const CustomChart = ({
	data,
	user,
}: {
	data: DataArr[];
	user: {
		channelId: string;
		title: string;
		thumbnailDetails: ThumbnailDetails;
		metric: Metric;
		timeCreatedSeconds: string;
		isNameVerified: boolean;
		channelHandle: string;
	};
}) => (
	<HighchartsProvider Highcharts={Highcharts}>
		<HighchartsChart plotOptions={{}}>
			<Chart backgroundColor={'transparent'} />

			<Title style={{ color: '#fff' }}>Total Subscribers by Day</Title>
			<Tooltip
				padding={10}
				hideDelay={250}
				shape='rect'
				split
				backgroundColor={'black'}
				style={{ color: 'white' }}
			/>
			<XAxis
				tickColor={'#fff'}
				gridLineColor={'#fff'}
				minorGridLineColor={'#fff'}
				lineColor={'#fff'}
				labels={{ style: { color: '#fff' } }}
				type='datetime'>
				<XAxis.Title style={{ color: '#fff' }}>Day</XAxis.Title>
			</XAxis>
			<YAxis
				id='number'
				tickColor={'#fff'}
				gridLineColor={'#fff'}
				minorGridLineColor={'#fff'}
				lineColor={'#fff'}
				labels={{ style: { color: '#fff' } }}>
				<YAxis.Title style={{ color: '#fff' }}>Subscribers</YAxis.Title>

				<LineSeries
					name={`${user.channelHandle}`}
					id='my-series'
					data={[...data.map((a) => [a[0], a[1]])]} // please end me
				/>
			</YAxis>
		</HighchartsChart>
	</HighchartsProvider>
);

export default CustomChart;
