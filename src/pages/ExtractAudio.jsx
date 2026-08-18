import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ExtractAudio = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Lütfen bir video dosyası seçin.");
            return;
        }

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            await api.post('/videos/extract-audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error("Yükleme hatası:", err);
            setError("Dosya gönderilirken bir hata oluştu. Dosya boyutunu kontrol edin.");
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-shell">
                <div className="upload-header">
                    <h2 className="upload-title">Sesi Ayrıştır (MP3)</h2>
                </div>

                <p className="muted-text" style={{ marginBottom: '20px', lineHeight: '1.5' }}>
                    Videonuzu yükleyin, arka plandaki tüm sesleri yüksek kaliteli bir MP3 dosyası olarak size verelim.
                    Görüntü tamamen silinecektir.
                </p>

                {error && <div className="alert" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="section-card">
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">Ses Dosyası Başlığı</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Örn: Podcast Bölüm 1"
                                    className="text-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">Video Dosyası Seç (.mp4)</label>
                                <input
                                    type="file"
                                    accept="video/mp4,video/x-m4v,video/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                    className="file-input"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="upload-button"
                    >
                        {loading ? 'İşleniyor (Bekleyin)...' : 'Sesi Çıkar (MP3)'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExtractAudio;