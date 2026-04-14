import { useState } from "react";

// 🔥 타입 정의
export interface FormValues {
  id: string;
  email1: string;
  email2: string;
  password: string;
  passwordConfirm: string;
  name: string;
  storeName: string;
  zonecode: string;
  address1: string;
  address2: string;
  phone1: string;
  phone2: string;
  phone3: string;
}

// 🔥 초기값
export const initialFormValues: FormValues = {
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
};

// 🔥 useForm 훅
export const useForm = (initialValues: FormValues = initialFormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);

  // 입력 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 숫자만 입력
  const onlyNumber = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };

  // validation
  const validate = (): string | null => {
    const {
      id,
      email1,
      email2,
      password,
      passwordConfirm,
      name,
      storeName,
      zonecode,
      address1,
      phone1,
      phone2,
      phone3,
    } = values;

    const pattern1 = /[0-9]/;
    const pattern2 = /[a-zA-Z]/;
    const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

    if (!id) return "아이디를 입력해주세요.";

    if (!email1 || !email2) return "이메일을 입력해주세요.";
    if (email1.includes(" ")) return "이메일 공백을 제거해주세요.";

    if (!password) return "비밀번호를 입력해주세요.";

    if (
      password.length < 8 ||
      password.length > 16 ||
      !pattern1.test(password) ||
      !pattern2.test(password) ||
      !pattern3.test(password)
    ) {
      return "비밀번호는 8~16자, 영문/숫자/특수문자를 포함해야 합니다.";
    }

    if (password !== passwordConfirm)
      return "비밀번호가 일치하지 않습니다.";

    if (!name) return "성명을 입력해주세요.";
    if (name.includes(" ")) return "성명 공백을 제거해주세요.";

    if (!storeName) return "매장명을 입력해주세요.";

    if (!zonecode || !address1) return "주소를 입력해주세요.";

    if (!phone1 || !phone2 || !phone3)
      return "휴대폰 번호를 입력해주세요.";

    return null;
  };

  return {
    values,
    setValues,
    handleChange,
    validate,
    onlyNumber,
  };
};