"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import { useForm, initialFormValues } from "@/hooks/useForm";
import { sweetAlert } from "@/utils/sweetAlert";
import { getMemberInfo, modifyMember } from "@/api/memberApi";
import { Address, useKakaoPostcodePopup } from "react-daum-postcode";
import { useSelector } from "react-redux";

export default function MemberModifyPage() {
  const router = useRouter();
  const loginInfo = useSelector((state: RootState) => state.auth);

  const { values, setValues, handleChange, modifyValidate, onlyNumber } = useForm(initialFormValues);

  const open = useKakaoPostcodePopup();

  //회원 정보 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberInfo = await getMemberInfo(loginInfo);

        const email = memberInfo.email?.split("@") || ["", ""];
        const phone = memberInfo.phone?.split("-") || ["", "", ""];

        setValues({
          ...values,
          ...memberInfo,
          email1: email[0],
          email2: email[1],
          phone1: phone[0],
          phone2: phone[1],
          phone3: phone[2],
        });
      } catch (err) {
        console.error("회원정보 불러오기 실패:", err);
        sweetAlert("회원정보 불러오기 실패", "", "error", "닫기");
      }
    };

    fetchData();
  }, []);
  
  
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

  // 🔥 수정
  const handleSubmit = async () => {
    const error = modifyValidate();
    if (error) {
      sweetAlert(error, "", "info", "닫기");
      return;
    }

    try {
      const res = await modifyMember({
        id: values.id,
        email: `${values.email1}@${values.email2}`,
        name: values.name,
        storeName: values.storeName,
        zonecode: values.zonecode,
        address1: values.address1,
        address2: values.address2,
        phone: `${values.phone1}-${values.phone2}-${values.phone3}`,
        password: values.password,
        //newPassword: values.passwordConfirm, // 새 비밀번호
      });

      if (res.result === "notMatch") {
        return sweetAlert("현재 비밀번호 불일치", "", "info", "닫기");
      }

      sweetAlert("회원정보 수정 완료", "", "success", "닫기");
      router.push("/");
    } catch (e) {
      console.log(e);
      sweetAlert("오류 발생", "", "error", "닫기");
    }
  };

    return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 🔥 왼쪽 프로필 카드 */}
        {/* <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
            {values.name?.charAt(0) || "U"}
          </div>

          <h3 className="mt-4 text-white text-lg font-semibold">
            {values.name}
          </h3>

          <p className="text-gray-400 text-sm">{values.id}</p>

          <div className="mt-6 text-sm text-gray-400 text-center">
            회원 정보를 수정할 수 있습니다.
          </div>
        </div> */}

        {/* 🔥 오른쪽 폼 */}
        <div className="md:col-span-2 bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl text-white font-bold mb-6">
            회원정보 수정
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 이메일 */}
            <div className="col-span-2">
              <label className="text-gray-300 text-sm">이메일</label>
              <div className="flex gap-2 mt-1">
                <input
                  name="email1"
                  value={values.email1}
                  onChange={handleChange}
                  className="flex-1 p-3 rounded bg-gray-700 text-white"
                />
                <span className="text-white">@</span>
                <input
                  name="email2"
                  value={values.email2}
                  onChange={handleChange}
                  className="flex-1 p-3 rounded bg-gray-700 text-white"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                아이디/비밀번호 찾기에 사용됩니다.
              </p>
            </div>

            {/* 현재 비밀번호 */}
            <div className="col-span-2">
              <label className="text-gray-300 text-sm">현재 비밀번호</label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white mt-1"
              />
            </div>

            {/* 새 비밀번호 
            <div className="col-span-2">
              <label className="text-gray-300 text-sm">새 비밀번호</label>
              <input
                type="password"
                name="passwordConfirm"
                value={values.passwordConfirm}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white mt-1"
              />
            </div> */}

            {/* 성명 */}
            <div>
              <label className="text-gray-300 text-sm">성명</label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white mt-1"
              />
            </div>

            {/* 매장명 */}
            <div>
              <label className="text-gray-300 text-sm">매장명</label>
              <input
                name="storeName"
                value={values.storeName}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white mt-1"
              />
            </div>

            {/* 우편번호 */}
            <div className="flex flex-col gap-1 col-span-2">
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

            {/* 주소 */}
            <div className="col-span-2">
              <label className="text-gray-300 text-sm">매장주소</label>
              <input
                value={values.address1}
                readOnly
                className="w-full p-3 rounded bg-gray-700 text-white mt-1"
              />
              <input
                name="address2"
                value={values.address2}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-700 text-white mt-2"
              />
            </div>

            {/* 핸드폰 */}
            <div className="col-span-2">
              <label className="text-gray-300 text-sm">핸드폰</label>
              <div className="flex gap-2 mt-1">
                <input
                  name="phone1"
                  value={values.phone1}
                  onChange={handleChange}
                  className="w-20 p-3 rounded bg-gray-700 text-white"
                />
                <input
                  name="phone2"
                  value={values.phone2}
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
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              저장하기
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}