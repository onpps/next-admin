
import React, { useEffect, useState } from 'react';
import { decode } from 'html-entities';
import { fetchMusics, stopMusic, startMusic } from '../../api/musicApi';
import { MusicListResponse, Music } from '../../types/Music';
import PageComponent from "@/components/PageComponent";
import useCustomMove from '@/utils/useCustomMove';
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import Button from '@/components/Button';
import HlsPlayer from '../player/HlsPlayer';
import YouTube from 'react-youtube';
import { FaPlay } from "react-icons/fa";
import Image from 'next/image';

const initState = {
  productCode: "",
  userId: "",
  status: "",
  paymentKey: "",
  paidAt: "",
};

interface StopParam {
  videoId: string;
  cancelReason: string;
}

export default function MusicPageContent() {
    const {page, size, moveToList} = useCustomMove();
    const [searchParams, setSearchParams] = useState(initState);

    const [musics, setMusics] = useState<MusicListResponse>({
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
    const [previewStreamUrl, setPreviewStreamUrl] = useState<string | null>(null);
    

    // 공통 onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
      fetchMusics({
        page: 1,  // 검색은 항상 첫 페이지부터
        size,
        ...searchParams
      }).then(setMusics);
    };    

    const handleStop = (videoId: string) => {
    
      console.log(`videoId => ${videoId}`);
    
      sweetConfirm(`${videoId} 영상을 사용중지 하시겠습니까?`, 'question', async () => {
        const param: StopParam = {
          videoId,
          cancelReason: '관리자 요청'
        };
    
        try {
          const data = await stopMusic(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist' || data.errorCode === 'refundError') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('음악이 중지 되었습니다.\n중지된 음악은 신청이 불가합니다.');
          //router.replace('/musics');
          fetchMusics({
            page: page,  // 검색은 항상 첫 페이지부터
            size,
            ...searchParams
          }).then(setMusics);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };


    const handleResume = (videoId: string) => {
    
      console.log(`videoId => ${videoId}`);
    
      sweetConfirm(`${videoId} 영상을 사용재개 하시겠습니까?`, 'question', async () => {
        const param: StopParam = {
          videoId,
          cancelReason: '관리자 요청'
        };
    
        try {
          const data = await startMusic(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist' || data.errorCode === 'refundError') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('음악이 사용재개 되었습니다.\n음악신청 가능합니다.');
          //router.replace('/musics');
          fetchMusics({
            page: page,  // 검색은 항상 첫 페이지부터
            size,
            ...searchParams
          }).then(setMusics);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };

    const closePlayer = () => {
      setPreviewVideo(null);
      setPreviewStreamUrl(null);
    };
    
    useEffect(() => {
      fetchMusics({page, size, ...searchParams}).then(setMusics);
    }, [page, size, searchParams]);

    useEffect(() => {
      console.log("paymentData=>" + JSON.stringify(musics));
    }, [musics]);

    /*useEffect(() => {
      if (previewVideo) {
        setIsAdPlaying(true);
        const timer = setTimeout(() => setIsAdPlaying(false), 10000); // 광고 10초 후 본영상 전환
        return () => clearTimeout(timer);
      }
    }, [previewVideo]);*/
        
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">음악 관리</h1>

        {/* 🔍 검색 폼 : 테두리 + 여백 + 정리된 UI */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="p-2 rounded border border-gray-300" name="genre" onChange={handleChange}>
              <option value="">장르명</option>
              <option value="BASIC">베이직</option>
              <option value="STANDARD">스탠다드</option>
              <option value="PREMIUM">프리미엄</option>
            </select>

            <input
              type="text"
              placeholder="가수명"
              className="p-2 rounded border border-gray-300"
              name="author"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="노래명"
              className="p-2 rounded border border-gray-300"
              name="title"
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
              <th className="p-3 text-center">비디오 아이디</th>
              <th className="p-3 text-center">이미지</th>
              <th className="p-3 text-center">제목</th>
              <th className="p-3 text-center">작가</th>
              <th className="p-3 text-center">검색단어</th>
              <th className="p-3 text-center w-32">미리보기</th>
              <th className="p-3 text-center w-32">관리</th>
            </tr>
          </thead>
          <tbody>
            {musics.dtoList.map((music: Music) => (
              <tr key={music.videoId} className="border-t">
                <td className="p-3 text-center">{music.videoId}</td>
                <td className="p-3 text-center"><Image
                                                 src={music.thumbUrl || "/no-image.png"}
                                                 alt={music.title}
                                                 width={150}  // 썸네일 가로 크기
                                                 height={100} // 썸네일 세로 크기
                                                 unoptimized
                                                 style={{ objectFit: 'cover', borderRadius: '8px' }}
                                              /></td>
                <td className="p-3 text-center">{decode(music.title)}</td>
                <td className="p-3 text-center">{music.author}</td>
                <td className="p-3 text-center">{music.word}</td>
                <td className="p-3 text-center">
                  <button
                    //onClick={() => setPreviewVideo(music.videoId)}
                    onClick={() => {
                      if (music.streamUrl) {
                        setPreviewStreamUrl(music.streamUrl);
                        setPreviewVideo(null);
                      } else {
                        setPreviewVideo(music.videoId);
                        setPreviewStreamUrl(null);
                      }
                    }}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    title="영상 미리보기"
                  >
                    <FaPlay />
                  </button>
                </td>
                <td className="p-3 text-center gap-2 justify-center">
                <Button
                  label={music.useYn === 'N' ? '사용재개' : '사용중지'}
                  variant={music.useYn === 'N' ? 'danger' : 'primary'}
                  onClick={() => music.useYn === 'N' ? handleResume(music.videoId) : handleStop(music.videoId)}
                />
              </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PageComponent serverData={musics} movePage={moveToList}></PageComponent>

        {/* 총 개수 출력: 중앙 정렬 + 회색 글씨 */}
        <div className="text-center text-gray-400 mt-2">
          총 음악 건수: {musics.totalCount} 건
        </div>

        {(previewVideo || previewStreamUrl) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closePlayer}
        >
          <div
            className="bg-white rounded-lg p-4 shadow-lg relative w-[90%] md:w-[720px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/*<button
              className="absolute top-2 right-2 bg-white border border-gray-300 text-gray-600 hover:text-black px-2 py-1 rounded-full shadow"
              onClick={closePlayer}
            >
              닫기 ✖️
            </button>*/}

            {/* R2 HLS 플레이어 */}
            {previewStreamUrl && (
              <HlsPlayer url={previewStreamUrl} />
            )}

            {/* YouTube 플레이어 */}
            {previewVideo && (
              <YouTube
                videoId={previewVideo}
                opts={{
                  width: "100%",
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1,
                    controls: 1,
                  }
                }}
              />
            )}

          </div>

        </div>
      )}
      </div>
    );
}