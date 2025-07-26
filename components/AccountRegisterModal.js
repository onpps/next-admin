// components/AccountRegisterModal.js
import { useState } from "react";
import { sweetAlert } from '@/utils/sweetAlert';
import { registerUser } from "@/api/deviceApi";

export default function AccountRegisterModal({ visible, onRefresh, onClose }) {
  if (!visible) return null;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    const { id, password, confirmPassword } = form;

    console.log(form);

    if (!id || !password || !confirmPassword) {
      sweetAlert('모든 항목을 입력해주세요.', '', 'info', '닫기');
      return;
    }

    // 길이 유효성 검사
    if (id.length < 5 || password.length < 5 || confirmPassword.length < 5) {
      sweetAlert('모든 항목은 최소 5자리 이상이어야 합니다.', '', 'info', '닫기');
      return;
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      sweetAlert('비밀번호가 일치하지 않습니다.', '', 'info', '닫기');
      return;
    }

    setLoading(true);
    try {

      const data = await registerUser(form);
      
      console.log("data=>" + JSON.stringify(data));

      /*if (data.errorCode === 'idIsEmpty') {
        sweetAlert('아이디 정보가 없습니다.', '', 'info', '닫기');
        return;
      }

      if (data.errorCode === 'passwordIsEmpty') {
        sweetAlert('비밀번호 정보가 없습니다.', '', 'info', '닫기');
        return;
      }

      if (data.errorCode === 'storeIdIsEmpty') {
        sweetAlert('매장아이디 정보가 없습니다.', '', 'info', '닫기');
        return;
      }

      if (data.errorCode === 'exist') {
        sweetAlert('이미 존재하는 아이디 입니다.', '', 'info', '닫기');
        return;
      }

      if (data.errorCode === 'limitExceeded') {
        sweetAlert('10개이상 계정등록이 불가 합니다.', '', 'info', '닫기');
        return;
      }*/

      if (data.success) {
        sweetAlert('계정추가가 완료되었습니다.', '', 'info', '닫기');
        onRefresh();
        onClose();
      } else {
        sweetAlert(data.error || '계정추가 실패', '', 'info', '닫기');
      }
    } catch (err) {
      console.error(err);
      sweetAlert(data.error || '서버 오류가 발생했습니다.', '', 'info', '닫기');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black border border-white text-white p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">계정추가</h2>
        <div className="space-y-3">
          <div className="flex">
            <label className="w-1/3 bg-black text-white px-2 py-2 text-sm">아이디</label>
            <input
              type="text"
              name="id"
              onChange={handleChange}
              className="w-2/3 bg-gray-100 px-2 py-2 text-black"
            />
          </div>
          <div className="flex">
            <label className="w-1/3 bg-black text-white px-2 py-2 text-sm">비밀번호</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-2/3 bg-gray-100 px-2 py-2 text-black"
            />
          </div>
          <div className="flex">
            <label className="w-1/3 bg-black text-white px-2 py-2 text-sm">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="비밀번호 확인을 입력해주세요"
              className="w-2/3 bg-gray-100 px-2 py-2 text-black placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? '처리중...' : '등록'}
          </button>
          <button className="bg-gray-400 text-black px-4 py-2 rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
