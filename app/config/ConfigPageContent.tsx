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
  Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { getConfig, saveConfig } from "@/api/configApi";

/* 설정 타입 명확히 정의 */
interface StoreSettings {
  searchSource: "api" | "db";
}

export default function ConfigPageContent() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const [settings, setSettings] = useState<StoreSettings>({
    searchSource: "api",
  });

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
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
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="large" onClick={handleSave}>
              설정 저장
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setOpen(false)}
      >
        <Alert
            severity={error ? "error" : "success"}
            onClose={() => setOpen(false)}
        >
            {error ? "설정 저장 실패" : "설정이 저장되었습니다"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
