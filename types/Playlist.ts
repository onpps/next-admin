export interface PlaylistVideo {
  id: string;
  storeId : string;
  title: string;
  channel: string;
  playlistId: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  selected: boolean;
}

export interface Playlist {
  storeId: string;
  playlistId: string;
  channel: string;
  title: string;
  thumbnail: string;
  position: number;
  selected: boolean;
  videos: PlaylistVideo[];
}