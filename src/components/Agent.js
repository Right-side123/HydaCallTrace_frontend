// *********************************************************************************
//                              *********************************************************************************************************

// import React, { useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import './Agent.css';
// import Header from './Header';
// import Footer from './Footer';
// import * as XLSX from 'xlsx';
// import editicon from './Assets/editagent.png';
// const API_URL = process.env.REACT_APP_API_URL;



// const AgentPage = () => {
//   const [agents, setAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [startTime, setStartTime] = useState('00:00');
//   const [endTime, setEndTime] = useState('23:59');
//   const [searchQuery, setSearchQuery] = useState('');

//   const managerId = localStorage.getItem('manager_id');
//   const navigate = useNavigate();

//   // localStorage.getItem('manager_id')

//   // console.log("API_URL:", API_URL);


//   useEffect(() => {
//     const currentDate = new Date();
//     const localDate = currentDate.toLocaleDateString('en-CA');
//     setStartDate(localDate);
//     setEndDate(localDate);
//   }, []);

//   const fetchAgents = async () => {
//     if (!managerId) {
//       setError('Manager ID is missing');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_URL}/agents/${managerId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch agents');
//       }

//       const allAgents = await response.json();
//       const formattedStartDate = `${startDate} ${startTime}`;
//       const formattedEndDate = `${endDate} ${endTime}`;

//       const callDataResponse = await fetch(`${API_URL}/agents/${managerId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
//       if (!callDataResponse.ok) {
//         throw new Error('Failed to fetch call data for the selected range');
//       }

//       const callData = await callDataResponse.json();
//       const callDataMap = new Map();
//       callData.agents.forEach(agent => {
//         callDataMap.set(agent.agentmobile, agent);
//       });

//       const mergedAgents = allAgents.agents.map(agent => {
//         const callStats = callDataMap.get(agent.agentmobile) || {};
//         return {
//           ...agent,
//           totalCalls: callStats.totalCalls || 0,
//           totaloutbound: callStats.totaloutbound || 0,
//           totalinbound: callStats.totalinbound || 0,
//           totalMissed: callStats.totalMissed || 0,
//           totalUnique: callStats.totalUnique || 0
//         };
//       });

//       setAgents(mergedAgents);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!managerId || !startDate || !endDate) return;
//     fetchAgents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [managerId, startDate, endDate, startTime, endTime]);

//   // useEffect(() => {
//   //   if (!managerId || !startDate || !endDate) return;
//   //   const fetchAgents = async () => {
//   //     if (!managerId) {
//   //       setError('Manager ID is missing');
//   //       setLoading(false);
//   //       return;
//   //     }
//   //     try {
//   //       const response = await fetch(`${API_URL}/agents/${managerId}`);
//   //       if (!response.ok) {
//   //         throw new Error('Failed to fetch agents');
//   //       }

//   //       const allAgents = await response.json();


//   //       const formattedStartDate = `${startDate} ${startTime}`;
//   //       const formattedEndDate = `${endDate} ${endTime}`;

//   //       const callDataResponse = await fetch(`${API_URL}/agents/${managerId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
//   //       if (!callDataResponse.ok) {
//   //         throw new Error('Failed to fetch call data for the selected range');
//   //       }

//   //       const callData = await callDataResponse.json();

//   //       const callDataMap = new Map();
//   //       callData.agents.forEach(agent => {
//   //         callDataMap.set(agent.agentmobile, agent);
//   //       });

//   //       const mergedAgents = allAgents.agents.map(agent => {
//   //         const callStats = callDataMap.get(agent.agentmobile) || {};
//   //         return {
//   //           ...agent,
//   //           totalCalls: callStats.totalCalls || 0,
//   //           totaloutbound: callStats.totaloutbound || 0,
//   //           totalinbound: callStats.totalinbound || 0,
//   //           totalMissed: callStats.totalMissed || 0,
//   //           totalUnique: callStats.totalUnique || 0
//   //         };
//   //       });

//   //       setAgents(mergedAgents);
//   //     } catch (err) {
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchAgents();
//   // }, [managerId, startDate, endDate, startTime, endTime]);


