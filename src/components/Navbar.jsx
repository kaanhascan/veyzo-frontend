import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="nav-brand">
                <div className="brand-badge">V</div>
                Veyzo
            </Link>

            <div className="nav-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/extract-audio" className="nav-link">Sesi Ayrıştır</Link>
                <p className="nav-link">Video Birleştirme(Yakında)</p>
                <Link to="/upload" className="nav-link">Toplu Yükle</Link>
                <Link to="/profile" className="nav-link">Profil</Link>


                <button
                    onClick={handleLogout}
                    className="table-button danger"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                >
                    Çıkış
                </button>
            </div>
        </nav>
    );
};

export default Navbar;