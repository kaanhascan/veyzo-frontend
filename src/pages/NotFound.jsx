import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: 'center', padding: '48px 28px' }}>

                <div className="error-code">404</div>

                <h1 className="auth-title">Sayfa Bulunamadı</h1>

                <p className="muted-text page-description" style={{ marginBottom: '32px' }}>
                    Uzayın derinliklerinde kaybolmuş gibisiniz. Aradığınız sayfa silinmiş, adı değiştirilmiş veya bir kara deliğe çekilmiş olabilir.
                </p>
                <Link to="/login" className="primary-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Giriş ekranına dön
                </Link>

            </div>
        </div>
    );
};

export default NotFound;