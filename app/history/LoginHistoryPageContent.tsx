
import React, { useEffect, useState } from 'react';
import { fetchHistorys } from '../../api/historyApi';
import { HistoryListResponse, History } from '../../types/History';
import PageComponent from "@/components/PageComponent";
import useCustomMove from '@/utils/useCustomMove';

const today = new Date().toISOString().split("T")[0];

const initState = {
  userName: "",
  status: "",
  loginDate: today   // 오늘날짜
};

interface StopParam {
  videoId: string;
  cancelReason: string;
}

export default function LoginHistoryPageContent() {
    const {page, size, moveToList} = useCustomMove();
    const [searchParams, setSearchParams] = useState(initState);

    const [historys, setHistorys] = useState<HistoryListResponse>({
      dtoList: [],
      pageNumList: [],
      pageRequestDTO: { page: 1, size: 10 },
      prev: false,
      next: false,
      totalCount: 0,
      prevPage: 0,
      nextPage: 0,
      totalPage: 0,
      current: 0
    });

    const [previewVideo, setPreviewVideo] = useState<string | null>(null);

    // 공통 onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
      fetchHistorys({
        page: 1,  // 검색은 항상 첫 페이지부터
        size,
        ...searchParams
      }).then(setHistorys);
    };

    useEffect(() => {
      fetchHistorys({page, size, ...searchParams}).then(setHistorys);
    }, [page, size, searchParams]);

    useEffect(() => {
      console.log("historyData=>" + JSON.stringify(historys));
    }, [historys]);

    /*useEffect(() => {
      if (previewVideo) {
        setIsAdPlaying(true);
        const timer = setTimeout(() => setIsAdPlaying(false), 10000); // 광고 10초 후 본영상 전환
        return () => clearTimeout(timer);
      }
    }, [previewVideo]);*/
        
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">로그인 이력 관리</h1>

        {/* 🔍 검색 폼 : 테두리 + 여백 + 정리된 UI */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              className="p-2 rounded border border-gray-300"
              name="loginDate"
              value={searchParams.loginDate}   // ⭐ 오늘 날짜
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="단말기 아이디"
              className="p-2 rounded border border-gray-300"
              name="userName"
              onChange={handleChange}
            />

            <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600" onClick={handleSearch}>
              🔍 검색
            </button>
          </div>
        </div>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-center w-full">
              <th className="p-3 text-center">매장 아이디</th>
              <th className="p-3 text-center">단말기 아이디</th>
              <th className="p-3 text-center">IP</th>
              <th className="p-3 text-center">상태</th>
              <th className="p-3 text-center">날짜</th>
            </tr>
          </thead>
          <tbody>
            {historys.dtoList.map((history: History) => (
              <tr key={history.id} className="border-t">
                <td className="p-3 text-center">{history.storeId}</td>
                <td className="p-3 text-center">{history.username}</td>
                <td className="p-3 text-center">{history.ip}</td>
                <td className="p-3 text-center">{history.status}</td>
                <td className="p-3 text-center">{history.loginDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <PageComponent serverData={historys} movePage={moveToList}></PageComponent>

        {/* 총 개수 출력: 중앙 정렬 + 회색 글씨 */}
        <div className="text-center text-gray-400 mt-2">
          총 접속 건수: {historys.totalCount} 건
        </div>
      </div>
    );
}