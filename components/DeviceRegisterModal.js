// components/DeviceRegisterModal.js
import { useState } from "react";
import { sweetAlert } from "@/utils/sweetAlert";
import { registerDivice } from "@/api/deviceApi";

export default function DeviceRegisterModal({ visible, onRefresh, onClose }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tableNo: "",
    deviceName: ""
  });

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {

    if (!form.tableNo || form.tableNo < 1) {
      sweetAlert("테이블 번호를 입력해주세요.", "", "info", "닫기");
      return;
    }

    if (!form.deviceName || form.deviceName.trim() === "") {
      sweetAlert("단말기 이름을 입력해주세요.", "", "info", "닫기");
      return;
    }

    setLoading(true);

    try {

      const data = await registerDivice(form);

      console.log("registerData=>" + JSON.stringify(data));

      if (data.success) {

        sweetAlert(
          `단말기 등록 완료\n\n페어링 코드 : ${data.device.pairCode}`,
          "태블릿에서 해당 코드를 입력하세요",
          "success",
          "닫기"
        );

        onRefresh();
        onClose();

      } else {
        sweetAlert(data.error || "단말기 등록 실패", "", "error", "닫기");
      }

    } catch (err) {
      console.error(err);
      sweetAlert("서버 오류가 발생했습니다.", "", "error", "닫기");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">단말기 등록</h2>

        <div className="space-y-4">

          {/* 테이블 번호 */}
          <div>
            <label className="block text-sm mb-1">테이블 번호</label>
            <input
              type="number"
              name="tableNo"
              min="1"
              step="1"
              value={form.tableNo} 
              required
              onChange={(e) => {
                let value = parseInt(e.target.value);

                if (value < 1 || isNaN(value)) {
                  value = 1;
                }

                setForm({ ...form, tableNo: value });
              }}
              className="w-full border px-3 py-2 rounded"
              placeholder="예: 1"
            />
          </div>

          {/* 단말기 이름 */}
          <div>
            <label className="block text-sm mb-1">단말기 이름 (선택)</label>
            <input
              type="text"
              name="deviceName"
              required
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="예: 테이블1 태블릿"
            />
          </div>

          <div className="bg-gray-100 p-3 text-sm rounded">
            등록 후 <b>페어링 코드(pairCode)</b>가 생성됩니다.<br/>
            태블릿에서 해당 코드를 입력하면 연결됩니다.
          </div>

        </div>

        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "처리중..." : "단말기 등록"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            취소
          </button>

        </div>

      </div>

    </div>
  );
}