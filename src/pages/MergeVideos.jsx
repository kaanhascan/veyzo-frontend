import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const MergeVideos = () => {
    const [availableVideos, setAvailableVideos] = useState([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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
        const droppedFiles = Array.from(e.dataTransfer.files);

        const videoFiles = droppedFiles.filter(file => file.type.startsWith('video/'));

        if (videoFiles.length > 0) {
            setNewFiles(prev => [...prev, ...videoFiles]);
            setError('');
        } else {
            setError("Lütfen sadece geçerli video dosyaları sürükleyin.");
        }
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
                : "Birleştirme işlemi başlatılamadı.";
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

                <p className="muted-text page-description">
                    İşlemi tamamlanmış eski videolarınızı seçebilir veya bilgisayarınızdan tamamen yeni videolar yükleyerek tek bir dosyada birleştirebilirsiniz.
                </p>

                {error && <div className="alert alert-top">{error}</div>}

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
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    <div className="drag-content">
                                        <div className="drag-icon">📁</div>
                                        <div>
                                            <span className="drag-instructions">Dosyalarınızı buraya sürükleyin</span> veya
                                            <span style={{ color: '#10b981', marginLeft: '4px', textDecoration: 'underline' }}>göz atın</span>
                                        </div>
                                        <div className="muted-text file-limits-text">
                                            MP4, MOV (Toplam Maks 1GB)
                                        </div>
                                    </div>
                                </div>

                                {newFiles.length > 0 && (
                                    <div className="video-list-container">
                                        {newFiles.map((file, index) => (
                                            <div key={index} className="new-file-item">
                                                <span className="video-date">📄 {file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewFile(index)}
                                                    className="table-button danger"
                                                    style={{ padding: '4px 8px' }}
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-field" style={{ marginTop: '10px' }}>
                                <label className="field-label">Veya Mevcut Videolarınızdan Seçin ({selectedVideoIds.length} Seçildi)</label>

                                {availableVideos.length === 0 ? (
                                    <div className="alert page-description" style={{ border: 'none', padding: '10px' }}>
                                        Daha önce yüklenmiş videonuz bulunmuyor.
                                    </div>
                                ) : (
                                    <div className="video-list-container">
                                        {availableVideos.map((video) => (
                                            <label
                                                key={video.id}
                                                className={`video-list-item ${selectedVideoIds.includes(video.id) ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox-input"
                                                    checked={selectedVideoIds.includes(video.id)}
                                                    onChange={() => handleCheckboxChange(video.id)}
                                                />
                                                <span className="video-title">{video.title}</span>
                                                <span className="muted-text video-date">
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