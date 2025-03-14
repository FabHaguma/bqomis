import React from 'react';
import TimeBox from './TimeBox'; // Import the TimeBox component
import './TimeSlotService.css'; // Import the CSS file for styling

const TimeSlotService = () => {
    // Example data: services with queue sizes for 8 time slots
    const services = [
        {
            name: 'Withdraw',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Deposit',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Check Book',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Foreign Currency',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Loan Application',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
    ];

    return (
        <div className="service-queue-matrix">
            <div className="table-header">
                <div className="service-name-header">Service</div>
                <div className="time-slots-header">Time Slots</div>
            </div>
            {services.map((service, index) => (
                <div key={index} className="service-row">
                    <div className="service-name">{service.name}</div>
                    <div className="time-boxes">
                        {service.timeSlots.map((queueSize, slotIndex) => (
                            <TimeBox key={slotIndex} queueSize={queueSize} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimeSlotService;