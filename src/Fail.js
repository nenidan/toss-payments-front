// src/Fail.js
import React, { useEffect, useState } from 'react';

const Fail = () => {
    const [failureData, setFailureData] = useState(null);

    useEffect(() => {
        // URL 파라미터에서 실패 정보 추출
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const message = params.get('message');
        const orderId = params.get('orderId');

        setFailureData({
            code: code || 'USER_CANCEL',
            message: message || '사용자가 결제를 취소하였습니다.',
            orderId: orderId || '알 수 없음'
        });
    }, []);

    const getFailureIcon = (code) => {
        switch (code) {
            case 'USER_CANCEL':
                return '🚫';
            case 'INSUFFICIENT_FUNDS':
                return '💸';
            case 'INVALID_CARD':
                return '💳';
            case 'NETWORK_ERROR':
                return '📡';
            default:
                return '❌';
        }
    };

    const getFailureTitle = (code) => {
        switch (code) {
            case 'USER_CANCEL':
                return '결제가 취소되었습니다';
            case 'INSUFFICIENT_FUNDS':
                return '잔액이 부족합니다';
            case 'INVALID_CARD':
                return '유효하지 않은 카드입니다';
            case 'NETWORK_ERROR':
                return '네트워크 오류가 발생했습니다';
            default:
                return '결제를 완료할 수 없습니다';
        }
    };

    const getFailureDescription = (code) => {
        switch (code) {
            case 'USER_CANCEL':
                return '결제 과정에서 취소를 선택하셨습니다. 언제든지 다시 시도해보세요.';
            case 'INSUFFICIENT_FUNDS':
                return '계좌 잔액 또는 카드 한도를 확인한 후 다시 시도해주세요.';
            case 'INVALID_CARD':
                return '카드 정보를 확인하시거나 다른 결제 수단을 이용해주세요.';
            case 'NETWORK_ERROR':
                return '인터넷 연결을 확인한 후 다시 시도해주세요.';
            default:
                return '잠시 후 다시 시도해주시거나 고객센터로 문의해주세요.';
        }
    };

    const handleRetry = () => {
        // 메인 페이지로 돌아가서 다시 시도
        window.location.href = '/';
    };

    const handleContactSupport = () => {
        // 고객센터 연결 (실제로는 고객센터 페이지나 전화번호)
        alert('고객센터: 1588-0000\n평일 09:00~18:00');
    };

    if (!failureData) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingCard}>
                    <div style={styles.spinner}></div>
                    <p>결과를 확인하고 있습니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.failCard}>
                {/* 실패 아이콘 */}
                <div style={styles.failIcon}>
                    <div style={styles.iconCircle}>
                        {getFailureIcon(failureData.code)}
                    </div>
                </div>

                {/* 실패 메시지 */}
                <h1 style={styles.failTitle}>
                    {getFailureTitle(failureData.code)}
                </h1>
                <p style={styles.failDescription}>
                    {getFailureDescription(failureData.code)}
                </p>

                {/* 실패 정보 */}
                <div style={styles.failureInfo}>
                    <h3 style={styles.infoTitle}>실패 정보</h3>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>오류 코드</span>
                        <span style={styles.infoValue}>{failureData.code}</span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>오류 메시지</span>
                        <span style={styles.infoValue}>{failureData.message}</span>
                    </div>

                    {failureData.orderId !== '알 수 없음' && (
                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>주문번호</span>
                            <span style={styles.infoValue}>
                                {failureData.orderId.substring(0, 8)}...
                            </span>
                        </div>
                    )}

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>발생 시간</span>
                        <span style={styles.infoValue}>
                            {new Date().toLocaleString('ko-KR')}
                        </span>
                    </div>
                </div>

                {/* 액션 버튼들 */}
                <div style={styles.actionButtons}>
                    <button
                        onClick={handleRetry}
                        style={styles.retryButton}
                    >
                        다시 시도하기
                    </button>
                    <button
                        onClick={handleContactSupport}
                        style={styles.supportButton}
                    >
                        고객센터 문의
                    </button>
                </div>

                {/* 도움말 */}
                <div style={styles.helpSection}>
                    <h4 style={styles.helpTitle}>💡 도움말</h4>
                    <ul style={styles.helpList}>
                        <li>결제 수단을 변경해보세요</li>
                        <li>인터넷 연결 상태를 확인해주세요</li>
                        <li>브라우저를 새로고침 후 다시 시도해보세요</li>
                        <li>문제가 지속되면 고객센터로 문의해주세요</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
        borderTop: '4px solid #ff6b6b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    failCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
    },
    failIcon: {
        marginBottom: '30px'
    },
    iconCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5em',
        animation: 'shake 0.6s ease-in-out'
    },
    failTitle: {
        color: '#333',
        margin: '0 0 15px 0',
        fontSize: '2.2em',
        fontWeight: '300'
    },
    failDescription: {
        color: '#666',
        fontSize: '1.1em',
        marginBottom: '40px',
        lineHeight: '1.6'
    },
    failureInfo: {
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
    actionButtons: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap'
    },
    retryButton: {
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
    supportButton: {
        background: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
        padding: '13px 28px',
        borderRadius: '25px',
        fontSize: '1.1em',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    helpSection: {
        borderTop: '1px solid #e9ecef',
        paddingTop: '20px',
        textAlign: 'left'
    },
    helpTitle: {
        color: '#333',
        marginBottom: '15px',
        fontSize: '1.1em'
    },
    helpList: {
        color: '#666',
        paddingLeft: '20px',
        margin: 0
    }
};

// CSS 애니메이션을 위한 스타일 태그 추가
if (!document.querySelector('#fail-animations')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'fail-animations';
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        button:hover {
            transform: translateY(-2px) !important;
        }
    `;
    document.head.appendChild(styleSheet);
}

export default Fail;