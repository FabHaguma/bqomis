import React, { useState, useEffect } from 'react';
import TimeBox from './TimeBox'; // Import the TimeBox component
import './styles/TimeSlotBranch.css'; // Import the CSS file for styling
import dataService from '../DataService';

const TimeSlotBranch = () => {

    const [branches, setBranches] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch branches
        dataService.getBranches().then(setBranches);

        // Fetch appointments
        dataService.getAppointments().then(setAppointments);
    }, []);

    // Example data: branches with queue sizes for 8 time slots
    const branchList = [
        {
            name: 'Branch A',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Branch B',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Branch C',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
        {
            name: 'Branch D',
            timeSlots: Array.from({ length: 8 }, () => Math.floor(Math.random() * 31)),
        },
    ];

    return (
        <div className="branch-matrix">
            <div className="table-header">
                <div className="branch-name-header">Branch</div>
                <div className="time-slots-header">Time Slots</div>
            </div>
            {branchList.map((branch, index) => (
                <div key={index} className="branch-row">
                    <div className="branch-name">{branch.name}</div>
                    <div className="time-boxes">
                        {branch.timeSlots.map((queueSize, slotIndex) => (
                            <TimeBox key={slotIndex} queueSize={queueSize} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimeSlotBranch;