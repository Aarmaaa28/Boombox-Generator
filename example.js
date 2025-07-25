import { Client, GatewayIntentBits, Partials } from 'discord.js'
import axios from 'axios'
import { spotifydl } from './spotifydl.js'
import { ytmp3dl } from './ytmp3dl.js'
import { soundclouddl } from './soundclouddl.js'
import { ttmp3dl } from './ttmp3dl.js'
import { uploadTop4Top } from './top4top.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel
  ]
})

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async msg => {
  if (msg.author.bot || !msg.content.startsWith('!download ')) return

  const url = msg.content.slice(10).trim()
  if (!url) {
    return msg.reply('Please provide a Spotify, YouTube, or SoundCloud URL.')
  }

  await msg.channel.sendTyping()

  try {
  const { link, title, artist = '' } =
    /spotify\.com\/track/.test(url) ? await spotifydl(url) :
    /youtu\.be\/|youtube\.com/.test(url) ? await ytmp3dl(url) :
    /soundcloud\.com/.test(url) ? await soundclouddl(url) :
    /tiktok\.com/.test(url) ? await ttmp3dl(url) :
    (() => { throw new Error('Unsupported URL.') })()

    const fileName = `${artist ? artist + ' - ' : ''}${title}.mp3`
    const fileBuffer = Buffer.from((await axios.get(link, { responseType: 'arraybuffer' })).data)
    const uploadFile = await uploadTop4Top(fileBuffer, fileName)

    await msg.reply(`✅ Uploaded ${fileName}\n🔗 ${uploadFile}`)
  } catch (err) {
    msg.reply(`${err.message}`)
  }
})

client.login('Aarmaaa28');