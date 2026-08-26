import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CompressVideo = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0 && droppedFiles[0].type.startsWith('video/')) {
            setFile(droppedFiles[0]);
            setError('');
        } else {
            setError("Lütfen sadece geçerli bir video dosyası sürükleyin.");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setError("Lütfen bir video dosyası seçin.");

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        try {
            await api.post('/videos/compress', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            setError(typeof err.response?.data === 'string' ? err.response.data : "Dosya gönderilemedi.");
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-shell">
                <div className="upload-header">
                    <h2 className="upload-title">Videoyu Sıkıştır (Küçült)</h2>
                </div>

                <p className="muted-text page-description">
                    WhatsApp veya e-posta ile gönderilemeyecek kadar büyük videolarınızı kalitesini bozmadan küçültün.
                </p>

                {error && <div className="alert alert-top">{error}</div>}

                <form onSubmit={handleUpload} className="upload-form">
                    <div className="section-card">
                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">Sıkıştırılmış Video Başlığı</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Örn: Sunum Videosu (Küçük)"
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
                                        onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    <div className="drag-content">
                                        <div className="drag-icon">🗜️</div>
                                        {file ? (
                                            <div className="file-success-text">Seçilen Dosya: {file.name}</div>
                                        ) : (
                                            <div>
                                                <span className="drag-instructions">Dosyanızı buraya sürükleyin</span> veya
                                                <span className="browse-text">göz atın</span>
                                            </div>
                                        )}
                                        <div className="muted-text file-limits-text">Maksimum sıkıştırma kalitesiyle işlenecektir.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading || !file} className="upload-button">
                        {loading ? 'Sıkıştırılıyor (Bekleyin)...' : 'Videoyu Sıkıştır'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompressVideo;