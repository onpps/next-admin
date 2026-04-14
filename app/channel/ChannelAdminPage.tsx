'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  CircularProgress,
  TextField,
  Stack,
  IconButton
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
//import { filterChannels } from '@/utils/filterChannels';
import { registerChannel, deleteChannel, getArtistList } from '@/api/channel';
import { Channel } from "@/types/Channel";
import { RAPID_API_KEY } from '@/utils/config';
import { sweetAlert, sweetConfirm } from '@/utils/sweetAlert'; 

type Artist = {
  id : number;
  channelId: string;
  name: string;
  thumbnail?: string;
};

type Video = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
};

type YoutubeItem = {
  id?: {
    videoId?: string;
  };
};

export default function ChannelAdminPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  //const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistInput, setArtistInput] = useState('');

  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

  const [open, setOpen] = useState(false);
  const [channelId, setChannelId] = useState('');
  const [channelStep, setChannelStep] = useState(true); // true=채널 선택 / false=영상 선택
  const [loading, setLoading] = useState(false);

  const isAllSelected = videos.length > 0 && selectedVideos.size === videos.length;

  const router = useRouter();

  //const API_KEY = 'e697a05539mshbf75465651d3d48p15591fjsn28c083b4314d';

  // =====================
  // 초기 아티스트 목록
  // =====================
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get('/api/artist/list');
      setArtists(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          router.push('/login');
        }
      } else {
        console.error("알 수 없는 에러:", err);
      }
    }
  };

  const handleOpenYoutube = (artist: Artist) => {
    if (!artist.channelId) {
      alert("채널 ID 없음");
      return;
    }

    window.open(
      `https://www.youtube.com/channel/${artist.channelId}`,
      "_blank",
      "noopener,noreferrer,width=1000,height=800"
    );
  };

  // =====================
  // 채널 검색
  // =====================
  const fetchChannels = async (name: string) => {
    setLoading(true);
    try {
      /*const res = await axios.get(
        'https://youtube-v31.p.rapidapi.com/search',
        {
          params: {
            q: name,
            part: 'snippet',
            type: 'channel', // 🔥 핵심
            maxResults: '10'
          },
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
          }
        }
      );*/

      const res = await getArtistList(name);

      console.log("res=>" + JSON.stringify(res));

      //const channels = res.data.items || [];
      //const filtered = filterChannels(channels, name);

      setChannels(res);
      setChannelStep(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // =====================
  // 영상 조회 (channelId 기반)
  // =====================
  const fetchVideosByChannel = async (channelId: string) => {
    setLoading(true);

    console.log("channelId=>" + channelId);

    try {
      const res = await axios.get(
        'https://youtube-v31.p.rapidapi.com/search',
        {
          params: {
            channelId,
            part: 'snippet,id',
            order: 'viewCount',
            maxResults: '30'
          },
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
          }
        }
      );

      const videoList = res.data.items.filter((v: YoutubeItem) => v.id?.videoId);

      console.log("videoList=>" + JSON.stringify(videoList));

      setVideos(videoList);
      setChannelId(channelId);
      setChannelStep(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // =====================
  // 검색 (input)
  // =====================
  const handleSearchByInput = async () => {
    if (!artistInput.trim()) return;

   // const tempArtist: Artist = { name: artistInput };
   // setSelectedArtist(tempArtist);
    setOpen(true);

    await fetchChannels(artistInput);
  };

  // =====================
  // 체크박스
  // =====================
  const handleSelect = (videoId: string) => {
    const newSet = new Set(selectedVideos);

    if (newSet.has(videoId)) {
      newSet.delete(videoId);
    } else {
      newSet.add(videoId);
    }

    setSelectedVideos(newSet);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVideos(new Set());
    } else {
      const allIds = videos.map(v => v.id.videoId);
      setSelectedVideos(new Set(allIds));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setChannels([]);
    setVideos([]);
    setSelectedVideos(new Set());
    setChannelStep(true);
  };

  // =====================
  // 저장
  // =====================
  const handleSave = async () => {
    const selected = videos.filter(v => selectedVideos.has(v.id.videoId));

    console.log("selected=>" + JSON.stringify(selected));
    console.log("selected.length=>" + selected.length);

    if (selected.length === 0) {
      sweetAlert('선택된 항목 없음', '최소 1개 이상의 영상을 선택해주세요.', 'info', '닫기');
      return;
    }

    //const payload = selected.map(v => ({
      //videoId: v.id.videoId,
      //title: v.snippet.title,
      //thumbnail: v.snippet.thumbnails.default.url
    //}));

    try {
      //await axios.post('/api/artist/save', {
        //channelId: channelId,
        //videos: payload
      //}, {
       // withCredentials: true
      //});

      console.log('채널 아이디:', channelId);
      console.log('선택된 영상:', selected);
      
      const param = {
        channelId: channelId,
        videos: selected 
      };
      
        // TODO: DB 저장
      await registerChannel(param);

      //alert('저장 완료');
      sweetAlert('저장 완료', '저장 완료 하였습니다.', 'info', '닫기');
      fetchArtists();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (channelId: string) => {
    //if (!confirm("삭제하시겠습니까?")) return;

    sweetConfirm(`삭제하시겠습니까?`, 'question', async () => {
      deleteChannel(channelId);

      fetchArtists();
      //setArtists((prev) => prev.filter((a) => a.channelId !== channelId));
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#fff" }}>
        아티스트 관리
      </Typography>

      {/* 검색 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="아티스트 검색"
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
            />
            <Button variant="contained" onClick={handleSearchByInput}>
              검색
            </Button>
          </Stack>
        </CardContent>
      </Card>

     {/* 아티스트 리스트 */}
    <Grid container spacing={2}>
      {artists.map((artist) => (
        <Grid size={12} key={artist.channelId}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2, position: "relative" }}>
            
            {/* ❌ 삭제 버튼 */}
            <IconButton
              size="small"
              onClick={() => {
                if (!artist.channelId) return;
                handleDelete(artist.channelId);
              }}
              sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  opacity: 0.5,
                  "&:hover": { opacity: 1 }
                }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* 썸네일 */}
            <CardMedia
              component="img"
              image={artist.thumbnail || "https://via.placeholder.com/100"}
              alt={artist.name}
              sx={{ width: 100, height: 100, borderRadius: 2, mr: 2 }}
            />

            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{artist.name}</Typography>

              <Button
                sx={{ mt: 1 }}
                variant="contained"
                onClick={() => handleOpenYoutube(artist)}
              >
                채널 찾기
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

      {/* 팝업 */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{artistInput} 인기곡 선택</span>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : channelStep ? (
            // 👉 채널 선택 단계
            <Grid container spacing={2}>
              {channels.map((ch) => (
                <CardContent sx={{ display: 'flex', gap: 2 }} key={ch.channelId}>
                  <img
                    src={ch.thumbnail}
                    alt={ch.name}
                    width={100}
                    height={100}
                    style={{ borderRadius: 8 }}
                  />

                  <div>
                    <Typography>
                      {ch.nameKo ?? ch.name}
                    </Typography>

                    <Typography variant="body2">
                      구독자: {ch.subscriberCount.toLocaleString()}
                    </Typography>

                    <Button
                      size="small"
                      onClick={() => fetchVideosByChannel(ch.channelId)}
                    >
                      영상 보기
                    </Button>
                  </div>
                </CardContent>
              ))}
            </Grid>
          ) : (
            // 👉 영상 선택 단계
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 50, textAlign: 'center'}}> 
                      <Checkbox checked={isAllSelected} indeterminate={selectedVideos.size > 0 && !isAllSelected} onChange={handleSelectAll} /> 
                    </TableCell>
                    <TableCell sx={{ width: 100, textAlign: 'center'}}>썸네일</TableCell>
                    <TableCell sx={{textAlign: 'center'}}>제목</TableCell>
                    <TableCell sx={{textAlign: 'center'}}>등록일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {videos.map((v) => (
                    <TableRow key={v.id.videoId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedVideos.has(v.id.videoId)}
                          onChange={() => handleSelect(v.id.videoId)}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center'}}>
                        <img src={v.snippet.thumbnails.default.url} />
                      </TableCell>
                      <TableCell>{v.snippet.title}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', minWidth: 110, textAlign: 'center' }}>
                        {v.snippet.publishedAt.split('T')[0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button variant="contained" sx={{ mt: 2, float: 'right' }} onClick={handleSave} >
                선택한 곡 저장 
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}