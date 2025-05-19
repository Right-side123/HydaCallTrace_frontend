import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import './CdrReport.css';
import * as XLSX from 'xlsx';
import 'font-awesome/css/font-awesome.min.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

function InboundCallsPage() {
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
            const response = await axios.get(`${API_URL}/inbound/${managerId}`, {
                params: {
                    startDate,
                    endDate,
                    startTime,
                    endTime
                }
            });

            if (response.data.cdr_data && response.data.cdr_data.length === 0) {
                setNoDataMessage('No Records Found.');
                setCdrData([])
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
            'S.N.', 'Call Date/Time', 'Call-Type', 'OverAll-Call-Status', 'Agent-Name', 'Agent-Number', 'Customer-Number', 'Customer-Name', 'Date', 'Time', 'Caller-Operator-Name', 'Caller-Circle-Name',
            'Client-Correlation-Id', 'Caller-Id-Type', 'Caller-Id-Circle', 'Caller-Status', 'Caller-Duration', 'Start-Time', 'End-Time', 'Duration', 'OverAll-Call-Duration', 'Conversation-Duration',
            'Destination-Operator-Name', 'Destination-Circle-Name', 'Destination-Name', 'Destination-Status', 'Destination-Number', 'From-Waiting-Time', 'Participant-Address',
            'Participant-Number-Type', 'HangUp-Cause'
        ];
        const dataWithHeaders = cdrData.map((cdr, index) => ({
            'S.N.': index + 1,
            'Call Date/Time': formatDate(cdr.timestamp),
            'Call-Type': cdr.Call_Type,
            'OverAll-Call-Status': cdr.Overall_Call_Status,
            'Agent-Name': cdr.agentname,
            'Agent-Number': cdr.agentmobile,
            'Customer-Number': cdr.customer_number,
            'Customer-Name': cdr.Customer_Name,
            'Date': cdr.date,
            'Time': cdr.Time,
            'Caller-Operator-Name': cdr.Caller_Operator_Name,
            'Caller-Circle-Name': cdr.Caller_Circle_Name,
            'Client-Correlation-Id': cdr.Client_Correlation_Id,
            'Caller-Id-Type': cdr.calleridType,
            'Caller-Id-Circle': cdr.callerIdCircle,
            'Caller-Status': cdr.Caller_Status,
            'Caller-Duration': cdr.Caller_Duration,
            'Start-Time': cdr.startTime,
            'End-Time': cdr.endTime,
            'Duration': cdr.duration,
            'OverAll-Call-Duration': cdr.Overall_Call_Duration,
            'Conversation-Duration': cdr.conversationDuration,
            'Destination-Operator-Name': cdr.Destination_Operator_Name,
            'Destination-Circle-Name': cdr.Destination_Circle_Name,
            'Destination-Name': cdr.Destination_Name,
            'Destination-Status': cdr.Destination_Status,
            'Destination-Number': cdr.Destination_Number,
            'From-Waiting-Time': cdr.fromWaitingTime,
            'Participant-Address': cdr.participantAddress,
            'Participant-Number-Type': cdr.participantNumberType,
            'HangUp-Cause': cdr.Hangup_Cause

        }));
        const sheetData = [headers, ...dataWithHeaders.map(row => Object.values(row))];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
        XLSX.writeFile(wb, 'Inbound Calls.xlsx');
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
            <div className="inboundCdrPage">
                <h1 className='inboundpage_heading'>Inbound Calls</h1>

                {cdrData.length > 0 && (
                    <div className="total-records_container">
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
                                <th>OverAll-Call-Status</th>
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
                                <th>Caller-Status</th>
                                <th>Caller-Duration</th>
                                <th>Start-Time</th>
                                <th>End-Time</th>
                                <th>Duration</th>
                                <th>OverAll-Call-Duration</th>
                                <th>Conversation-Duration</th>
                                <th>Destination-Operator-Name</th>
                                <th>Destination-Circle-Name</th>
                                <th>Destination-Name</th>
                                <th>Destination-Status</th>
                                <th>Destination-Number</th>
                                <th>From-Waiting-Time</th>
                                <th>Participant-Address</th>
                               
                                <th>Participant-Number-Type</th>
                                <th>Recording...</th>
                                <th>HangUp-Cause</th>

                            </tr>
                        </thead>
                        <tbody className='cdr_tbody'>
                            {cdrData.map((cdr, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(cdr.timestamp)}</td>
                                    <td>{cdr.Call_Type}</td>
                                    <td>{cdr.Overall_Call_Status}</td>
                                    <td>{cdr.agentname}</td>
                                    <td>{cdr.agentmobile}</td>
                                    <td>{cdr.Caller_Number}</td>
                                    <td>{cdr.Customer_Name}</td>
                                    <td>{cdr.date}</td>
                                    <td>{cdr.Time}</td>
                                    <td>{cdr.Caller_Operator_Name}</td>
                                    <td>{cdr.Caller_Circle_Name}</td>
                                    <td>{cdr.Client_Correlation_Id}</td>
                                    <td>{cdr.calleridType}</td>
                                    <td>{cdr.callerIdCircle}</td>
                                    <td>{cdr.Caller_Status}</td>
                                    <td>{cdr.Caller_Duration}</td>
                                    <td>{cdr.startTime}</td>
                                    <td>{cdr.endTime}</td>
                                    <td>{cdr.duration}</td>
                                    <td>{cdr.Overall_Call_Duration}</td>
                                    <td>{cdr.conversationDuration}</td>
                                    <td>{cdr.Destination_Operator_Name}</td>
                                    <td>{cdr.Destination_Circle_Name}</td>
                                    <td>{cdr.Destination_Name}</td>
                                    <td>{cdr.Destination_Status}</td>
                                    <td>{cdr.Destination_Number}</td>
                                    <td>{cdr.fromWaitingTime}</td>
                                    <td>{cdr.participantAddress}</td>
                                   
                                    <td>{cdr.participantNumberType}</td>
                                    <td onClick={() => handleRecordingClick(cdr.Recording)} className='custom_recording'>
                                        {cdr.Recording}
                                    </td>
                                    <td>{cdr.Hangup_Cause}</td>
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

export default InboundCallsPage;
