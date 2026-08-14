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
            setError("Lütfen bir video dosyası seçin.");
            return;
        }
        if (startTime >= endTime) {
            setError("Başlangıç süresi, bitiş süresinden küçük olmalıdır.");
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
            console.error("Yükleme hatası:", err);
            setError("Video yüklenirken bir hata oluştu.");
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ color: '#2c3e50', margin: 0 }}>Yeni Video Yükle</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ← Geri Dön
                    </button>
                </div>

                {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#495057', display: 'block', marginBottom: '8px' }}>Video Başlığı:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box' }}
                        />

                        <label style={{ fontWeight: '600', color: '#495057', display: 'block', marginTop: '20px', marginBottom: '8px' }}>Video Dosyası Seç (.mp4):</label>
                        <input
                            type="file"
                            accept="video/mp4,video/x-m4v,video/*"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%', padding: '10px', backgroundColor: 'white', border: '1px dashed #adb5bd', borderRadius: '6px' }}
                        />
                    </div>

                    {videoUrl && (
                        <div style={{ padding: '20px', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                            <h4 style={{ marginTop: 0, color: '#343a40' }}>Önizleme ve Kesme (Trim)</h4>

                            <video
                                ref={videoRef}
                                src={videoUrl}
                                controls
                                onLoadedMetadata={handleLoadedMetadata}
                                style={{ width: '100%', maxHeight: '350px', backgroundColor: '#000', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                            />

                            <div style={{ marginTop: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#495057' }}>Başlangıç: <span style={{ color: '#0056b3' }}>{formatTime(startTime)}</span></label>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={startTime}
                                    onChange={(e) => setStartTime(Number(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer', accentColor: '#0056b3' }}
                                />
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: 'bold', color: '#495057' }}>Bitiş: <span style={{ color: '#0056b3' }}>{formatTime(endTime)}</span></label>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={endTime}
                                    onChange={(e) => setEndTime(Number(e.target.value))}
                                    style={{ width: '100%', cursor: 'pointer', accentColor: '#0056b3' }}
                                />
                            </div>

                            <div style={{ marginTop: '25px', textAlign: 'center', backgroundColor: '#e2e3e5', padding: '12px', borderRadius: '6px', color: '#383d41' }}>
                                <strong>Kesilecek Toplam Süre:</strong> {Math.max(0, endTime - startTime)} saniye
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !file}
                        style={{
                            padding: '16px',
                            backgroundColor: (loading || !file) ? '#adb5bd' : '#0d6efd',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: (loading || !file) ? 'not-allowed' : 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {loading ? 'Sunucuya Yükleniyor (Bekleyin)...' : 'Videoyu Yükle ve Kes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;