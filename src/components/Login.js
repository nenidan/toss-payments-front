// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://3.36.220.104:8080/api/accounts/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // CORS 문제 해결을 위한 추가 헤더들
                    'Accept': 'application/json',
                },
                // CORS credentials 설정
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Login success response:', responseData);

            // 🔥 백엔드에서 실제 토큰을 받아서 저장
            const authHeader = response.headers.get('Authorization');
            const refreshToken = response.headers.get('Refresh-Token');

            if (authHeader) {
                // Bearer 토큰에서 실제 토큰 부분만 추출
                const token = authHeader.replace('Bearer ', '');
                localStorage.setItem('accessToken', token);
            } else {
                // 헤더에 없으면 응답 데이터에서 찾기 (백엔드 구현에 따라)
                localStorage.setItem('accessToken', 'temp-token-' + responseData.data.id);
            }

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            onLogin(email);
        } catch (err) {
            console.error('Login error:', err);
            setError(`로그인 실패! ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>🔐 로그인</h1>
                    <p>포인트 충전 서비스에 오신 것을 환영합니다</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                로그인 중...
                            </>
                        ) : (
                            '로그인'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* 🔥 디버깅을 위한 테스트 계정 안내 */}
                <div className="login-footer">
                    <p>테스트 계정으로 회원가입 후 이용해주세요</p>
                    <details style={{marginTop: '10px', fontSize: '0.9em', color: '#666'}}>
                        <summary style={{cursor: 'pointer'}}>디버깅 정보 보기</summary>
                        <div style={{marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px'}}>
                            <p><strong>API URL:</strong> http://3.36.220.104:8080/api/accounts/login</p>
                            <p><strong>현재 도메인:</strong> {window.location.origin}</p>
                            <p><strong>CORS 설정이 필요할 수 있습니다</strong></p>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Login;