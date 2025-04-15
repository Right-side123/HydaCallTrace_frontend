import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login';
import Dashboard from './components/DashBoard';
import AgentsPage from './components/Agent';
import CdrReportPage from './components/CdrReport';
import OutboundCallsPage from './components/OutboundCalls';
import InboundCallsPage from './components/InboundCalls';
import ConnectedCallsPage from './components/ConnectedCalls';
import NotConnectedCallsPage from './components/NotConnectedCalls';
import MissedOutboundCallsPage from './components/Missedoutbound';
import AgentDetailPage from './components/SingleAgent';
import LogoutHandler from './components/LogoutHandler';
import MissedCallsPage from './components/MissedCalls';
import AddAgent from './components/AddAgent';
import UpdateAgent from './components/UpdateAgent';

const App = () => {
  return (
    <Router>

      <LogoutHandler />
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path='/agents' element={<AgentsPage />} />

        <Route path='/addagent' element = {<AddAgent/>} />

        <Route path="/edit-agent/:id" element={<UpdateAgent />} />


        <Route path='/cdr_report' element={<CdrReportPage />} />

        <Route path="/cdr-report/:agentName" element={<CdrReportPage />} />

        <Route path='/outbound_calls' element={<OutboundCallsPage />} />

        <Route path='/inbound_calls' element={<InboundCallsPage />} />

        <Route path='/connected_calls' element={<ConnectedCallsPage />} />

        <Route path='/notConnected_calls' element={<NotConnectedCallsPage />} />

        <Route path='/Missed_Outbound_calls' element={<MissedOutboundCallsPage />} />

        <Route path='missed_calls' element={<MissedCallsPage />} />

        <Route path="/agent_details/:agentName" element={<AgentDetailPage />} />

      </Routes>

    </Router>
  );
};

export default App;
