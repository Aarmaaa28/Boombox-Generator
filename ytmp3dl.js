import axios from 'axios'
import FormData from 'form-data'

export async function ytmp3dl(url) {
  if (!/^(https?:\/\/)?((www|m)\.)?(youtube\.com\/watch\?.*?[&?]v=|youtu\.be\/)[\w-]{11}(\S*)?$/i.test(url)) {
    throw new Error('Invalid YouTube URL')
  }

  const form = new FormData()
  form.append('url', url)

  const { data } = await axios.post(
    'https://www.youtubemp3.ltd/convert',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Origin: 'https://www.youtubemp3.ltd',
        Referer: 'https://www.youtubemp3.ltd/'
      },
    }
  )

  if (!data?.link) throw new Error('Download link not found')

  return {
    title: (data.filename ?? 'Unknown').replace(/\.mp3$/i, ''),
    link: data.link
  }
}
