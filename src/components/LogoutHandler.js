import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogoutEvent = (event) => {

            if (event.key === 'logout_event') {

                localStorage.removeItem('access_token');
                localStorage.removeItem('manager_id');
                navigate('/');
            }
        };

        window.addEventListener('storage', handleLogoutEvent);


        return () => {
            window.removeEventListener('storage', handleLogoutEvent);
        };
    }, [navigate]);

    return null;
};

export default LogoutHandler;
