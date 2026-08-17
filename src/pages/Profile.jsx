import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Profil bilgileri alınırken bir hata oluştu.');
            setLoading(false);

            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwt_token');
                navigate('/login');
            }
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page" style={{ paddingTop: '20px' }}>
                <div className="dashboard-shell" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                    Bilgileriniz yükleniyor...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page" style={{ paddingTop: '20px' }}>
                <div className="dashboard-shell"><div className="alert">{error}</div></div>
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ paddingTop: '20px' }}>
            <div className="dashboard-shell" style={{ maxWidth: '600px' }}>
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Profilim</h2>
                    <button className="secondary-button" onClick={() => navigate('/dashboard')}>
                        ← Dashboard'a Dön
                    </button>
                </div>

                <div className="dashboard-body">
                    <div className="section-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                            <div className="brand-badge" style={{ width: '80px', height: '80px', fontSize: '2rem', borderRadius: '24px' }}>
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'var(--foreground)' }}>
                                    {user.username}
                                </h3>
                                <p className="muted-text" style={{ margin: 0 }}>{user.email}</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">Kayıt Tarihi</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    value={new Date(user.joinDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    disabled
                                    style={{ opacity: 0.7 }}
                                />
                            </div>
                            <div className="form-field">
                                <label className="field-label">Mevcut Plan</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    value={user.plan}
                                    disabled
                                    style={{ opacity: 0.7, color: '#fbbf24', fontWeight: 'bold' }}
                                />
                            </div>
                        </div>

                        <div className="alert" style={{ marginTop: '30px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
                            Yakında buraya detaylı kullanım istatistikleri ve şifre değiştirme ekranı eklenecektir.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;