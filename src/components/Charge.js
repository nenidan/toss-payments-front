// src/components/Charge.js
import React, { useState, useEffect } from 'react';
import './Charge.css';

const Charge = ({ user, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // UUID 생성 함수
    const generateOrderId = () => {
        return 'order-' + crypto.randomUUID();
    };

    const handlePayment = async (amount) => {
        console.log('🚀 결제 시작:', { amount });
        setLoading(true);
        setMessage('');

        try {
            // 1. orderId 프론트엔드에서 직접 생성
            const orderId = generateOrderId();
            console.log('🆔 생성된 orderId:', orderId);

            // 2. 토스 페이먼츠 파라미터 준비
            const tossParams = {
                amount,
                orderId: orderId,
                orderName: `포인트 ${amount.toLocaleString()}원 충전`
            };
            console.log('💳 토스 결제 파라미터:', tossParams);

            // 3. 토스 페이먼츠 객체 확인
            console.log('🏪 TossPayments 객체:', {
                exists: !!window.TossPayments,
                type: typeof window.TossPayments
            });

            if (window.TossPayments) {
                console.log('💳 토스 페이먼츠 초기화 중...');
                const tossPayments = window.TossPayments('test_ck_KNbdOvk5rkOOXMabGXRqrn07xlzm');

                console.log('💳 결제 요청 시작...');
                await tossPayments.requestPayment('카드', {
                    amount: tossParams.amount,
                    orderId: tossParams.orderId,
                    orderName: tossParams.orderName,
                    successUrl: `http://localhost:3000/payments/success`,
                    failUrl: `http://localhost:3000/payments/fail`
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
            setMessage(`결제 오류: ${err.message}`);
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

                {/* 현재 포인트 (가상 데이터) */}
                <div className="current-points">
                    <div className="points-info">
                        <span className="points-label">현재 보유 포인트</span>
                        <span className="points-value">0 P</span>
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
                    </div>
                )}

                {/* 로딩 상태 */}
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="loading-spinner"></div>
                            <p>결제창을 열고 있습니다...</p>
                        </div>
                    </div>
                )}

                {/* 안내 사항 */}
                <div className="charge-notice">
                    <h4>💡 충전 안내</h4>
                    <ul>
                        <li>충전된 포인트는 즉시 사용 가능합니다</li>
                        <li>결제는 토스페이먼츠를 통해 안전하게 처리됩니다</li>
                        <li>테스트 환경에서는 실제 결제가 발생하지 않습니다</li>
                        <li>🆕 이제 더 빠른 결제 경험을 제공합니다!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Charge;