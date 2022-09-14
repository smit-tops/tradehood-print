import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Printer from './pages/Printer';
import Settings from './pages/Settings';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/print" element={<Printer />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
}
