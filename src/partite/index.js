const { formatStream } = require('../formatter.js');

const BASE_URL = 'https://www.partite.cc';
const TMDB_API_KEY = '68e094699525b18a70bab2f86b1fa706';
const MAPPING_URL = 'https://animemapping.realbestia.com';

function imdb(value) {
  const match = String(value || '').match(/tt\d+/i);
  return match ? match[0] : null;
}

async function resolveImdbId(id, type, season) {
  const raw = String(id || '').trim();
  const direct = imdb(raw);
  if (direct) return direct;
  const anime = raw.match(/^(kitsu|mal|anilist|anidb):(\d+)(?::(\d+))?(?::(\d+))?$/i);
  if (anime) {
    try {
      const s = anime[4] ? anime[3] : season || 1;
      const ep = anime[4] || anime[3] || 1;
      const r = await fetch(`${MAPPING_URL}/${anime[1].toLowerCase()}/${anime[2]}?s=${s}&ep=${ep}&lang=it`);
      if (r.ok) {
        const payload = await r.json();
        const ep = payload?.mappings?.tmdb_episode || payload?.tmdb_episode;
        return { imdbId: imdb(payload?.mappings?.ids?.imdb), season: ep?.season, episode: ep?.episode };
      }
    } catch (_) {}
    return null;
  }
  const match = raw.match(/^tmdb:(\d+)$/i) || raw.match(/^(\d+)$/);
  if (!match) return null;
  try {
    const endpoint = String(type).toLowerCase() === 'movie' ? 'movie' : 'tv';
    const r = await fetch(`https://api.themoviedb.org/3/${endpoint}/${match[1]}/external_ids?api_key=${TMDB_API_KEY}`);
    return r.ok ? imdb((await r.json()).imdb_id) : null;
  } catch (_) { return null; }
}

async function getStreams(id, type, season, episode) {
  const animeEpisode = String(id || '').match(/^(?:kitsu|mal|anilist|anidb):\d+:(\d+)$/i);
  const animeSeasonEpisode = String(id || '').match(/^(?:kitsu|mal|anilist|anidb):\d+:(\d+):(\d+)$/i);
  let s = Number.parseInt(animeSeasonEpisode?.[1] || season, 10) || 1;
  let e = Number.parseInt(animeSeasonEpisode?.[2] || animeEpisode?.[1] || episode, 10) || 1;
  const imdbId = await resolveImdbId(id, type, s);
  const resolved = typeof imdbId === 'string' ? { imdbId } : imdbId;
  if (!resolved?.imdbId) return [];
  const mappedSeason = Number.parseInt(resolved.season, 10);
  const mappedEpisode = Number.parseInt(resolved.episode, 10);
  if (mappedSeason > 0) s = mappedSeason;
  if (mappedEpisode > 0) e = mappedEpisode;
  const finalImdbId = resolved.imdbId;
  const movie = String(type).toLowerCase() === 'movie';
  const streams = [];
  for (const server of [1, 2, 3, 4, 5]) {
    const path = movie ? `/hls/s${server}/movie/${finalImdbId}` : `/hls/s${server}/serial/${finalImdbId}/${s}/${e}`;
    const url = `${BASE_URL}${path}/playlist.m3u8`;
    try {
      const r = await fetch(url, { headers: { Referer: `${BASE_URL}/` } });
      if (r.ok) {
        const text = await r.text();
        const heights = [...text.matchAll(/RESOLUTION=\d+x(\d+)/gi)].map(m => Number(m[1])).filter(Boolean);
        const height = Math.max(0, ...heights);
        const quality = height >= 2160 ? '4K' : height >= 1440 ? '1440p' : height >= 1080 ? '1080p' : height >= 720 ? '720p' : height ? `${height}p` : 'Unknown';
        if (/#EXT-X-MEDIA:[^\r\n]*TYPE=AUDIO/i.test(text)) streams.push(formatStream({ name: `Partite.cc Server ${server}`, title: movie ? 'Partite.cc' : `Partite.cc ${s}x${e}`, quality, language: 'Italian', type: 'hls', url, behaviorHints: { notWebReady: true, proxyHeaders: { request: { Referer: `${BASE_URL}/` } } } }, 'Partite.cc'));
      }
    } catch (_) {}
  }
  return streams.filter(Boolean);
}

module.exports = { getStreams };
