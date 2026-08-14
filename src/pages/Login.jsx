import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/users/login', {
                email: email,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('jwt_token', token);
            navigate('/dashboard');
        } catch (err) {
            setError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-badge">V</div>
                    <h2 className="auth-title">Veyzo'ya Giriş Yap</h2>
                    <p className="auth-subtitle">Video düzenleme ve kırpma işleminize başlamak için giriş yapın.</p>
                </div>

                {error && <div className="alert">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
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
                        <label className="field-label">Şifre</label>
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
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                    Hesabınız yok mu?{' '}
                    <Link to="/register" className="inline-link">Hemen Kayıt Olun</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;