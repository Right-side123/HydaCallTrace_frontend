import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import rightsideLogo from './Assets/mainlogo.svg';
import Footer from './Footer';
import LoginHeader from './LoginHeader';
const API_URL = process.env.REACT_APP_API_URL;

const LoginPage = () => {
  const [managerName, setManagerName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const managerNameLower = managerName.toLowerCase();

    try {
      const response = await axios.post(`${API_URL}/login`, {
        manager_name: managerNameLower,
        password: password,
      });


      localStorage.setItem('access_token', response.data.accessToken);
      localStorage.setItem('manager_id', response.data.manager_id);
      localStorage.setItem('manager_name', response.data.manager_name);
      // localStorage.setItem('agents', JSON.stringify(response.data.agents)); 

      console.log("Login successful, redirecting...");

      toast.success("Login Successful!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError('Invalid credentials or server error');
      console.error(err);
    }
  };

  return (
    <div>
      <LoginHeader />
      <div className="login-container">
        <div className="login_form_container">
          <img src={rightsideLogo} alt="rightside_logo" className="header_rightside_logo" />
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="managerName" className="labelname">Manager Name:</label>
                <input
                  className="labelname"
                  type="text"
                  id="managerName"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="labelname">Password:</label>
                <input
                  className="labelname"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="login-button">Login</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
