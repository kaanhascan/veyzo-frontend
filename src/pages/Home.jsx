import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="landing-page">
            <nav className="landing-nav">
                <div className="nav-brand">
                    <div className="brand-badge">V</div>
                    Veyzo
                </div>
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Giriş Yap</Link>
                    <Link to="/register" className="primary-button" style={{ textDecoration: 'none', padding: '8px 16px' }}>
                        Ücretsiz Başla
                    </Link>
                </div>
            </nav>

            <main className="hero-section">
                <h1 className="hero-title">Video İşleme Artık <br /><span style={{ color: '#fbbf24' }}>Çok Daha Hızlı</span></h1>
                <p className="hero-subtitle">
                    Toplu video yükleyin, saniyeler içinde şablonlar oluşturun ve tüm videolarınızı tek bir ZIP dosyası olarak anında indirin. Veyzo ile iş akışınızı hızlandırın.
                </p>

                <div className="hero-buttons">
                    <Link to="/register" className="primary-button" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '12px 24px' }}>
                        Hemen Kullanmaya Başla
                    </Link>
                </div>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3 className="feature-title">Toplu İşlem (Batch)</h3>
                        <p className="muted-text">Aynı anda birden fazla videoyu seçin ve tek bir kesme şablonunu hepsine anında uygulayın.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">Asenkron Mimari</h3>
                        <p className="muted-text">Beklemek yok. Videolarınız arka planda işlenirken siz platformda gezinmeye devam edin.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📦</div>
                        <h3 className="feature-title">Sıfır RAM ZIP İndirme</h3>
                        <p className="muted-text">İşlemi biten yüzlerce videoyu sunucuyu yormadan, tek tıkla şık bir klasör halinde indirin.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;