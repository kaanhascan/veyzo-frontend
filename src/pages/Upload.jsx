import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('00:00:00');
    const [endTime, setEndTime] = useState('00:00:10');
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

    const calculateDurationInSeconds = (start, end) => {
        const timeToSeconds = (timeStr) => {
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            return (hours * 3600) + (minutes * 60) + seconds;
        };

        const duration = timeToSeconds(end) - timeToSeconds(start);
        return duration > 0 ? duration : 1;
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            setError("Lütfen en az bir video seçin.");
            return;
        }

        setError('');
        setLoading(true);

        const batchId = files.length > 1 ? crypto.randomUUID() : '';

        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                formData.append('startTime', startTime);
                formData.append('endTime', endTime);

                formData.append('duration', calculateDurationInSeconds(startTime, endTime).toString());

                if (batchId) formData.append('batchId', batchId);

                return api.post('/videos/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            });

            await Promise.all(uploadPromises);

            navigate('/dashboard');
        } catch (err) {
            setError("Dosyalar gönderilirken bir hata oluştu.");
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-shell">
                <div className="upload-header">
                    <h2 className="upload-title">Video Yükle ve Kırp</h2>
                </div>

                <p className="muted-text page-description">
                    Videonuzu yükleyin ve başlangıç/bitiş sürelerini belirleyerek istediğiniz bölümü hassas bir şekilde kırpın.
                </p>

                {error && <div className="alert alert-top">{error}</div>}

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
                                    placeholder="Örn: Tatil Vlog Kesit"
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
                                        multiple
                                        accept="video/mp4,video/x-m4v,video/*"
                                        onChange={(e) => {
                                            if (e.target.files.length > 0) {
                                                setFiles(Array.from(e.target.files));
                                                setError('');
                                            }
                                        }}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    <div className="drag-content">
                                        <div className="drag-icon">📁</div>

                                        {files.length > 0 ? (
                                            <div className="file-success-text">
                                                {files.length === 1
                                                    ? `Seçilen Dosya: ${files[0].name}`
                                                    : `${files.length} adet dosya seçildi.`}
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="drag-instructions">Dosyanızı buraya sürükleyin</span> veya
                                                <span style={{ color: '#10b981', marginLeft: '4px', textDecoration: 'underline' }}>göz atın</span>
                                            </div>
                                        )}

                                        <div className="muted-text file-limits-text">
                                            MP4, MOV (Maks 250 MB)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-field" style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="field-label">Başlangıç Zamanı</label>
                                    <input
                                        type="text"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        placeholder="00:00:00"
                                        className="text-input"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="field-label">Bitiş Zamanı</label>
                                    <input
                                        type="text"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        placeholder="00:00:10"
                                        className="text-input"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || files.length === 0}
                        className="upload-button"
                    >
                        {loading ? 'İşleniyor (Bekleyin)...' : 'Videoyu Kırp'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;