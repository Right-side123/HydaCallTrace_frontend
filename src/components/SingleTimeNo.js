import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './CdrReport.css';
import * as XLSX from 'xlsx';
import 'font-awesome/css/font-awesome.min.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

function SingleTimeNo () {
    const [managerId, setManagerId] = useState('');
    const [cdrData, setCdrData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [showDateSelector, setShowDateSelector] = useState(true);
    const [noDataMessage, setNoDataMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRecording, setSelectedRecording] = useState('');
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');

    const [callFilter, setCallFilter] = useState('all');
    const [callStatusFilter, setCallStatusFilter] = useState('all');

    const handleFilterChange = (e) => {
        setCallFilter(e.target.value);
    };

    const handleCallStatusChange = (e) => {
        setCallStatusFilter(e.target.value);
    }



    useEffect(() => {
        const fetchAgents = async () => {
            if (!managerId) return;

            try {
                const response = await axios.get(`${API_URL}/agents/${managerId}`);
                setAgents(response.data.agents || []);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        fetchAgents();
    }, [managerId]);

    useEffect(() => {
        const currentDate = new Date();
        const localDate = currentDate.toLocaleDateString('en-CA');
        setStartDate(localDate);
        setEndDate(localDate);
    }, []);

    useEffect(() => {
        const storedManagerId = localStorage.getItem('manager_id');
        if (storedManagerId) {
            setManagerId(storedManagerId);
        }
    }, []);

    const fetchCdrData = async () => {
        if (!managerId) {
            setError('Manager ID is missing');
            return;
        }

        if (!startDate || !endDate || !startTime || !endTime) {
            setError('Please select both start and end dates.');
            return;
        }

        setLoading(true);
        setError('');
        setNoDataMessage('');

        try {
            const response = await axios.get(`${API_URL}/cdrsingletime/${managerId}`, {
                params: {
                    startDate,
                    endDate,
                    startTime,
                    endTime,
                    filter: callFilter,
                    callStatus: callStatusFilter,
                    agent: selectedAgent || undefined
                }
            });

            if (response.data.cdr_data && response.data.cdr_data.length === 0) {
                setNoDataMessage('No Records Found.');
                setCdrData([]);
            }
            setCdrData(response.data.cdr_data);
            setShowDateSelector(false);

        } catch (err) {
            console.error('Error fetching CDR data:', err);
            setError('Failed to fetch CDR data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return ' ';
        }
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const downloadExcel = () => {
        const headers = [
            'S.N.', 'Call Date/Time', 'Call-Type', 'Call-Status', 'Agent-Name', 'Agent-Number', 'Customer-Number', 'Customer-Name', 'Date', 'Time', 'Caller-Operator-Name', 'Caller-Circle-Name',
            'Caller-Correlation-Id', 'Caller-Id-Type', 'Caller-Id-Circle', 'Caller-Number-Status', 'Caller-Duration', 'Start-Time', 'End-Time', 'Duration', 'OverAll-Call-Duration', 'Conversation-Duration',
            'Destination-Operator-Name', 'Destination-Circle-Name', 'Destination-Name', 'Destination-Number-Status', 'Destination-Number', 'From-Waiting-Time', 'Customer-Id', 'Participant-Address',
            'Participant-Number-Type', 'Participant-Start-Time', 'Participant-End-Time', 'Participant-Duration', 'HangUp-Cause'
        ];
        const dataWithHeaders = cdrData.map((cdr, index) => ({
            'S.N.': index + 1,
            'Call Date/Time': formatDate(cdr.timestamp),
            'Call-Type': cdr.call_type,
            'Call-Status': cdr.overall_call_status,
            'Agent-Name': cdr.agentname,
            'Agent-Number': cdr.agentmobile,
            'Customer-Number': cdr.customer_number,
            'Customer-Name': cdr.customer_name,
            'Date': formatDate(cdr.date),
            'Time': cdr.time,
            'Caller-Operator-Name': cdr.caller_operator_name,
            'Caller-Circle-Name': cdr.caller_circle_name,
            'Caller-Correlation-Id': cdr.client_correlation_id,
            'Caller-Id-Type': cdr.caller_id_type,
            'Caller-Id-Circle': cdr.caller_id_circle,
            'Caller-Number-Status': cdr.caller_number_status,
            'Caller-Duration': cdr.caller_duration,
            'Start-Time': cdr.start_time,
            'End-Time': cdr.end_time,
            'Duration': cdr.duration,
            'OverAll-Call-Duration': cdr.overall_call_duration,
            'Conversation-Duration': cdr.conversation_duration,
            'Destination-Operator-Name': cdr.destination_operator_name,
            'Destination-Circle-Name': cdr.destination_circle_name,
            'Destination-Name': cdr.destination_name,
            'Destination-Number-Status': cdr.destination_number_status,
            'Destination-Number': cdr.destination_number,
            'From-Waiting-Time': cdr.from_waiting_time,
            'Customer-Id': cdr.customer_id,
            'Participant-Address': cdr.participant_address,
            'Participant-Number-Type': cdr.participant_number_type,
            'Participant-Start-Time': cdr.participant_start_time,
            'Participant-End-Time': cdr.participant_end_time,
            'Participant-Duration': cdr.participant_duration,
            'HangUp-Cause': cdr.hangup_cause

        }));
        const sheetData = [headers, ...dataWithHeaders.map(row => Object.values(row))];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
        XLSX.writeFile(wb, 'OnetimeNumberCDR.xlsx');
    };

    const handleBack = () => {
        setCdrData([]);
        setShowDateSelector(true);
        setNoDataMessage('');
    };

    const handleRecordingClick = (recordingUrl) => {
        setSelectedRecording(recordingUrl);
        setModalOpen(true);
    };

    const handleDownload = () => {
        if (selectedRecording) {
            const link = document.createElement('a');
            link.href = selectedRecording;
            link.download = selectedRecording.split('/').pop();
            link.click();
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleBackAgents = () => {
        navigate(-1)
    }

    return (
        <div>
            <Header />
            <div className="CdrReportPage">
                <h1 className='page_heading'>Unique Calls</h1>

                {cdrData.length > 0 && (
                    <div total_records_container>
                        <p className='total_records'>Total Records: {cdrData.length}</p>
                    </div>
                )}

                {showDateSelector && (
                    <div className="date-input-container">
                        <div className='container2'>
                            <label className='select_type'>Start Date:</label>
                            <input
                                className='select_option'
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <input
                                className='select_time'
                                type='time'
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        {/* <div>

                        </div> */}

                        <div className='container2'>
                            <label className='select_type'>End Date:</label>
                            <input
                                className='select_option'
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <input
                                className='select_time'
                                type='time'
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        {/* <div>

                        </div> */}

                        <div className='container2'>
                            <label className='select_type'>Agents:</label>
                            <select
                                className='select_option'
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                            >
                                <option value="">All</option>
                                {agents.map((agent, index) => (
                                    <option key={index} value={agent.agentmobile}>
                                        {agent.agentname} ({agent.agentmobile})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="container2">
                            <label className='select_type'>Call Type: </label>
                            <select value={callFilter} onChange={handleFilterChange} className='select_option'>
                                <option value="all">All</option>
                                <option value="outbound">Outbound</option>
                                <option value="inbound">Inbound</option>

                            </select>
                        </div>

                        <div className="filter-container">
                            <label className='select_type'>Call Status: </label>
                            <select value={callStatusFilter} onChange={handleCallStatusChange} className='select_option'>
                                <option value="all">All</option>
                                <option value="ANSWERED">Answered</option>
                                <option value="Missed">Missed</option>

                            </select>
                        </div>

                    </div>
                )}

                {!loading && !cdrData.length && !noDataMessage && (
                    <div>
                        <button className='cdr_back_dwldbtn_back' onClick={handleBackAgents}>Back</button>
                        <button onClick={fetchCdrData} disabled={loading} className='cdr_back_dwldbtn'>
                            {loading ? 'Loading...' : 'Get Data'}
                        </button>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                {noDataMessage && (
                    <div>
                        <p className="no-data-message">{noDataMessage}</p>
                        <button onClick={handleBack} className='cdr_back_dwldbtn'>Back</button>
                    </div>
                )}

                {cdrData.length > 0 && (
                    <div className="buttons-container">
                        <button onClick={handleBack} className='dwldbtn_back'>Back</button>
                        <button onClick={downloadExcel} className='cdr_back_dwldbtn'>Download</button>
                    </div>
                )}

                {cdrData.length > 0 && (
                    <table className={modalOpen ? 'blurred' : 'cdr_table'}>
                        <thead>
                            <tr>
                                <th>S.N.</th>
                                <th>Call Date/Time</th>
                                <th>Call-Type</th>
                                <th>Call-Status</th>
                                <th>Agent-Name</th>
                                <th>Agent-Number</th>
                                <th>Customer-Number</th>
                                <th>Customer-Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Caller-Oprator-Name</th>
                                <th>Caller-Circle-Name</th>
                                <th>Client-Correlation-Id</th>
                                <th>Caller-Id-Type</th>
                                <th>Caller-Id-Circle</th>
                                <th>Caller-Number-Status</th>
                                <th>Caller-Duration</th>
                                <th>Start-Time</th>
                                <th>End-Time</th>
                                <th>Duration</th>
                                <th>OverAll-Call-Duration</th>
                                <th>Conversation-Duration</th>
                                <th>Destination-Operator-Name</th>
                                <th>Destination-Circle-Name</th>
                                <th>Destination-Name</th>
                                <th>Destination-Number-Status</th>
                                <th>Destination-Number</th>
                                <th>From-Waiting-Time</th>
                                <th>Customer-Id</th>
                                <th>Participant-Address</th>
                                <th>Participant-Number-Type</th>
                                <th>Participant-Start-Time</th>
                                <th>Participant-End-Time</th>
                                <th>Participant-Duration</th>
                                <th>Recording...</th>
                                <th>HangUp-Cause</th>

                            </tr>
                        </thead>
                        <tbody className='cdr_tbody'>
                            {cdrData.map((cdr, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(cdr.timestamp)}</td>
                                    <td>{cdr.call_type}</td>
                                    <td>{cdr.overall_call_status}</td>
                                    <td>{cdr.agentname}</td>
                                    <td>{cdr.agentmobile}</td>
                                    <td>{cdr.customer_number}</td>
                                    <td>{cdr.customer_name}</td>
                                    <td>{formatDate(cdr.date)}</td>
                                    <td>{cdr.time}</td>
                                    <td>{cdr.caller_operator_name}</td>
                                    <td>{cdr.caller_circle_name}</td>
                                    <td>{cdr.client_correlation_id}</td>
                                    <td>{cdr.caller_id_type}</td>
                                    <td>{cdr.caller_id_circle}</td>
                                    <td>{cdr.caller_number_status}</td>
                                    <td>{cdr.caller_duration}</td>
                                    <td>{cdr.start_time}</td>
                                    <td>{cdr.end_time}</td>
                                    <td>{cdr.duration}</td>
                                    <td>{cdr.overall_call_duration}</td>
                                    <td>{cdr.conversation_duration}</td>
                                    <td>{cdr.destination_operator_name}</td>
                                    <td>{cdr.destination_circle_name}</td>
                                    <td>{cdr.destination_name}</td>
                                    <td>{cdr.destination_number_status}</td>
                                    <td>{cdr.destination_number}</td>
                                    <td>{cdr.from_waiting_time}</td>
                                    <td>{cdr.customer_id}</td>
                                    <td>{cdr.participant_address}</td>
                                    <td>{cdr.participant_number_type}</td>
                                    <td>{cdr.participant_start_time}</td>
                                    <td>{cdr.participant_end_time}</td>
                                    <td>{cdr.participant_duration}</td>
                                    <td onClick={() => handleRecordingClick(cdr.recording)} className='custom_recording'>
                                        {cdr.recording}
                                    </td>
                                    <td>{cdr.hangup_cause}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {modalOpen && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setModalOpen(false)}>
                            &times;
                        </span>
                        <span className='close_x_btn' onClick={handleCloseModal}>
                            <i className="fas fa-close"></i>
                        </span>
                        <h3 className='modelRecordinfHeading'>Recording...</h3>
                        <audio controls>
                            <source src={selectedRecording} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        <button onClick={handleDownload} className="download_btn">
                            <i className="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default SingleTimeNo;
