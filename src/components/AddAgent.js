// import React, { useState } from 'react';
// import axios from 'axios';
// import './Agent.css';
// import Header from './Header';
// import Footer from './Footer';
// import { useNavigate } from 'react-router-dom';
// const API_URL = process.env.REACT_APP_API_URL;

// const AddAgent = () => {
//     const [agentname, setAgentname] = useState('');
//     const [agentmobile, setAgentmobile] = useState('');
//     const [managername, setManagername] = useState('');
//     const [department, setDepartment] = useState('');
//     const [imei_no, setImeino] = useState('');
//     const [status, setStatus] = useState('active');
//     const [message, setMessage] = useState('');
//     const [Error, setError] = useState(false);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const agentData = {
//             agentname,
//             agentmobile,
//             managername,
//             department,
//             imei_no,
//             status
//         };

//         try {
//             await axios.post(`${API_URL}/insertagent`, agentData);
//             setMessage('Agent added successfully!');
//             setError(false);
//             // clear form
//             setAgentname('');
//             setAgentmobile('');
//             setManagername('');
//             setDepartment('');
//             setImeino('');
//             setStatus('active');
//         } catch (error) {
//             console.error('Error adding agent:', error);
//             setMessage('Failed to add agent.');
//             setError(true);
//         }

//     };

//     const handleBackAgents = () => {
//         navigate(-1);
//     };

//     return (
//         <div>
//             <Header />
//             <div className='main_parent_container'>
//                 <h2>Add Agent</h2>

//                 <form onSubmit={handleSubmit}>
//                     <div className='agent_name_container'>
//                         <div>
//                             <label className='content_heding'>Agent Name: </label>
//                             <input
//                                 className='agent_input'
//                                 type="text"
//                                 value={agentname}
//                                 onChange={(e) => setAgentname(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className='content_heding'>Agent Mobile: </label>
//                             <input
//                                 className='agent_input'
//                                 type="text"
//                                 value={agentmobile}
//                                 onChange={(e) => setAgentmobile(e.target.value)}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className='agent_name_container'>
//                         <div>
//                             <label className='content_heding'>Manager Name: </label>
//                             <input
//                                 className='agent_input'
//                                 type="text"
//                                 value={managername}
//                                 onChange={(e) => setManagername(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className='content_heding'>Department: </label>
//                             <input
//                                 className='agent_input'
//                                 type="text"
//                                 value={department}
//                                 onChange={(e) => setDepartment(e.target.value)}
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div className='agent_name_container'>
//                         <div>
//                             <label className='content_heding'>IMEI No: </label>
//                             <input
//                                 className='agent_input'
//                                 type="text"
//                                 value={imei_no}
//                                 onChange={(e) => setImeino(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className='content_heding'>Status: </label>
//                             <select
//                                 className='agent_input'
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}
//                                 required
//                             >
//                                 <option value="active">Active</option>
//                                 <option value="not active">Not Active</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div>
//                         <button className='agent_back' onClick={handleBackAgents}>Back</button>
//                         <button type="submit" className='submit_btn'>Submit</button>
//                     </div>

//                 </form>
//                 {message && (
//                     <p style={{ color: Error ? 'red' : 'green', fontWeight: 'bold', marginTop: '20px' } } >
//                         {message}
//                     </p>
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default AddAgent;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Agent.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const AddAgent = () => {
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

    const navigate = useNavigate();

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await axios.get(`${API_URL}/manager`);
                setManagers(response.data.managers || []);
            } catch (error) {
                console.error('Error fetching managers:', error);
            }
        };

        fetchManagers();
    }, []);

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
            await axios.post(`${API_URL}/insertagent`, agentData);
            setMessage('Agent added successfully!');
            setError(false);

            // Clear form
            setAgentname('');
            setAgentmobile('');
            setSelectedManagerName('');
            setDepartment('');
            setImeino('');
            setSIM_No('');
            setStatus('active');
        } catch (error) {
            console.error('Error adding agent:', error);
            setMessage('Failed to add agent.');
            setError(true);
        }
    };

    const handleBackAgents = () => {
        navigate(-1);
    };

    return (
        <div>
            <Header />
            <div className='main_parent_container'>
                <h2>Add Agent</h2>

                <form onSubmit={handleSubmit}>
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
                            <label className='content_heding'>Agent Mobile: </label>
                            <input
                                className='agent_input'
                                type="text"
                                value={agentmobile}
                                onChange={(e) => setAgentmobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='agent_name_container'>

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
                            <label className='content_heding'>Department: </label>
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
                        <button type="button" className='agent_back' onClick={handleBackAgents}>Back</button>
                        <button type="submit" className='submit_btn'>Submit</button>
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

export default AddAgent;

