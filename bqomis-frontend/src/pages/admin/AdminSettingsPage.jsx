import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGlobalSettings, updateGlobalSettings, getBranchSettings, updateBranchSettings } from '../../api/settingsService';
import { getAllBranches } from '../../api/branchService';
import './AdminSettingsPage.scss'; // Create this SCSS file

const AdminSettingsPage = () => {
  const { token } = useAuth();

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    bookingWindowDays: 30,
    minBookingNoticeHours: 2,
    defaultQueueThresholdLow: 6,
    defaultQueueThresholdModerate: 12,
    defaultSlotDurationMins: 15,
    defaultAllowCancellationHours: 2,
    maintenanceModeEnabled: false,
  });

  // Branch-Specific Settings State
  const [branches, setBranches] = useState([]);
  const [selectedBranchIdForSettings, setSelectedBranchIdForSettings] = useState('');
  const [branchSpecificSettings, setBranchSpecificSettings] = useState({
    // Overridable fields, null means use global
    queueThresholdLow: null,
    queueThresholdModerate: null,
    slotDurationMins: null,
    maxAppointmentsPerSlot: null, 
  });
  // To show effective settings (global or override) for the selected branch
  const [effectiveBranchSettings, setEffectiveBranchSettings] = useState({});


  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [isLoadingBranch, setIsLoadingBranch] = useState(false);
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [isSavingBranch, setIsSavingBranch] = useState(false);
  
  const [globalError, setGlobalError] = useState(null);
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [branchError, setBranchError] = useState(null);
  const [branchSuccess, setBranchSuccess] = useState('');


  // Fetch global settings and branches on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return;
      setIsLoadingGlobal(true);
      try {
        const [globalData, branchesData] = await Promise.all([
          getGlobalSettings(token),
          getAllBranches(token)
        ]);
        if (globalData) setGlobalSettings(prev => ({ ...prev, ...globalData })); // Merge with defaults
        setBranches(branchesData || []);
      } catch (err) {
        setGlobalError("Failed to load initial settings or branches.");
        console.error(err);
      } finally {
        setIsLoadingGlobal(false);
      }
    };
    fetchInitialData();
  }, [token]);

  // Fetch branch-specific settings when a branch is selected
  const fetchBranchSpecificSettings = useCallback(async () => {
    if (!selectedBranchIdForSettings || !token) {
      setBranchSpecificSettings({ queueThresholdLow: null, queueThresholdModerate: null, slotDurationMins: null, maxAppointmentsPerSlot: null });
      setEffectiveBranchSettings({}); // Clear effective settings
      return;
    }
    setIsLoadingBranch(true);
    setBranchError(null);
    setBranchSuccess('');
    try {
      const branchData = await getBranchSettings(selectedBranchIdForSettings, token);
      // Backend returns overrides. Null values mean use global.
      // If branchData is empty or some fields are null, it means global is used for those.
      setBranchSpecificSettings(prev => ({
        ...prev, // Keep structure
        queueThresholdLow: branchData?.queueThresholdLow !== undefined ? branchData.queueThresholdLow : null,
        queueThresholdModerate: branchData?.queueThresholdModerate !== undefined ? branchData.queueThresholdModerate : null,
        slotDurationMins: branchData?.slotDurationMins !== undefined ? branchData.slotDurationMins : null,
        maxAppointmentsPerSlot: branchData?.maxAppointmentsPerSlot !== undefined ? branchData.maxAppointmentsPerSlot : null,
      }));
    } catch (err) {
      setBranchError(`Failed to load settings for branch ${selectedBranchIdForSettings}.`);
      console.error(err);
    } finally {
      setIsLoadingBranch(false);
    }
  }, [selectedBranchIdForSettings, token]);

  useEffect(() => {
    fetchBranchSpecificSettings();
  }, [fetchBranchSpecificSettings]);

  // Calculate effective settings for the selected branch (global + override)
  useEffect(() => {
    if (selectedBranchIdForSettings) {
      setEffectiveBranchSettings({
        queueThresholdLow: branchSpecificSettings.queueThresholdLow ?? globalSettings.defaultQueueThresholdLow,
        queueThresholdModerate: branchSpecificSettings.queueThresholdModerate ?? globalSettings.defaultQueueThresholdModerate,
        slotDurationMins: branchSpecificSettings.slotDurationMins ?? globalSettings.defaultSlotDurationMins,
        maxAppointmentsPerSlot: branchSpecificSettings.maxAppointmentsPerSlot // No global default specified for this one in example
      });
    } else {
      setEffectiveBranchSettings({});
    }
  }, [globalSettings, branchSpecificSettings, selectedBranchIdForSettings]);


  const handleGlobalSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGlobalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value),
    }));
  };

  const handleBranchSettingChange = (e) => {
    const { name, value, type } = e.target;
    // If value is empty string for a number field, treat it as wanting to use global (send null)
    const processedValue = (type === 'number' && value === '') ? null : (type === 'number' ? parseInt(value) : value);
    setBranchSpecificSettings(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSaveGlobalSettings = async (e) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingGlobal(true);
    setGlobalError(null);
    setGlobalSuccess('');
    try {
      await updateGlobalSettings(globalSettings, token);
      setGlobalSuccess("Global settings updated successfully!");
    } catch (err) {
      setGlobalError(err.message || "Failed to save global settings.");
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleSaveBranchSettings = async (e) => {
    e.preventDefault();
    if (!selectedBranchIdForSettings || !token) return;
    setIsSavingBranch(true);
    setBranchError(null);
    setBranchSuccess('');
    try {
      // Send only the overridable fields. Backend should handle nulls as "revert to global".
      const payload = {
        queueThresholdLow: branchSpecificSettings.queueThresholdLow,
        queueThresholdModerate: branchSpecificSettings.queueThresholdModerate,
        slotDurationMins: branchSpecificSettings.slotDurationMins,
        maxAppointmentsPerSlot: branchSpecificSettings.maxAppointmentsPerSlot,
      };
      await updateBranchSettings(selectedBranchIdForSettings, payload, token);
      setBranchSuccess(`Settings for branch ${selectedBranchIdForSettings} updated!`);
      // Refetch to ensure UI consistency, especially for effective settings
      fetchBranchSpecificSettings(); 
    } catch (err) {
      setBranchError(err.message || `Failed to save settings for branch.`);
    } finally {
      setIsSavingBranch(false);
    }
  };
  
  const getInputPlaceholder = (fieldName) => {
    switch(fieldName) {
        case 'queueThresholdLow': return `Global: ${globalSettings.defaultQueueThresholdLow}`;
        case 'queueThresholdModerate': return `Global: ${globalSettings.defaultQueueThresholdModerate}`;
        case 'slotDurationMins': return `Global: ${globalSettings.defaultSlotDurationMins}`;
        case 'maxAppointmentsPerSlot': return `Enter value (no global default shown)`;
        default: return '';
    }
  };


  if (isLoadingGlobal) {
    return <div className="loading-message">Loading settings...</div>;
  }

  return (
    <div className="admin-settings-page">
      <header className="page-header"><h1>Application Settings</h1></header>

      {/* Global Settings Section */}
      <section className="settings-section global-settings">
        <h2>Global Default Settings</h2>
        {globalError && <div className="error-message alert alert-danger">{globalError}</div>}
        {globalSuccess && <div className="success-message alert alert-success">{globalSuccess}</div>}
        <form onSubmit={handleSaveGlobalSettings}>
          {/* Example fields, add all from your GlobalApplicationConfiguration */}
          <div className="form-group">
            <label htmlFor="bookingWindowDays">Booking Window (Days)</label>
            <input type="number" id="bookingWindowDays" name="bookingWindowDays" value={globalSettings.bookingWindowDays} onChange={handleGlobalSettingChange} disabled={isSavingGlobal} />
          </div>
          <div className="form-group">
            <label htmlFor="defaultQueueThresholdLow">Default Queue Threshold (Low)</label>
            <input type="number" id="defaultQueueThresholdLow" name="defaultQueueThresholdLow" value={globalSettings.defaultQueueThresholdLow} onChange={handleGlobalSettingChange} disabled={isSavingGlobal} />
          </div>
           <div className="form-group">
            <label htmlFor="defaultQueueThresholdModerate">Default Queue Threshold (Moderate)</label>
            <input type="number" id="defaultQueueThresholdModerate" name="defaultQueueThresholdModerate" value={globalSettings.defaultQueueThresholdModerate} onChange={handleGlobalSettingChange} disabled={isSavingGlobal} />
          </div>
          <div className="form-group">
            <label htmlFor="defaultSlotDurationMins">Default Slot Duration (Minutes)</label>
            <input type="number" id="defaultSlotDurationMins" name="defaultSlotDurationMins" value={globalSettings.defaultSlotDurationMins} onChange={handleGlobalSettingChange} disabled={isSavingGlobal} />
          </div>
          <div className="form-group form-group-checkbox">
            <label htmlFor="maintenanceModeEnabled">Maintenance Mode</label>
            <input type="checkbox" id="maintenanceModeEnabled" name="maintenanceModeEnabled" checked={globalSettings.maintenanceModeEnabled} onChange={handleGlobalSettingChange} disabled={isSavingGlobal} />
          </div>
          {/* Add other global settings here */}
          <button type="submit" className="btn btn-primary" disabled={isSavingGlobal}>
            {isSavingGlobal ? "Saving..." : "Save Global Settings"}
          </button>
        </form>
      </section>

      {/* Branch-Specific Settings Section */}
      <section className="settings-section branch-settings">
        <h2>Branch-Specific Setting Overrides</h2>
        <div className="form-group">
          <label htmlFor="branch-select-settings">Select Branch to Configure:</label>
          <select 
            id="branch-select-settings" 
            value={selectedBranchIdForSettings} 
            onChange={(e) => setSelectedBranchIdForSettings(e.target.value)}
          >
            <option value="">-- Select a Branch --</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {selectedBranchIdForSettings && (
          isLoadingBranch ? <p className="loading-text">Loading branch settings...</p> :
          <form onSubmit={handleSaveBranchSettings}>
            {branchError && <div className="error-message alert alert-danger">{branchError}</div>}
            {branchSuccess && <div className="success-message alert alert-success">{branchSuccess}</div>}
            
            <p className="info-text">Leave fields blank to use the global default setting for that branch.</p>

            {/* Example overridable fields */}
            <div className="form-group">
              <label htmlFor="bs_queueThresholdLow">Queue Threshold (Low) - Effective: {effectiveBranchSettings.queueThresholdLow}</label>
              <input type="number" id="bs_queueThresholdLow" name="queueThresholdLow" 
                     value={branchSpecificSettings.queueThresholdLow ?? ''} onChange={handleBranchSettingChange} 
                     placeholder={getInputPlaceholder('queueThresholdLow')} disabled={isSavingBranch} />
            </div>
            <div className="form-group">
              <label htmlFor="bs_queueThresholdModerate">Queue Threshold (Moderate) - Effective: {effectiveBranchSettings.queueThresholdModerate}</label>
              <input type="number" id="bs_queueThresholdModerate" name="queueThresholdModerate" 
                     value={branchSpecificSettings.queueThresholdModerate ?? ''} onChange={handleBranchSettingChange} 
                     placeholder={getInputPlaceholder('queueThresholdModerate')} disabled={isSavingBranch} />
            </div>
            <div className="form-group">
              <label htmlFor="bs_slotDurationMins">Slot Duration (Minutes) - Effective: {effectiveBranchSettings.slotDurationMins}</label>
              <input type="number" id="bs_slotDurationMins" name="slotDurationMins" 
                     value={branchSpecificSettings.slotDurationMins ?? ''} onChange={handleBranchSettingChange} 
                     placeholder={getInputPlaceholder('slotDurationMins')} disabled={isSavingBranch} />
            </div>
             <div className="form-group">
              <label htmlFor="bs_maxAppointmentsPerSlot">Max Appointments Per Slot - Effective: {effectiveBranchSettings.maxAppointmentsPerSlot ?? 'Not Set'}</label>
              <input type="number" id="bs_maxAppointmentsPerSlot" name="maxAppointmentsPerSlot" 
                     value={branchSpecificSettings.maxAppointmentsPerSlot ?? ''} onChange={handleBranchSettingChange} 
                     placeholder={getInputPlaceholder('maxAppointmentsPerSlot')} disabled={isSavingBranch} />
            </div>
            {/* Add other overridable settings here */}
            <button type="submit" className="btn btn-primary" disabled={isSavingBranch}>
              {isSavingBranch ? "Saving..." : "Save Branch Settings"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default AdminSettingsPage;