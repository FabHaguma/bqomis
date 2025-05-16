import React from 'react';
import './HourChunkStatus.scss';

const HourChunkStatus = ({ hourlyStatus }) => {
  // hourlyStatus is an array of 9 colors ('green', 'yellow', 'red')
  // representing 8am, 9am, ..., 4pm

  const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'];

  if (!hourlyStatus || hourlyStatus.length !== 9) {
    // return <p>Traffic data unavailable.</p>; // Or some placeholder
    return null; // Or a more subtle indicator
  }

  return (
    <div className="hour-chunk-status-container">
      <p className="status-label">Today's Estimated Traffic (8am - 5pm):</p>
      <div className="chunks-wrapper">
        {hourlyStatus.map((status, index) => (
          <div key={index} className="hour-chunk-item" title={hours[index]}>
            <div className={`chunk-bar chunk-${status}`}></div>
            <span className="chunk-hour-label">{hours[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourChunkStatus;