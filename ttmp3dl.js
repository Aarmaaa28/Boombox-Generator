import axios from 'axios'

export async function ttmp3dl(url) {
  if (!/^(https?:\/\/)?(www\.)?(vm|vt)?\.?tiktok\.com\/[^\s]+$/i.test(url))
    throw new Error('Invalid TikTok URL.')

  const { data } = await axios.post(
    'https://downloader.bot/api/tiktok/info',
    { url },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Origin: 'https://downloader.bot',
        Referer: 'https://downloader.bot/'
      },
    }
  )

  if (!data?.status) throw new Error(data?.error || 'Unable to retrieve video information.')

  return {
    title: (data.data.video_info || '').trim() || 'Unknown',
    link: data.data.mp3 ?? null
  }
}