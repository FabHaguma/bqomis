import React, { useState } from 'react';

const BranchList = () => {
    const provinces = ['Kigali', 'East', 'North', 'South', 'West'];
    const kigaliDistricts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
    const eastDistricts = ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'];
    const northDistricts = ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'];
    const southDistricts = ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'];
    const westDistricts = ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'];

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const handleProvinceClick = (province) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
    };

    const handleDistrictClick = (district) => {
        setSelectedDistrict(district);
    };

    const branches = {
        "Gasabo": ["Branch Ga1", "Branch Ga2", "Branch Ga3", "Branch Ga4"],
        "Kicukiro": ["Branch Ki1", "Branch Ki2", "Branch Ki3", "Branch Ki4"],
        "Nyarugenge": ["Branch Ny1", "Branch Ny2", "Branch Ny3", "Branch Ny4"],
        "Bugesera": ["Branch 7", "Branch 8"],
        "Gatsibo": ["Branch 9", "Branch 10"],
        "Kayonza": ["Branch 11", "Branch 12"],
        "Kirehe": ["Branch 13", "Branch 14"],
        "Ngoma": ["Branch 15", "Branch 16"],
        "Nyagatare": ["Branch 17", "Branch 18"],
        "Rwamagana": ["Branch 19", "Branch 20"],
        "Burera": ["Branch 21", "Branch 22"],
        "Gakenke": ["Branch 23", "Branch 24"],
        "Gicumbi": ["Branch 25", "Branch 26"],
        "Musanze": ["Branch 27", "Branch 28"],
        "Rulindo": ["Branch 29", "Branch 30"],
        "Gisagara": ["Branch 31", "Branch 32"],
        "Huye": ["Branch 33", "Branch 34"],
        "Kamonyi": ["Branch 35", "Branch 36"],
        "Muhanga": ["Branch 37", "Branch 38"],
        "Nyamagabe": ["Branch 39", "Branch 40"],
        "Nyanza": ["Branch 41", "Branch 42"],
        "Nyaruguru": ["Branch 43", "Branch 44"],
        "Ruhango": ["Branch 45", "Branch 46"],
        "Karongi": ["Branch 47", "Branch 48"],
        "Ngororero": ["Branch 49", "Branch 50"],
        "Nyabihu": ["Branch 51", "Branch 52"],
        "Nyamasheke": ["Branch 53", "Branch 54"],
        "Rubavu": ["Branch 55", "Branch 56"],
        "Rusizi": ["Branch 57", "Branch 58"],
        "Rutsiro": ["Branch 59", "Branch 60"]
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
            <div className="provinces">
                {provinces.map((province) => (
                    <button key={province} onClick={() => handleProvinceClick(province)}>
                        {province}
                    </button>
                ))}
            </div>
            {selectedProvince && (
                <div className="districts">
                    <h3>{selectedProvince} Districts</h3>
                    {getDistricts(selectedProvince).map((district) => (
                        <button key={district} onClick={() => handleDistrictClick(district)}>
                            {district}
                        </button>
                    ))}
                </div>
            )}
            {selectedDistrict && (
                <div className="branches">
                    <h3>{selectedDistrict} Branches</h3>
                    {branches[selectedDistrict].map((branch) => (
                        <div key={branch}>{branch}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BranchList;