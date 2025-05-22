import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './CdrReport.css';
import * as XLSX from 'xlsx';
import 'font-awesome/css/font-awesome.min.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

function OutboundCallsPage() {
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
            const response = await axios.get(`${API_URL}/outbound/${managerId}`, {
                params: {
                    startDate,
                    endDate,
                    startTime,
                    endTime
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

    function formatTime(timeStr) {
        const parts = timeStr.split(":");
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);

            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;

            return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }
        return timeStr;
    }


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
            'S.N.', 'Call Date/Time', 'Call-Type', 'Call-Status', 'OverAll-Call-Status', 'Agent-Name', 'Agent-Number', 'Customer-Number', 'Date', 'Time', 'Caller-Circle-Name',
            'Destination-Circle-Name', 'Start-Time', 'End-Time', 'Duration', 'OverAll-Call-Duration', 'Talk-Time', 'Conversation-Duration',
            'Destination-Number', 'From-Waiting-Time', 'HangUp-Cause'
        ];
        const dataWithHeaders = cdrData.map((cdr, index) => ({
            'S.N.': index + 1,
            'Call Date/Time': formatDate(cdr.timestamp),
            'Call-Type': cdr.Call_Type,
            'Call-Status': cdr.Caller_Status,
            'OverAll-Call-Status': cdr.Overall_Call_Status,
            'Agent-Name': cdr.agentname,
            'Agent-Number': cdr.agentmobile,
            'Customer-Number': cdr.Destination_Number,
            'Date': cdr.date,
            'Time': cdr.Time,
            'Caller-Circle-Name': cdr.Caller_Circle_Name,
            'Destination-Circle-Name': cdr.Destination_Circle_Name,
            'Start-Time': formatEpochToTime(cdr.startTime),
            'End-Time': formatEpochToTime(cdr.endTime),
            'Duration': formatDuration(cdr.duration),
            'OverAll-Call-Duration': formatTime(cdr.Overall_Call_Duration),
            'Talk-Time': formatTime(cdr.Caller_Duration),
            'Conversation-Duration': formatDuration(cdr.conversationDuration),
            'Destination-Number': cdr.Destination_Number,
            'From-Waiting-Time': formatDuration(cdr.fromWaitingTime),
            'HangUp-Cause': cdr.Hangup_Cause


        }));
        const sheetData = [headers, ...dataWithHeaders.map(row => Object.values(row))];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
        XLSX.writeFile(wb, 'Outbound Calls.xlsx');
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
            <div className="outboundCdrPage">
                <h1 className='outboundpage_heading'>Outbound Calls</h1>


                {cdrData.length > 0 && (
                    <div className="total-records_container">
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
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        {/* <div>

                        </div> */}

                        <div>
                            <label className='select_type'>End Date:</label>
                            <input
                                className='select_option'
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <input
                                className='select_time'
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        {/* <div>

                        </div> */}
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
                                <th>OverAll-Call-Status</th>
                                <th>Agent-Name</th>
                                <th>Agent-Number</th>
                                <th>Customer-Number</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Caller-Circle-Name</th>
                                <th>Destination-Circle-Name</th>
                                <th>Start-Time</th>
                                <th>End-Time</th>
                                <th>Duration</th>
                                <th>OverAll-Call-Duration</th>
                                <th>Talk-Time</th>
                                <th>Conversation-Duration</th>
                                <th>Destination-Number</th>
                                <th>From-Waiting-Time</th>
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
                                    <td>{cdr.Overall_Call_Status}</td>
                                    <td>{cdr.agentname}</td>
                                    <td>{cdr.agentmobile}</td>
                                    <td>{cdr.Destination_Number}</td>
                                    <td>{cdr.date}</td>
                                    <td>{cdr.Time}</td>
                                    <td>{cdr.Caller_Circle_Name}</td>
                                    <td>{cdr.Destination_Circle_Name}</td>
                                    <td>{formatEpochToTime(cdr.startTime)}</td>
                                    <td>{formatEpochToTime(cdr.endTime)}</td>
                                    <td>{formatDuration(cdr.duration)}</td>
                                    <td>{formatTime(cdr.Overall_Call_Duration)}</td>
                                    <td>{formatTime(cdr.Caller_Duration)}</td>
                                    <td>{formatDuration(cdr.conversationDuration)}</td>
                                    <td>{cdr.Destination_Number}</td>
                                    <td>{formatDuration(cdr.fromWaitingTime)}</td>
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

            {/* Modal for Audio Playback */}

            {modalOpen && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span
                            className="close-btn"
                            onClick={() => setModalOpen(false)}
                        >
                            &times;
                        </span>
                        <span className='close_x_btn' onClick={handleCloseModal}>
                            <i className="fas fa-close"></i>
                        </span>
                        <h3 className='model_heading'>Recording...</h3>
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

export default OutboundCallsPage;
