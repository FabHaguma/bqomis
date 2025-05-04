import React from 'react';
import './styles/TimeBox.css'; // Import the CSS file for styling

const TimeBox = ({ queueSize }) => {
    // Determine the color class based on the queue size
    const getColorClass = (size) => {
        if (size <= 5) return 'light'; // Light color for small queues
        if (size <= 15) return 'mid';  // Medium color for moderate queues
        return 'high';                // Dark color for large queues
    };

    const colorClass = getColorClass(queueSize);

    return (
        <button className={`time-box ${colorClass}`}>
            {queueSize}
        </button>
    );
};

export default TimeBox;