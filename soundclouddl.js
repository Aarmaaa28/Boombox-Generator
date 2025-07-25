import axios from 'axios'

export async function soundclouddl(url) {
  if (
    !/^(https?:\/\/)?(www\.)?(soundcloud\.com|snd\.sc)\/[\w\-./?%&=+#]+$/i.test(url)
  )
    throw new Error('Invalid SoundCloud URL.')

  const { data } = await axios.post('https://api.downloadsound.cloud/track',
      { url },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Accept: 'application/json, text/plain, */*',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Origin: 'https://downloadsound.cloud',
          Referer: 'https://downloadsound.cloud/'
        }
      }
    )
    .catch(err => {
      throw new Error(
        err.response?.data?.message || 'Failed to retrieve the SoundCloud track.'
      )
    })

  if (!data?.url) throw new Error('Download link not found.')

  return {
    title: data.title || 'Unknown',
    link: data.url
  }
}