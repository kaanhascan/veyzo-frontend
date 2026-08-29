import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ExtractAudio from './pages/ExtractAudio';
import MergeVideos from './pages/MergeVideos';
import ExtractGif from './pages/ExtractGif';
import CompressVideo from './pages/CompressVideo';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/extract-audio" element={<ExtractAudio />} />
          <Route path="/merge-videos" element={<MergeVideos />} />
          <Route path="/extract-gif" element={<ExtractGif />} />
          <Route path="/compress-video" element={<CompressVideo />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;