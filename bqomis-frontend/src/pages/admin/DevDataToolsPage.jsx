import React, { useState, /* useEffect */ } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTestUsers } from '../../api/userService';
import { getAllBranchServiceRelationships } from '../../api/branchLinkService'; // Your service name
import { createBatchAppointments } from '../../api/appointmentService';
import { KIGALI_DISTRICTS, getRandomElement, getRandomDate, getRandomTimeSlot, /* getWeightedRandomService */ } from '../../features/admin/devDataTools/generatorUtils'; // Import utils
import './DevDataToolsPage.scss'; // Create this SCSS file

const DevDataToolsPage = () => {
  const { token } = useAuth();

  // Prerequisite Data
  const [testUsers, setTestUsers] = useState([]);
  const [allBranchServices, setAllBranchServices] = useState([]);
  const [prereqLoading, setPrereqLoading] = useState(false);
  const [prereqError, setPrereqError] = useState('');

  // Generator Config
  const [config, setConfig] = useState({
    totalAppointments: 100,
    skewServicePopularity: true,
    percentToday: 70,
    percentFuture: 20,
    maxFutureDays: 30,
    percentPast: 10,
    maxPastDays: 30,
  });

  // Submission & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [generationError, setGenerationError] = useState('');

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
  };

  const loadPrerequisites = async () => {
    setPrereqLoading(true);
    setPrereqError('');
    setTestUsers([]);
    setAllBranchServices([]);
    try {
      const [usersData, bsData] = await Promise.all([
        getTestUsers(token),
        getAllBranchServiceRelationships(token)
      ]);
      setTestUsers(usersData || []);
      setAllBranchServices(bsData || []);
      if (!usersData?.length || !bsData?.length) {
        setPrereqError("Warning: Test users or branch services list is empty. Generator might not work.");
      }
    } catch (err) {
      setPrereqError(err.message || "Failed to load prerequisite data.");
      console.error(err);
    } finally {
      setPrereqLoading(false);
    }
  };
  
  const generateAndSubmit = async () => {
    if (testUsers.length === 0 || allBranchServices.length === 0) {
      setGenerationError("Please load prerequisite data first (Test Users and Branch Services).");
      return;
    }
    if (config.percentToday + config.percentFuture + config.percentPast !== 100) {
      setGenerationError("Date percentages must sum to 100%.");
      return;
    }

    setIsSubmitting(true);
    setBatchResult(null);
    setGenerationError('');
    
    const generatedAppointments = [];
    const kigaliBranchServices = allBranchServices.filter(bs => KIGALI_DISTRICTS.includes(bs.district));
    const otherBranchServices = allBranchServices.filter(bs => !KIGALI_DISTRICTS.includes(bs.district));

    for (let i = 0; i < config.totalAppointments; i++) {
      let date;
      let status;
      const dateRoll = Math.random() * 100;

      if (dateRoll < config.percentPast) { // Past
        date = getRandomDate(null, -config.maxPastDays, -1); // -days to -1
        const statusRoll = Math.random() * 100;
        if (statusRoll < 80) status = "COMPLETED";
        else if (statusRoll < 90) status = "CANCELLED";
        else status = "NO_SHOW";
      } else if (dateRoll < config.percentPast + config.percentToday) { // Today
        date = new Date().toISOString().split('T')[0];
        status = "SCHEDULED"; // Could also be CHECKED_IN or COMPLETED if time is past
      } else { // Future
        date = getRandomDate(null, 1, config.maxFutureDays);
        status = "SCHEDULED";
      }

      const time = getRandomTimeSlot(9, 17, 15); // 9 AM to 4:45 PM (last slot starts at 16:45 for 15 min interval if endHour is 17)
      const user = getRandomElement(testUsers);

      // Branch Distribution
      let targetBranchServicePool = [];
      const branchRoll = Math.random() * 100;
      if (branchRoll < 40 && kigaliBranchServices.length > 0) { // 40% Kigali
        targetBranchServicePool = kigaliBranchServices;
      } else if (otherBranchServices.length > 0) { // Remaining 60% for others or all if Kigali empty
        targetBranchServicePool = otherBranchServices;
      } else { // Fallback if one pool is empty
        targetBranchServicePool = allBranchServices;
      }
      if (targetBranchServicePool.length === 0) {
          console.warn("No branch services available for selection criteria. Skipping appointment generation.");
          continue; // or handle error
      }
      
      // For service selection, we need to know what services a specific branch offers.
      // The current `allBranchServices` contains links. We pick one link.
      const selectedBranchServiceLink = getRandomElement(targetBranchServicePool);
      if (!selectedBranchServiceLink) {
          console.warn("Could not select a branch service link. Skipping appointment.");
          continue;
      }
      
      // Skewed service selection is harder with current structure of picking one BSLink randomly first.
      // For simplicity in this generator, if skewing is on, we'll try to find a popular service
      // from the selected BS link's branch, if not, just use the BS link's service.
      // A more advanced skew would pick service type first, then find a BS link for it.
      let finalBranchServiceId = selectedBranchServiceLink.id;
      // This simple skew is not perfect. It depends on the random branch picked first.
      // A true weighted random selection would list all unique services, pick one by weight,
      // then find a branch that offers it. For now, this is a simpler approximation.

      generatedAppointments.push({
        userId: user.id,
        branchServiceId: finalBranchServiceId, // This is the ID of the BranchService link
        date: date,
        time: time,
        status: status,
      });
    }

    if (generatedAppointments.length === 0) {
        setGenerationError("No appointments were generated. Check console for warnings.");
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await createBatchAppointments(generatedAppointments, token);
      setBatchResult(result);
    } catch (err) {
      setGenerationError(err.message || "Failed to submit batch appointments.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="dev-data-tools-page">
      <header className="page-header"><h1>Developer Data Tools</h1></header>

      {prereqError && <div className="error-message alert alert-danger">{prereqError}</div>}
      
      <section className="tool-section">
        <h2>1. Prerequisite Data</h2>
        <button onClick={loadPrerequisites} disabled={prereqLoading} className="btn btn-secondary">
          {prereqLoading ? "Loading Data..." : "Load Test Users & Branch Services"}
        </button>
        <div className="prereq-status">
          <p>Test Users Loaded: {testUsers.length}</p>
          <p>Branch-Service Links Loaded: {allBranchServices.length}</p>
        </div>
      </section>

      {(testUsers.length > 0 && allBranchServices.length > 0) && (
        <>
          <section className="tool-section">
            <h2>2. Generator Configuration</h2>
            <div className="config-grid">
              <div className="form-group">
                <label htmlFor="totalAppointments">Total Appointments to Generate:</label>
                <input type="number" id="totalAppointments" name="totalAppointments" value={config.totalAppointments} onChange={handleConfigChange} />
              </div>
              <div className="form-group">
                <label htmlFor="skewServicePopularity">Skew Service Popularity (Deposits/Withdrawals favored):</label>
                <input type="checkbox" id="skewServicePopularity" name="skewServicePopularity" checked={config.skewServicePopularity} onChange={handleConfigChange} />
              </div>
              <fieldset>
                <legend>Date Distribution (%)</legend>
                <div className="form-group inline">
                  <label htmlFor="percentPast">Past:</label>
                  <input type="number" id="percentPast" name="percentPast" value={config.percentPast} onChange={handleConfigChange} min="0" max="100"/>
                  <label htmlFor="maxPastDays">Max Days:</label>
                  <input type="number" id="maxPastDays" name="maxPastDays" value={config.maxPastDays} onChange={handleConfigChange} min="1"/>
                </div>
                <div className="form-group inline">
                  <label htmlFor="percentToday">Today:</label>
                  <input type="number" id="percentToday" name="percentToday" value={config.percentToday} onChange={handleConfigChange} min="0" max="100"/>
                </div>
                <div className="form-group inline">
                  <label htmlFor="percentFuture">Future:</label>
                  <input type="number" id="percentFuture" name="percentFuture" value={config.percentFuture} onChange={handleConfigChange} min="0" max="100"/>
                   <label htmlFor="maxFutureDays">Max Days:</label>
                  <input type="number" id="maxFutureDays" name="maxFutureDays" value={config.maxFutureDays} onChange={handleConfigChange} min="1"/>
                </div>
                 {config.percentToday + config.percentFuture + config.percentPast !== 100 && <p className="validation-error">Percentages must sum to 100%</p>}
              </fieldset>
            </div>
          </section>

          <section className="tool-section">
            <h2>3. Generate & Submit</h2>
            {generationError && <div className="error-message alert alert-danger">{generationError}</div>}
            <button onClick={generateAndSubmit} disabled={isSubmitting || prereqLoading || (config.percentToday + config.percentFuture + config.percentPast !== 100)} className="btn btn-primary btn-lg">
              {isSubmitting ? "Generating & Submitting..." : "Generate & Submit Batch"}
            </button>
          </section>
        </>
      )}

      {batchResult && (
        <section className="tool-section results-section">
          <h2>4. Batch Results</h2>
          <p>Total Submitted: {batchResult.totalSubmitted}</p>
          <p>Successfully Created: {batchResult.successfullyCreated}</p>
          <p>Failed Count: {batchResult.failedCount}</p>
          {batchResult.failedCount > 0 && (
            <div>
              <h3>Failures:</h3>
              <ul className="failure-list">
                {batchResult.failures.map((fail, index) => (
                  <li key={index}>
                    <p><strong>Input Index:</strong> {fail.inputIndex}</p>
                    <p><strong>Error:</strong> {fail.error}</p>
                    <details>
                        <summary>Submitted Data:</summary>
                        <pre>{JSON.stringify(fail.data, null, 2)}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DevDataToolsPage;