//   const handleAgentClick = (agentName) => {
//     navigate(`/agent_details/${agentName}`);
//   };

//   const handleBackAgents = () => {
//     navigate(-1);
//   };

//   const calculateTotals = (agents) => {
//     let totalCalls = 0;
//     let totalOutbound = 0;
//     let totalInbound = 0;
//     let totalMissed = 0;
//     let totalUnique = 0;


//     agents.forEach(agent => {
//       totalCalls += parseInt(agent.totalCalls) || 0;
//       totalOutbound += parseInt(agent.totaloutbound) || 0;
//       totalInbound += parseInt(agent.totalinbound) || 0;
//       totalMissed += parseInt(agent.totalMissed) || 0;
//       totalUnique += parseInt(agent.totalUnique)
//     });

//     return {
//       totalCalls,
//       totalOutbound,
//       totalInbound,
//       totalMissed,
//       totalUnique
//     };
//   };

//   const filteredAgents = agents.filter(agent =>
//     agent.agentname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     agent.agentmobile.includes(searchQuery)
//   );

//   const totals = calculateTotals(filteredAgents);
//   const safeNumber = (num) => (num !== undefined && num !== null ? Number(num) : 0);


//   const downloadExcel = () => {

//     const formattedStartDate = `${startDate} ${startTime}`;
//     const formattedEndDate = `${endDate} ${endTime}`;

//     const dateTimeRow = [` `, ` `, ` `, `Date-Time Range:`, `${formattedStartDate} to ${formattedEndDate}`];
//     const blankRow = [` `];

//     const headers = [
//       'S.N.', 'Agent Name', 'Agent Mobile No', 'Manager', 'IMEI NO', 'SIM No', 'Status', 'Department',
//       'Total Calls', 'Total Outbound Calls', 'Total Inbound Calls',
//       'Total Missed Calls', 'Total Unique Calls'
//     ];
//     const dataWithHeaders = filteredAgents.map((agent, index) => ({
//       'S.N.': index + 1,
//       'Agent Name': agent.agentname,
//       'Agent Mobile No': agent.agentmobile,
//       'Manager': agent.managername,
//       'Department': agent.department,
//       'IMEI No': agent.imei_no,
//       'SIM No': agent.SIM_No,
//       'Status': agent.status,
//       'Total Calls': safeNumber(agent.totalCalls),
//       'Total Outbound Calls': safeNumber(agent.totaloutbound),
//       'Total Inbound Calls': safeNumber(agent.totalinbound),
//       'Total Missed Calls': safeNumber(agent.totalMissed),
//       'Total Unique Calls': safeNumber(totals.totalUnique)
//     }));

//     const totalRow = {
//       'S.N.': 'Total',
//       'Agent Name': '',
//       'Agent Mobile No': '',
//       'Manager': '',
//       'Department': '',
//       'IMEI No': '',
//       'SIM No': '',
//       'Status': '',
//       'Total Calls': safeNumber(totals.totalCalls),
//       'Total Outbound Calls': safeNumber(totals.totalOutbound),
//       'Total Inbound Calls': safeNumber(totals.totalInbound),
//       'Total Missed Calls': safeNumber(totals.totalMissed),
//       'Total Unique Calls': safeNumber(totals.totalUnique)
//     };
//     const sheetData = [dateTimeRow, blankRow, headers, ...dataWithHeaders.map(row => Object.values(row)),
//       Object.values(totalRow)];
//     const ws = XLSX.utils.aoa_to_sheet(sheetData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
//     XLSX.writeFile(wb, 'Agents..xlsx');
//   };

//   return (
//     <div>
//       <Header />

//       <h2 className="agentpage_heading">Agents</h2>
//       <div className='top_fields'>

//         <div></div>
//         <div className="filter-container">
//           <label className='select_type'>Start Date:</label>
//           <input
//             className='select_option'
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />

//           <input
//             className='select_option_time'
//             type="time"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//           />
//           <label className='select_type'>End Date:</label>
//           <input className='select_option'
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />

