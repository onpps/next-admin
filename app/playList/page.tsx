'use client';

import React, { useEffect, useState } from 'react';
import { decode } from 'html-entities';
import { fetchPlayList, stopMusicItem, startMusicItem, updateNewSort } from '../../api/musicApi';
import { PlayListResponse, MusicItem } from '../../types/Music';
import PageComponent from "@/components/PageComponent";
import useCustomMove from '@/utils/useCustomMove';
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import YouTube from 'react-youtube';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';


const initState = {
  regDate: ""
};

interface StopParam {
  videoId: string;
  cancelReason: string;
}

export default function VideoPage() {
    const users = [
      { id: 1, name: '홍길동', email: 'hong@example.com' },
      { id: 2, name: '김철수', email: 'kim@example.com' },
    ];
    const {page, size, moveToList, moveToRefresh} = useCustomMove();
    const [searchParams, setSearchParams] = useState(initState);

    const [musicItems, setMusicItems] = useState<PlayListResponse>({
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
    const [isAdPlaying, setIsAdPlaying] = useState(false);

    // 공통 onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
     // fetchPlayList({
     //   page: 1,  // 검색은 항상 첫 페이지부터
     //   size,
     //   ...searchParams
     // }).then(setMusicItems);

      fetchPlayList({page: 1, size, ...searchParams})
        .then(data => {
          console.log("응답 확인:" + JSON.stringify(data)); // ❗여기에서 data가 undefined일 수 있음
          if (data && Array.isArray(data.dtoList)) {
            console.log('11111');
            setMusicItems(data); // 문제가 되는 지점
          } else {
            console.warn("서버에서 받은 데이터가 없습니다:", data);
          }
        })
        .catch(err => {
          console.error("에러 발생:", err);
        });
    };    

    const handleStop = (videoId: string) => {
    
      console.log(`videoId => ${videoId}`);
    
      sweetConfirm(`${videoId} 영상을 사용중지 하시겠습니까?`, 'question', async () => {
        const param: StopParam = {
          videoId,
          cancelReason: '관리자 요청'
        };
    
        try {
          const data = await stopMusicItem(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist' || data.errorCode === 'refundError') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('음악이 중지 되었습니다.\n중지된 음악은 신청이 불가합니다.');
          //router.replace('/musics');
          fetchPlayList({
            page: page,  // 검색은 항상 첫 페이지부터
            size,
            ...searchParams
          }).then(setMusicItems);
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
          const data = await startMusicItem(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist' || data.errorCode === 'refundError') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('음악이 사용재개 되었습니다.\n음악신청 가능합니다.');
          //router.replace('/musics');
          fetchPlayList({
            page: page,
            size,
            ...searchParams
          }).then(setMusicItems);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };

    useEffect(() => {
      fetchPlayList({page, size, ...searchParams})
        .then(data => {
          console.log("응답 확인:" + JSON.stringify(data)); // ❗여기에서 data가 undefined일 수 있음
          if (data && Array.isArray(data.dtoList)) {
            console.log('11111');
            setMusicItems(data); // 문제가 되는 지점
          } else {
            console.warn("서버에서 받은 데이터가 없습니다:", data);
          }
        })
        .catch(err => {
          console.error("에러 발생:", err);
        });
    }, [page, size]);
    

    useEffect(() => {
      console.log("playListData=>" + JSON.stringify(musicItems));
    }, [musicItems]);

    /*useEffect(() => {
      if (previewVideo) {
        setIsAdPlaying(true);
        const timer = setTimeout(() => setIsAdPlaying(false), 10000); // 광고 10초 후 본영상 전환
        return () => clearTimeout(timer);
      }
    }, [previewVideo]);*/

    const saveNewSort = async (newList: MusicItem[]) => {
      const param = newList.map((item, index) => ({
        mno: item.mno,   // ✅ videoId 대신 mno 보내기
        sort: index + 1,
      }));
    
      console.log("param=>" + JSON.stringify(param));
    
      try {
        const data = await updateNewSort(param); // ★ 배열(param)만 바로 보냄
        console.log(`data => ${JSON.stringify(data)}`);
        
      } catch (error) {
        console.log("error=>" + JSON.stringify(error));
        alert("오류가 발생했습니다.");
      }
    };
    

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
    
      const items = Array.from(musicItems.dtoList); // ✅ dtoList 배열 복사
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
    
      setMusicItems(prev => ({
        ...prev,
        dtoList: items, // ✅ dtoList만 업데이트
      }));

      saveNewSort(items);
    };    
        
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">플레이 리스트</h1>

        {/* 🔍 검색 폼 : 테두리 + 여백 + 정리된 UI */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              className="p-2 rounded border border-gray-300"
              name="regDate"
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="가수명"
              className="p-2 rounded border border-gray-300"
              name="userId"
            />

            <input
              type="text"
              placeholder="노래명"
              className="p-2 rounded border border-gray-300"
              name="paymentKey"
            />

            <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600" onClick={handleSearch}>
              🔍 검색
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="musicList">
          {(provided) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-w-full bg-white"
            >
              <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-3">순서</th>
                <th className="p-3">비디오 아이디</th>
                <th className="p-3">이미지</th>
                <th className="p-3">제목</th>
                <th className="p-3">작가</th>
                <th className="p-3">검색단어</th>
                <th className="p-3">미리보기</th>
                <th className="p-3">재생완료</th>
                <th className="p-3">관리</th>
              </tr>
              </thead>
              <tbody>
                {musicItems?.dtoList?.length > 0 ? (
                  musicItems.dtoList.map((music: MusicItem, idx: number) => (
                    <Draggable key={music.videoId} draggableId={music.videoId} index={idx}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3 text-center">{idx + 1}</td>
                          <td className="p-3 text-center">{music.videoId}</td>
                          <td className="p-3 text-center">
                            <Image
                              src={music.imageFile}
                              alt={music.title}
                              width={150}
                              height={100}
                              style={{ objectFit: 'cover', borderRadius: '8px' }}
                            />
                          </td>
                          <td className="p-3 text-center">{music.title}</td>
                          <td className="p-3 text-center">{music.author}</td>
                          <td className="p-3 text-center">{music.word}</td>
                          <td className="p-3 text-center">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => setPreviewVideo(music.videoId)}
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            {/* ✅ 재생완료 표시 */}
                            {music.playYn === 'Y' ? (
                              <span className="text-green-600 font-semibold">재생완료</span>
                            ) : (
                              <span className="text-gray-400">대기중</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant={music.cancelYn === 'N' ? 'danger' : 'primary'}
                              label={music.cancelYn === 'N' ? '사용재개' : '사용중지'}
                              onClick={() =>
                                music.cancelYn === 'N'
                                  ? handleResume(music.videoId)
                                  : handleStop(music.videoId)
                              }
                            />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-5 text-center text-gray-400">
                      플레이 리스트가 없습니다.
                    </td>
                  </tr>
                )}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>


        {/*<table className="w-full bg-white shadow rounded">
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
          {musicItems?.dtoList?.length > 0 ? (
              musicItems.dtoList.map((music: MusicItem, idx: number) => (
              <tr key={music.videoId} className="border-t">
                <td className="p-3 text-center">{music.videoId}</td>
                <td className="p-3 text-center"><Image
                                                src={music.imageFile}
                                                alt={music.title}
                                                width={150}  // 썸네일 가로 크기
                                                height={100} // 썸네일 세로 크기
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                              /></td>
                <td className="p-3 text-center">{decode(music.title)}</td>
                <td className="p-3 text-center">{music.author}</td>
                <td className="p-3 text-center">{music.word}</td>
                <td className="p-3 text-center">
                <button className="p-2 text-blue-600 hover:text-blue-800" onClick={() => setPreviewVideo(music.videoId)}>
                  <Eye size={20} />
                </button>
                </td>
                <td className="p-3 text-center gap-2 justify-center">
                <Button
                  label={music.cancelYn === 'N' ? '사용재개' : '사용중지'}
                  variant={music.cancelYn === 'N' ? 'danger' : 'primary'}
                  onClick={() => music.cancelYn === 'N' ? handleResume(music.videoId) : handleStop(music.videoId)}
                />
              </td>
              </tr>
               ))
            ) : (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">플레이 리스트 내역이 없습니다.</td></tr>
            )}
          </tbody>
        </table>*/}

        <PageComponent serverData={musicItems} movePage={moveToList}></PageComponent>

        {/* 총 개수 출력: 중앙 정렬 + 회색 글씨 */}
        <div className="text-center text-gray-400 mt-2">
          총 음악 건수: {musicItems.totalCount} 건
        </div>

        {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg relative w-[90%] md:w-[720px]">
            <button className="absolute -top-0 right-0 bg-white border border-gray-300 text-gray-600 hover:text-black px-2 py-1 rounded-full shadow" onClick={() => setPreviewVideo(null)}>닫기 ✖️</button>
            {isAdPlaying ? (
              <iframe
                width="100%"
                height="405"
                src="https://www.youtube.com/embed/2gGWEMBEgpM?autoplay=1&rel=0&modestbranding=1"
                title="광고영상"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <YouTube
                videoId={previewVideo}
                opts={{
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1,
                    controls: 0,
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