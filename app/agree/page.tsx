"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sweetAlert } from "@/utils/sweetAlert";

export default function FindIdPage() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const router = useRouter();

  const handleSubmit = () => {
    if (!agreeTerms && !agreePrivacy) {
      sweetAlert("이용약관과 개인정보처리방침에 모두 동의해주세요.", "", "info", "닫기");
    } else if (!agreeTerms) {
      sweetAlert("이용약관에 동의해주세요.", "", "info", "닫기");
    } else if (!agreePrivacy) {
      sweetAlert("개인정보처리방침에 동의해주세요.", "", "info", "닫기");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          회원가입 약관 동의
        </h2>

        {/* 이용약관 */}
        <div className="mb-6">
          <div className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto text-sm text-gray-300">
            <strong className="text-white">이용약관</strong>
            <p className="mt-2 leading-relaxed">
              제1조 (목적)<br></br>  
              본 약관은 [뮤직큐] (이하 “회사”)가 운영하는 매장음악 신청곡 플랫폼 (이하 “서비스”)의 이용 조건 및 절차, 회사와 이용자의 권리와 의무를 규정함을 목적으로 합니다.<br></br>
              <br></br>
              제2조 (정의)<br></br>
              ① “회원”이라 함은 본 약관에 따라 서비스에 가입하고, 회사가 제공하는 서비스를 이용하는 자를 말합니다.<br></br>  
              ② “신청곡”이란 이용자가 서비스 내에서 매장음악으로 재생되기를 희망하는 곡을 의미합니다.<br></br>  
              ③ “플랫폼”이란 회사가 제공하는 모바일 앱 또는 웹 기반 시스템을 의미합니다.<br></br>
              <br></br>
              제3조 (약관의 효력 및 변경)<br></br>  
              1. 본 약관은 회원이 서비스에 가입함과 동시에 효력이 발생합니다.<br></br>  
              2. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.<br></br>
              <br></br>
              제4조 (회원가입 및 탈퇴)<br></br>  
              1. 이용자는 회사가 정한 양식에 따라 회원 정보를 기입한 후 본 약관에 동의함으로써 회원가입을 신청할 수 있습니다.<br></br>  
              2. 회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴할 수 있습니다.<br></br>
              <br></br>
              제5조 (서비스의 제공)<br></br>  
              1. 회사는 회원에게 신청곡 등록, 매장음악 재생, 즐겨찾기 및 통계 열람 기능 등을 제공합니다.<br></br>  
              2. 회사는 기술적 사유 또는 정책 변경에 따라 일부 서비스의 제공을 일시적으로 중단할 수 있습니다.<br></br>
              <br></br>
              제6조 (이용자의 의무)<br></br>  
              1. 이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다. <br></br> 
                - 타인의 개인정보 도용<br></br>
                - 음란물, 저작권 침해곡 신청<br></br>
                - 시스템의 정상적 운영을 방해하는 행위<br></br>
                <br></br>
              제7조 (저작권)<br></br>
              1. 신청된 음악 콘텐츠의 저작권은 해당 권리자에게 있으며, 회사는 이용자에게 음악을 신청하고 감상할 수 있는 이용권만을 제공합니다. <br></br> 
             {/* 2. 회사는 자체적으로 한국음악저작권협회 또는 관련 저작권 단체와 정산 계약을 체결하고 있습니다.<br></br> */}
              <br></br>
              제8조 (면책조항)<br></br>
              1. 회사는 서비스의 중단, 오류, 제3자 행위로 인한 손해에 대해 책임을 지지 않습니다.  <br></br>
              2. 이용자가 약관 위반 또는 불법행위로 인해 법적 분쟁이 발생할 경우, 회사는 이에 대한 책임을 지지 않습니다.<br></br>
              <br></br>
              [부칙]<br></br>
              본 약관은 2026년 1월 1일부터 적용됩니다.<br></br>
            </p>
          </div>

          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="terms" className="ml-2 text-gray-300 text-sm">
              이용약관에 동의합니다.
            </label>
          </div>
        </div>

        {/* 개인정보 */}
        <div className="mb-6">
          <div className="bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto text-sm text-gray-300">
            <strong className="text-white">개인정보 처리방침</strong>
            <p className="mt-2 leading-relaxed">
              [뮤직큐]는 이용자의 개인정보를 중요하게 생각하며, 다음과 같이 처리방침을 공개합니다.<br></br>
              1. 수집하는 개인정보 항목<br></br>
              - 필수항목: 이름, 휴대전화번호, 이메일<br></br>
              - 선택항목: 매장명, 선호 장르, 재생 시간대<br></br>
              - 자동수집: 접속 IP, 기기정보, 쿠키정보<br></br>
              <br></br>
              2. 개인정보 수집 목적<br></br>
              - 회원가입 및 인증<br></br>
              - 신청곡 처리 및 매장음악 제공<br></br>
              - 고객문의 응답 및 서비스 개선<br></br>
              <br></br>
              3. 보유 및 이용기간<br></br>
              - 회원 탈퇴 시까지 보관하며, 관련 법령에 따라 최대 5년까지 보관될 수 있습니다.<br></br>
              <br></br>
              4. 개인정보 제3자 제공<br></br>
              - 회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.<br></br>
              - 단, 법령에 따른 요청 시에는 예외로 합니다.<br></br>
              <br></br>
              5. 개인정보 처리위탁<br></br>
              - SMS 발송, 서버 운영 등을 위하여 일부 업무를 외부 업체에 위탁할 수 있습니다.<br></br>  
                (예: Amazon Web Services, 카카오 알림톡 등)<br></br>
              <br></br>
              6. 이용자의 권리<br></br>
              - 이용자는 언제든지 본인의 개인정보를 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.<br></br>
              <br></br>
              7. 개인정보 보호책임자<br></br>
              - 책임자: [김태윤]<br></br>  
              - 이메일: onpps@naver.com<br></br>  
              {/*- 전화번호: 010-2753-5979<br></br> */}
              <br></br>
              [부칙]<br></br>  
              본 개인정보 처리방침은 2026년 1월 1일부터 시행됩니다.<br></br>
              </p>
          </div>

          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              id="privacy"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="privacy" className="ml-2 text-gray-300 text-sm">
              개인정보 처리방침에 동의합니다.
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}