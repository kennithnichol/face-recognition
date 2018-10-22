import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxes}) => (
	<div className='center ma relative'>
		<div className='absolute mt2'>
			<img id="inputimage" width='500px' height='auto' src={imageUrl} alt='' />
			<div className='bounding-boxes'>
				{boxes.map((box,index) => (
						<div key={`face-${index}`} className='bounding-box' style={{
							top: box.topRow,
							right: box.rightCol,
							bottom: box.bottomRow,
							left: box.leftCol}}>
						</div>
					)
				)}
			</div>
		</div>
	</div>
);

export default FaceRecognition;
