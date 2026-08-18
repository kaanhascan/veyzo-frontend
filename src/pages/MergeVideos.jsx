import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const MergeVideos = () => {
    const [availableVideos, setAvailableVideos] = useState([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchCompletedVideos();
    }, []);

    const fetchCompletedVideos = async () => {
        try {
            const response = await api.get('/videos/my-videos');
            const completedVideos = response.data.filter(video => video.status === 'COMPLETED');
            setAvailableVideos(completedVideos);
        } catch (err) {
            console.error("Video çekme hatası:", err);
        }
    };

    const handleCheckboxChange = (videoId) => {
        setSelectedVideoIds((prevSelected) => {
            if (prevSelected.includes(videoId)) {
                return prevSelected.filter(id => id !== videoId);
            } else {
                return [...prevSelected, videoId];
            }
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setNewFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleMerge = async (e) => {
        e.preventDefault();

        const totalSelected = selectedVideoIds.length + newFiles.length;

        if (totalSelected < 2) {
            setError("Lütfen birleştirmek için toplamda en az 2 video (mevcut veya yeni) seçin.");
            return;
        }

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);


        newFiles.forEach(file => {
            formData.append('files', file);
        });

        selectedVideoIds.forEach(id => {
            formData.append('existingVideoIds', id);
        });

        try {
            await api.post('/videos/merge', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error("Birleştirme hatası:", err);

            const errorMessage = typeof err.response?.data === 'string'
                ? err.response.data
                : (err.response?.data?.message || err.response?.data?.error || "Birleştirme işlemi başlatılamadı.");

            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-shell">
                <div className="upload-header">
                    <h2 className="upload-title">Videoları Birleştir</h2>
                </div>

                <p className="muted-text" style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                    İşlemi tamamlanmış eski videolarınızı seçebilir veya bilgisayarınızdan tamamen yeni videolar yükleyerek tek bir dosyada birleştirebilirsiniz.
                </p>

                {error && <div className="alert" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleMerge} className="upload-form">
                    <div className="section-card">
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">Yeni Birleştirilmiş Video Başlığı</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Örn: Tatil Vlog Tamamı"
                                    className="text-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">Sıfırdan Video Dosyaları Ekle (.mp4)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="video/mp4,video/x-m4v,video/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                {newFiles.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                        {newFiles.map((file, index) => (
                                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--foreground)' }}>📄 {file.name}</span>
                                                <button type="button" onClick={() => removeNewFile(index)} className="table-button danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Sil</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-field" style={{ marginTop: '10px' }}>
                                <label className="field-label">Veya Mevcut Videolarınızdan Seçin ({selectedVideoIds.length} Seçildi)</label>

                                {availableVideos.length === 0 ? (
                                    <div className="alert" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: 'none', padding: '10px', fontSize: '0.9rem' }}>
                                        Daha önce yüklenmiş videonuz bulunmuyor.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                                        {availableVideos.map((video) => (
                                            <label
                                                key={video.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '12px',
                                                    backgroundColor: selectedVideoIds.includes(video.id) ? 'rgba(16, 185, 129, 0.1)' : 'var(--card-bg)',
                                                    border: `1px solid ${selectedVideoIds.includes(video.id) ? '#10b981' : 'var(--border)'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedVideoIds.includes(video.id)}
                                                    onChange={() => handleCheckboxChange(video.id)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                                <span style={{ color: 'var(--foreground)', fontWeight: '500' }}>{video.title}</span>
                                                <span className="muted-text" style={{ fontSize: '0.85rem', marginLeft: 'auto' }}>
                                                    {new Date(video.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (selectedVideoIds.length + newFiles.length < 2)}
                        className="upload-button"
                    >
                        {loading ? 'Sunucuya Gönderiliyor...' : `Toplam ${selectedVideoIds.length + newFiles.length} Videoyu Birleştir`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MergeVideos;