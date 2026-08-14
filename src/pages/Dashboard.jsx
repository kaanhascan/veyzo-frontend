import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchMyVideos();
    }, []);

    const fetchMyVideos = async () => {
        try {
            const response = await api.get('/videos/my-videos');
            setVideos(response.data);
            setLoading(false);
        } catch (err) {
            setError('Videolar yüklenirken bir sorun oluştu.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('jwt_token');
                navigate('/login');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;

        try {
            await api.delete(`/videos/${videoId}`);
            setVideos((currentVideos) => currentVideos.filter((v) => v.id !== videoId));
        } catch (err) {
            alert('Video silinirken hata oluştu.');
        }
    };

    const handleDownload = async (videoId, title) => {
        try {
            const response = await api.get(`/videos/download/${videoId}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}_veyzo.mp4`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Video indirilirken hata oluştu. (Video işlenmemiş olabilir)');
        }
    };

    const getStatusClass = (status) => {
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'FAILED') return 'status-failed';
        return 'status-pending';
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-shell" style={{ maxWidth: '700px', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
                    Videolar yükleniyor...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Videolarım</h2>
                    <div className="toolbar">
                        <button className="primary-button" onClick={() => navigate('/upload')}>
                            + Yeni Yükle
                        </button>
                        <button className="secondary-button" onClick={handleLogout}>
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                {error && <div className="alert" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

                {videos.length === 0 && !error ? (
                    <div className="empty-state">
                        <h3>Burası biraz boş</h3>
                        <p>Yukarıdaki butona tıklayarak ilk videonuzu kesmeye başlayın.</p>
                    </div>
                ) : (
                    <div className="dashboard-body">
                        <div className="table-card">
                            <table className="video-table">
                                <thead>
                                    <tr>
                                        <th>Video Başlığı</th>
                                        <th>Durum</th>
                                        <th>Tarih</th>
                                        <th style={{ textAlign: 'right' }}>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((video) => (
                                        <tr key={video.id}>
                                            <td className="video-title">{video.title}</td>
                                            <td>
                                                <span className={`status-pill ${getStatusClass(video.status)}`}>
                                                    {video.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'rgba(255,255,255,0.7)' }}>
                                                {new Date(video.createdAt).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="table-button primary"
                                                        onClick={() => handleDownload(video.id, video.title)}
                                                        disabled={video.status !== 'COMPLETED'}
                                                    >
                                                        İndir
                                                    </button>
                                                    <button
                                                        className="table-button danger"
                                                        onClick={() => handleDelete(video.id)}
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;