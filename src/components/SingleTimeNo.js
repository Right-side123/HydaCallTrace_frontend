import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './CdrReport.css';
import * as XLSX from 'xlsx';
import 'font-awesome/css/font-awesome.min.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

function SingleTimeNo() {
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


    function formatDuration(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // function formatTime(timeStr) {
    //     const parts = timeStr.split(":");
    //     if (parts.length === 2) {
    //         const minutes = parseInt(parts[0], 10);
    //         const seconds = parseInt(parts[1], 10);

    //         const hours = Math.floor(minutes / 60);
    //         const remainingMinutes = minutes % 60;

    //         return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    //     }
    //     return timeStr;
    // }


    function formatEpochToTime(epochTime) {
        if (!epochTime) return "00:00:00";
        const date = new Date(Number(epochTime));
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

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
            'S.N.', 'Call Date/Time', 'Call-Type', 'Call-Status', 'Agent-Name', 'Agent-Number', 'Customer-Number', 'Caller-Circle-Name',
            'Destination-Circle-Name', 'Start-Time', 'End-Time', 'Duration', 'Talk-Time',
            'Destination-Number', 'HangUp-Cause'
        ];
        const dataWithHeaders = cdrData.map((cdr, index) => ({
            'S.N.': index + 1,
            'Call Date/Time': formatDate(cdr.timestamp),
            'Call-Type': cdr.Call_Type,
            'Call-Status': cdr.Caller_Status,
            'Agent-Name': cdr.agentname,
            'Agent-Number': cdr.agentmobile,
            'Customer-Number': cdr.customer_number,

            'Caller-Circle-Name': cdr.Caller_Circle_Name,
            'Destination-Circle-Name': cdr.Destination_Circle_Name,
            'Start-Time': formatEpochToTime(cdr.startTime),
            'End-Time': formatEpochToTime(cdr.endTime),
            'Duration': formatDuration(cdr.duration),

            'Talk-Time': formatDuration(cdr.conversationDuration),
            'Destination-Number': cdr.Destination_Number,

            'HangUp-Cause': cdr.Hangup_Cause

        }));
        const sheetData = [headers, ...dataWithHeaders.map(row => Object.values(row))];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
        XLSX.writeFile(wb, 'UniqueCDR.xlsx');
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
                        <button onClick={fetchCdrData} className='cdr_refresh_btn'>
                            <i className="fa fa-refresh"></i> Refresh
                        </button>
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
                                <option value="OUTBOUND">Outbound</option>
                                <option value="INBOUND">Inbound</option>

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
                        <button onClick={handleBack} className='dwldbtn_backsss'>Back</button>
                        <button onClick={downloadExcel} className='cdr__dwldbtn'>Download</button>
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

                                <th>Caller-Circle-Name</th>
                                <th>Destination-Circle-Name</th>
                                <th>Start-Time</th>
                                <th>End-Time</th>
                                <th>Duration</th>

                                <th>Talk-Time</th>
                                <th>Destination-Number</th>

                                <th>HangUp-Cause</th>
                                <th>Recording...</th>
                            </tr>
                        </thead>
                        <tbody className='cdr_tbody'>
                            {cdrData.map((cdr, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(cdr.timestamp)}</td>
                                    <td>{cdr.Call_Type}</td>
                                    <td>{cdr.Caller_Status}</td>
                                    <td>{cdr.agentname}</td>
                                    <td>{cdr.agentmobile}</td>
                                    <td>{cdr.customer_number}</td>

                                    <td>{cdr.Caller_Circle_Name}</td>
                                    <td>{cdr.Destination_Circle_Name}</td>
                                    <td>{formatEpochToTime(cdr.startTime)}</td>
                                    <td>{formatEpochToTime(cdr.endTime)}</td>
                                    <td>{formatDuration(cdr.duration)}</td>

                                    <td>{formatDuration(cdr.conversationDuration)}</td>
                                    <td>{cdr.Destination_Number}</td>

                                    <td>{cdr.Hangup_Cause}</td>
                                    <td onClick={() => handleRecordingClick(cdr.Recording)} className='custom_recording'>
                                        {cdr.Recording}
                                    </td>
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
