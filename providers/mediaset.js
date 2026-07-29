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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
    function formatStream(stream, providerName) {
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
    module2.exports = { formatStream };
  }
});

// src/official_vod.js
var require_official_vod = __commonJS({
  "src/official_vod.js"(exports2, module2) {
    var { formatStream } = require_formatter();
    var TMDB_API_KEY = "68e094699525b18a70bab2f86b1fa706";
    var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36";
    var MEDIASET_ORIGIN = "https://mediasetinfinity.mediaset.it";
    var RAI_ORIGIN = "https://www.raiplay.it";
    var RAI_SEARCH_URL = `${RAI_ORIGIN}/atomatic/raiplay-search-service/api/v1/msearch`;
    var RAI_RELINKER = "https://mediapolisvod.rai.it/relinker/relinkerServlet.htm";
    var MEDIASET_GRAPHQL = "https://mediasetplay.api-graph.mediaset.it/";
    var MEDIASET_FEED = "https://feed.entertainment.tv.theplatform.eu/f/PR1GhC";
    var MEDIASET_LOGIN = "https://api-ott-prod-fe.mediaset.net/PROD/play/idm/anonymous/login/v2.0";
    var CACHE = /* @__PURE__ */ new Map();
    var MIN_MATCH_SCORE = 0.63;
    var DEBUG = typeof process !== "undefined" && process.env && process.env.OFFICIAL_PROVIDER_DEBUG === "1";
    function debug(message, error) {
      if (!DEBUG) return;
      console.warn(`[OfficialVOD] ${message}${error ? `: ${error.message || error}` : ""}`);
    }
    function cacheGet(key) {
      const item = CACHE.get(key);
      if (!item) return null;
      if (item.expires <= Date.now()) {
        CACHE.delete(key);
        return null;
      }
      return item.value;
    }
    function cacheSet(key, value, ttlMs) {
      if (CACHE.size > 400) CACHE.delete(CACHE.keys().next().value);
      CACHE.set(key, { value, expires: Date.now() + ttlMs });
      return value;
    }
    function request(_0) {
      return __async(this, arguments, function* (url, options = {}, timeoutMs = 12e3) {
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        try {
          return yield fetch(url, __spreadProps(__spreadValues({}, options), {
            signal: controller ? controller.signal : options.signal,
            headers: __spreadValues({
              "user-agent": USER_AGENT,
              accept: "*/*"
            }, options.headers || {})
          }));
        } finally {
          if (timer) clearTimeout(timer);
        }
      });
    }
    function fetchJson(_0) {
      return __async(this, arguments, function* (url, options = {}, timeoutMs) {
        const response = yield request(url, options, timeoutMs);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      });
    }
    function fetchText(_0) {
      return __async(this, arguments, function* (url, options = {}, timeoutMs) {
        const _a = options, { allowErrorStatus = false } = _a, requestOptions = __objRest(_a, ["allowErrorStatus"]);
        const response = yield request(url, requestOptions, timeoutMs);
        if (!response.ok && !allowErrorStatus) throw new Error(`HTTP ${response.status}`);
        return response.text();
      });
    }
    function positiveInt(value) {
      const parsed = Number.parseInt(String(value == null ? "" : value), 10);
      return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
    }
    function firstNumber(value) {
      const match = String(value == null ? "" : value).match(/\d+/);
      return match ? Number(match[0]) : null;
    }
    function parseYear(value) {
      const match = String(value || "").match(/\b(19|20)\d{2}\b/);
      return match ? Number(match[0]) : null;
    }
    function cleanTitle(value) {
      return String(value || "").replace(/\s*\((?:IT|Italy|Italia)\)\s*$/i, "").replace(/\s+/g, " ").trim();
    }
    function normalizeTitle(value) {
      return cleanTitle(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " e ").replace(/\b(ita|italiano|mediaset|infinity|wittytv|puntata intera|episodio completo)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
    }
    function tokenSimilarity(a, b) {
      const left = new Set(normalizeTitle(a).split(" ").filter(Boolean));
      const right = new Set(normalizeTitle(b).split(" ").filter(Boolean));
      if (!left.size || !right.size) return 0;
      let intersection = 0;
      for (const token of left) if (right.has(token)) intersection += 1;
      return intersection / (/* @__PURE__ */ new Set([...left, ...right])).size;
    }
    function diceSimilarity(a, b) {
      const left = normalizeTitle(a).replace(/\s+/g, "");
      const right = normalizeTitle(b).replace(/\s+/g, "");
      if (left === right) return 1;
      if (left.length < 2 || right.length < 2) return 0;
      const pairs = /* @__PURE__ */ new Map();
      for (let i = 0; i < left.length - 1; i += 1) {
        const pair = left.slice(i, i + 2);
        pairs.set(pair, (pairs.get(pair) || 0) + 1);
      }
      let matches = 0;
      for (let i = 0; i < right.length - 1; i += 1) {
        const pair = right.slice(i, i + 2);
        const count = pairs.get(pair) || 0;
        if (count > 0) {
          pairs.set(pair, count - 1);
          matches += 1;
        }
      }
      return 2 * matches / (left.length + right.length - 2);
    }
    function scoreCandidate(target, candidate) {
      const targetTitles = [target.title, target.originalTitle, target.episodeTitle].filter(Boolean);
      const candidateTitles = [candidate.title, candidate.seriesTitle, candidate.episodeTitle].filter(Boolean);
      let titleScore = 0;
      for (const left of targetTitles) {
        for (const right of candidateTitles) {
          titleScore = Math.max(titleScore, 0.55 * diceSimilarity(left, right) + 0.45 * tokenSimilarity(left, right));
        }
      }
      if (normalizeTitle(target.title) === normalizeTitle(candidate.seriesTitle || candidate.title)) {
        titleScore = Math.max(titleScore, 0.98);
      }
      let score = titleScore * 0.72;
      if (target.year && candidate.year) {
        const difference = Math.abs(target.year - candidate.year);
        score += difference === 0 ? 0.12 : difference === 1 ? 0.07 : 0;
      } else {
        score += 0.03;
      }
      if (target.type === "series") {
        if (target.season != null && candidate.season != null) {
          score += Number(target.season) === Number(candidate.season) ? 0.07 : -0.05;
        }
        if (target.episode != null && candidate.episode != null) {
          score += Number(target.episode) === Number(candidate.episode) ? 0.09 : -0.08;
        } else if (target.episodeTitle && candidate.episodeTitle) {
          score += diceSimilarity(target.episodeTitle, candidate.episodeTitle) * 0.08;
        }
      }
      if (candidate.isFullEpisode) score += 0.14;
      if (candidate.isClip) score -= 0.22;
      if (candidate.guid || candidate.contentId) score += 0.02;
      return Math.max(0, Math.min(1, score));
    }
    function resolveTarget(_0, _1, _2, _3) {
      return __async(this, arguments, function* (id, type, season, episode, context = {}) {
        const normalizedType = String(type || "").toLowerCase() === "movie" ? "movie" : "series";
        let tmdbId = /^\d+$/.test(String(context.tmdbId || "")) ? String(context.tmdbId) : null;
        let imdbId = /^tt\d+$/i.test(String(context.imdbId || "")) ? String(context.imdbId) : null;
        const rawId = String(id || "").replace(/^tmdb:/i, "");
        if (!tmdbId && /^\d+$/.test(rawId)) tmdbId = rawId;
        if (!imdbId && /^tt\d+$/i.test(rawId)) imdbId = rawId;
        if (!tmdbId && imdbId) {
          const found = yield fetchJson(`https://api.themoviedb.org/3/find/${encodeURIComponent(imdbId)}?api_key=${TMDB_API_KEY}&external_source=imdb_id&language=it-IT`);
          const values = normalizedType === "movie" ? found.movie_results : found.tv_results;
          tmdbId = values && values[0] ? String(values[0].id) : null;
        }
        if (!tmdbId) return null;
        const endpoint = normalizedType === "movie" ? "movie" : "tv";
        const meta = yield fetchJson(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=it-IT`);
        const target = {
          type: normalizedType,
          title: meta.title || meta.name || "",
          originalTitle: meta.original_title || meta.original_name || "",
          year: parseYear(meta.release_date || meta.first_air_date),
          tmdbId,
          imdbId,
          season: normalizedType === "series" ? positiveInt(season) : null,
          episode: normalizedType === "series" ? positiveInt(episode) : null,
          episodeTitle: null
        };
        if (normalizedType === "series" && target.season != null && target.episode != null) {
          try {
            const detail = yield fetchJson(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${target.season}/episode/${target.episode}?api_key=${TMDB_API_KEY}&language=it-IT`);
            target.episodeTitle = detail.name || null;
          } catch (e) {
          }
        }
        return target;
      });
    }
    function buildQueries(target) {
      const result = [];
      if (target.type === "series" && target.episodeTitle) result.push(`${target.title} ${target.episodeTitle}`);
      if (target.type === "series") result.push(`${target.title} stagione ${target.season} episodio ${target.episode}`);
      result.push(target.title);
      if (target.originalTitle && normalizeTitle(target.originalTitle) !== normalizeTitle(target.title)) {
        result.push(target.originalTitle);
      }
      return [...new Set(result.map(cleanTitle).filter(Boolean))].slice(0, 4);
    }
    function walk(value, visit) {
      if (!value || typeof value !== "object") return;
      visit(value);
      if (Array.isArray(value)) {
        for (const item of value) walk(item, visit);
      } else {
        for (const item of Object.values(value)) walk(item, visit);
      }
    }
    function deduplicate(items) {
      const map = /* @__PURE__ */ new Map();
      for (const item of items) {
        const key = item && (item.guid || item.contentId || item.pageUrl);
        if (!key) continue;
        const current = map.get(key);
        if (!current || String(item.title || "").length > String(current.title || "").length) map.set(key, item);
      }
      return [...map.values()];
    }
    function searchRai(query, target) {
      return __async(this, null, function* () {
        const cacheKey = `rai:${normalizeTitle(query)}:${target.type}:${target.season}:${target.episode}`;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;
        const data = yield fetchJson(RAI_SEARCH_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: RAI_ORIGIN,
            referer: `${RAI_ORIGIN}/`
          },
          body: JSON.stringify({
            templateIn: "6470a982e4e0301afe1f81f1",
            templateOut: "6516ac5d40da6c377b151642",
            params: { param: query, from: null, sort: "relevance", onlyVideoQuery: false }
          })
        });
        const cards = (data && data.agg && data.agg.titoli && data.agg.titoli.cards || []).filter((item) => /^\/(?:programmi|collezioni)\/.+\.json$/i.test(String(item.path_id || ""))).slice(0, 8);
        const settled = yield Promise.allSettled(cards.slice(0, 3).map((card) => expandRaiProgram(card, target)));
        return cacheSet(cacheKey, deduplicate(settled.flatMap((entry) => entry.status === "fulfilled" ? entry.value : [])), 15 * 60 * 1e3);
      });
    }
    function raiJson(path) {
      return __async(this, null, function* () {
        const safePath = String(path || "");
        if (!safePath.startsWith("/") || safePath.includes("..")) throw new Error("Invalid Rai path");
        const key = `rai-json:${safePath}`;
        const cached = cacheGet(key);
        if (cached) return cached;
        return cacheSet(key, yield fetchJson(`${RAI_ORIGIN}${safePath}`, {
          headers: { origin: RAI_ORIGIN, referer: `${RAI_ORIGIN}/` }
        }), 30 * 60 * 1e3);
      });
    }
    function expandRaiProgram(card, target) {
      return __async(this, null, function* () {
        const program = yield raiJson(card.path_id);
        const info = program.program_info || program.collection_info || {};
        const seriesTitle = info.name || info.title || card.titolo || "";
        const year = parseYear(info.year);
        if (target.type === "movie") {
          if (!program.first_item_path) return [];
          const video = yield raiJson(program.first_item_path);
          const candidate = normalizeRaiVideo(video, seriesTitle, year, "movie");
          return candidate ? [candidate] : [];
        }
        const matchingSets = [];
        for (const block of program.blocks || []) {
          if (block.type !== "RaiPlay Multimedia Block" || /clip|extra|trailer|promo/i.test(String(block.name || ""))) continue;
          for (const set of block.sets || []) {
            if (firstNumber(set.name) === Number(target.season)) matchingSets.push({ block, set });
          }
        }
        const result = [];
        for (const { block, set } of matchingSets.slice(0, 3)) {
          const base = String(card.path_id).replace(/\.json$/i, "");
          const payload = yield raiJson(`${base}/${encodeURIComponent(block.id)}/${encodeURIComponent(set.id)}/episodes.json`);
          const cardsFound = [];
          walk(payload, (item) => {
            if (item && item.video_url && Number(item.episode) === Number(target.episode)) cardsFound.push(item);
          });
          for (const item of cardsFound) {
            let detail = item;
            if (item.path_id) {
              try {
                detail = __spreadValues(__spreadValues({}, item), yield raiJson(item.path_id));
              } catch (e) {
              }
            }
            const candidate = normalizeRaiVideo(detail, seriesTitle, year, "series");
            if (candidate) result.push(candidate);
          }
        }
        return result;
      });
    }
    function normalizeRaiVideo(video, seriesTitle, year, targetType) {
      let contentId = "";
      try {
        contentId = new URL(String(video.video_url || video.video && video.video.content_url || ""), RAI_ORIGIN).searchParams.get("cont") || "";
      } catch (e) {
      }
      if (!/^[A-Za-z0-9._~+/=-]{8,512}$/.test(contentId)) return null;
      const episodeTitle = video.episode_title || video.toptitle || "";
      const title = targetType === "movie" ? video.name || seriesTitle : episodeTitle || video.name || seriesTitle;
      const duration = parseDuration(video.duration || video.video && video.video.duration);
      return {
        source: "raiplay",
        contentId,
        guid: String(video.id || contentId),
        title,
        seriesTitle,
        episodeTitle,
        year,
        season: positiveInt(video.season),
        episode: positiveInt(video.episode),
        isClip: /clip|extra|trailer|promo|backstage/i.test(`${video.forma || ""} ${video.type || ""} ${video.name || ""}`) || duration > 0 && duration < 600,
        isFullEpisode: targetType === "series" && Number(video.episode) > 0 && duration >= 600,
        subtitles: normalizeRaiSubtitles(video.video && (video.video.subtitlesArray || video.video.subtitleList) || video.subtitlesArray || video.subtitleList)
      };
    }
    function parseDuration(value) {
      const parts = String(value || "").split(":").map(Number);
      return parts.length === 3 && parts.every(Number.isFinite) ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
    }
    function normalizeRaiSubtitles(items) {
      return (Array.isArray(items) ? items : []).map((item, index) => {
        try {
          const url = new URL(item.url, RAI_ORIGIN);
          if (url.hostname !== "www.raiplay.it") return null;
          return { id: `rai-${index + 1}`, lang: String(item.language || "it").toLowerCase(), url: url.href };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
    }
    var mediasetSessionPromise = null;
    function createMediasetSession(appName) {
      return __async(this, null, function* () {
        const clientId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const data = yield fetchJson(MEDIASET_LOGIN, {
          method: "POST",
          headers: { "content-type": "application/json", origin: MEDIASET_ORIGIN, referer: `${MEDIASET_ORIGIN}/` },
          body: JSON.stringify({ client_id: clientId, appName })
        });
        const response = data.response || {};
        if (!response.beToken) throw new Error("Mediaset anonymous token missing");
        return {
          beToken: response.beToken,
          sid: response.sid || clientId,
          clientId
        };
      });
    }
    function getMediasetSession() {
      return __async(this, null, function* () {
        const cached = cacheGet("mediaset-session");
        if (cached) return cached;
        if (mediasetSessionPromise) return mediasetSessionPromise;
        mediasetSessionPromise = (() => __async(null, null, function* () {
          var _a;
          let appName = "web//mediasetplay-web/1.3.0";
          try {
            const html = yield fetchText(`${MEDIASET_ORIGIN}/`, {
              headers: { range: "bytes=0-300000", origin: MEDIASET_ORIGIN, referer: `${MEDIASET_ORIGIN}/` }
            });
            appName = ((_a = html.match(/<meta[^>]+name=["']app-name["'][^>]+content=["']([^"']+)["']/i)) == null ? void 0 : _a[1]) || appName;
          } catch (e) {
          }
          return cacheSet("mediaset-session", yield createMediasetSession(appName), 45 * 60 * 1e3);
        }))();
        try {
          return yield mediasetSessionPromise;
        } finally {
          mediasetSessionPromise = null;
        }
      });
    }
    function getMediasetGraphqlHash() {
      return __async(this, null, function* () {
        const cached = cacheGet("mediaset-graphql-hash");
        if (cached) return cached;
        const html = yield fetchText(`${MEDIASET_ORIGIN}/cerca?q=a`, {
          allowErrorStatus: true,
          headers: { origin: MEDIASET_ORIGIN, referer: `${MEDIASET_ORIGIN}/` }
        }, 15e3);
        const scripts = [];
        const regex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
        let match;
        while (match = regex.exec(html)) {
          try {
            const url = new URL(match[1], MEDIASET_ORIGIN);
            if (/^static\d+\.mediasetplay\.mediaset\.it$/i.test(url.hostname)) scripts.push(url.href);
          } catch (e) {
          }
        }
        let hash = extractMediasetGraphqlHash(html);
        const prioritized = scripts.sort((left, right) => mediasetScriptPriority(right) - mediasetScriptPriority(left)).slice(0, 32);
        for (let index = 0; !hash && index < prioritized.length; index += 8) {
          const settled = yield Promise.allSettled(prioritized.slice(index, index + 8).map((url) => fetchText(url, {
            headers: { origin: MEDIASET_ORIGIN, referer: `${MEDIASET_ORIGIN}/` }
          }, 12e3)));
          for (const result of settled) {
            if (result.status !== "fulfilled") continue;
            hash = extractMediasetGraphqlHash(result.value);
            if (hash) break;
          }
        }
        if (hash) {
          debug(`Mediaset GraphQL hash ${hash.slice(0, 8)}`);
          return cacheSet("mediaset-graphql-hash", hash.toLowerCase(), 6 * 60 * 60 * 1e3);
        }
        throw new Error("Mediaset GraphQL hash not found");
      });
    }
    function extractMediasetGraphqlHash(source) {
      var _a, _b, _c;
      const decoded = String(source || "").replace(/\\\//g, "/").replace(/\\"/g, '"');
      return ((_a = decoded.match(/GetSearchPageDocument["']?\s*,?\s*0?\s*,?\s*\{[\s\S]{0,300}?__meta__\s*:\s*\{[\s\S]{0,100}?hash\s*:\s*["']([a-f0-9]{64})["']/i)) == null ? void 0 : _a[1]) || ((_b = decoded.match(/GetSearchPageDocument[\s\S]{0,500}?hash\s*:\s*["']([a-f0-9]{64})["']/i)) == null ? void 0 : _b[1]) || ((_c = decoded.match(/getSearchPage[\s\S]{0,1000}?sha256Hash["']?\s*[:=]\s*["']([a-f0-9]{64})["']/i)) == null ? void 0 : _c[1]) || null;
    }
    function mediasetScriptPriority(value) {
      const url = String(value || "").toLowerCase();
      let score = 0;
      if (url.includes("/_next/static/chunks/app/")) score += 8;
      if (url.includes("page")) score += 5;
      if (url.includes("search") || url.includes("cerca")) score += 5;
      if (url.includes("main") || url.includes("webpack")) score += 2;
      return score;
    }
    function mediasetHeaders(session, bearer = false) {
      return {
        authorization: bearer ? `Bearer ${session.beToken}` : session.beToken,
        "x-m-device-id": session.clientId,
        "x-m-platform": "WEB",
        "x-m-property": "MPLAY",
        "x-m-sid": session.sid,
        "x-m-app-version": "1.1.1",
        origin: MEDIASET_ORIGIN,
        referer: `${MEDIASET_ORIGIN}/`
      };
    }
    function searchMediaset(query, target) {
      return __async(this, null, function* () {
        const cacheKey = `mediaset:${normalizeTitle(query)}:${target.type}:${target.season}`;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;
        const candidates = [];
        try {
          const [session, hash] = yield Promise.all([getMediasetSession(), getMediasetGraphqlHash()]);
          const url = new URL(MEDIASET_GRAPHQL);
          url.searchParams.set("extensions", JSON.stringify({ persistedQuery: { version: 1, sha256Hash: hash } }));
          url.searchParams.set("variables", JSON.stringify({ first: 30, property: "search", query, uxReference: "filteredSearch" }));
          const data = yield fetchJson(url, { headers: __spreadProps(__spreadValues({}, mediasetHeaders(session)), { accept: "*/*" }) });
          const raw = extractMediasetItems(data);
          candidates.push(...raw.map(normalizeMediasetEntry).filter((item) => item.guid));
          if (target.type === "series") {
            const expanded = yield Promise.allSettled(raw.filter(isMediasetSeries).slice(0, 5).map((item) => expandMediasetSeries(item, target)));
            for (const item of expanded) if (item.status === "fulfilled") candidates.push(...item.value);
          }
        } catch (error) {
          debug("Mediaset GraphQL search failed", error);
        }
        if (!hasStrongOfficialCandidate(candidates, target)) {
          try {
            const url = new URL("/cerca", MEDIASET_ORIGIN);
            url.searchParams.set("q", query);
            const html = yield fetchText(url, {
              allowErrorStatus: true,
              headers: { origin: MEDIASET_ORIGIN, referer: `${MEDIASET_ORIGIN}/` }
            });
            candidates.push(...extractMediasetPage(html));
          } catch (error) {
            debug("Mediaset public search failed", error);
          }
        }
        if (!hasStrongOfficialCandidate(candidates, target)) {
          try {
            candidates.push(...yield searchWitty(query, target));
          } catch (error) {
            debug("Witty search failed", error);
          }
        }
        return cacheSet(cacheKey, deduplicate(candidates), 15 * 60 * 1e3);
      });
    }
    function hasStrongOfficialCandidate(candidates, target) {
      return candidates.some((candidate) => {
        if (!candidate || candidate.isClip || !candidate.pageUrl) return false;
        const titleScore = Math.max(
          diceSimilarity(target.title, candidate.seriesTitle || candidate.title),
          tokenSimilarity(target.title, candidate.seriesTitle || candidate.title)
        );
        if (target.type === "movie") return titleScore >= 0.9;
        if (candidate.episode == null || Number(candidate.episode) !== Number(target.episode)) return false;
        if (candidate.season != null && Number(candidate.season) !== Number(target.season)) return false;
        return titleScore >= 0.72;
      });
    }
    function extractMediasetItems(data) {
      const direct = data && data.data && data.data.getSearchPage && data.data.getSearchPage.areaContainersConnection && data.data.getSearchPage.areaContainersConnection.areaContainers && data.data.getSearchPage.areaContainersConnection.areaContainers[0] && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0] && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections[0] && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections[0].collections && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections[0].collections[0] && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections[0].collections[0].itemsConnection && data.data.getSearchPage.areaContainersConnection.areaContainers[0].areas[0].sections[0].collections[0].itemsConnection.items;
      if (Array.isArray(direct)) return direct;
      const arrays = [];
      walk(data, (value) => {
        if (Array.isArray(value) && value.some((item) => item && typeof item === "object" && (item.guid || item.cardTitle))) arrays.push(value);
      });
      return arrays.sort((a, b) => b.length - a.length)[0] || [];
    }
    function normalizeMediasetEntry(entry) {
      var _a;
      const media = Array.isArray(entry.media) ? entry.media[0] : null;
      const cardLink = entry.cardLink && (entry.cardLink.value || entry.cardLink) || "";
      const rawGuid = entry.guid || entry.id || media && media.guid || "";
      const guid = /^F[A-Z0-9]{15}$/i.test(String(rawGuid)) ? String(rawGuid) : (_a = String(cardLink || entry.publicUrl || "").match(/\bF[A-Z0-9]{15}\b/i)) == null ? void 0 : _a[0];
      const title = entry.cardTitle || entry.title || entry.description || entry["mediasetprogram$brandTitle"] || "";
      const seriesTitle = entry.seriesTitle || entry["mediasetprogram$brandTitle"] || entry["mediasetprogram$tvLinearSeasonTitle"] || "";
      const duration = Number(entry["mediasetprogram$duration"] || entry.duration || media && media.duration || 0);
      const kind = String(entry.__typename || entry.programType || "");
      return {
        source: "mediaset",
        guid,
        title,
        seriesTitle,
        episodeTitle: /episode|videoitem/i.test(kind) || entry.tvSeasonEpisodeNumber != null ? title : "",
        year: parseYear(entry.year || entry["mediasetprogram$productionYear"] || entry.pubDate || entry.updated),
        season: positiveInt(entry.tvSeasonNumber || entry.seasonNumber || entry["mediasetprogram$seasonNumber"]),
        episode: positiveInt(entry.tvSeasonEpisodeNumber || entry.episodeNumber || entry["mediasetprogram$episodeNumber"]),
        isClip: /clip|promo|trailer|backstage/i.test(`${kind} ${entry["mediasetprogram$category"] || ""} ${title}`) || duration > 0 && duration < 600,
        isFullEpisode: duration >= 600 && (/episode/i.test(kind) || entry.tvSeasonEpisodeNumber != null),
        pageUrl: validMediasetPage(entry["mediasetprogram$videoPageUrl"] || cardLink || entry.publicUrl || entry["mediasetprogram$pageUrl"] || media && media.publicUrl)
      };
    }
    function isMediasetSeries(item) {
      return item && (item.__typename === "SeriesItem" || /^SE\d+$/i.test(String(item.guid || "")) || String(item.cardLink && item.cardLink.referenceType || "").toLowerCase() === "series");
    }
    function expandMediasetSeries(item, target) {
      return __async(this, null, function* () {
        var _a;
        const seriesGuid = String(item.guid || item.cardLink && item.cardLink.referenceId || "");
        if (!/^SE\d+$/i.test(seriesGuid)) return [];
        const seriesUrl = new URL(`${MEDIASET_FEED}/mediaset-prod-all-series-v2`);
        seriesUrl.searchParams.set("byGuid", seriesGuid);
        const series = (_a = (yield fetchJson(seriesUrl)).entries) == null ? void 0 : _a[0];
        if (!series) return [];
        const season = (series.seriesTvSeasons || []).find((value) => Number(value.tvSeasonNumber) === Number(target.season));
        if (!season) return [];
        const seasonId = season.id || season.url || (series.availableTvSeasonIds || []).find((value) => String(value).endsWith(`/${season.guid}`));
        if (!seasonId) return [];
        const episodesUrl = new URL(`${MEDIASET_FEED}/mediaset-prod-all-programs-v2`);
        episodesUrl.searchParams.set("byTvSeasonId", seasonId);
        episodesUrl.searchParams.set("sort", ":publishInfo_lastPublished|asc,tvSeasonEpisodeNumber|asc");
        episodesUrl.searchParams.set("range", "1-600");
        const episodes = (yield fetchJson(episodesUrl)).entries || [];
        return episodes.map((entry) => normalizeMediasetEntry(__spreadProps(__spreadValues({}, entry), {
          seriesTitle: series.title || item.cardTitle || "",
          tvSeasonNumber: entry.tvSeasonNumber == null ? season.tvSeasonNumber : entry.tvSeasonNumber
        }))).filter((candidate) => candidate.guid);
      });
    }
    function validMediasetPage(value) {
      if (!value) return null;
      try {
        const url = new URL(value, MEDIASET_ORIGIN);
        return /(^|\.)mediaset\.it$/i.test(url.hostname) || /(^|\.)wittytv\.it$/i.test(url.hostname) ? url.href : null;
      } catch (e) {
        return null;
      }
    }
    function extractMediasetPage(html) {
      const text = String(html || "").replace(/\\\//g, "/").replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
      const regex = /(?:https?:\/\/(?:www\.)?mediasetinfinity\.mediaset\.it)?\/(?:video|movie|on-demand)\/[^"'<>\s]+?_(F[A-Z0-9]{15})(?:\/)?/gi;
      const result = [];
      let match;
      while (match = regex.exec(text)) {
        const pageUrl = validMediasetPage(match[0]);
        if (!pageUrl) continue;
        const parts = new URL(pageUrl).pathname.split("/").filter(Boolean);
        const itemSlug = String(parts[parts.length - 1] || "").replace(new RegExp(`_${match[1]}.*$`, "i"), "");
        const seriesSlug = parts.length >= 3 ? parts[parts.length - 2] : "";
        result.push({
          source: "mediaset",
          guid: match[1],
          title: titleFromSlug(itemSlug),
          seriesTitle: titleFromSlug(seriesSlug),
          episodeTitle: titleFromSlug(itemSlug),
          year: null,
          season: null,
          episode: null,
          isClip: /clip|promo|trailer|backstage|anticipazioni/i.test(`${itemSlug} ${seriesSlug}`),
          isFullEpisode: false,
          pageUrl
        });
      }
      return result;
    }
    function searchWitty(query, target) {
      return __async(this, null, function* () {
        const bases = [];
        if (target && target.title && target.episodeTitle) {
          const deterministic = {
            pageUrl: `${WITTY_ORIGIN}/${slugify(target.title)}/${slugify(target.episodeTitle)}/`,
            title: target.episodeTitle
          };
          try {
            const candidate = yield enrichWittyBase(deterministic);
            if (isStrongWittyEpisode(candidate, target)) return [candidate];
            if (candidate) bases.push(deterministic);
          } catch (e) {
          }
        }
        if (target && target.title) {
          try {
            const programUrl = `${WITTY_ORIGIN}/${slugify(target.title)}/`;
            const html = yield fetchText(programUrl, { headers: { referer: `${WITTY_ORIGIN}/`, accept: "text/html" } });
            const programBases = extractWittyBases(html);
            const programCandidates = yield enrichWittyBases(programBases);
            const strong = programCandidates.find((candidate) => isStrongWittyEpisode(candidate, target));
            if (strong) return [strong];
            bases.push(...programBases);
          } catch (e) {
          }
        }
        const searchUrl = new URL("/wp-json/wp/v2/search", WITTY_ORIGIN);
        searchUrl.searchParams.set("search", query);
        searchUrl.searchParams.set("per_page", "100");
        try {
          const data = yield fetchJson(searchUrl);
          for (const item of Array.isArray(data) ? data : []) bases.push({ pageUrl: item.url, title: decodeHtml(item.title || "") });
        } catch (e) {
        }
        try {
          const htmlUrl = new URL("/", WITTY_ORIGIN);
          htmlUrl.searchParams.set("s", query);
          const html = yield fetchText(htmlUrl, { headers: { referer: `${WITTY_ORIGIN}/`, accept: "text/html" } });
          bases.push(...extractWittyBases(html));
        } catch (e) {
        }
        return enrichWittyBases(bases);
      });
    }
    function enrichWittyBases(bases) {
      return __async(this, null, function* () {
        const settled = yield Promise.allSettled(deduplicate(bases).slice(0, 30).map(enrichWittyBase));
        return settled.filter((item) => item.status === "fulfilled" && item.value).map((item) => item.value);
      });
    }
    var WITTY_ORIGIN = "https://www.wittytv.it";
    function isStrongWittyEpisode(candidate, target) {
      if (!candidate || candidate.isClip || candidate.isFullEpisode !== true) return false;
      if (!target || target.type !== "series") return true;
      if (candidate.episode != null && Number(candidate.episode) !== Number(target.episode)) return false;
      if (candidate.season != null && Number(candidate.season) !== Number(target.season)) return false;
      return candidate.episode != null || diceSimilarity(target.episodeTitle || "", candidate.episodeTitle || "") >= 0.75;
    }
    function enrichWittyBase(base) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f;
        const html = yield fetchText(base.pageUrl, { headers: { referer: `${WITTY_ORIGIN}/`, accept: "text/html" } });
        const guid = ((_a = html.match(/guIDcurrentGlobal\s*=\s*["'](F[A-Z0-9]{15})["']/i)) == null ? void 0 : _a[1]) || ((_b = html.match(/\b(F[A-Z0-9]{15})\b/i)) == null ? void 0 : _b[1]);
        if (!guid) return null;
        const metaTitle = decodeHtml(((_c = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)) == null ? void 0 : _c[1]) || base.title);
        const title = metaTitle.replace(/\s*[|–-]\s*Witty\s*TV.*$/i, "").trim();
        const duration = Number(((_d = html.match(/mediasetprogram\\?["']?\$duration\\?["']?\s*:\s*(\d+)/i)) == null ? void 0 : _d[1]) || 0);
        return {
          source: "witty",
          guid,
          title,
          seriesTitle: titleFromSlug(new URL(base.pageUrl).pathname.split("/").filter(Boolean)[0] || ""),
          episodeTitle: title,
          year: parseYear(html),
          season: positiveInt((_e = html.match(/stagione\s*(\d+)/i)) == null ? void 0 : _e[1]),
          episode: parseWittyEpisode(title) || positiveInt((_f = html.match(/episodio\s*(\d+)/i)) == null ? void 0 : _f[1]),
          isClip: /\b(?:clip|promo|trailer|backstage|anticipazioni|highlight|highlights|best moments|momenti|riassunto|prossimamente)\b|nella prossima puntata|nei prossimi episodi|ci aspetta|ci attende/i.test(normalizeTitle(title)) || duration > 0 && duration < 600,
          isFullEpisode: /puntata|episodio/i.test(title) && !/\b(?:clip|promo|trailer|backstage|anticipazioni|highlight|highlights|best moments|momenti|riassunto|prossimamente)\b|ci aspetta|ci attende/i.test(normalizeTitle(title)),
          pageUrl: base.pageUrl
        };
      });
    }
    function extractWittyBases(html) {
      const result = [];
      const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      while (match = regex.exec(String(html || ""))) {
        try {
          const url = new URL(decodeHtml(match[1]), WITTY_ORIGIN);
          const segments = url.pathname.split("/").filter(Boolean);
          if (!url.hostname.endsWith("wittytv.it") || segments.length < 2) continue;
          if (/\.(?:jpg|jpeg|png|gif|webp|svg|css|js|woff2?)$/i.test(url.pathname)) continue;
          result.push({
            pageUrl: url.href,
            title: decodeHtml(String(match[2] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
          });
        } catch (e) {
        }
      }
      return result;
    }
    function slugify(value) {
      return normalizeTitle(value).replace(/\s+/g, "-");
    }
    function decodeHtml(value) {
      return String(value || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'");
    }
    function titleFromSlug(value) {
      try {
        value = decodeURIComponent(value);
      } catch (e) {
      }
      return String(value || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    }
    function parseWittyEpisode(value) {
      var _a, _b;
      const numeric = (_a = normalizeTitle(value).match(/(?:episodio|puntata)\s*(\d{1,3})\b/i)) == null ? void 0 : _a[1];
      if (numeric) return Number(numeric);
      const ordinals = {
        prima: 1,
        primo: 1,
        seconda: 2,
        secondo: 2,
        terza: 3,
        terzo: 3,
        quarta: 4,
        quarto: 4,
        quinta: 5,
        quinto: 5,
        sesta: 6,
        sesto: 6,
        settima: 7,
        settimo: 7,
        ottava: 8,
        ottavo: 8,
        nona: 9,
        nono: 9,
        decima: 10,
        decimo: 10
      };
      const word = (_b = normalizeTitle(value).match(/\b(prima|primo|seconda|secondo|terza|terzo|quarta|quarto|quinta|quinto|sesta|sesto|settima|settimo|ottava|ottavo|nona|nono|decima|decimo)\s+puntata\b/i)) == null ? void 0 : _b[1];
      return word ? ordinals[word] || null : null;
    }
    function resolveProxyEntries(context) {
      const settings = typeof globalThis !== "undefined" && globalThis.SCRAPER_SETTINGS ? globalThis.SCRAPER_SETTINGS : {};
      const entries = [];
      if (Array.isArray(context && context.proxyEntries)) entries.push(...context.proxyEntries);
      if (!entries.length && settings.easyProxies) {
        try {
          const configured = typeof settings.easyProxies === "string" ? JSON.parse(settings.easyProxies) : settings.easyProxies;
          if (Array.isArray(configured)) entries.push(...configured);
        } catch (e) {
        }
      }
      if (!entries.length && context && context.proxyUrl) entries.push({ url: context.proxyUrl, password: context.proxyPassword || "" });
      if (!entries.length && settings.proxyUrl) entries.push({ url: settings.proxyUrl, password: settings.proxyPassword || "" });
      if (!entries.length && settings.easyProxyUrl) entries.push({ url: settings.easyProxyUrl, password: settings.easyProxyPassword || "" });
      const normalized = entries.map((entry) => ({
        url: String(entry && (entry.url || entry.proxyUrl) || "").trim().replace(/\/+$/, ""),
        password: String(entry && (entry.password || entry.proxyPassword) || "").trim()
      })).filter((entry) => /^https?:\/\//i.test(entry.url) && entry.password);
      const selectedUrl = String(context && context.proxyUrl || "").replace(/\/+$/, "");
      if (!selectedUrl) return normalized;
      return normalized.map((entry, index) => ({ entry, index, selected: entry.url === selectedUrl ? 0 : 1 })).sort((left, right) => left.selected - right.selected || left.index - right.index).map((item) => item.entry);
    }
    function getCandidateExtractorSource(candidate) {
      let sourceUrl;
      let host;
      if (candidate.source === "raiplay") {
        const relinker = new URL(RAI_RELINKER);
        relinker.searchParams.set("cont", candidate.contentId);
        relinker.searchParams.set("output", "62");
        sourceUrl = relinker.href;
        host = "raiplay";
      } else {
        sourceUrl = validMediasetPage(candidate.pageUrl);
        if (!sourceUrl) throw new Error("Invalid provider URL");
        host = new URL(sourceUrl).hostname.endsWith("wittytv.it") ? "wittytv" : "mediaset";
      }
      return { sourceUrl, host };
    }
    function buildLazyExtractorUrl(candidate, proxyEntry) {
      const { sourceUrl, host } = getCandidateExtractorSource(candidate);
      const endpoint = new URL("/extractor/video.m3u8", `${proxyEntry.url}/`);
      endpoint.searchParams.set("host", host);
      endpoint.searchParams.set("d", sourceUrl);
      endpoint.searchParams.set("redirect_stream", "true");
      endpoint.searchParams.set("api_password", proxyEntry.password);
      return endpoint.href;
    }
    function inspectMediasetCandidate(candidate) {
      return __async(this, null, function* () {
        var _a;
        const cacheKey = `mediaset-playback:${candidate.guid}`;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;
        const sessionFactories = [
          () => getMediasetSession(),
          () => createMediasetSession("embed//mediasetplay-embed")
        ];
        let sessionsTried = 0;
        let explicitRightsErrors = 0;
        for (const createSession of sessionFactories) {
          try {
            const session = yield createSession();
            sessionsTried += 1;
            const playback = yield fetchJson(
              "https://api-ott-prod-fe.mediaset.net/PROD/play/playback/check/v2.0",
              {
                method: "POST",
                headers: __spreadProps(__spreadValues({}, mediasetHeaders(session, true)), { "content-type": "application/json" }),
                body: JSON.stringify({ contentId: candidate.guid, streamType: "VOD" })
              },
              8e3
            );
            if (playback.error) {
              explicitRightsErrors += 1;
              debug(`Mediaset playback ${playback.error.code || "error"} for ${candidate.guid}`);
              continue;
            }
            const selector = playback.response && playback.response.mediaSelector;
            if (!selector || !selector.url) throw new Error("Mediaset media selector missing");
            const selectorUrl = new URL(selector.url);
            const params = {
              format: "SMIL",
              auth: session.beToken,
              formats: "MPEG4,M3U,MPEG-DASH",
              assetTypes: "HD,browser,widevine,geoIT|geoNo:HR,browser,widevine,geoIT|geoNo:SD,browser,widevine,geoIT|geoNo",
              balance: "true",
              auto: "true",
              tracking: "true",
              delivery: "Streaming"
            };
            if (selector.publicUrl) params.publicUrl = selector.publicUrl;
            for (const [key, value] of Object.entries(params)) selectorUrl.searchParams.set(key, value);
            const smil = yield fetchText(selectorUrl, {
              headers: {
                accept: "application/json,text/plain,*/*",
                origin: MEDIASET_ORIGIN,
                referer: `${MEDIASET_ORIGIN}/`
              }
            }, 8e3);
            const manifests = [];
            for (const match of smil.matchAll(/<(?:ref|video)\b([^>]*)>/gi)) {
              const source = decodeHtml(((_a = match[1].match(/\bsrc=["']([^"']+)/i)) == null ? void 0 : _a[1]) || "");
              if (/\.(?:mpd|m3u8)(?:$|\?)/i.test(source)) manifests.push(source);
            }
            if (!manifests.length) throw new Error("Mediaset manifest missing");
            const quality = yield detectManifestQuality(manifests[0], {
              origin: MEDIASET_ORIGIN,
              referer: `${MEDIASET_ORIGIN}/`,
              "user-agent": USER_AGENT
            });
            return cacheSet(cacheKey, { available: true, quality }, 15 * 60 * 1e3);
          } catch (error) {
            debug(`Mediaset lightweight inspection failed for ${candidate.guid}`, error);
          }
        }
        if (sessionsTried > 0 && explicitRightsErrors === sessionsTried) {
          return cacheSet(cacheKey, { available: false, quality: "720p" }, 30 * 1e3);
        }
        return { available: true, quality: "720p" };
      });
    }
    function inspectRaiCandidate(candidate) {
      return __async(this, null, function* () {
        const cacheKey = `rai-playback:${candidate.contentId}`;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;
        try {
          const relinker = new URL(RAI_RELINKER);
          relinker.searchParams.set("cont", candidate.contentId);
          relinker.searchParams.set("output", "62");
          const data = yield fetchJson(relinker, {
            headers: { origin: RAI_ORIGIN, referer: `${RAI_ORIGIN}/` }
          }, 8e3);
          const manifest = String(data.video && data.video[0] || "");
          const parsed = new URL(manifest);
          if (parsed.protocol !== "https:" || !(parsed.hostname.endsWith(".rai.it") || parsed.hostname.endsWith(".akamaized.net") || parsed.hostname.endsWith(".msvdn.net"))) {
            return cacheSet(cacheKey, { available: false, quality: "720p" }, 30 * 1e3);
          }
          const quality = yield detectManifestQuality(manifest, {
            origin: RAI_ORIGIN,
            referer: `${RAI_ORIGIN}/`,
            "user-agent": USER_AGENT
          });
          return cacheSet(cacheKey, { available: true, quality }, 15 * 60 * 1e3);
        } catch (error) {
          debug(`RaiPlay lightweight inspection failed for ${candidate.contentId}`, error);
          return { available: true, quality: "720p" };
        }
      });
    }
    function detectManifestQuality(_0) {
      return __async(this, arguments, function* (url, headers = {}) {
        try {
          const text = yield fetchText(url, { headers: __spreadProps(__spreadValues({}, headers), { range: "bytes=0-524287" }) }, 8e3);
          const heights = [];
          for (const match of text.matchAll(/(?:RESOLUTION=\d+x|height=["'])(\d{3,4})/gi)) heights.push(Number(match[1]));
          for (const match of text.matchAll(/\b(?:maxHeight|height)\s*=\s*["'](\d{3,4})["']/gi)) heights.push(Number(match[1]));
          const max = Math.max(0, ...heights);
          if (max >= 2160) return "2160p";
          if (max >= 1440) return "1440p";
          if (max >= 1080) return "1080p";
          if (max >= 720) return "720p";
          if (max > 0) return "480p";
        } catch (e) {
        }
        return "720p";
      });
    }
    function providerLabel(candidate) {
      if (candidate.source === "raiplay") return "RaiPlay";
      try {
        if (new URL(candidate.pageUrl).hostname.endsWith("wittytv.it")) return "WittyTV";
      } catch (e) {
      }
      return candidate.source === "witty" ? "WittyTV" : "Mediaset Infinity";
    }
    function getOfficialStreams2(_0, _1, _2, _3, _4) {
      return __async(this, arguments, function* (provider, id, type, season, episode, context = {}) {
        try {
          const proxyEntries = resolveProxyEntries(context || {});
          if (!proxyEntries.length) return [];
          const target = yield resolveTarget(id, type, season, episode, context || {});
          if (!target) return [];
          const all = [];
          for (const query of buildQueries(target)) {
            const found = provider === "raiplay" ? yield searchRai(query, target) : yield searchMediaset(query, target);
            all.push(...found);
            const ranked2 = deduplicate(all).map((candidate) => __spreadProps(__spreadValues({}, candidate), { score: scoreCandidate(target, candidate) })).sort((a, b) => b.score - a.score);
            if (ranked2[0] && ranked2[0].score >= 0.88 && !ranked2[0].isClip) break;
          }
          const ranked = deduplicate(all).map((candidate) => __spreadProps(__spreadValues({}, candidate), { score: scoreCandidate(target, candidate) })).filter((candidate) => {
            if (candidate.score < MIN_MATCH_SCORE || candidate.isClip) return false;
            if (target.type !== "series") return true;
            if (candidate.season != null && Number(candidate.season) !== Number(target.season)) return false;
            if (candidate.episode != null && Number(candidate.episode) !== Number(target.episode)) return false;
            if (candidate.source === "witty" && candidate.isFullEpisode !== true) return false;
            return true;
          }).sort((a, b) => b.score - a.score).slice(0, 6);
          for (const candidate of ranked) {
            try {
              const inspection = provider === "raiplay" ? yield inspectRaiCandidate(candidate) : yield inspectMediasetCandidate(candidate);
              if (!inspection.available) continue;
              const label = providerLabel(candidate);
              const title = target.type === "series" ? `${target.title} S${String(target.season).padStart(2, "0")}E${String(target.episode).padStart(2, "0")}` : target.title;
              const stream = formatStream({
                url: buildLazyExtractorUrl(candidate, proxyEntries[0]),
                name: label,
                title,
                quality: inspection.quality,
                language: "Italian",
                type: "direct",
                subtitles: candidate.subtitles || [],
                behaviorHints: {
                  notWebReady: true,
                  bingeGroup: provider === "raiplay" ? "raiplay" : "mediaset",
                  filename: `${cleanTitle(title).replace(/[^a-z0-9._ -]+/gi, " ")}.m3u8`
                }
              }, provider === "raiplay" ? "RaiPlay" : "Mediaset Infinity");
              return stream ? [stream] : [];
            } catch (e) {
            }
          }
          return [];
        } catch (error) {
          console.warn(`[${provider === "raiplay" ? "RaiPlay" : "Mediaset"}] ${error.message}`);
          return [];
        }
      });
    }
    module2.exports = { getOfficialStreams: getOfficialStreams2 };
  }
});

// src/mediaset/index.js
var { getOfficialStreams } = require_official_vod();
function getStreams(id, type, season, episode, providerContext = null) {
  return __async(this, null, function* () {
    return getOfficialStreams("mediaset", id, type, season, episode, providerContext || {});
  });
}
module.exports = { getStreams };
