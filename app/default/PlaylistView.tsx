'use client';

import { useState } from "react";
import Image from 'next/image';
import {
  Box,
  Card,
  Typography,
  Dialog,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { Playlist, PlaylistVideo } from "@/types/Playlist";

interface Props {
  items: Playlist[];
  openPreview: (value: Playlist) => void;
}

export default function PlaylistView({ items, openPreview }: Props) {

  const [playingVideo, setPlayingVideo] = useState<PlaylistVideo | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  // ▶ 영상 재생
  //const handlePlay = (video : any) => {
    //setPlayingVideo(video);
  //};

  // ▶ 전체 재생 (첫번째 영상)
  const handlePlayAll = (playlist: Playlist) => {

    console.log("handlePlayAll=>" + JSON.stringify(playlist));

    if (playlist.videos?.length > 0) {
      //setPlayingVideo(playlist.videos[0]);
      handlePlay(playlist.videos[playlist.position]);
    }
  };

  const handlePlay = (video: PlaylistVideo) => {
      if (!video.videoId) {
        alert("videoId가 없습니다.");
        return;
      }
  
      const url = `/player/${video.videoId}`;
  
      // location=no를 명시하고, toolbar와 status 등을 꺼줍니다.
      const features = "width=1000,height=700,left=200,top=100,resizable=yes,location=no,toolbar=no,menubar=no,status=no";
      
      window.open(url, "storePlayer", features);
  };

  console.log("items=>" , items);

  return (
       <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto", px: 2 }}>

      {items.map((playlist, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={() => setExpanded(expanded === index ? null : index)}
          sx={{
            background: "#0f172a",
            color: "#fff",
            mb: 2,
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >

          {/* 🎬 헤더 */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.03)"
              }
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >

              {/* 왼쪽 영역 */}
              <Box display="flex" alignItems="center" gap={2}>
                <Image
                  src={playlist.thumbnail}
                  alt=""
                  width={80}
                  height={80}
                  style={{ borderRadius: 8 }}
                />

                <Typography fontWeight="bold" fontSize={16}>
                  {playlist.title}
                </Typography>
              </Box>

              {/* 오른쪽 영역 */}
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {playlist.selected ? (
                    <CheckCircleIcon sx={{ color: "#9333ea", fontSize: 32 }} onClick={() => handlePlayAll(playlist)} />
                ) : (
                    <PlayCircleFilledWhiteIcon sx={{ color: "#22c55e", fontSize: 32 }} onClick={() => openPreview(playlist)} />
                )}
              </Box>

            </Box>
          </AccordionSummary>

          {/* 🎵 영상 리스트 */}
          <AccordionDetails>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2
              }}
            >

              {playlist.videos?.map((item) => {

                const isPlaying = playingVideo?.id === item.id;

                return (
                  <Card
                    key={item.id}
                    sx={{
                      position: "relative",
                      background: "#1e293b",
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: "scale(1)",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                      },
                      ...(isPlaying && {
                        boxShadow: "0 0 20px #22c55e",
                        border: "1px solid #22c55e"
                      })
                    }}
                  >

                    {/* 🎬 썸네일 */}
                    <Box sx={{ position: "relative", width: "100%", height: 150 }}>
                      <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                     />

                      {/* ▶ 오버레이 재생 버튼 */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "rgba(0,0,0,0.4)",
                          opacity: 0,
                          transition: "0.3s",
                          "&:hover": {
                            opacity: 1
                          }
                        }}
                        onClick={() => handlePlay(item)}
                      >
                        <PlayArrowIcon sx={{ fontSize: 50, color: "#fff" }} />
                      </Box>
                    </Box>

                    {/* 🎵 정보 */}
                    <Box p={1} sx={{
                      color: "#fff"
                    }}>
                      <Typography fontSize={14} fontWeight="bold" noWrap>
                        {item.title}
                      </Typography>

                      {isPlaying && (
                        <Typography sx={{ color: "#22c55e", fontSize: 12 }}>
                          ▶ 재생중
                        </Typography>
                      )}
                    </Box>

                  </Card>
                );
              })}
            </Box>
          </AccordionDetails>

        </Accordion>
      ))}

      {/* 🎥 유튜브 모달 */}
      <Dialog
        open={!!playingVideo}
        onClose={() => setPlayingVideo(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, background: "#000" }}>
          {playingVideo && (
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1`}
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
}