import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const backendMessage = error.response.data?.message || "Bir hata oluştu.";

            if (status === 401) {
                localStorage.removeItem('jwt_token');
                window.location.href = '/login';
                toast.error("Oturum süresi doldu. Tekrar giriş yapın.");
            }
            else if (status === 403) {
                toast.error("Bu işlemi yapmaya yetkiniz yok.");
            }
            else if (status === 413) {
                toast.error("Yüklediğiniz dosya sınırları aşıyor!");
            }
            else if (status === 400 || status === 500) {
                toast.error(backendMessage);
            }
        } else if (error.request) {
            toast.error("Sunucuya bağlanılamadı. İnternetinizi kontrol edin.");
        }

        return Promise.reject(error);
    }
);

export default api;