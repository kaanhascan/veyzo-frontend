import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchMyVideos(true);
        const interval = setInterval(() => { fetchMyVideos(false); }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchMyVideos = async (isInitialLoad = false) => {
        try {
            const response = await api.get('/videos/my-videos');
            setVideos(response.data);
            if (isInitialLoad) setLoading(false);
        } catch (err) {
            if (isInitialLoad) { setError('Videolar yüklenirken bir sorun oluştu.'); setLoading(false); }
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu", error);
        } finally {
            navigate('/login');
        }
    };

    const handleDelete = async (id, isBatch, items) => {
        const message = isBatch
            ? 'Bu klasördeki TÜM videoları silmek istediğinize emin misiniz?'
            : 'Bu videoyu silmek istediğinize emin misiniz?';

        if (!window.confirm(message)) return;

        try {
            if (isBatch) {
                for (let item of items) { await api.delete(`/videos/${item.id}`); }
                setVideos((current) => current.filter((v) => v.batchId !== id));
            } else {
                await api.delete(`/videos/${id}`);
                setVideos((current) => current.filter((v) => v.id !== id));
            }
        } catch (err) {
            alert('Silme işlemi sırasında hata oluştu.');
        }
    };

    const handleDownload = async (video) => {
        try {
            const response = await api.get(`/videos/download/${video.id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            let extension = ".mp4";

            if (video.processedFileName && video.processedFileName.includes('.')) {
                extension = video.processedFileName.substring(video.processedFileName.lastIndexOf('.'));
            } else if (video.originalFileName && video.originalFileName.includes('.')) {
                extension = video.originalFileName.substring(video.originalFileName.lastIndexOf('.'));
            }

            const safeTitle = video.title ? video.title.replace(/[^a-zA-Z0-9]/g, "_") : "veyzo_export";
            const downloadName = safeTitle + extension;

            console.log("DOSYA ŞU İSİMLE İNDİRİLECEK:", downloadName);

            link.setAttribute('download', downloadName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("İndirme sırasında bir hata oluştu:", error);
            toast.error("Dosya indirilemedi!");
        }
    };

    const handleZipDownload = async (batchId, title) => {
        try {
            const response = await api.get(`/videos/download/batch/${batchId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title.split(' (')[0]}_veyzo_klasor.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('ZIP dosyası oluşturulurken hata oluştu. Videoların tamamlandığından emin olun.');
        }
    };
    const getGroupedVideos = () => {
        const groups = [];
        const groupMap = {};

        videos.forEach(video => {
            const key = video.batchId || video.id;

            if (!groupMap[key]) {
                groupMap[key] = {
                    id: key,
                    isBatch: !!video.batchId,
                    title: video.batchId ? `${video.title.split(' (')[0]}` : video.title,
                    createdAt: video.createdAt,
                    items: []
                };
                groups.push(groupMap[key]);
            }
            groupMap[key].items.push(video);

            if (groupMap[key].isBatch) {
                const statuses = groupMap[key].items.map(i => i.status);
                if (statuses.includes('FAILED')) groupMap[key].status = 'FAILED';
                else if (statuses.includes('PENDING')) groupMap[key].status = 'PENDING';
                else groupMap[key].status = 'COMPLETED';
            } else {
                groupMap[key].status = video.status;
            }
        });

        return groups;
    };

    const getOperationDetails = (type) => {
        switch (type) {
            case 'TRIM': return { label: 'Kırpma', class: 'op-trim' };
            case 'COMPRESS': return { label: 'Sıkıştırma', class: 'op-compress' };
            case 'AUDIO': return { label: 'Ses Ayrıştırma', class: 'op-audio' };
            case 'MERGE': return { label: 'Birleştirme', class: 'op-merge' };
            case 'GIF': return { label: 'GIF', class: 'op-gif' };
            default: return { label: 'İşlem', class: '' };
        }
    };

    const getStatusClass = (status) => {
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'FAILED') return 'status-failed';
        return 'status-pending';
    };

    if (loading) return <div className="dashboard-page"><div className="dashboard-shell" style={{ maxWidth: '700px', textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>Videolar yükleniyor...</div></div>;

    const groupedVideos = getGroupedVideos();

    return (
        <div className="dashboard-page">
            <div className="dashboard-shell">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Videolarım</h2>
                    <div className="toolbar">
                        <button className="primary-button" onClick={() => navigate('/upload')}>+ Yeni Yükle</button>
                        <button className="secondary-button" onClick={handleLogout}>Çıkış Yap</button>
                    </div>
                </div>

                {error && <div className="alert" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

                {groupedVideos.length === 0 && !error ? (
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
                                        <th>İsim / Klasör</th>
                                        <th>Durum</th>
                                        <th>Tarih</th>
                                        <th>İşlem Türü</th>
                                        <th style={{ textAlign: 'right' }}>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedVideos.map((group) => (
                                        <tr key={group.id}>
                                            <td className="video-title">
                                                {group.isBatch
                                                    ? `📁 [Klasör] ${group.title} (${group.items.length} Video)`
                                                    : group.title}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${getStatusClass(group.status)}`}>
                                                    {group.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'rgba(255,255,255,0.7)' }}>
                                                {new Date(group.createdAt).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td>
                                                {!group.isBatch && group.items[0]?.operationType ? (
                                                    <span className={`operation-badge ${getOperationDetails(group.items[0].operationType).class}`}>
                                                        {getOperationDetails(group.items[0].operationType).label}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    {group.isBatch ? (
                                                        <button
                                                            className="table-button primary"
                                                            onClick={() => handleZipDownload(group.id, group.title)}
                                                            disabled={group.status !== 'COMPLETED'}
                                                        >
                                                            ZIP İndir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="table-button primary"
                                                            onClick={() => handleDownload(group.items[0])}
                                                            disabled={group.status !== 'COMPLETED'}
                                                        >
                                                            İndir
                                                        </button>
                                                    )}
                                                    <button
                                                        className="table-button danger"
                                                        onClick={() => handleDelete(group.id, group.isBatch, group.items)}
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