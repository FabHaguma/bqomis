import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.scss"; // Assuming you have a CSS file for styling

// Example: NotFoundPage placeholder
export default function NotFoundPage() {
    return (
        <div className="notfound-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist or has been moved.</p>
            <Link to="/">Go Home</Link>
        </div>
    );
}