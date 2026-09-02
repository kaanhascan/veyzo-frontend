import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            let backendMessage = "Bir hata oluştu.";
            if (error.response.data) {
                if (typeof error.response.data === 'string') {
                    backendMessage = error.response.data;
                } else if (typeof error.response.data.message === 'string') {
                    backendMessage = error.response.data.message;
                } else if (typeof error.response.data.error === 'string') {
                    backendMessage = error.response.data.error;
                }
            }

            if (status === 401) {
                if (window.location.pathname !== '/login') {
                    toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
                    window.location.href = '/login';
                }
            }
            else if (status === 403) {
                toast.error("Bu işlemi yapmaya yetkiniz yok.");
            }
            else if (status === 413) {
                toast.error("Yüklediğiniz dosya çok büyük!");
            }
            else if (status === 400 || status >= 500) {
                const finalMessage = backendMessage === "Bad credentials"
                    ? "E-posta veya şifre hatalı."
                    : String(backendMessage);

                toast.error(finalMessage);
            }
        } else if (error.request) {
            toast.error("Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.");
        }

        return Promise.reject(error);
    }
);

export default api;