import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/users/login', {
                email,
                password
            });

            toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', {
                style: { background: '#1A1A24', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            setError("E-posta veya şifre hatalı.");
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

                {error && (
                    <div className="alert">
                        {typeof error === 'string' ? error : "E-posta veya şifre hatalı."}
                    </div>
                )}

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