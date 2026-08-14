import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [duration, setDuration] = useState(0);

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const videoRef = useRef(null);
    const navigate = useNavigate();

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setVideoUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const videoLength = Math.floor(videoRef.current.duration);
            setDuration(videoLength);
            setEndTime(videoLength);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Lütfen bir video dosyası seçin.');
            return;
        }
        if (startTime >= endTime) {
            setError('Başlangıç süresi, bitiş süresinden küçük olmalıdır.');
            return;
        }

        setError('');
        setLoading(true);

        const formattedStartTime = formatTime(startTime);
        const calculateDuration = Math.floor(endTime - startTime).toString();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('startTime', formattedStartTime);
        formData.append('duration', calculateDuration);

        try {
            await api.post('/videos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Yükleme hatası:', err);
            setError('Video yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-shell">
                <div className="upload-header">
                    <h2 className="upload-title">Yeni Video Yükle</h2>
                    <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
                        ← Geri Dön
                    </button>
                </div>

                {error && <div className="alert" style={{ marginTop: '0', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="section-card">
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">Video Başlığı</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="text-input"
                                    placeholder="Örneğin: Intro Cut"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">Video Dosyası Seç (.mp4)</label>
                                <input
                                    type="file"
                                    accept="video/mp4,video/x-m4v,video/*"
                                    onChange={handleFileChange}
                                    required
                                    className="file-input"
                                />
                            </div>
                        </div>
                    </div>

                    {videoUrl && (
                        <div className="section-card preview-panel">
                            <h4 style={{ color: 'var(--foreground)', fontSize: '1rem' }}>Önizleme ve Kesme</h4>

                            <video
                                ref={videoRef}
                                src={videoUrl}
                                controls
                                onLoadedMetadata={handleLoadedMetadata}
                                className="preview-video"
                            />

                            <div className="trim-group">
                                <label className="range-label">
                                    Başlangıç: <span className="range-value">{formatTime(startTime)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={startTime}
                                    onChange={(e) => setStartTime(Number(e.target.value))}
                                    className="trim-range"
                                />
                            </div>

                            <div className="trim-group">
                                <label className="range-label">
                                    Bitiş: <span className="range-value">{formatTime(endTime)}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={endTime}
                                    onChange={(e) => setEndTime(Number(e.target.value))}
                                    className="trim-range"
                                />
                            </div>

                            <div className="duration-summary">
                                <strong>Kesilecek Toplam Süre:</strong> {Math.max(0, endTime - startTime)} saniye
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading || !file} className="upload-button">
                        {loading ? 'Sunucuya Yükleniyor (Bekleyin)...' : 'Videoyu Yükle ve Kes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;