import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ExtractGif = () => {
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
            await api.post('/videos/extract-gif', formData, {
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
                    <h2 className="upload-title">Videoyu GIF'e Çevir</h2>
                </div>

                <p className="muted-text page-description">
                    Videonuzu yükleyin, sosyal medyada paylaşmaya hazır, yüksek kaliteli ve optimize edilmiş bir GIF dosyasına dönüştürelim.
                </p>

                {error && <div className="alert alert-top">{error}</div>}

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="section-card">
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">GIF Başlığı</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Örn: Komik Kedi Reaksiyonu"
                                    className="text-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">Video Dosyası Seç (.mp4, .mov)</label>

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
                                        <div className="drag-icon">🎞️</div>
                                        {file ? (
                                            <div className="file-success-text">
                                                Seçilen Dosya: {file.name}
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="drag-instructions">Dosyanızı buraya sürükleyin</span> veya
                                                <span className="browse-text">göz atın</span>
                                            </div>
                                        )}
                                        <div className="muted-text file-limits-text">
                                            (Önerilen maks süre: 15 Saniye)
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
                        {loading ? 'Dönüştürülüyor...' : 'GIF Oluştur'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExtractGif;