import React from 'react';
import './ServiceList.css'; // Import the CSS file for styling

const ServiceList = () => {
    return (
        <div className="service">
            <h2>Pick a Service</h2>
            <div className="service-list">
                <button>Withdraw</button>
                <button>Deposit</button>
                <button>Check Book</button>
                <button>Foreign Currency</button>
                <button>Loan Application</button>
                <button>Account Opening</button>
                <button>Balance Inquiry</button>
                <button>Card Replacement</button>
                <button>Bill Payment</button>
                <button>Money Transfer</button>
                <button>Fixed Deposit</button>
                <button>Investment Services</button>
            </div>
        </div>
    );
};

export default ServiceList;