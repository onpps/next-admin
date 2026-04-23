"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Snackbar, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { getConfig, saveConfig, changePassword } from "@/api/configApi";

/* 설정 타입 명확히 정의 */
interface StoreSettings {
  searchSource: "api" | "db";
}

export default function ConfigPageContent() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // 메시지 상태 추가

  const [settings, setSettings] = useState<StoreSettings>({
    searchSource: "api",
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const [passwordError, setPasswordError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (key: string, value: string) => {
    setPasswordForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 여기 수정됨
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();

        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data, // 🔥 서버에서 받은 값 전체 바인딩
          }));
        }
      } catch (error) {
        console.error("설정 불러오기 실패:", error);
      }
    };

    fetchConfig();
  }, []);

  const handlePasswordUpdate = async () => {

    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "현재 비밀번호를 입력하세요.";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "새 비밀번호를 입력하세요.";
    } else if (!passwordRegex.test(passwordForm.newPassword)) {
      errors.newPassword =
        "비밀번호는 8~16자 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "새 비밀번호 확인을 입력하세요.";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setPasswordError(errors);

    if (
      errors.currentPassword ||
      errors.newPassword ||
      errors.confirmPassword
    ) {
      return;
    }

    try {
      await changePassword(passwordForm);
      
      setPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setError(false);
      setSnackbarMessage("비밀번호가 성공적으로 변경되었습니다."); // 성공 메시지
      setOpen(true);

    } catch (e: unknown) { // 타입을 명시하지 않으면 기본적으로 unknown입니다.
      console.log(e);
      setError(true);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const serverMsg = (e as any).response?.data || "비밀번호 변경 중 오류가 발생했습니다.";
      
      setSnackbarMessage(serverMsg);
      setOpen(true);
    }
  };

  const handleSave = async () => {
    console.log("저장 데이터:", settings);

    try {
        await saveConfig(settings);

        setError(false);
        setOpen(true);
    } catch (e) {
        console.log(e);
        setError(true);
        setOpen(true);
    }
 };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        매장 설정
      </Typography>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                음악 환경 설정
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {/* 🔥 신청곡 검색 방식 선택 */}
                <Grid size={12}>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    신청곡 검색 방식
                  </FormLabel>

                 <RadioGroup
                    row
                    value={settings.searchSource}
                    onChange={(e) =>
                      handleChange(
                        "searchSource",
                        e.target.value as "api" | "db"
                      )
                    }
                  >
                    <FormControlLabel
                      value="api"
                      control={<Radio />}
                      label="외부 API 검색"
                    />
                    <FormControlLabel
                      value="db"
                      control={<Radio />}
                      label="내 DB 검색"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>

              <Typography variant="h6" gutterBottom>
                보안 설정
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>비밀번호 변경</Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  변경하기
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="large" onClick={handleSave}>
              설정 저장
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>비밀번호 변경</DialogTitle>

          <DialogContent>

           <TextField
              fullWidth
              margin="normal"
              type="password"
              label="현재 비밀번호"
              value={passwordForm.currentPassword}
              error={!!passwordError.currentPassword}
              helperText={passwordError.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
            />

            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="새 비밀번호"
              value={passwordForm.newPassword}
              error={!!passwordError.newPassword}
              helperText={passwordError.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
            />

          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="새 비밀번호 확인"
            value={passwordForm.confirmPassword}
            error={!!passwordError.confirmPassword}
            helperText={passwordError.confirmPassword}
            onChange={(e) =>
              handlePasswordChange("confirmPassword", e.target.value)
            }
          />

          </DialogContent>

          <DialogActions>

            <Button onClick={() => setPasswordDialogOpen(false)}>
              취소
            </Button>

            <Button
              variant="contained"
              onClick={handlePasswordUpdate}
            >
              변경
            </Button>

          </DialogActions>
        </Dialog>

      <Snackbar
        open={open}
        autoHideDuration={3000} // 에러 메시지를 읽을 수 있도록 시간을 조금 늘림
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setOpen(false)}
      >
        <Alert
            severity={error ? "error" : "success"}
            onClose={() => setOpen(false)}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {snackbarMessage} 
        </Alert>
      </Snackbar>
    </Box>
  );
}
