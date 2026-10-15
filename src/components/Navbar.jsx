import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/compress-video', label: 'Videoyu Sıkıştır' },
    { to: '/extract-gif', label: 'GIF Ayrıştır' },
    { to: '/extract-audio', label: 'Sesi Ayrıştır' },
    { to: '/merge-videos', label: 'Videoları Birleştir' },
    { to: '/upload', label: 'Toplu Yükle' },
    { to: '/profile', label: 'Profil' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu", error);
        } finally {
            setOpen(false);
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="nav-brand" onClick={() => setOpen(false)}>
                <div className="brand-badge">V</div>
                Veyzo
            </Link>

            <button
                type="button"
                className="nav-toggle"
                aria-label="Menüyü aç/kapat"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                {open ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${open ? 'open' : ''}`}>
                {links.map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        onClick={() => setOpen(false)}
                    >
                        {l.label}
                    </NavLink>
                ))}

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