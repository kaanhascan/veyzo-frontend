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
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                <h2 style={{ color: '#2c3e50', margin: '0 0 20px 0', textAlign: 'center' }}>Veyzo'ya Giriş Yap</h2>

                {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontWeight: '600', color: '#495057', display: 'block', marginBottom: '8px' }}>E-Posta Adresi</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ornek@gmail.com"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: '600', color: '#495057', display: 'block', marginBottom: '8px' }}>Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '14px',
                            backgroundColor: loading ? '#6c757d' : '#0d6efd',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
                    Hesabınız yok mu? <Link to="/register" style={{ color: '#198754', textDecoration: 'none', fontWeight: 'bold' }}>Hemen Kayıt Olun</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;