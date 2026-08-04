var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/formatter.js
var require_formatter = __commonJS({
  "src/formatter.js"(exports2, module2) {
    function normalizePlaybackHeaders(headers) {
      if (!headers || typeof headers !== "object") return headers;
      const normalized = {};
      for (const [key, value] of Object.entries(headers)) {
        if (value == null) continue;
        const lowerKey = String(key).toLowerCase();
        if (lowerKey === "user-agent") normalized["User-Agent"] = value;
        else if (lowerKey === "referer" || lowerKey === "referrer") normalized["Referer"] = value;
        else if (lowerKey === "origin") normalized["Origin"] = value;
        else if (lowerKey === "accept") normalized["Accept"] = value;
        else if (lowerKey === "accept-language") normalized["Accept-Language"] = value;
        else normalized[key] = value;
      }
      return normalized;
    }
    function shouldForceNotWebReadyForPlugin(stream, providerName, headers, behaviorHints) {
      const text = [
        stream == null ? void 0 : stream.url,
        stream == null ? void 0 : stream.name,
        stream == null ? void 0 : stream.title,
        stream == null ? void 0 : stream.server,
        providerName
      ].filter(Boolean).join(" ").toLowerCase();
      if (text.includes("loadm") || text.includes("loadm.cam") || text.includes("mixdrop") || text.includes("mxcontent")) {
        return true;
      }
      return false;
    }
    function normalizeProviderId(providerName) {
      const normalized = String(providerName || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
      return normalized || void 0;
    }
    function normalizeEpisodeTemplate(value) {
      return String(value || "").replace(
        /\b(\d{1,3})[xX](\d{1,3})\b/g,
        (_, season, episode) => `S${season.padStart(2, "0")}E${episode.padStart(2, "0")}`
      ).replace(
        /\bS(\d{1,3})\s*E(\d{1,3})\b/gi,
        (_, season, episode) => `S${season.padStart(2, "0")}E${episode.padStart(2, "0")}`
      );
    }
    function formatStream2(stream, providerName) {
      let quality = stream.quality || "";
      if (quality === "2160p") quality = "\u{1F525}4K UHD";
      else if (quality === "1440p") quality = "\u2728 QHD";
      else if (quality === "1080p") quality = "\u{1F680} FHD";
      else if (quality === "720p") quality = "\u{1F4BF} HD";
      else if (quality === "576p" || quality === "480p" || quality === "360p" || quality === "240p") quality = "\u{1F4A9} Low Quality";
      else if (!quality || ["auto", "unknown", "unknow"].includes(String(quality).toLowerCase())) quality = "\u{1F4BF} HD";
      const normalizedTitle = normalizeEpisodeTemplate(stream.title || "Stream");
      let title = `\u{1F4C1} ${normalizedTitle}`;
      let language = stream.language;
      if (language === "Italian") {
        language = "\u{1F1EE}\u{1F1F9}";
      } else if (stream.name && (stream.name.includes("SUB ITA") || stream.name.includes("SUB"))) {
        language = "\u{1F1EF}\u{1F1F5} \u{1F1EE}\u{1F1F9}";
      } else if (normalizedTitle.includes("SUB ITA") || normalizedTitle.includes("SUB")) {
        language = "\u{1F1EF}\u{1F1F5} \u{1F1EE}\u{1F1F9}";
      } else if (language === void 0 || language === null) {
        language = "";
      }
      let details = [];
      if (stream.size) details.push(`\u{1F4E6} ${stream.size}`);
      const desc = details.join(" | ");
      let pName = stream.name || stream.server || providerName;
      if (pName) {
        pName = pName.replace(/\s*\[?\(?\s*SUB\s*ITA\s*\)?\]?/i, "").replace(/\s*\[?\(?\s*ITA\s*\)?\]?/i, "").replace(/\s*\[?\(?\s*SUB\s*\)?\]?/i, "").replace(/\(\s*\)/g, "").replace(/\[\s*\]/g, "").trim();
      }
      if (pName === providerName) {
        pName = pName.charAt(0).toUpperCase() + pName.slice(1);
      }
      if (pName) {
        pName = `\u{1F4E1} ${pName}`;
      }
      const behaviorHints = stream.behaviorHints && typeof stream.behaviorHints === "object" ? __spreadValues({}, stream.behaviorHints) : {};
      let finalHeaders = stream.headers;
      if (behaviorHints.proxyHeaders && behaviorHints.proxyHeaders.request) {
        finalHeaders = behaviorHints.proxyHeaders.request;
      } else if (behaviorHints.headers) {
        finalHeaders = behaviorHints.headers;
      }
      finalHeaders = normalizePlaybackHeaders(finalHeaders);
      const isStreamingCommunityProvider = String(providerName || "").toLowerCase() === "streamingcommunity" || String((stream == null ? void 0 : stream.name) || "").toLowerCase().includes("streamingcommunity");
      if (isStreamingCommunityProvider && !finalHeaders) {
        delete behaviorHints.proxyHeaders;
        delete behaviorHints.headers;
        delete behaviorHints.notWebReady;
      }
      if (finalHeaders) {
        behaviorHints.proxyHeaders = behaviorHints.proxyHeaders || {};
        behaviorHints.proxyHeaders.request = finalHeaders;
        behaviorHints.headers = finalHeaders;
      }
      const providerExplicitNotWebReady = stream.behaviorHints && "notWebReady" in stream.behaviorHints;
      const shouldForceNotWebReady = shouldForceNotWebReadyForPlugin(stream, providerName, finalHeaders, behaviorHints);
      if (!isStreamingCommunityProvider && shouldForceNotWebReady) {
        behaviorHints.notWebReady = true;
      } else if (!providerExplicitNotWebReady) {
        delete behaviorHints.notWebReady;
      }
      const finalName = pName;
      let finalTitle = `\u{1F4C1} ${normalizedTitle}`;
      if (desc) finalTitle += ` | ${desc}`;
      if (language) finalTitle += ` | ${language}`;
      const playbackReferer = stream.referer || (finalHeaders == null ? void 0 : finalHeaders.Referer) || (finalHeaders == null ? void 0 : finalHeaders.referer);
      const playbackUserAgent = stream.userAgent || (finalHeaders == null ? void 0 : finalHeaders["User-Agent"]) || (finalHeaders == null ? void 0 : finalHeaders["user-agent"]);
      return __spreadProps(__spreadValues({}, stream), {
        // Keep original properties
        name: finalName,
        title: finalTitle,
        // Metadata for Stremio UI reconstruction (safer names for RN)
        providerName: pName,
        qualityTag: quality,
        description: desc,
        originalTitle: normalizedTitle,
        // Ensure language is set for Stremio/Nuvio sorting
        language,
        // Mark as formatted
        _nuvio_formatted: true,
        behaviorHints,
        provider: stream.provider || normalizeProviderId(providerName),
        referer: playbackReferer,
        userAgent: playbackUserAgent,
        // Explicitly ensure root headers are preserved for Nuvio
        headers: finalHeaders
      });
    }
    module2.exports = { formatStream: formatStream2 };
  }
});

// src/partite/index.js
var { formatStream } = require_formatter();
var BASE_URL = "https://www.partite.cc";
var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
var MAPPING_URL = "https://animemapping.realbestia.com";
function imdb(value) {
  const match = String(value || "").match(/tt\d+/i);
  return match ? match[0] : null;
}
function resolveImdbId(id, type, season, episode) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    const raw = String(id || "").trim();
    const direct = imdb(raw);
    if (direct) return direct;
    const anime = raw.match(/^(kitsu|mal|anilist|anidb):(\d+)(?::(\d+))?(?::(\d+))?$/i);
    if (anime) {
      try {
        const s = anime[4] ? anime[3] : season || 1;
        const ep = anime[4] || anime[3] || episode || 1;
        const r = yield fetch(`${MAPPING_URL}/${anime[1].toLowerCase()}/${anime[2]}?s=${s}&ep=${ep}&lang=it`);
        if (r.ok) {
          const payload = yield r.json();
          const ep2 = ((_a = payload == null ? void 0 : payload.mappings) == null ? void 0 : _a.tmdb_episode) || (payload == null ? void 0 : payload.tmdb_episode);
          return { imdbId: imdb((_c = (_b = payload == null ? void 0 : payload.mappings) == null ? void 0 : _b.ids) == null ? void 0 : _c.imdb), season: ep2 == null ? void 0 : ep2.season, episode: ep2 == null ? void 0 : ep2.episode };
        }
      } catch (_) {
      }
      return null;
    }
    const match = raw.match(/^tmdb:(\d+)$/i) || raw.match(/^(\d+)$/);
    if (!match) return null;
    try {
      const endpoint = String(type).toLowerCase() === "movie" ? "movie" : "tv";
      const r = yield fetch(`https://api.themoviedb.org/3/${endpoint}/${match[1]}/external_ids?api_key=${TMDB_API_KEY}`);
      return r.ok ? imdb((yield r.json()).imdb_id) : null;
    } catch (_) {
      return null;
    }
  });
}
function getStreams(id, type, season, episode) {
  return __async(this, null, function* () {
    const animeEpisode = String(id || "").match(/^(?:kitsu|mal|anilist|anidb):\d+:(\d+)$/i);
    const animeSeasonEpisode = String(id || "").match(/^(?:kitsu|mal|anilist|anidb):\d+:(\d+):(\d+)$/i);
    let s = Number.parseInt((animeSeasonEpisode == null ? void 0 : animeSeasonEpisode[1]) || season, 10) || 1;
    let e = Number.parseInt((animeSeasonEpisode == null ? void 0 : animeSeasonEpisode[2]) || (animeEpisode == null ? void 0 : animeEpisode[1]) || episode, 10) || 1;
    const imdbId = yield resolveImdbId(id, type, s, e);
    const resolved = typeof imdbId === "string" ? { imdbId } : imdbId;
    if (!(resolved == null ? void 0 : resolved.imdbId)) return [];
    const mappedSeason = Number.parseInt(resolved.season, 10);
    const mappedEpisode = Number.parseInt(resolved.episode, 10);
    if (mappedSeason > 0) s = mappedSeason;
    if (mappedEpisode > 0) e = mappedEpisode;
    const finalImdbId = resolved.imdbId;
    const movie = String(type).toLowerCase() === "movie";
    const streams = [];
    for (const server of [1, 2, 3, 4, 5]) {
      const path = movie ? `/hls/s${server}/movie/${finalImdbId}` : `/hls/s${server}/serial/${finalImdbId}/${s}/${e}`;
      const url = `${BASE_URL}${path}/playlist.m3u8`;
      try {
        const r = yield fetch(url, { headers: { Referer: `${BASE_URL}/` } });
        if (r.ok) {
          const text = yield r.text();
          const heights = [...text.matchAll(/RESOLUTION=\d+x(\d+)/gi)].map((m) => Number(m[1])).filter(Boolean);
          const height = Math.max(0, ...heights);
          const quality = height >= 2160 ? "4K" : height >= 1440 ? "1440p" : height >= 1080 ? "1080p" : height >= 720 ? "720p" : height ? `${height}p` : "Unknown";
          const hasItalianAudio = /#EXT-X-MEDIA:[^\r\n]*TYPE=AUDIO[^\r\n]*(?:LANGUAGE="(?:it|ita)"|NAME="(?:Italian|Italiano))/i.test(text);
          const hasAudio = /#EXT-X-MEDIA:[^\r\n]*TYPE=AUDIO/i.test(text);
          if (hasAudio) streams.push(formatStream({ name: `Partite.cc Server ${server}`, title: movie ? "Partite.cc" : `Partite.cc ${s}x${e}`, quality, language: hasItalianAudio ? "Italian" : "", type: "hls", url, behaviorHints: { notWebReady: true, proxyHeaders: { request: { Referer: `${BASE_URL}/` } } } }, "Partite.cc"));
        }
      } catch (_) {
      }
    }
    return streams.filter(Boolean);
  });
}
module.exports = { getStreams };
