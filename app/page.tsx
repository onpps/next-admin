"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { PlayList } from '@/types/Dashboard';
import { getDashboardList } from '@/api/dashboardApi';
import { sweetConfirm } from '@/utils/sweetAlert';
import { Button } from '@mui/material';
import { Card, CardContent } from '@/components/ui/Card'; 

export default function AdminDashboard() {
  /*const [requests, setRequests] = useState([
    { id: 1, song: "Dynamite", artist: "BTS", user: "손님12", status: "대기중" },
    { id: 2, song: "Ditto", artist: "NewJeans", user: "익명", status: "대기중" },
  ]);*/

  const router = useRouter();

  const [requests, setRequests] = useState<PlayList[]>([]);

  useEffect(() => {
      getDashboardList()
        .then(data => {
          console.log("응답 확인:" + JSON.stringify(data)); // ❗여기에서 data가 undefined일 수 있음
           if (data?.playList && Array.isArray(data.playList)) {
              setRequests(data.playList);
           } else {
              console.warn("playList가 없습니다:", data);
           }
        })
        .catch(err => {
          console.error("에러 발생:", err);
        });
    }, []);
    
  useEffect(() => {
    console.log("requests 변경됨:", requests);
  }, [requests]);

  const reject = (id: number) => {
    //setRequests(req => req.map(r => r.id === id ? { ...r, status: "rejected" } : r));
 
    sweetConfirm(
      `<span style="font-size:20px;padding-top:0px;">
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
        <h1 className="text-2xl font-bold text-white">🎵 매장 관리자 대시보드</h1>
        <Button variant="outline">설정</Button>
      </header>

     <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">오늘 신청</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">대기 중</p>
              <p className="text-2xl font-bold">
                {requests.filter(r => r.playYn === "N").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main */}
      <div className="max-h-[70vh] overflow-y-auto">
        {/* 실시간 신청 (2칸 전체) */}
        <Card className="col-span-2 h-[500px]">
          <CardContent>
            <h2 className="font-semibold mb-4 text-left">실시간 신청</h2>

            {/* 👇 여기 추가 */}
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    <th className="py-3 px-2">순번</th>
                    <th className="py-3 px-2">곡</th>
                    <th className="py-3 px-2">신청자</th>
                    <th className="py-3 px-2">상태</th>
                    <th className="py-3 px-2">관리</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r, index) => (
                    <tr key={r.mno} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-2 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-2 px-2">{r.title}</td>
                      <td className="py-2 px-2">{r.id}</td>
                      <td className="py-2 px-2">
                        {r.playYn === "N" ? "대기중" : r.playYn === "Y" ? "재생완료" : "-"}
                      </td>
                      <td className="py-2 px-2">
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => reject(r.mno)}
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

        {/* 현재 재생 (아래 1칸) */}
        {/* <Card>
          <CardContent>
            <h2 className="font-semibold mb-2">현재 재생</h2>
            <p className="font-medium">IU - Love Poem</p>
            <p className="text-xs text-gray-500">손님3 신청</p>
            <div className="mt-4 space-x-2">
              <Button size="sm">⏭ 스킵</Button>
              <Button size="sm" variant="outline">⏸ 일시정지</Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
