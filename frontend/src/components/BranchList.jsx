import React, { useState } from 'react';
import './BranchList.css'; // Import the CSS file

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

    const handleProvinceClick = (province) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setDisplayableNames(getDistricts(province));
        setLevel('district');
    };

    const handleDistrictClick = (district) => {
        setSelectedDistrict(district);
        setDisplayableNames(branches[district]);
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

    const branches = {
        "Gasabo": ["Branch Ga1", "Branch Ga2", "Branch Ga3", "Branch Ga4"],
        "Kicukiro": ["Branch Ki1", "Branch Ki2", "Branch Ki3", "Branch Ki4"],
        "Nyarugenge": ["Branch Ny1", "Branch Ny2", "Branch Ny3", "Branch Ny4"],
        "Bugesera": ["Branch Bu1", "Branch Bu2"],
        "Gatsibo": ["Branch Ga1", "Branch Ga2"],
        "Kayonza": ["Branch Ka1", "Branch Ka2"],
        "Kirehe": ["Branch Ki1", "Branch Ki2"],
        "Ngoma": ["Branch Ng1", "Branch Ng2"],
        "Nyagatare": ["Branch Ny1", "Branch Ny2"],
        "Rwamagana": ["Branch Rw1", "Branch Rw2"],
        "Burera": ["Branch Bu1", "Branch Bu2"],
        "Gakenke": ["Branch Ga1", "Branch Ga2"],
        "Gicumbi": ["Branch Gi1", "Branch Gi2"],
        "Musanze": ["Branch Mu1", "Branch Mu2"],
        "Rulindo": ["Branch Ru1", "Branch Ru2"],
        "Gisagara": ["Branch Gi1", "Branch Gi2"],
        "Huye": ["Branch Hu1", "Branch Hu2"],
        "Kamonyi": ["Branch Ka1", "Branch Ka2"],
        "Muhanga": ["Branch Mu1", "Branch Mu2"],
        "Nyamagabe": ["Branch Ny1", "Branch Ny2"],
        "Nyanza": ["Branch Ny1", "Branch Ny2"],
        "Nyaruguru": ["Branch Ny1", "Branch Ny2"],
        "Ruhango": ["Branch Ru1", "Branch Ru2"],
        "Karongi": ["Branch Ka1", "Branch Ka2"],
        "Ngororero": ["Branch Ng1", "Branch Ng2"],
        "Nyabihu": ["Branch Ny1", "Branch Ny2"],
        "Nyamasheke": ["Branch Ny1", "Branch Ny2"],
        "Rubavu": ["Branch Ru1", "Branch Ru2"],
        "Rusizi": ["Branch Ru1", "Branch Ru2"],
        "Rutsiro": ["Branch Ru1", "Branch Ru2"]
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
        </div>
    );
};

export default BranchList;