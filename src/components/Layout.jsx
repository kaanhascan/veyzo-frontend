import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Navbar />

            <Outlet />
        </div>
    );
};

export default Layout;