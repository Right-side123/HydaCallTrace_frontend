import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import './Dashboard.css';
import 'font-awesome/css/font-awesome.min.css';
import agentimg from './Assets/Agent-PNG.png';
import cdrimg from './Assets/cdr.png';
// import connectedimg from './Assets/connt.png';
// import notconnectedimg from './Assets/notConnect.png';
import incomingimg from './Assets/incoming.png';
import outgoingimg from './Assets/outgoing.png';
// import missedoutgoingimg from './Assets/outgoing-missed-call.png';
import missedimg from './Assets/missedcall.webp';
import Footer from './Footer';
const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {

  const [agents, setAgents] = useState([]);
  const [totalCdr, setTotalCdrCount] = useState([]);
  // const [connectedCalls, setConnectedCalls] = useState([]);
  // const [notConnectedCalls, setNotConnectedCalls] = useState([]);
  const [totalInbound, setTotalInbound] = useState([]);
  const [outgoingCalls, setOutgoingCalls] = useState([]);
  // const [missedOutboundCall, setMissedOutboundCall] = useState([]);
  const [missedCalls, setMissedCalls] = useState([]);
  const managerId = localStorage.getItem('manager_id');

  useEffect(() => {
    const fetchAgents = async () => {
      if (!managerId) {
        // setError('Manager ID is missing');
        // setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/agents/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data.agents);
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchAgents();
  }, [managerId]);



  // Fetch Total CDR Count
  useEffect(() => {
    const fetchTotalCdrCount = async () => {
      if (!managerId) return;

      try {
        const response = await fetch(`${API_URL}/totalcdr/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total CDR count');
        }
        const data = await response.json();
        setTotalCdrCount(data.total_cdr_count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotalCdrCount();
  }, [managerId]);


  // Fetch total inbound 

  useEffect(() => {
    const fetchTotalCdrCount = async () => {
      if (!managerId) return;

      try {
        const response = await fetch(`${API_URL}/totalinbound/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total CDR count');
        }
        const data = await response.json();
        setTotalInbound(data.total_cdr_count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotalCdrCount();
  }, [managerId]);


  useEffect(() => {
    const fetchTotalCdrCount = async () => {
      if (!managerId) return;

      try {
        const response = await fetch(`${API_URL}/totaloutbound/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total CDR count');
        }
        const data = await response.json();
        setOutgoingCalls(data.total_cdr_count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotalCdrCount();
  }, [managerId]);


  // useEffect(() => {
  //   const fetchTotalCdrCount = async () => {
  //     if (!managerId) return;

  //     try {
  //       const response = await fetch(`${API_URL}/totalconnected/${managerId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch total CDR count');
  //       }
  //       const data = await response.json();
  //       setConnectedCalls(data.total_cdr_count);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchTotalCdrCount();
  // }, [managerId]);


  // useEffect(() => {
  //   const fetchTotalCdrCount = async () => {
  //     if (!managerId) return;

  //     try {
  //       const response = await fetch(`${API_URL}/totalnotconnected/${managerId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch total CDR count');
  //       }
  //       const data = await response.json();
  //       setNotConnectedCalls(data.total_cdr_count);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchTotalCdrCount();
  // }, [managerId]);


  // useEffect(() => {
  //   const fetchTotalCdrCount = async () => {
  //     if (!managerId) return;

  //     try {
  //       const response = await fetch(`${API_URL}/totalmissedoutbound/${managerId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch total CDR count');
  //       }
  //       const data = await response.json();
  //       setMissedOutboundCall(data.total_cdr_count);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchTotalCdrCount();
  // }, [managerId]);


  useEffect(() => {
    const fetchTotalCdrCount = async () => {
      if (!managerId) return;

      try {
        const response = await fetch(`${API_URL}/totalmissed/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch total CDR count');
        }
        const data = await response.json();
        setMissedCalls(data.total_cdr_count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTotalCdrCount();
  }, [managerId]);


  return (
    <div>
      <div className='container_Scroll'>
        <Header />


        <div>

          <div className="dashboard-container">

            <div className="dashboard-content">

              <h1 className="dashboard_heading">Your complete contact&nbsp;center solution</h1>
              <div className="card-container">
                <NavLink to="/agents" className="navlink_link">
                  <div className="card">
                    <div className='heading_container'>
                      <span className='card_heading'>Agents</span>
                      <img src={agentimg} alt='agent' className='agentpng' />
                    </div>
                    <p>Total: {agents.length}</p>
                    <button className="dashboard-button">Click here</button>
                  </div>
                </NavLink>
                <NavLink to="/cdr_report" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_cdr'>
                      <span className='card_heading'>Custom CDR</span>
                      <img src={cdrimg} alt='cdr' className='cdr_png' />
                    </div>
                    <p>Total Records: {totalCdr}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink>
                {/* <NavLink to="/connected_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_connected'>
                      <span className='card_heading'>Connected Calls</span>
                      <img src={connectedimg} alt='connected' className='cdrpng' />
                    </div>
                    <p>Total Records: {connectedCalls} </p>/

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink> */}
                {/* <NavLink to="/notConnected_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_connected'>
                      <span className='card_heading'>Not Connected Calls</span>
                      <img src={notconnectedimg} alt='notconnected' className='cdrpng' />
                    </div>
                    <p>Total Records: {notConnectedCalls}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink> */}
                <NavLink to="/inbound_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_incoming'>
                      <span className='card_heading'>Inbound Calls</span>
                      <img src={incomingimg} alt='incoming' className='incomingpng' />
                    </div>
                    {/* <h3>Incoming Calls</h3> */}
                    <p>Total Records: {totalInbound}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink>
                <NavLink to="/outbound_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_incoming'>
                      <span className='card_heading'>Outbound Calls</span>
                      <img src={outgoingimg} alt='outgoing' className='incomingpng' />
                    </div>
                    <p>Total Records: {outgoingCalls}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink>
                <NavLink to="/missed_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_failed'>
                      <span className='card_heading'>Missed Calls</span>
                      <img src={missedimg} alt='failed' className='failedpng' />
                    </div>
                    {/* <h3>Failed Calls</h3> */}
                    <p>Total Records: {missedCalls}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink>


                <NavLink to="/singletimecdr" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_failed'>
                      <span className='card_heading'>Onetime Calls</span>
                      <img src={cdrimg} alt='failed' className='failedpng' />
                    </div>
                    {/* <h3>Failed Calls</h3> */}
                    <p>Total Records: {missedCalls}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink>

                {/* <NavLink to="/Missed_Outbound_calls" className="navlink_link">
                  <div className="card">
                    <div className='heading_container_connected'>
                      <span className='card_heading'>Missed Outgoing Calls</span>
                      <img src={missedoutgoingimg} alt='failed' className='failedpng' />
                    </div>
                  
                    <p>Total Records: {missedOutboundCall}</p>

                    <button className="dashboard-button">Click here</button>

                  </div>
                </NavLink> */}

              </div>
              {/* <div className='failed_card_container'>
               
              </div> */}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
