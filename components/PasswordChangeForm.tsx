'use client';
import React, { useState } from 'react';
import { sweetToast } from '@/utils/sweetAlert';
import { changePassword } from "@/api/deviceApi";

interface Props {
  loginId: string;
  onClose: () => void;
}

interface userParam {
  id: string;
  password: string;
}

const PasswordChangeForm: React.FC<Props> = ({ loginId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setError('비밀번호는 6자 이상 입력하세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      /*const response = await fetch('/api/device/changePassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId,
          newPassword,
        }),
      });*/
      
      const param: userParam = {
        id: loginId,
        password: newPassword,
      };
  
      const data = await changePassword(param);
            
      console.log("data=>" + JSON.stringify(data));
      
      if (data.success) {
        sweetToast('비밀번호가 변경되었습니다.');
        onClose();
      } else {
        setError(data.message || '비밀번호 변경 실패');
      }
    } catch (error) {
      setError('서버 오류');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>비밀번호 변경</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>로그인 ID</label>
          <input type="text" value={loginId} disabled style={{ ...inputStyle, backgroundColor: '#f5f5f5' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
            minLength={6}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem' }}>
            취소
          </button>
          <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
            {loading ? '변경 중...' : '변경'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
