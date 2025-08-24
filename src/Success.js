// src/Success.js
import React, {useEffect, useState, useRef} from 'react';

const Success = () => {
    const [message, setMessage] = useState('결제 확인 중입니다...');
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const confirmPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentKey = params.get('paymentKey');
            const orderId = params.get('orderId');
            const amount = parseInt(params.get('amount'), 10);
            const token = localStorage.getItem('accessToken');

            console.log('API 호출 시작 - orderId:', orderId);

            try {
                const response = await fetch('3.36.220.104/api/payments/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount
                    })
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('API 에러:', errorData);
                    throw new Error('서버에서 결제 승인 실패');
                }

                const apiResponse = await response.json();
                const data = apiResponse.data;
                setPaymentData({
                    ...data,
                    paymentKey,
                    orderId,
                    amount
                });
                setMessage('결제가 성공적으로 완료되었습니다!');
                setLoading(false);
            } catch (err) {
                console.error('결제 확인 실패:', err);
                setError('결제 승인에 실패했습니다.');
                setLoading(false);
            }
        };

        confirmPayment();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return amount?.toLocaleString('ko-KR') || '0';
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingCard}>
                    <div style={styles.spinner}></div>
                    <h2 style={styles.loadingTitle}>결제 확인 중입니다...</h2>
                    <p style={styles.loadingText}>잠시만 기다려주세요</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorCard}>
                    <div style={styles.errorIcon}>❌</div>
                    <h1 style={styles.errorTitle}>결제 실패</h1>
                    <p style={styles.errorMessage}>{error}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={styles.homeButton}
                    >
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.successCard}>
                {/* 성공 아이콘 */}
                <div style={styles.successIcon}>
                    <div style={styles.checkmark}>✓</div>
                </div>

                {/* 성공 메시지 */}
                <h1 style={styles.successTitle}>결제 완료!</h1>
                <p style={styles.successMessage}>포인트 충전이 성공적으로 완료되었습니다.</p>

                {/* ✅ orderName 추가 */}
                <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>주문명</span>
                    <span style={styles.infoValue}>
                        {paymentData?.orderName || '포인트 충전'}
                    </span>
                </div>

                {/* 결제 정보 카드 */}
                <div style={styles.paymentInfo}>
                    <h3 style={styles.infoTitle}>결제 정보</h3>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>충전 금액</span>
                        <span style={styles.infoValue}>
                            {formatAmount(paymentData?.amount)}원
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>결제 방법</span>
                        <span style={styles.infoValue}>
                            {paymentData?.method || '카드'}
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>주문번호</span>
                        <span style={styles.infoValue}>
                            {paymentData?.orderId?.substring(0, 8)}...
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>승인 시간</span>
                        <span style={styles.infoValue}>
                            {formatDate(paymentData?.approvedAt)}
                        </span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>결제 상태</span>
                        <span style={{...styles.infoValue, ...styles.statusSuccess}}>
                            {paymentData?.status || 'DONE'}
                        </span>
                    </div>
                </div>

                {/* 액션 버튼들 */}
                <div style={styles.actionButtons}>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={styles.primaryButton}
                    >
                        메인으로 돌아가기
                    </button>
                </div>

                {/* 추가 정보 */}
                <div style={styles.additionalInfo}>
                    <p style={styles.infoText}>
                        💰 충전된 포인트는 즉시 사용 가능합니다.
                    </p>
                    <p style={styles.infoText}>
                        📧 결제 완료 알림이 등록된 이메일로 발송됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    loadingCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    loadingTitle: {
        color: '#333',
        marginBottom: '10px',
        fontSize: '1.5em'
    },
    loadingText: {
        color: '#666',
        margin: 0
    },
    errorCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
    },
    errorIcon: {
        fontSize: '4em',
        marginBottom: '20px'
    },
    errorTitle: {
        color: '#e74c3c',
        marginBottom: '15px',
        fontSize: '2em'
    },
    errorMessage: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '1.1em'
    },
    successCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
    },
    successIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
        margin: '0 auto 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'bounce 0.6s ease-in-out'
    },
    checkmark: {
        color: 'white',
        fontSize: '2.5em',
        fontWeight: 'bold'
    },
    successTitle: {
        color: '#333',
        margin: '0 0 15px 0',
        fontSize: '2.5em',
        fontWeight: '300'
    },
    successMessage: {
        color: '#666',
        fontSize: '1.2em',
        marginBottom: '40px'
    },
    paymentInfo: {
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'left'
    },
    infoTitle: {
        color: '#333',
        marginBottom: '20px',
        fontSize: '1.3em',
        textAlign: 'center'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef'
    },
    infoLabel: {
        color: '#666',
        fontSize: '1em'
    },
    infoValue: {
        color: '#333',
        fontWeight: '600',
        fontSize: '1em'
    },
    statusSuccess: {
        color: '#28a745',
        background: '#d4edda',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.9em'
    },
    actionButtons: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginBottom: '30px'
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '25px',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(102,126,234,0.4)'
    },
    homeButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '25px',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(102,126,234,0.4)'
    },
    additionalInfo: {
        borderTop: '1px solid #e9ecef',
        paddingTop: '20px'
    },
    infoText: {
        color: '#666',
        fontSize: '0.95em',
        margin: '8px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    }
};

// CSS 애니메이션을 위한 스타일 태그 추가
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(102,126,234,0.6) !important;
    }
`;
document.head.appendChild(styleSheet);

export default Success;