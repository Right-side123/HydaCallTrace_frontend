import './Header.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import rightsideLogo from './Assets/rightsidelogo.svg';
import locationicon from './Assets/locationIcon.png';
import mailicon from './Assets/emailIcon.png';
import whatsappicon from './Assets/whatsappicon.png'
import callicon from './Assets/callIcon.png';


const Header = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState('');
  const [supportModel, setSupportModel] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();


      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');


      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');


      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      setDateTime(formattedDate);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('manager_id');
    localStorage.removeItem('manager_name');
    localStorage.setItem('logout_event', Date.now());

    toast.success("You are logged out!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      navigate('/');
    }, 1500);

  };

  const handleSupportClick = () => {
    setSupportModel(true);
  };

  // const handleCloseModal = () => {
  //   setSupportModel(false);
  // };


  return (
    <div>
      <header className="header">
        <div className="header_content">
          <div className='header_firstdivlogo'>
            <a href="https://www.rightside.co.in" target='blank' className="header_logo">
              <img src={rightsideLogo} alt='rightside_logo' className='header_rightside_logo' />
            </a>

            <span className='date_time'>
              <i className="fas fa-clock"></i> {dateTime}
            </span>
          </div>
          <div className='header_logout_container'>
            <button className="support_button"
              onClick={handleSupportClick} onMouseOver={() => setSupportModel(true)} onMouseOut={() => setSupportModel(false)}>Support</button>
            <button onClick={handleLogout} className="logout_button">Logout <i className="fa fa-sign-out" aria-hidden="true"></i></button>
          </div>

        </div>

      </header>
      {supportModel && (
        <div className='support_page'>
          <div className='Support_Container'>
            <div className='contact_details_container'>
              <h1 className='contactdetails_heading'>Contact Details</h1>
              <div className='location_details'>
                <img src={locationicon} alt='address' className='location_icon' />
                <span className='contact_details'>10th Floor, Aston tower, Sundervan Complex, <br />
                  Shashtri Nagar, Andheri West, Mumbai, 400053, <br />
                  Maharashtra, India.</span><br />
              </div>
              <div>
                <img src={mailicon} alt='e-mail' className='mail_icon' />
                <span className="contact_email">
                  <NavLink to="mailto:helpdesk@rightside.co.in" className="contact_email">helpdesk@rightside.co.in</NavLink>
                </span><br />
              </div>
              <div className='phone_container'>
                <img src={whatsappicon} alt='call' className='call_icon' />
                <span className='contact_phone'>
                  <NavLink to="tel:9987324949" className="contact_phone">+91 99873 24949</NavLink>
                </span>
              </div>
              <div className='phone_container'>
                <img src={callicon} alt='landline' className='call_icon' />
                <span className='contact_phone'>
                  <NavLink to="tel:2268996899" className="contact_phone"> +91 22 6899 6899</NavLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Header;
