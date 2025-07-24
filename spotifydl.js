import axios from 'axios'
import { load } from 'cheerio'

let cookie, token

export async function spotifydl(url) {
  if (
    !/^https?:\/\/(open\.)?spotify\.com\/track\/[A-Za-z0-9]{22}(?:\?.*)?$/i.test(
      url
    )
  ) {
    throw new Error('Invalid Spotify URL')
  }

  if (!token) {
    const { data, headers } = await axios.get('https://spotmate.online/en', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })

    cookie = headers['set-cookie']?.map(c => c.split(';')[0]).join('; ')
    token = load(data)('meta[name="csrf-token"]').attr('content')
    if (!token) throw new Error('Token not found')
  }

  const trackdata = (
    await axios.post(
      'https://spotmate.online/getTrackData',
      { spotify_url: url },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          Cookie: cookie,
          Origin: 'https://spotmate.online',
          Referer: 'https://spotmate.online/en',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    )
  ).data

  const convert = (
    await axios.post(
      'https://spotmate.online/convert',
      { urls: url },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          Cookie: cookie,
          Origin: 'https://spotmate.online',
          Referer: 'https://spotmate.online/en',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    )
  ).data

  const link = convert.url || convert.download || convert.link
  if (!link) throw new Error('Download link not found')

  return {
    link,
    title: trackdata.title || trackdata.name || 'Unknown',
    artist: trackdata.artist || trackdata.artists?.[0]?.name || 'Unknown'
  }
}