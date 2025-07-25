import axios from 'axios'
import { load } from 'cheerio'

let cookie = ''
let token = ''

export async function spotifydl(url) {
  if (
    !/^https?:\/\/(open\.)?spotify\.com\/track\/[A-Za-z0-9]{22}(?:\?.*)?$/i.test(
      url
    )
  ) {
    throw new Error('Invalid Spotify URL.')
  }

  if (!token) {
    const { data, headers } = await axios.get('https://spotmate.online/en', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })

    cookie = headers['set-cookie']?.map(v => v.split(';')[0]).join('; ') || ''
    token = load(data)('meta[name="csrf-token"]').attr('content') || ''
    if (!token) throw new Error('Unable to obtain CSRF token.')
  }

  const { data: track } = await axios.post(
    'https://spotmate.online/getTrackData',
    { spotify_url: url },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        Cookie: cookie,
        Origin: 'https://spotmate.online',
        Referer: 'https://spotmate.online/en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }
  )
  if (!track) throw new Error('Failed to retrieve track information.')

  const { data: convert } = await axios.post(
    'https://spotmate.online/convert',
    { urls: url },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        Cookie: cookie,
        Origin: 'https://spotmate.online',
        Referer: 'https://spotmate.online/en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }
  )
  if (!convert) throw new Error('Failed to convert track.')

  const link = convert.url || convert.download || convert.link
  if (!link) throw new Error('Download link not found.')

  return {
    link,
    title: track.title || track.name || 'Unknown',
    artist: track.artist || track.artists?.[0]?.name || 'Unknown'
  }
}