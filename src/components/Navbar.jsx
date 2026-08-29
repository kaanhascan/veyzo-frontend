import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu", error);
        } finally {
            navigate('/login');
        }
    };
    return (
        <nav className="navbar">
            <Link to="/dashboard" className="nav-brand">
                <div className="brand-badge">V</div>
                Veyzo
            </Link>

            <div className="nav-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/compress-video" className="nav-link">Videoyu Sıkıştır</Link>
                <Link to="/extract-gif" className="nav-link">GIF Ayrıştır</Link>
                <Link to="/extract-audio" className="nav-link">Sesi Ayrıştır</Link>
                <Link to="/merge-videos" className="nav-link">Videoları Birleştir</Link>
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