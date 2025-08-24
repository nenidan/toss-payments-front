// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Charge from './components/Charge';
import Success from './Success';
import Fail from "./Fail";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. URL 파라미터에서 사용자 정보 확인 (결제 후 돌아온 경우)
        const urlParams = new URLSearchParams(window.location.search);
        const userFromUrl = urlParams.get('user');

        if (userFromUrl) {
            // 결제 후 돌아온 경우, URL의 사용자 정보로 상태 복원
            setUser(decodeURIComponent(userFromUrl));
            // URL 파라미터 정리 (브라우저 히스토리에서 제거)
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        // 2. localStorage에서 사용자 정보 확인
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('currentUser');

        if (token && savedUser) {
            setUser(savedUser);
        }
    }, []);

    const handleLogin = (email) => {
        const username = email.split('@')[0] || email;
        setUser(username);
        // 사용자 정보를 localStorage에도 저장
        localStorage.setItem('currentUser', username);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser'); // 사용자 정보도 함께 제거
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <Charge user={user} onLogout={handleLogout} />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/payments/success" element={<Success />} />
                <Route path="/payments/fail" element={<Fail />} />
            </Routes>
        </Router>
    );
}

export default App;