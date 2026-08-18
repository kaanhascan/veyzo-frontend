import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ExtractAudio = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [isDragging, setIsDragging] = useState(false);


    const fileInputRef = useRef(null);

    const navigate = useNavigate();


    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            if (droppedFiles[0].type.startsWith('video/')) {
                setFile(droppedFiles[0]);
                setError('');
            } else {
                setError("Lütfen sadece geçerli bir video dosyası sürükleyin.");
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Lütfen bir video dosyası seçin veya sürükleyin.");
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
            const errorMessage = typeof err.response?.data === 'string'
                ? err.response.data
                : "Dosya gönderilirken bir hata oluştu.";
            setError(errorMessage);
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
                                <label className="field-label">Video Dosyası</label>

                                <div
                                    className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <input
                                        type="file"
                                        accept="video/mp4,video/x-m4v,video/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                setFile(e.target.files[0]);
                                                setError('');
                                            }
                                        }}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    <div className="drag-content">
                                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📁</div>
                                        {file ? (
                                            <div style={{ color: '#10b981', fontWeight: '500' }}>
                                                Seçilen Dosya: {file.name}
                                            </div>
                                        ) : (
                                            <div>
                                                <span style={{ color: 'var(--foreground)' }}>Dosyanızı buraya sürükleyin</span> veya
                                                <span style={{ color: '#10b981', marginLeft: '4px', textDecoration: 'underline' }}>göz atın</span>
                                            </div>
                                        )}
                                        <div className="muted-text" style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                                            MP4, MOV (Maks 250 MB)
                                        </div>
                                    </div>
                                </div>

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