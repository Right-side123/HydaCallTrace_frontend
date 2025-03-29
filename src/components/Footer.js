import React from 'react'
import './Footer.css';
import linkedimg from './Assets/linkedin.svg';
import instaimg from './Assets/Instagram.svg';
import facebookimg from './Assets/faceboook.png';

const Footer = () => {
    return (
        <div>

            <div className="page_footer">
                <div className='icon_container'>
                    <a href="https://www.linkedin.com/company/6458395" target='blank'>
                        <img src={linkedimg} className='linkedicon' alt='linkedin' />
                    </a>
                    <a href="https://www.instagram.com/rsbspl/" target='blank'>
                        <img src={instaimg} className='linkedicon' alt='instagram' />
                    </a>
                    <a href="https://www.facebook.com/rightsidebusinesssolutions/" target='blank'>
                        <img src={facebookimg} className='facebookicon' alt='facebook' />
                    </a>
                </div>
                <div className="page_footer_fixed"> 2025 ©
                    <a href="https://www.rightside.co.in" target='blank' className="footer_content">
                        <span> Powered by RIGHT SIDE BUSINESS SOLUTIONS PRIVATE LIMITED</span>
                    </a>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Footer;