//           <input
//             className='select_option_time'
//             type="time"
//             value={endTime}
//             onChange={(e) => setEndTime(e.target.value)}
//           />


//           <label className='select_type'>Search:</label>
//           <input
//             className='searchbox'
//             type="text"
//             placeholder="Search by name or mobile"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />


//         </div>

//         <div className='buttons_container_create_agent'>
//           <button onClick={fetchAgents} className='cdr_refresh_btn'>
//             <i className="fa fa-refresh"></i> Refresh
//           </button>
//           <NavLink to="/addagent">
//             <button className='agent_back'>Create Agent</button>
//           </NavLink>
//         </div>

//       </div>

//       <div className="buttons_container">
//         <button className="agent_back" onClick={handleBackAgents}>Back</button>
//         <button onClick={downloadExcel} className="agent_dwldbtn">Download</button>
//       </div>
//       <div className="agent-container">
//         <div className="agent-content">
//           {loading ? (
//             <p>Loading agents...</p>
//           ) : error ? (
//             <p>Error: {error}</p>
//           ) : (
//             <table className="agents-table">
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>Agent Name</th>
//                   <th>Agent Mobile No</th>
//                   <th>Manager</th>
//                   <th className="tdregion">Department</th>
//                   <th>IMEI No</th>
//                   <th>SIM No</th>
//                   <th>Status</th>
//                   <th>Total Calls</th>
//                   <th>Total Outbound</th>
//                   <th>Total Inbound</th>
//                   <th>Total Missed</th>
//                   <th>Total Unique</th>
//                   <th>Edit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAgents.length > 0 ? (
//                   filteredAgents.map((agent, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td key={agent.agentmobile} onClick={() => handleAgentClick(agent.agentmobile)} className="clickable-row">{agent.agentname}</td>
//                       <td>{agent.agentmobile}</td>
//                       <td>{agent.managername}</td>
//                       <td className="tdregion">{agent.department}</td>
//                       <td>{agent.imei_no}</td>
//                       <td>{agent.SIM_No}</td>
//                       <td>{agent.status}</td>
//                       <td>{agent.totalCalls || 0}</td>
//                       <td>{agent.totaloutbound || 0}</td>
//                       <td>{agent.totalinbound || 0}</td>
//                       <td>{agent.totalMissed || 0}</td>
//                       <td>{agent.totalUnique || 0}</td>
//                       <td>
//                         <img className="editagent" alt='edit' src={editicon} onClick={() => navigate(`/edit-agent/${agent.id}`)} />
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="12">No agents available.</td>
//                   </tr>
//                 )}
//                 <tr>
//                   <td colSpan="8"><strong>Total</strong></td>
//                   <td>{totals.totalCalls}</td>
//                   <td>{totals.totalOutbound}</td>
//                   <td>{totals.totalInbound}</td>
//                   <td>{totals.totalMissed}</td>
//                   <td>{totals.totalUnique}</td>
//                   <td></td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default AgentPage;





import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Agent.css';
import Header from './Header';
import Footer from './Footer';
import * as XLSX from 'xlsx';
import editicon from './Assets/editagent.png';
const API_URL = process.env.REACT_APP_API_URL;



const AgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [searchQuery, setSearchQuery] = useState('');

  const managerId = localStorage.getItem('manager_id');
  const navigate = useNavigate();

  // localStorage.getItem('manager_id')

  // console.log("API_URL:", API_URL);


  useEffect(() => {
    const currentDate = new Date();
    const localDate = currentDate.toLocaleDateString('en-CA');
    setStartDate(localDate);
    setEndDate(localDate);
  }, []);

  const fetchAgents = async () => {
    if (!managerId) {
      setError('Manager ID is missing');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/agents/${managerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const allAgents = await response.json();
      const formattedStartDate = `${startDate} ${startTime}`;
      const formattedEndDate = `${endDate} ${endTime}`;

      const callDataResponse = await fetch(`${API_URL}/agents/${managerId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      if (!callDataResponse.ok) {
        throw new Error('Failed to fetch call data for the selected range');
      }

      const callData = await callDataResponse.json();
      const callDataMap = new Map();
      callData.agents.forEach(agent => {
        callDataMap.set(agent.agentmobile, agent);
      });

      const mergedAgents = allAgents.agents.map(agent => {
        const callStats = callDataMap.get(agent.agentmobile) || {};
        return {
          ...agent,
          totalCalls: callStats.totalCalls || 0,
          totaloutbound: callStats.totaloutbound || 0,
          totalinbound: callStats.totalinbound || 0,
          totalMissed: callStats.totalMissed || 0,
          totalUnique: callStats.totalUnique || 0
        };
      });

      setAgents(mergedAgents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!managerId || !startDate || !endDate) return;
    fetchAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managerId, startDate, endDate, startTime, endTime]);

  // useEffect(() => {
  //   if (!managerId || !startDate || !endDate) return;
  //   const fetchAgents = async () => {
  //     if (!managerId) {
  //       setError('Manager ID is missing');
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       const response = await fetch(`${API_URL}/agents/${managerId}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch agents');
  //       }

  //       const allAgents = await response.json();


  //       const formattedStartDate = `${startDate} ${startTime}`;
  //       const formattedEndDate = `${endDate} ${endTime}`;

  //       const callDataResponse = await fetch(`${API_URL}/agents/${managerId}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
  //       if (!callDataResponse.ok) {
  //         throw new Error('Failed to fetch call data for the selected range');
  //       }

  //       const callData = await callDataResponse.json();

  //       const callDataMap = new Map();
  //       callData.agents.forEach(agent => {
  //         callDataMap.set(agent.agentmobile, agent);
  //       });

  //       const mergedAgents = allAgents.agents.map(agent => {
  //         const callStats = callDataMap.get(agent.agentmobile) || {};
  //         return {
  //           ...agent,
  //           totalCalls: callStats.totalCalls || 0,
  //           totaloutbound: callStats.totaloutbound || 0,
  //           totalinbound: callStats.totalinbound || 0,
  //           totalMissed: callStats.totalMissed || 0,
  //           totalUnique: callStats.totalUnique || 0
  //         };
  //       });

  //       setAgents(mergedAgents);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAgents();
  // }, [managerId, startDate, endDate, startTime, endTime]);


  // const handleAgentClick = (agentName) => {
  //   navigate(`/agent_details/${agentName}`);
  // };

  const handleBackAgents = () => {
    navigate(-1);
  };

  const calculateTotals = (agents) => {
    let totalCalls = 0;
    let totalOutbound = 0;
    let totalInbound = 0;
    let totalMissed = 0;
    let totalUnique = 0;


    agents.forEach(agent => {
      totalCalls += parseInt(agent.totalCalls) || 0;
      totalOutbound += parseInt(agent.totaloutbound) || 0;
      totalInbound += parseInt(agent.totalinbound) || 0;
      totalMissed += parseInt(agent.totalMissed) || 0;
      totalUnique += parseInt(agent.totalUnique)
    });

    return {
      totalCalls,
      totalOutbound,
      totalInbound,
      totalMissed,
      totalUnique
    };
  };

  const filteredAgents = agents.filter(agent =>
    agent.agentname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.agentmobile.includes(searchQuery)
  );

  const totals = calculateTotals(filteredAgents);
  const safeNumber = (num) => (num !== undefined && num !== null ? Number(num) : 0);


  const downloadExcel = () => {

    const formattedStartDate = `${startDate} ${startTime}`;
    const formattedEndDate = `${endDate} ${endTime}`;

    const dateTimeRow = [` `, ` `, ` `, `Date-Time Range:`, `${formattedStartDate} to ${formattedEndDate}`];
    const blankRow = [` `];

    const headers = [
      'S.N.', 'Agent Name', 'Agent Mobile No', 'Manager', 'IMEI NO', 'SIM No', 'Status', 'Department',
      'Total Calls', 'Total Outbound Calls', 'Total Inbound Calls',
      'Total Missed Calls', 'Total Unique Calls'
    ];
    const dataWithHeaders = filteredAgents.map((agent, index) => ({
      'S.N.': index + 1,
      'Agent Name': agent.agentname,
      'Agent Mobile No': agent.agentmobile,
      'Manager': agent.managername,
      'Department': agent.department,
      'IMEI No': agent.imei_no,
      'SIM No': agent.SIM_No,
      'Status': agent.status,
      'Total Calls': safeNumber(agent.totalCalls),
      'Total Outbound Calls': safeNumber(agent.totaloutbound),
      'Total Inbound Calls': safeNumber(agent.totalinbound),
      'Total Missed Calls': safeNumber(agent.totalMissed),
      'Total Unique Calls': safeNumber(totals.totalUnique)
    }));

    const totalRow = {
      'S.N.': 'Total',
      'Agent Name': '',
      'Agent Mobile No': '',
      'Manager': '',
      'Department': '',
      'IMEI No': '',
      'SIM No': '',
      'Status': '',
      'Total Calls': safeNumber(totals.totalCalls),
      'Total Outbound Calls': safeNumber(totals.totalOutbound),
      'Total Inbound Calls': safeNumber(totals.totalInbound),
      'Total Missed Calls': safeNumber(totals.totalMissed),
      'Total Unique Calls': safeNumber(totals.totalUnique)
    };
    const sheetData = [dateTimeRow, blankRow, headers, ...dataWithHeaders.map(row => Object.values(row)),
      Object.values(totalRow)];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
    XLSX.writeFile(wb, 'Agents..xlsx');
  };

  return (
    <div>
      <Header />

      <h2 className="agentpage_heading">Agents</h2>
      <div className='top_fields'>

        <div></div>
        <div className="filter-container">
          <label className='select_type'>Start Date:</label>
          <input
            className='select_option'
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            className='select_option_time'
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label className='select_type'>End Date:</label>
          <input className='select_option'
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <input
            className='select_option_time'
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />


          <label className='select_type'>Search:</label>
          <input
            className='searchbox'
            type="text"
            placeholder="Search by name or mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />


        </div>

        <div className='buttons_container_create_agent'>
          <button onClick={fetchAgents} className='cdr_refresh_btn'>
            <i className="fa fa-refresh"></i> Refresh
          </button>
          <NavLink to="/addagent">
            <button className='agent_back'>Create Agent</button>
          </NavLink>
        </div>

      </div>

      <div className="buttons_container">
        <button className="agent_back" onClick={handleBackAgents}>Back</button>
        <button onClick={downloadExcel} className="agent_dwldbtn">Download</button>
      </div>
      <div className="agent-container">
        <div className="agent-content">
          {loading ? (
            <p>Loading agents...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <table className="agents-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Agent Name</th>
                  <th>Agent Mobile No</th>
                  <th>Manager</th>
                  <th className="tdregion">Department</th>
                  <th>IMEI No</th>
                  <th>SIM No</th>
                  <th>Status</th>
                  <th>Total Calls</th>
                  <th>Total Outbound</th>
                  <th>Total Inbound</th>
                  <th>Total Missed</th>
                  <th>Total Unique</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{agent.agentname}</td>
                      <td>{agent.agentmobile}</td>
                      <td>{agent.managername}</td>
                      <td className="tdregion">{agent.department}</td>
                      <td>{agent.imei_no}</td>
                      <td>{agent.SIM_No}</td>
                      <td>{agent.status}</td>
                      <td>{agent.totalCalls || 0}</td>
                      <td>{agent.totaloutbound || 0}</td>
                      <td>{agent.totalinbound || 0}</td>
                      <td>{agent.totalMissed || 0}</td>
                      <td>{agent.totalUnique || 0}</td>
                      <td>
                        <img className="editagent" alt='edit' src={editicon} onClick={() => navigate(`/edit-agent/${agent.id}`)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12">No agents available.</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="8"><strong>Total</strong></td>
                  <td>{totals.totalCalls}</td>
                  <td>{totals.totalOutbound}</td>
                  <td>{totals.totalInbound}</td>
                  <td>{totals.totalMissed}</td>
                  <td>{totals.totalUnique}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AgentPage;