// utils/filterChannels.ts

export const filterChannels = (channels: any[], artistName: string) => {
  const blacklist = ['cover', 'reaction', 'fan', 'lyrics', 'karaoke'];
  const officialKeywords = ['official', 'vevo', 'topic'];

  return channels
    // 1️⃣ 아티스트 이름 포함
    .filter(ch =>
      ch.snippet.title.toLowerCase().includes(artistName.toLowerCase())
    )
    // 2️⃣ 불필요 채널 제거
   // .filter(ch =>
    //  !blacklist.some(word =>
     //   ch.snippet.title.toLowerCase().includes(word)
    //  )
    //)
    // 3️⃣ 공식 채널 우선 정렬
    .sort((a, b) => {
      const aScore = officialKeywords.some(k =>
        a.snippet.title.toLowerCase().includes(k)
      ) ? 1 : 0;

      const bScore = officialKeywords.some(k =>
        b.snippet.title.toLowerCase().includes(k)
      ) ? 1 : 0;

      return bScore - aScore;
    });
};