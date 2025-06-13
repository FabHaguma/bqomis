import React, { useEffect, useState } from 'react';
import './App.css';
import LeftsideNav from './components/LeftsideNav';
import HeaderNav from './components/HeaderNav';
import FooterComp from './components/FooterComp';
import ServiceList from './components/ServiceList';
import BranchList from './components/BranchList';
import TimeSlotBranch from './components/TimeSlotBranch';
import TimeSlotService from './components/TimeSlotService';

function App() {

  return (
    <div>
      <div class="container">
      <LeftsideNav />

      <main class="main-content">
        <HeaderNav />

        <section class="service-location">
          <ServiceList/>
          <BranchList/>
        </section>
        <section class="appointments">
          <h2>Appointments View</h2>
          <div class="branch-matrix">
            <TimeSlotBranch />
            <TimeSlotService />
          </div>
        </section>
        
        <FooterComp/>
      </main>
    </div>
    </div>
  );
}

export default App;










/*
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [backEndData, setBackEndData] = useState([]);

  useEffect(() => {
    fetch("/branches").then(
      response => response.json()
    ).then(data => setBackEndData(data));
  }
  , []);

  return (
    <div>
      <ul>
        {backEndData.map(branch => (
          <li key={branch.id}>{branch.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
*/