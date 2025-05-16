import React, { useState, useEffect, /* useCallback */ } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllDistricts } from '../../api/districtService';
import { getBranchesByDistrictName } from '../../api/branchService';
import { getBranchServicesByBranchId } from '../../api/branchLinkService';
import { getTodaysAppointmentsForBranch } from '../../api/appointmentService';
import HourChunkStatus from '../../components/client/HourChunkStatus';
import './ClientFindBranchPage.scss';

const STEPS = {
  PROVINCE: 'province',
  DISTRICT: 'district',
  BRANCH: 'branch',
  SERVICES: 'services', // When services are displayed after branch selection
};

// Define thresholds for queue status colors (example: number of appointments per hour)
const QUEUE_THRESHOLDS = {
  LOW: 2,    // 0-2 appointments = green
  MODERATE: 5, // 3-5 appointments = yellow
             // >5 appointments = red
};

const ClientFindBranchPage = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.PROVINCE);
  
  const [allDistrictsData, setAllDistrictsData] = useState([]); // Raw data from API
  const [selectableItems, setSelectableItems] = useState([]); // Items for current selection list

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Store district object
  const [selectedBranch, setSelectedBranch] = useState(null);   // Store branch object
  
  const [servicesWithTraffic, setServicesWithTraffic] = useState([]); // { service, hourlyTraffic }

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // 1. Fetch all districts on initial load to derive provinces
  useEffect(() => {
    const fetchAllDistricts = async () => {
      if (!token) { setError("Please log in."); return; }
      setIsLoading(true); setError(null);
      try {
        const data = await getAllDistricts(token);
        setAllDistrictsData(data || []);
        const uniqueProvinces = Array.from(new Set((data || []).map(d => d.province)))
                                   .sort()
                                   .map(name => ({ id: name, name })); // Give it an 'id' for consistency
        setSelectableItems(uniqueProvinces);
        setCurrentStep(STEPS.PROVINCE);
      } catch (err) {
        setError(err.message || 'Failed to fetch location data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllDistricts();
  }, [token]);

  // 2. Handle Province Selection -> Populate Districts for that Province
  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    const districtsInProvince = allDistrictsData
      .filter(d => d.province === province.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    setSelectableItems(districtsInProvince);
    setCurrentStep(STEPS.DISTRICT);
    // Reset downstream
    setSelectedDistrict(null);
    setSelectedBranch(null);
    setServicesWithTraffic([]);
  };

  // 3. Handle District Selection -> Fetch Branches for that District
  const handleDistrictSelect = async (district) => {
    setSelectedDistrict(district);
    if (!token || !district) return;
    setIsLoading(true); setError(null);
    try {
      const branchesData = await getBranchesByDistrictName(district.name, token);
      setSelectableItems(branchesData || []);
      setCurrentStep(STEPS.BRANCH);
    } catch (err) {
      setError(err.message || `Failed to fetch branches for ${district.name}.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
    // Reset downstream
    setSelectedBranch(null);
    setServicesWithTraffic([]);
  };

  // 4. Handle Branch Selection -> Fetch BranchServices, BranchAppointments, then process
  const handleBranchSelect = async (branch) => {
    setSelectedBranch(branch);
    if (!token || !branch) return;
    
    setIsLoading(true); setError(null);
    setCurrentStep(STEPS.SERVICES);
    setSelectableItems([]); // Clear branch selection list

    try {
      // Promise.all to fetch both sets of data concurrently
      const [branchServiceLinksData, branchAppointmentsData] = await Promise.all([
        getBranchServicesByBranchId(branch.id, token), // Gets all BranchService links for the branch
        getTodaysAppointmentsForBranch(branch.id, token) // Gets all appointments for the branch today
      ]);

      const branchServiceLinks = branchServiceLinksData || [];
      const allBranchAppointmentsToday = branchAppointmentsData || [];
      
      if (branchServiceLinks.length === 0) {
        setServicesWithTraffic([]);
        setIsLoading(false);
        return;
      }

      // Now, for each BranchService link, filter the allBranchAppointmentsToday
      // and calculate hourly traffic.
      const processedServicesTraffic = branchServiceLinks.map(bsLink => {
        // Filter appointments for the current bsLink.id (which is BranchService.id)
        const appointmentsForThisService = allBranchAppointmentsToday.filter(
          app => app.branchServiceId === bsLink.id 
        );
        
        // Calculate hourly traffic (8am - 5pm example, 9 slots for 8 hours)
        const hourlyCounts = Array(9).fill(0); // 8am, 9am, ..., 4pm (index 0 = 8:00-8:59)
        appointmentsForThisService.forEach(app => {
          if (app.time) { // Ensure time is present
            const appHour = parseInt(app.time.split(':')[0]);
            if (appHour >= 8 && appHour <= 16) { // 8am to 4:59pm
              hourlyCounts[appHour - 8]++;
            }
          }
        });
        
        const hourlyTrafficStatus = hourlyCounts.map(count => {
          if (count <= QUEUE_THRESHOLDS.LOW) return 'green';
          if (count <= QUEUE_THRESHOLDS.MODERATE) return 'yellow';
          return 'red';
        });

        return {
          // Key information from bsLink (BranchService object)
          serviceId: bsLink.serviceId, // The actual Service ID
          branchServiceId: bsLink.id,  // The ID of the BranchService link itself
          serviceName: bsLink.serviceName,
          // description: bsLink.serviceDescription, // If your BranchService object has service description
          hourlyTraffic: hourlyTrafficStatus,
        };
      });

      setServicesWithTraffic(processedServicesTraffic);

    } catch (err) {
      const errorMessage = err.message || `Failed to fetch service details for ${branch.name}.`;
      setError(errorMessage);
      console.error("Error in handleBranchSelect:", err);
      setServicesWithTraffic([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation back functions
  const goBackToProvinceSelect = () => {
    const uniqueProvinces = Array.from(new Set(allDistrictsData.map(d => d.province))).sort().map(name => ({ id: name, name }));
    setSelectableItems(uniqueProvinces);
    setCurrentStep(STEPS.PROVINCE);
    setSelectedProvince(null); setSelectedDistrict(null); setSelectedBranch(null); setServicesWithTraffic([]);
  };

  const goBackToDistrictSelect = () => {
    if (!selectedProvince) return; // Should not happen if called correctly
    handleProvinceSelect(selectedProvince); // Re-triggers district population
  };

  const goBackToBranchSelect = () => {
    if (!selectedDistrict) return; // Should not happen
    handleDistrictSelect(selectedDistrict); // Re-triggers branch population
  };

  // Helper to render the current selection list
  const renderSelectionList = () => {
    if (isLoading) return <p className="loading-text">Loading...</p>;
    if (!selectableItems.length && (currentStep !== STEPS.SERVICES)) return <p>No items to display.</p>;

    let onItemSelect;
    switch (currentStep) {
      case STEPS.PROVINCE: onItemSelect = handleProvinceSelect; break;
      case STEPS.DISTRICT: onItemSelect = handleDistrictSelect; break;
      case STEPS.BRANCH: onItemSelect = handleBranchSelect; break;
      default: return null;
    }

    return (
      <ul className="selection-list">
        {selectableItems.map(item => (
          <li key={item.id || item.name} onClick={() => onItemSelect(item)}>
            {item.name}
            {item.address && <span className="item-detail"> - {item.address}</span>}
          </li>
        ))}
      </ul>
    );
  };
  
  const getStepTitle = () => {
    if (isLoading && currentStep !== STEPS.SERVICES) return "Loading..."; // Avoid title change during service load
    switch (currentStep) {
      case STEPS.PROVINCE: return "1. Select a Province";
      case STEPS.DISTRICT: return `2. Select a District in ${selectedProvince?.name || ''}`;
      case STEPS.BRANCH: return `3. Select a Branch in ${selectedDistrict?.name || ''}`;
      case STEPS.SERVICES: return `Services at ${selectedBranch?.name || ''}`;
      default: return "";
    }
  };

  const handleBookAppointment = (serviceItem) => {
    // serviceItem now contains: { serviceId, branchServiceId, serviceName, hourlyTraffic }
    navigate('/client/book-appointment', { 
        state: { 
            branch: selectedBranch, 
            service: { // Construct a service object needed by booking page
                id: serviceItem.serviceId,
                name: serviceItem.serviceName,
                // description: serviceItem.description, // if available
                branchServiceId: serviceItem.branchServiceId // Pass the ID of the specific BranchService link
            },
            // initialHourlyTraffic: serviceItem.hourlyTraffic // if needed
        } 
    });
  };

  return (
    <div className="client-find-branch-page progressive-select">
      <header className="page-header">
        <h1>Find Branch & Book</h1>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="selection-path">
        {selectedProvince && (
          <span onClick={goBackToProvinceSelect} className="path-item">
            {selectedProvince.name}
          </span>
        )}
        {selectedDistrict && (
          <>
            <span className="path-separator"></span>
            <span onClick={goBackToDistrictSelect} className="path-item">
              {selectedDistrict.name}
            </span>
          </>
        )}
        {selectedBranch && currentStep === STEPS.SERVICES && ( // Only show branch in path if services are displayed
          <>
            <span className="path-separator"></span>
            <span onClick={goBackToBranchSelect} className="path-item">
              {selectedBranch.name}
            </span>
          </>
        )}
      </div>
      
      <div className="current-selection-area">
        <h3>{getStepTitle()}</h3>
        {currentStep !== STEPS.SERVICES && renderSelectionList()}
      </div>

      {currentStep === STEPS.SERVICES && !isLoading && (
        <div className="services-display">
          {servicesWithTraffic.length > 0 ? (
            servicesWithTraffic.map(item => ( // item is { serviceId, branchServiceId, serviceName, hourlyTraffic }
              <div key={item.branchServiceId} className="service-item-card"> {/* Use branchServiceId as key here as it's unique for this view */}
                <h4>{item.serviceName}</h4>
                {/* {item.description && <p className="service-description">{item.description}</p>} */}
                <HourChunkStatus hourlyStatus={item.hourlyTraffic} />
                <button 
                    className="btn btn-primary btn-book-service"
                    onClick={() => handleBookAppointment(item)}
                >
                    Book this Service
                </button>
              </div>
            ))
          ) : (
            <p>No services found or traffic data unavailable for this branch.</p>
          )}
        </div>
      )}
       {isLoading && currentStep === STEPS.SERVICES && <p className="loading-text">Loading services and traffic...</p>}
    </div>
  );
};

export default ClientFindBranchPage;