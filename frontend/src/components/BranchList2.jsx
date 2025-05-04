import React, { useState, useEffect } from 'react';
import './styles/BranchList.css'; // Import the CSS file

const BranchList = () => {
    const provinces = ['Kigali', 'East', 'North', 'South', 'West'];
    const kigaliDistricts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
    const eastDistricts = ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'];
    const northDistricts = ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'];
    const southDistricts = ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'];
    const westDistricts = ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'];

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [displayableNames, setDisplayableNames] = useState(provinces);
    const [level, setLevel] = useState('province');
    const [branches, setBranches] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/branches'); // Adjust API endpoint as needed
                const data = await response.json();
                setBranches(data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleProvinceClick = (province) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setDisplayableNames(getDistricts(province));
        setLevel('district');
    };

    const handleDistrictClick = (district) => {
        setSelectedDistrict(district);
        setDisplayableNames(branches[district] || []);
        setLevel('branch');
    };

    const handleBackClick = () => {
        if (level === 'branch') {
            setDisplayableNames(getDistricts(selectedProvince));
            setSelectedDistrict(null);
            setLevel('district');
        } else if (level === 'district') {
            setDisplayableNames(provinces);
            setSelectedProvince(null);
            setLevel('province');
        }
    };

    const getDistricts = (province) => {
        switch (province) {
            case 'Kigali':
                return kigaliDistricts;
            case 'East':
                return eastDistricts;
            case 'North':
                return northDistricts;
            case 'South':
                return southDistricts;
            case 'West':
                return westDistricts;
            default:
                return [];
        }
    };

    return (
        <div className="location">
            <h2>Pick a Location</h2>
            {loading && <p>Loading...</p>}
            {!loading && (
                <>
                    {level !== 'province' && (
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                    )}
                    <div className="names scrollable">
                        {displayableNames.map((name) => (
                            <button
                                key={name}
                                onClick={() => {
                                    if (level === 'province') {
                                        handleProvinceClick(name);
                                    } else if (level === 'district') {
                                        handleDistrictClick(name);
                                    }
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BranchList;