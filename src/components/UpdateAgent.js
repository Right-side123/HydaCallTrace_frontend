import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Agent.css';

const API_URL = process.env.REACT_APP_API_URL;

const UpdateAgent = () => {
    const { id } = useParams();
    // console.log(id);

    const navigate = useNavigate();

    const [agentname, setAgentname] = useState('');
    const [agentmobile, setAgentmobile] = useState('');
    const [department, setDepartment] = useState('');
    const [imei_no, setImeino] = useState('');
    const [SIM_No, setSIM_No] = useState('');
    const [status, setStatus] = useState('active');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [managers, setManagers] = useState([]);
    const [selectedManagerName, setSelectedManagerName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentRes, managerRes] = await Promise.all([
                    axios.get(`${API_URL}/agent/${id}`),
                    axios.get(`${API_URL}/manager`)
                ]);

                // console.log('API Response:', agentRes.data);

                const agent = agentRes.data.agents?.find((a) => a.id === parseInt(id));

                if (agent) {
                    setAgentname(agent.agentname);
                    setAgentmobile(agent.agentmobile);
                    setDepartment(agent.department);
                    setImeino(agent.imei_no);
                    setSIM_No(agent.SIM_No);
                    setStatus(agent.status.toLowerCase());
                    setSelectedManagerName(agent.managername);
                } else {
                    console.error("Agent not found for id:", id);
                    setError(true);
                }

                setManagers(managerRes.data?.managers || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(true);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const agentData = {
            agentname,
            agentmobile,
            managername: selectedManagerName,
            department,
            imei_no,
            SIM_No,
            status
        };

        try {
            await axios.put(`${API_URL}/updateagent/${id}`, agentData);
            setMessage('Agent updated successfully!');
            setError(false);
        } catch (err) {
            console.error('Error updating agent:', err);
            setMessage('Failed to update agent.');
            setError(true);
        }
    };

    return (
        <div>
            <Header />
            <div className='main_parent_container'>
                <h2>Edit Agent</h2>

                <form onSubmit={handleSubmit}>
                    {/* same form inputs as AddAgent.js, just values filled in */}
                    {/* ... same as before ... */}
                    <div className='agent_name_container'>
                        <div>
                            <label className='content_heding'>Agent Name: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={agentname}
                                onChange={(e) => setAgentname(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className='content_heding'>IMEI No: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={imei_no}
                                onChange={(e) => setImeino(e.target.value)}
                                required
                            />
                        </div>

                    </div>

                    <div className='agent_name_container'>


                        <div>
                            <label className='content_heding_mobile'>Agent Mobile: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={agentmobile}
                                onChange={(e) => setAgentmobile(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className='content_heding'>SIM No: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={SIM_No}
                                onChange={(e) => setSIM_No(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='agent_name_container'>
                        <div>
                            <label className='content_heding_dpt'>Department: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className='content_heding'>Manager:</label>
                            <select
                                className='agent_input'
                                value={selectedManagerName}
                                onChange={(e) => setSelectedManagerName(e.target.value)}
                                required
                            >
                                <option value="">Select Manager</option>
                                {managers.map((manager, index) => (
                                    <option key={index} value={manager.managername}>
                                        {manager.managername}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='agent_name_container'>
                        <div>
                            <label className='content_heding'>Status: </label>
                            <select
                                className='agent_input'
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="not active">Not Active</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="button" className='agent_back' onClick={() => navigate(-1)}>Back</button>
                        <button type="submit" className='submit_btn'>Update</button>
                    </div>
                </form>

                {message && (
                    <p style={{ color: error ? 'red' : 'green', fontWeight: 'bold', marginTop: '20px' }} >
                        {message}
                    </p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default UpdateAgent;
