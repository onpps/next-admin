"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayList } from "@/types/Dashboard";
import { getDashboardList } from "@/api/dashboardApi";
import { sweetConfirm } from "@/utils/sweetAlert";
import { Button } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminDashboard() {
  const router = useRouter();
  const [openPlayer, setOpenPlayer] = useState(false);
  const [requests, setRequests] = useState<PlayList[]>([]);

  useEffect(() => {
    getDashboardList()
      .then((data) => {
        if (data?.playList && Array.isArray(data.playList)) {
          setRequests(data.playList);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  /* -------------------------
     팟플레이어 재생 함수
  -------------------------- */
  const handlePlay = (item: PlayList) => {
    if (!item.videoId) {
      alert("videoId가 없습니다.");
      return;
    }

    const url = `/player/${item.videoId}`;

    // location=no를 명시하고, toolbar와 status 등을 꺼줍니다.
    const features = "width=1000,height=700,left=200,top=100,resizable=yes,location=no,toolbar=no,menubar=no,status=no";
    
    window.open(url, "storePlayer", features);

    //const youtubeUrl = `https://www.youtube.com/watch?v=${item.videoId}`;

    // 팟플레이어 실행
    //window.location.href = `potplayer://${youtubeUrl}`;

    // UI 재생완료 처리
    //setRequests((prev) =>
      //prev.map((r) =>
        ///r.mno === item.mno ? { ...r, playYn: "Y" } : r
      //)
    //);
  };

  const reject = () => {
    sweetConfirm(
      `<span style="font-size:20px;">
        신청곡 거절은 플레이리스트 관리화면에서 가능합니다.
        이동 하시겠습니까?
      </span>`,
      "question",
      async () => {
        router.push("/playList");
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          🎵 매장 관리자 대시보드
        </h1>
      </header>

      {/* 통계 카드 */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold">오늘 신청</p>
              <p className="text-2xl font-bold">&nbsp;{requests.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">대기 중</p>
              <p className="text-2xl font-bold">&nbsp;
                {requests.filter((r) => r.playYn === "N").length}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">재생완료</p>
              <p className="text-2xl font-bold">&nbsp;
                {requests.filter((r) => r.playYn === "Y").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 실시간 신청 */}
      <div className="max-h-[70vh] overflow-y-auto">
        <Card className="col-span-2 h-[500px]">
          <CardContent>
            <h2 className="font-semibold mb-4 text-left">
              실시간 신청
            </h2>

            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <th className="py-3 px-2">순번</th>
                    <th className="py-3 px-2">곡</th>
                    <th className="py-3 px-2">신청자</th>
                    <th className="py-3 px-2">상태</th>
                    <th className="py-3 px-2">재생</th>
                    <th className="py-3 px-2">관리</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r, index) => (
                    <tr
                      key={r.mno}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2">{r.title}</td>
                      <td className="py-2">{r.id}</td>

                      <td className="py-2">
                        {r.playYn === "N"
                          ? "대기중"
                          : r.playYn === "Y"
                          ? "재생완료"
                          : "-"}
                      </td>

                      {/* 실시간 재생 버튼 */}
                      <td className="py-2">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={r.playYn === "Y"}
                          onClick={() => handlePlay(r)}
                        >
                          ▶ 재생
                        </Button>
                      </td>

                      <td className="py-2">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={reject}
                        >
                          거절
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
            
      <Dialog
        open={openPlayer}
        onClose={() => setOpenPlayer(false)}
        maxWidth="md"
        fullWidth
       >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            onClick={() => setOpenPlayer(false)}
            sx={{ position: "absolute", right: 8, top: 8, zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogContent>
      </Dialog>

    </div>
  );
}