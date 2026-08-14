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

    // VİDEO SİLME FONKSİYONU
    const handleDelete = async (videoId) => {
        if (!window.confirm('Bu videoyu silmek istediğinize emin misiniz?')) return;

        try {
            await api.delete(`/videos/${videoId}`);
            // Silinen videoyu ekrandaki listeden de anında çıkar
            setVideos(videos.filter(v => v.id !== videoId));
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

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>Videolar yükleniyor...</div>;

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f8f9fa', paddingBottom: '20px' }}>
                    <h2 style={{ color: '#2c3e50', margin: 0 }}>Veyzo - Videolarım</h2>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => navigate('/upload')}
                            style={{ padding: '10px 18px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            + Yeni Yükle
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{ padding: '10px 18px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>

                {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

                {videos.length === 0 && !error ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#6c757d' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Burası biraz boş</h3>
                        <p style={{ margin: 0 }}>Yukarıdaki butona tıklayarak ilk videonuzu kesmeye başlayın.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '15px', color: '#495057' }}>Video Başlığı</th>
                                    <th style={{ padding: '15px', color: '#495057' }}>Durum</th>
                                    <th style={{ padding: '15px', color: '#495057' }}>Tarih</th>
                                    <th style={{ padding: '15px', color: '#495057', textAlign: 'right' }}>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((video) => (
                                    <tr key={video.id} style={{ borderBottom: '1px solid #e9ecef', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '15px', fontWeight: '500', color: '#212529' }}>{video.title}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                backgroundColor: video.status === 'COMPLETED' ? '#d1e7dd' : video.status === 'FAILED' ? '#f8d7da' : '#fff3cd',
                                                color: video.status === 'COMPLETED' ? '#0f5132' : video.status === 'FAILED' ? '#842029' : '#664d03'
                                            }}>
                                                {video.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', color: '#6c757d', fontSize: '14px' }}>
                                            {new Date(video.createdAt).toLocaleDateString('tr-TR')}
                                        </td>

                                        {/* İŞLEM BUTONLARI */}
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <button
                                                    onClick={() => handleDownload(video.id, video.title)}
                                                    disabled={video.status !== 'COMPLETED'}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: video.status === 'COMPLETED' ? '#0d6efd' : '#e9ecef',
                                                        color: video.status === 'COMPLETED' ? 'white' : '#6c757d',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: video.status === 'COMPLETED' ? 'pointer' : 'not-allowed',
                                                        fontWeight: 'bold',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    İndir
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(video.id)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: 'white',
                                                        color: '#dc3545',
                                                        border: '1px solid #dc3545',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '13px'
                                                    }}
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
                )}
            </div>
        </div>
    );
};

export default Dashboard;