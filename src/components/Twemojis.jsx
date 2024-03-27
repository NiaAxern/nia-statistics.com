/** @format */

import React, { useEffect, useState } from 'react';

const Twemoji = ({ emoji, height, width }) => {
	const [preEmoji, setPremoji] = useState(emoji);
	useEffect(() => {
		const emj = window.twemoji.parse(emoji);
		setPremoji(emj);
		console.log(emj);
	});

	return (
		<span
			style={{ width, height }}
			dangerouslySetInnerHTML={{ __html: preEmoji }}
			className='Twemoji inline-block'></span>
	);
};

export default Twemoji;
