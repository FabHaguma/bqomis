import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBranches } from '../../api/branchService';
import { getAllDistricts } from '../../api/districtService';
import { getAllServices as getAllBankingServices } from '../../api/serviceService'; // Renamed to avoid conflict
import {
  getAppointmentsByBranchAnalytics,
  getAppointmentsByServiceAnalytics,
  getPeakTimesAnalytics,
  getPeakTimesByDistrictAnalytics,
} from '../../api/analyticsService';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './AdminDashboardPage.scss'; // Create/Update SCSS

// Helper to format date period (e.g., last 7 days)
const formatDatePeriod = (daysAgo = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (daysAgo -1)); // -6 for 7 days total (inclusive)
  
  const format = (date) => date.toISOString().split('T')[0];
  return `${format(startDate)}_to_${format(endDate)}`;
};

const DAY_OF_WEEK_MAP = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' };
const HOUR_MAP = (hour) => `${hour}:00-${hour+1}:00`; // Simple hour format

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];


const AdminDashboardPage = () => {
  const { token } = useAuth();

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState(formatDatePeriod(7)); // Default to last 7 days
  const [selectedBranchIdForAnalytics, setSelectedBranchIdForAnalytics] = useState('');
  const [selectedDistrictForAnalytics, setSelectedDistrictForAnalytics] = useState('');
  const [selectedServiceIdForAnalytics, setSelectedServiceIdForAnalytics] = useState('');
  const [peakTimeGroupBy, setPeakTimeGroupBy] = useState('hour'); // 'hour' or 'dayOfWeek'
  const [peakTimeDistrictGroupBy, setPeakTimeDistrictGroupBy] = useState('hour');


  // Data states
  const [branchAnalytics, setBranchAnalytics] = useState(null);
  const [serviceAnalytics, setServiceAnalytics] = useState(null);
  const [peakTimes, setPeakTimes] = useState(null);
  const [peakTimesDistrict, setPeakTimesDistrict] = useState(null);

  // Filter options
  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      if (!token) return;
      try {
        const [br, di, se] = await Promise.all([
          getAllBranches(token),
          getAllDistricts(token),
          getAllBankingServices(token)
        ]);
        setBranches(br || []);
        setDistricts(di || []);
        setAllServices(se || []);
      } catch (err) { console.error("Error fetching filter options", err); }
    };
    fetchOptions();
  }, [token]);


  const fetchAllAnalytics = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const promises = [
        getPeakTimesAnalytics(selectedPeriod, peakTimeGroupBy, token),
      ];
      if (selectedBranchIdForAnalytics) {
        promises.push(getAppointmentsByBranchAnalytics(selectedBranchIdForAnalytics, selectedPeriod, token));
      } else { setBranchAnalytics(null); /* Clear if no branch selected */ }
      
      if (selectedDistrictForAnalytics && selectedServiceIdForAnalytics) {
        promises.push(getAppointmentsByServiceAnalytics({ district: selectedDistrictForAnalytics, serviceId: selectedServiceIdForAnalytics, period: selectedPeriod }, token));
      } else { setServiceAnalytics(null); }

      if (selectedDistrictForAnalytics) {
         promises.push(getPeakTimesByDistrictAnalytics(selectedDistrictForAnalytics, selectedPeriod, peakTimeDistrictGroupBy, token));
      } else { setPeakTimesDistrict(null); }


      const results = await Promise.allSettled(promises);
      
      // Order of results matches order of promises if all pushed conditionally
      let promiseIndex = 0;
      if (results[promiseIndex]?.status === 'fulfilled') setPeakTimes(results[promiseIndex].value);
      else if (results[promiseIndex]?.status === 'rejected') console.error("PeakTimes Error:", results[promiseIndex].reason);
      promiseIndex++;

      if (selectedBranchIdForAnalytics) {
        if (results[promiseIndex]?.status === 'fulfilled') setBranchAnalytics(results[promiseIndex].value);
        else if (results[promiseIndex]?.status === 'rejected') console.error("BranchAnalytics Error:", results[promiseIndex].reason);
        promiseIndex++;
      }
      if (selectedDistrictForAnalytics && selectedServiceIdForAnalytics) {
        if (results[promiseIndex]?.status === 'fulfilled') setServiceAnalytics(results[promiseIndex].value);
         else if (results[promiseIndex]?.status === 'rejected') console.error("ServiceAnalytics Error:", results[promiseIndex].reason);
        promiseIndex++;
      }
       if (selectedDistrictForAnalytics) {
        if (results[promiseIndex]?.status === 'fulfilled') setPeakTimesDistrict(results[promiseIndex].value);
        else if (results[promiseIndex]?.status === 'rejected') console.error("PeakTimesDistrict Error:", results[promiseIndex].reason);
      }

    } catch (err) {
      setError(err.message || "Failed to fetch analytics data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedPeriod, selectedBranchIdForAnalytics, selectedDistrictForAnalytics, selectedServiceIdForAnalytics, peakTimeGroupBy, peakTimeDistrictGroupBy]);

  useEffect(() => {
    fetchAllAnalytics();
  }, [fetchAllAnalytics]);

  const handlePeriodChange = (e) => {
      const days = parseInt(e.target.value);
      setSelectedPeriod(formatDatePeriod(days));
  };

  // Data transformations for charts
  const branchServiceStatusData = branchAnalytics?.services?.map(s => ({
    name: s.serviceName,
    Completed: s.completed,
    Cancelled: s.cancelled,
    NoShow: s.no_show,
  })) || [];
  
  const peakTimesData = peakTimes?.peakTimes?.map(pt => ({
    name: peakTimeGroupBy === 'hour' ? HOUR_MAP(pt.hour) : DAY_OF_WEEK_MAP[pt.dayOfWeek],
    Appointments: pt.count
  })).sort((a,b) => peakTimeGroupBy === 'hour' ? parseInt(a.name.split(':')[0]) - parseInt(b.name.split(':')[0]) : Object.values(DAY_OF_WEEK_MAP).indexOf(a.name) - Object.values(DAY_OF_WEEK_MAP).indexOf(b.name) ) || [];

  const peakTimesDistrictData = peakTimesDistrict?.peakTimes?.map(pt => ({
    name: peakTimeDistrictGroupBy === 'hour' ? HOUR_MAP(pt.hour) : DAY_OF_WEEK_MAP[pt.dayOfWeek],
    Appointments: pt.count
  })).sort((a,b) => peakTimeDistrictGroupBy === 'hour' ? parseInt(a.name.split(':')[0]) - parseInt(b.name.split(':')[0]) : Object.values(DAY_OF_WEEK_MAP).indexOf(a.name) - Object.values(DAY_OF_WEEK_MAP).indexOf(b.name) ) || [];


  return (
    <div className="admin-dashboard-page">
      <header className="page-header">
        <h1>Admin Dashboard & Analytics</h1>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}
      {isLoading && <div className="loading-message">Loading analytics...</div>}

      <div className="filters-area">
        <label htmlFor="period-select">Period:</label>
        <select id="period-select" onChange={handlePeriodChange} defaultValue="7">
            <option value="1">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
        </select>
      </div>

      <div className="dashboard-grid">
        {/* Overall Peak Times Chart */}
        <div className="chart-card">
          <h3>Overall Peak Times ({peakTimeGroupBy === 'hour' ? 'Hourly' : 'Daily'})</h3>
          <select value={peakTimeGroupBy} onChange={(e) => setPeakTimeGroupBy(e.target.value)}>
            <option value="hour">By Hour</option>
            <option value="dayOfWeek">By Day of Week</option>
          </select>
          {peakTimesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={peakTimesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Appointments" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (<p>No data for overall peak times.</p>)}
        </div>

        {/* Branch Specific Analytics */}
        <div className="chart-card">
            <h3>Branch Performance</h3>
            <select value={selectedBranchIdForAnalytics} onChange={(e) => setSelectedBranchIdForAnalytics(e.target.value)}>
                <option value="">Select a Branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {selectedBranchIdForAnalytics && branchAnalytics && (
                <>
                    <h4>{branchAnalytics.branchName} - Total Appointments: {branchAnalytics.appointmentCount}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={branchServiceStatusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Completed" fill="#00C49F" />
                            <Bar dataKey="Cancelled" fill="#FF8042" />
                            <Bar dataKey="NoShow" fill="#FFBB28" />
                        </BarChart>
                    </ResponsiveContainer>
                </>
            )}
            {selectedBranchIdForAnalytics && !branchAnalytics && !isLoading && <p>No data for selected branch.</p>}
        </div>
        
        {/* Service Specific Analytics by District */}
        <div className="chart-card">
            <h3>Service Performance by District</h3>
            <select value={selectedDistrictForAnalytics} onChange={(e) => setSelectedDistrictForAnalytics(e.target.value)}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <select value={selectedServiceIdForAnalytics} onChange={(e) => setSelectedServiceIdForAnalytics(e.target.value)} disabled={!selectedDistrictForAnalytics}>
                <option value="">Select Service</option>
                {allServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {selectedDistrictForAnalytics && selectedServiceIdForAnalytics && serviceAnalytics && (
                 <>
                    <h4>{serviceAnalytics.serviceName} in {serviceAnalytics.district} - Total: {serviceAnalytics.appointmentCount}</h4>
                    {/* Could use a Pie chart for Completed/Cancelled/NoShow ratio */}
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={[
                                    { name: 'Completed', value: serviceAnalytics.completed },
                                    { name: 'Cancelled', value: serviceAnalytics.cancelled },
                                    { name: 'No Show', value: serviceAnalytics.no_show }
                                ]} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" cy="50%" 
                                outerRadius={80} 
                                label
                            >
                                {[{ name: 'Completed', value: serviceAnalytics.completed },
                                  { name: 'Cancelled', value: serviceAnalytics.cancelled },
                                  { name: 'No Show', value: serviceAnalytics.no_show }].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </>
            )}
             {selectedDistrictForAnalytics && selectedServiceIdForAnalytics && !serviceAnalytics && !isLoading && <p>No data for selected service/district.</p>}
        </div>

        {/* Peak Times by District */}
        <div className="chart-card">
            <h3>Peak Times by District</h3>
             <select value={selectedDistrictForAnalytics} onChange={(e) => {setSelectedDistrictForAnalytics(e.target.value); /* Fetch data or rely on global fetch */ }}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            {selectedDistrictForAnalytics && (
                <select value={peakTimeDistrictGroupBy} onChange={(e) => setPeakTimeDistrictGroupBy(e.target.value)}>
                    <option value="hour">By Hour</option>
                    <option value="dayOfWeek">By Day of Week</option>
                </select>
            )}
            {selectedDistrictForAnalytics && peakTimesDistrictData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={peakTimesDistrictData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Appointments" stroke="#82Ca9D" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (selectedDistrictForAnalytics && !isLoading && <p>No peak time data for selected district.</p>)}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;