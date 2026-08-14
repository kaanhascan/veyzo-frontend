import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/users/register', {
                username: username,
                email: email,
                password: password
            });

            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            navigate('/login');
        } catch (err) {
            setError('Kayıt işlemi başarısız oldu. Bu e-posta zaten kullanılıyor olabilir.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-badge">V</div>
                    <h2 className="auth-title">Veyzo'ya Katılın</h2>
                    <p className="auth-subtitle">Kısa videoları işleyip profesyonel çıktılar üretmeye başlayın.</p>
                </div>

                {error && <div className="alert">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-field">
                        <label className="field-label">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Kullanıcı Adı"
                            className="text-input"
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label">E-Posta Adresi</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ornek@gmail.com"
                            className="text-input"
                        />
                    </div>

                    <div className="form-field">
                        <label className="field-label">Şifre Belirleyin</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="text-input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="primary-button">
                        {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                    </button>
                </form>

                <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                    Zaten üye misiniz?{' '}
                    <Link to="/login" className="inline-link">Giriş Yapın</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;