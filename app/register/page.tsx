"use client";

import { useRouter } from "next/navigation";
import { Address, useKakaoPostcodePopup } from "react-daum-postcode";
import { sweetAlert } from "@/utils/sweetAlert";
import { useForm } from "@/hooks/useForm";
//import useCustomLogin from "@/hooks/useCustomLogin";
import { doRegister, doDuplicateCheck } from "@/api/memberApi";

export default function RegisterPage() {
  const router = useRouter();
  const open = useKakaoPostcodePopup();

  //const { doResigter, doDuplicateCheck } = useCustomLogin();

  const { values, setValues, handleChange, onlyNumber, validate } = useForm({
    id: "",
    email1: "",
    email2: "",
    password: "",
    passwordConfirm: "",
    name: "",
    storeName: "",
    zonecode: "",
    address1: "",
    address2: "",
    phone1: "",
    phone2: "",
    phone3: "",
  });

  // 주소 검색
  const handleAddress = () => {
    open({
      onComplete: (data: Address) => {
        let fullAddress = data.address;
        let extra = "";

        if (data.bname) extra += data.bname;
        if (data.buildingName)
          extra += extra ? `, ${data.buildingName}` : data.buildingName;

        if (extra) fullAddress += ` (${extra})`;

        setValues((prev) => ({
          ...prev,
          zonecode: data.zonecode,
          address1: fullAddress,
        }));
      },
    });
  };

  // 회원가입
  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      sweetAlert(error, "", "info", "닫기");
      return;
    }

    try {
      const res = await doRegister({
        id: values.id,
        email: `${values.email1}@${values.email2}`,
        password: values.password,
        name: values.name,
        storeName: values.storeName,
        zonecode: values.zonecode,
        address1: values.address1,
        address2: values.address2,
        phone: `${values.phone1}-${values.phone2}-${values.phone3}`,
      });

      if (res.result === "idExist") return sweetAlert("이미 존재하는 아이디 입니다.", "", "info", "닫기");
      if (res.result === "emailExist") return sweetAlert("이미 존재하는 이메일 입니다.", "", "info", "닫기");

      sweetAlert("회원가입 완료", "", "success", "닫기");
      router.push("/");
    } catch (e) {
      console.log(e);
      sweetAlert("오류 발생", "", "error", "닫기");
    }
  };

  // 중복 체크
  const handleDuplicate = async () => {
    if (!values.id) return sweetAlert("아이디 입력", "", "info", "닫기");

    const res = await doDuplicateCheck({
      type: "id",
      id: values.id,
      email: `${values.email1}@${values.email2}`,
    });

    if (res.result === "exist") {
      sweetAlert("이미 존재하는 아이디 입니다.", "", "info", "닫기");
    } else {
      sweetAlert("사용 가능 아이디 입니다.", "", "success", "닫기");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">회원가입</h2>

        <div className="flex flex-col gap-4">

          {/* 아이디 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">아이디</label>
            <div className="flex gap-2">
              <input
                name="id"
                value={values.id}
                onChange={handleChange}
                className="flex-1 p-3 rounded bg-gray-700 text-white"
                placeholder="아이디를 입력해주세요."
              />
              <button
                onClick={handleDuplicate}
                className="bg-blue-600 px-4 rounded text-white"
              >
                중복확인
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">이메일</label>
            <div className="flex gap-2 items-center">
              <input
                name="email1"
                value={values.email1}
                onChange={handleChange}
                className="flex-1 p-3 rounded bg-gray-700 text-white"
              />
              <span className="text-white">@</span>
              <select
                name="email2"
                value={values.email2}
                onChange={handleChange}
                className="p-3 rounded bg-gray-700 text-white"
              >
                <option value="">선택하세요</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="kakao.com">kakao.com</option>
              </select>
            </div>

            {/* 👇 추가되는 안내 문구 */}
            <p className="text-xs text-blue-400 mt-1">
              이메일 주소는 아이디 및 비밀번호 찾기에 이용되므로 정확히 입력해 주시길 바랍니다.
            </p>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">비밀번호</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={values.passwordConfirm}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white"
            />
          </div>

          {/* 성명 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">성명</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white"
              placeholder="성명을 입력해주세요"
            />
          </div>

          {/* 매장명 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">매장명</label>
            <input
              name="storeName"
              value={values.storeName}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white"
              placeholder="매장명을 입력해주세요"
            />
          </div>

          {/* 우편번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">우편번호</label>
            <div className="flex gap-2">
              <input
                value={values.zonecode}
                readOnly
                className="flex-1 p-3 rounded bg-gray-700 text-white"
                placeholder="우편번호"
              />
              <button
                onClick={handleAddress}
                className="bg-blue-600 px-4 rounded text-white"
              >
                우편번호 찾기
              </button>
            </div>
          </div>

          {/* 매장주소 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">매장주소</label>
            <input
              value={values.address1}
              readOnly
              className="p-3 rounded bg-gray-700 text-white"
              placeholder="주소"
            />
            <input
              name="address2"
              value={values.address2}
              onChange={handleChange}
              className="p-3 rounded bg-gray-700 text-white mt-2"
              placeholder="상세주소"
            />
          </div>

          {/* 핸드폰 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">핸드폰</label>
            <div className="flex gap-2 items-center">
              <select
                name="phone1"
                value={values.phone1}
                onChange={handleChange}
                className="p-3 rounded bg-gray-700 text-white"
              >
                <option value="">선택</option>
                <option value="010">010</option>
              </select>

              <span className="text-white">-</span>
              
              <input
                name="phone2"
                value={values.phone2}
                maxLength={4}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    phone2: onlyNumber(e.target.value),
                  }))
                }
                className="flex-1 p-3 rounded bg-gray-700 text-white"
              />

              <input
                name="phone3"
                value={values.phone3}
                maxLength={4}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    phone3: onlyNumber(e.target.value),
                  }))
                }
                className="flex-1 p-3 rounded bg-gray-700 text-white"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
              가입하기
            </button>
            <button onClick={() => router.push("/")}
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl">
              취소
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}