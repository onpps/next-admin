"use client";

import { useCallback, useState, useEffect} from "react";
import Image from 'next/image';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { sweetConfirm } from "@/utils/sweetAlert";
import { getDefaultMusicList, registerDefaultPlaylist, deletePlaylist } from '@/api/playlistApi';
import { Playlist } from "@/types/Playlist";
import { API_KEY } from "@/utils/config";
import PlaylistView from "./PlaylistView";

/*interface PlaylistItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  selected: boolean;
}*/

interface YoutubePlaylistItem {
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
      default?: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
}

/*interface YoutubeVideo {
  contentDetails: {
    duration: string;
  };
}*/

interface Track {
  title: string;
  thumbnail: string;
  duration: string;
}

export default function DefaultPageContent() {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<Playlist[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Playlist | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const formatDuration = (iso: string) => {
    const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    const min = match?.[1] || "0";
    const sec = match?.[2] || "0";
    return `${min}:${sec.padStart(2, "0")}`;
  };

  const searchYoutube = async () => {
    if (!keyword) return;

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${keyword}&maxResults=10&key=${API_KEY}`
      );

      const data = await res.json();

      console.log("data=>" + JSON.stringify(data));

      // 🔥 playlist 하나씩 검사
      const filtered: Playlist[] = [];

      for (const item of data.items) {
        const playlistId = item.id.playlistId;

        // 👉 playlist 내부 10개만 샘플링
        const res2 = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlistId}&key=${API_KEY}`
        );

        const data2 = await res2.json();

        const videoIds = data2.items
          .map((it: YoutubePlaylistItem) => it.snippet.resourceId.videoId)
          .filter(Boolean);

        if (videoIds.length === 0) continue;

        //const res3 = await fetch(
          //`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`
        //);

        //const data3 = await res3.json();

        // 👉 평균 길이 계산
        /*let totalMin = 0;
        let count = 0;

        data3.items.forEach((v: YoutubeVideo) => {
          const duration = v.contentDetails.duration;
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

          const hour = parseInt(match?.[1] || "0");
          const min = parseInt(match?.[2] || "0");

          const total = hour * 60 + min;

          if (total > 0) {
            totalMin += total;
            count++;
          }
        });*/

       // const avg = totalMin / (count || 1);

       // 🔥 평균 10분 이하만 통과
       // if (avg <= 30) {
          filtered.push({
            storeId: "",
            playlistId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            position : 0,
            selected: false,
            videos : []
          });
       // }
      }

      setItems(filtered);
      setIsSearchMode(true);

    } catch (e) {
      console.error(e);
    }
  };

  /*const toggleSelect = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };*/

  const loadPlayList = useCallback(async () => {
    try {
      const data = await getDefaultMusicList();

      console.log("data=>" + JSON.stringify(data));

      /*setItems(prev =>
        prev.map(item => ({
          ...item,
          selected: true
        }))
      );*/
      const mapped = data.map((item: Playlist) => ({
        ...item,
        selected: true
      }));

      console.log("mapped=>" , mapped);

      setItems(data);
      setIsSearchMode(false); // 기본 리스트 모드
    } catch (error) {
      console.log("플레이리스트 데이터를 불러오는 중 에러 발생:", error);
      alert("서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, []); 
  

  //  플레이리스트 상세 (곡 목록 가져오기)
  const openPreview = async (item: Playlist) => {
    setSelectedItem(item);

    console.log("item=>" + JSON.stringify(item));

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${item.playlistId}&key=${API_KEY}`
    );

    const data = await res.json();

    const videoIds = data.items.map(
      (it: YoutubePlaylistItem) => it.snippet.resourceId.videoId
    );

    const res2 = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`
    );

    const data2 = await res2.json();

    const list: Track[] = data.items.map((it: YoutubePlaylistItem, idx: number): Track => {
        const duration = data2.items[idx]?.contentDetails?.duration;

        return {
          title: it.snippet.title,
          thumbnail: it.snippet.thumbnails.default?.url || "/no-image.png",
          duration: formatDuration(duration || "PT0M0S")
        };
      })
      .filter((item: Track) => item.duration !== "0:00")
      .filter((item: Track) => !item.title.toLowerCase().includes("playlist"));

    setTracks(list);
    setOpen(true);
  };

  const confirmSelect = async () => {
    if (!selectedItem) return;

    try {
      setSaving(true);

      const param = {
        playlistId: selectedItem.playlistId,
        title: selectedItem.title,
        channel: selectedItem.channel,
        thumbnail: selectedItem.thumbnail
      };

      console.log("param=>" + JSON.stringify(param));

      await registerDefaultPlaylist(param);

      setOpen(false);

      setSnackbar({
        open: true,
        message: "등록 완료!",
        severity: "success"
      });

      loadPlayList();

     } catch (e: unknown) { // any → unknown
      console.error(e);

      let errorMessage = "서버 오류가 발생했습니다.";

      // axios 스타일 에러 처리
      if (typeof e === "object" && e !== null) {
        const err = e as {
          response?: {
            data?: { message?: string } | string;
          };
          message?: string;
        };

        if (typeof err.response?.data === "string") {
          errorMessage = err.response.data;
        } else if (typeof err.response?.data?.message === "string") {
          errorMessage = err.response.data.message;
        } else if (typeof err.message === "string") {
          errorMessage = err.message;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });

    } finally {
      setSaving(false);
    }
  };

  /* -------------------------
    플레이어 재생 함수
  -------------------------- */
  /*const handlePlay = (item: PlaylistVideo) => {
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
  };*/

  useEffect(() => {
    loadPlayList();
  }, [loadPlayList]);

  return (
    <Box sx={{ p: 3, maxWidth: "90%", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#fff" }}>
        기본 재생목록 설정
      </Typography>

      <Typography variant="body2" sx={{ color: "#bbb" }} mb={2}>
        신청곡이 없을 때 재생될 재생목록을 설정하세요.
      </Typography>

      {/* 검색 영역 */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          placeholder="URL 또는 검색어 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" }
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#aaa",
              opacity: 1
            }
          }}
        />
        <Button variant="contained" onClick={searchYoutube}>
          검색
        </Button>
      </Box>

      {/* 태그 */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {["최신가요", "KPOP", "싸이월드", "2000년대", "발라드", "팝송", "술집", "카페"].map(tag => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => setKeyword(tag)}
            sx={{ backgroundColor: "#1e293b", color: "#fff" }}
          />
        ))}
      </Box>

      {/* 리스트 */}
      {isSearchMode ? (
        /* 검색 결과 리스트 */
        <Box>
         {items.map((item, index) => (
          <Card
            key={index}
            sx={{
              mb: 1,
              backgroundColor: "#1e293b",
              color: "#fff"
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Image
                  src={item.thumbnail}
                  alt=""
                  width={80}
                  height={80}
                  style={{ borderRadius: 8 }}
                />

                <Box>
                  <Typography fontWeight="bold">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: "#ccc" }}>
                    {item.channel}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
    
                <IconButton onClick={() => openPreview(item)}>
                  {item.selected ? (
                    <CheckCircleIcon sx={{ color: "#9333ea" }} />
                  ) : (
                    <AddIcon sx={{ color: "#fff" }} />
                  )}
                </IconButton>

              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      ) : (
        /* 기존 플레이리스트 */
       <PlaylistView
          items={items}
          openPreview={openPreview}
          onDelete={(playlistId) => {

            sweetConfirm(`삭제하시겠습니까?`, 'question', async () => {
              try {
                await deletePlaylist(playlistId);
                loadPlayList();
              } catch (error) {
                console.error("삭제 중 오류 발생:", error);
              }
            });
            
            // UI 제거
            //setItems(prev => prev.filter(p => p.playlistId !== playlistId));
          }}
        />
      )}
      {/*  미리보기 다이얼로그 */}
       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          기본 재생목록으로 설정하시겠습니까?
        </DialogTitle>

        <DialogContent>
          {selectedItem && (
            <Box mb={2} display="flex" gap={2}>
              <Image src={selectedItem.thumbnail} alt="" width={100} height={100}/>
              <Box>
                <Typography fontWeight="bold">
                  {selectedItem.title}
                </Typography>
                <Typography variant="body2">
                  {selectedItem.channel}
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body2" mb={1}>
            곡 정보 미리보기 (최대 50곡)
          </Typography>

          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {tracks.map((t, i) => (
              <Box key={i} display="flex" gap={2} mb={1}>
                <Image src={t.thumbnail} alt="" width={60} height={60}/>
                <Box>
                  <Typography>{`${i + 1}. ${t.title}`}</Typography>
                  <Typography variant="caption">
                    {t.duration}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button variant="contained" onClick={confirmSelect} disabled={saving}>
             {saving ? "저장 중..." : "확인"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {saving && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.6)", // ✅ 밝은 dim
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              width: 300,
              backgroundColor: "#ffffff", // ✅ 흰색 카드
              borderRadius: 3,
              p: 3,
              textAlign: "center",
              boxShadow: 5
            }}
          >
            {/* 🔥 로딩 아이콘 */}
            <CircularProgress sx={{ mb: 2 }} />

            {/* 🔥 메시지 */}
             <Typography
              sx={{
                fontWeight: 600,
                mb: 1
              }}
            >
              재생목록 설정 중...
            </Typography>

            {/* 🔥 서브 텍스트 */}
            <Typography
              variant="body2"
            >
              잠시만 기다려주세요
            </Typography>

            {/* 🔥 진행률 */}
            {/*<Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
              {progress}%
            </Typography>

            <LinearProgress variant="determinate" value={progress} />*/}
          </Box>
        </Box>
      )}

    </Box>

  );
  
}

