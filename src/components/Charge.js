// src/components/Charge.js
import React, { useState, useEffect } from 'react';
import './Charge.css';

const Charge = ({ user, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pointBalance, setPointBalance] = useState(0);
    const [balanceLoading, setBalanceLoading] = useState(true);

    // 토스 페이먼츠 스크립트 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v2/standard';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // 포인트 잔액 조회
    useEffect(() => {
        const fetchPointBalance = async () => {
            try {
                setBalanceLoading(true);
                const response = await fetch('http://3.36.220.104:8080/api/points', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (response.ok) {
                    const apiResponse = await response.json();
                    // ApiResponse 구조에서 실제 데이터 추출
                    const balanceData = apiResponse.data;
                    setPointBalance(balanceData.balance || 0);
                } else {
                    console.error('포인트 잔액 조회 실패:', response.status);
                    setPointBalance(0); // 실패 시 0으로 표시
                }
            } catch (error) {
                console.error('포인트 잔액 조회 에러:', error);
                setPointBalance(0);
            } finally {
                setBalanceLoading(false);
            }
        };

        fetchPointBalance();
    }, []);

    const handlePayment = async (amount) => {
        console.log('🚀 결제 시작:', { amount });
        setLoading(true);
        setMessage('');

        try {
            // 1. 서버에 결제 준비 요청 (토스 권장사항)
            console.log('📝 결제 준비 API 호출...');
            const prepareResponse = await fetch('http://3.36.220.104:8080/api/payments/prepare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    amount: amount
                })
            });

            if (!prepareResponse.ok) {
                const errorData = await prepareResponse.json();
                throw new Error(errorData.message || '결제 준비 실패');
            }

            const apiResponse = await prepareResponse.json();
            const prepareData = apiResponse.data;
            console.log('✅ 결제 준비 완료:', prepareData);

            // 2. 토스 페이먼츠 v2로 결제 요청
            console.log('💳 토스 결제 파라미터:', {
                amount: prepareData.amount,
                orderId: prepareData.orderId,
                orderName: prepareData.orderName
            });

            if (window.TossPayments) {
                console.log('💳 토스 페이먼츠 v2 초기화 중...');
                const tossPayments = window.TossPayments('test_ck_KNbdOvk5rkOOXMabGXRqrn07xlzm');

                // customerKey를 규칙에 맞게 생성
                const customerKey = `user-${user.replace(/[^a-zA-Z0-9\-*=.@]/g, '')}`;
                console.log('생성된 customerKey:', customerKey);

                const payment = tossPayments.payment({
                    customerKey: customerKey
                });

                console.log('💳 결제 요청 시작...');
                await payment.requestPayment({
                    method: 'CARD',
                    amount: {
                        currency: 'KRW',
                        value: prepareData.amount
                    },
                    orderId: prepareData.orderId,
                    orderName: prepareData.orderName,
                    // 🔥 수정된 부분: 사용자 정보를 URL에 포함
                    successUrl: `${window.location.origin}/payments/success?user=${encodeURIComponent(user)}`,
                    failUrl: `${window.location.origin}/payments/fail?user=${encodeURIComponent(user)}`
                });
                console.log('✅ 결제 요청 완료');
            } else {
                console.error('❌ TossPayments 객체를 찾을 수 없습니다');
                throw new Error('TossPayments 라이브러리가 로드되지 않았습니다');
            }

        } catch (err) {
            console.error('💥 전체 에러:', {
                name: err.name,
                message: err.message,
                stack: err.stack
            });

            // 사용자 친화적 에러 메시지
            let userMessage = '결제 중 오류가 발생했습니다.';
            if (err.message.includes('준비')) {
                userMessage = '결제 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            } else if (err.message.includes('취소')) {
                userMessage = '결제가 취소되었습니다.';
            } else if (err.message.includes('로드')) {
                userMessage = 'TossPayments 라이브러리가 로드되지 않았습니다.';
            }

            setMessage(userMessage);
        } finally {
            console.log('🏁 결제 프로세스 종료');
            setLoading(false);
        }
    };

    const amounts = [
        { value: 10000, popular: false },
        { value: 30000, popular: true },
        { value: 50000, popular: false },
        { value: 100000, popular: false }
    ];

    return (
        <div className="charge-container">
            <div className="charge-card">
                {/* 헤더 */}
                <div className="charge-header">
                    <div className="header-content">
                        <h1>💳 포인트 충전</h1>
                        <p>{user}님, 충전할 금액을 선택해주세요</p>
                    </div>
                    <button className="logout-button" onClick={onLogout}>
                        로그아웃
                    </button>
                </div>

                {/* 현재 포인트 (실제 API 데이터) */}
                <div className="current-points">
                    <div className="points-info">
                        <span className="points-label">현재 보유 포인트</span>
                        <span className="points-value">
                            {balanceLoading ? (
                                <span style={{color: '#999', fontSize: '0.9em'}}>로딩 중...</span>
                            ) : (
                                `${pointBalance.toLocaleString()} P`
                            )}
                        </span>
                    </div>
                    <div className="points-icon">🪙</div>
                </div>

                {/* 충전 금액 선택 */}
                <div className="amount-selection">
                    <h3>충전 금액 선택</h3>
                    <div className="amount-grid">
                        {amounts.map(({ value, popular }) => (
                            <button
                                key={value}
                                className={`amount-button ${popular ? 'popular' : ''}`}
                                onClick={() => handlePayment(value)}
                                disabled={loading}
                            >
                                {popular && <span className="popular-badge">인기</span>}
                                <div className="amount-value">
                                    {value.toLocaleString()}원
                                </div>
                                <div className="amount-points">
                                    +{value.toLocaleString()}P
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 메시지 표시 */}
                {message && (
                    <div className="message-box error">
                        <span className="message-icon">⚠️</span>
                        {message}
                        <button
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            🔄 새로고침
                        </button>
                    </div>
                )}

                {/* 로딩 상태 */}
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="loading-spinner"></div>
                            <p>결제 준비 중입니다...</p>
                            <small>서버에서 결제 정보를 검증하고 있어요</small>
                        </div>
                    </div>
                )}

                {/* 안내 사항 */}
                <div className="charge-notice">
                    <h4>💡 충전 안내</h4>
                    <ul>
                        <li>✅ 모든 결제 정보는 서버에서 안전하게 검증됩니다</li>
                        <li>🔒 토스페이먼츠를 통해 안전하게 처리됩니다</li>
                        <li>⚡ 충전된 포인트는 즉시 사용 가능합니다</li>
                        <li>🧪 테스트 환경에서는 실제 결제가 발생하지 않습니다</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Charge;