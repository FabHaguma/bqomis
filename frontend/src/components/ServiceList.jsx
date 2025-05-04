import React, { useEffect, useState } from 'react';
import './styles/ServiceList.css'; // Import the CSS file for styling
import dataService from '../DataService.js';

const ServiceList = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // Fetch services
        dataService.getServices().then(setServices);
    }, []);

    // Hardcoded fallback services
    const fallbackServices = [
        'Withdraw-f',
        'Deposit-f',
        'Check Book-f',
        'Foreign Currency-f',
        'Loan Application-f',
        'Account Opening-f',
        'Balance Inquiry-f',
        'Card Replacement-f',
        'Bill Payment-f',
        'Money Transfer-f',
        'Fixed Deposit-f',
        'Investment Services-f',
    ];

    // Determine which services to display
    const displayedServices = services && services.length > 0
        ? services.map((service) => service.name) // Extract names from fetched services
        : fallbackServices;

    return (
        <div className="service">
            <h2>Pick a Service</h2>
            <div className="service-list">
                {displayedServices.map((serviceName, index) => (
                    <button key={index}>
                        {serviceName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceList;