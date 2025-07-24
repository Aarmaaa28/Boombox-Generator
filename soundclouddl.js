import axios from 'axios'

export async function soundclouddl(url) {
  if (!/soundcloud\.com/.test(url)) throw new Error('Invalid SoundCloud URL.')

  try {
    const { data } = await axios.post(
      'https://api.downloadsound.cloud/track',
      { url },
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept': 'application/json, text/plain, */*'
        }
      }
    )

    return {
      link: data.url,
      title: data.title
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to fetch the SoundCloud track.'
    throw new Error(msg)
  }
}
