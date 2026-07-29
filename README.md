# Nuvio Plugin & Stremio Addon

Questo repository contiene una collezione di provider italiani per lo streaming di Film, Serie TV e Anime.
Il progetto è progettato per essere versatile e può essere utilizzato in due modi diversi:

1.  Come **Plugin per Nuvio**
2.  Come **Addon per Stremio**

## 📺 Provider Supportati

-   **AnimeUnity** (Anime)
-   **AnimeWorld** (Anime)
-   **AnimeSaturn** (Anime)
-   **GuardaHD** (Film)
-   **GuardoSerie** (Film & Serie TV)
-   **StreamingCommunity** (Film & Serie TV)
-   **VidxGo** (Film & Serie TV)
-   **AltadefinizioneStreaming** (Film & Serie TV)
-   **Mediaset Infinity / WittyTV** (Film & Serie TV ufficiali gratuiti)
-   **RaiPlay** (Film & Serie TV ufficiali gratuiti)

---

## 🚀 Installazione su Nuvio

Per installare i provider su Nuvio, basta seguire questi semplici passaggi:

1.  Apri **Nuvio**.
2.  Vai nelle **Impostazioni** > **Plugin**.
3.  Incolla il seguente link nel campo apposito per aggiungere un plugin esterno:
    ```text
    https://raw.githubusercontent.com/realbestia1/easystreams/refs/heads/main/
    ```
4.  I provider saranno immediatamente attivi.

---

## 🍿 Installazione su Stremio

Puoi trasformare questi provider in un Addon per Stremio che gira in locale o su un server.

### Esecuzione Locale (Consigliata)
Poiché molti siti italiani bloccano gli IP dei server cloud (AWS, Heroku, ecc.), l'esecuzione locale è spesso la soluzione migliore.

1.  Apri il terminale nella cartella del progetto.
2.  Avvia l'addon:
    ```bash
    npm start
    ```
3.  L'addon si avvierà su `http://localhost:7000`.
4.  Apri il browser a quell'indirizzo.
5.  Clicca sul pulsante **"INSTALL ADDON"** per aggiungerlo automaticamente al tuo Stremio.

### Esecuzione con Docker
Se preferisci usare Docker (ottimo per NAS o server casalinghi):

1.  Assicurati di avere Docker installato.
2.  Esegui il comando:
    ```bash
    docker-compose up -d
    ```
3.  L'addon sarà disponibile su `http://localhost:7000`.

### Deploy su Cloud (HuggingFace, Render, ecc.)
Puoi caricare questo repository su servizi come HuggingFace.
Tuttavia, tieni presente che **alcuni provider potrebbero non funzionare** a causa dei blocchi geografici o dei blocchi IP dei datacenter imposti dai siti sorgente.

---

## ⚙️ Configurazione Avanzata (Addon Stremio)

Quando l'addon viene eseguito su un server remoto (non in locale), alcuni provider potrebbero riscontrare problemi tecnici dovuti alle protezioni dei siti sorgente.

### EasyProxy

Mediaset Infinity, WittyTV, RaiPlay e gli altri provider che richiedono EasyProxy
usano gli stessi endpoint configurati nella pagina dell'addon. È possibile
inserire uno o più indirizzi con password e scegliere la modalità failover o
bilanciamento. I contenuti ufficiali vengono verificati prima di essere mostrati:
quelli a pagamento o non disponibili non vengono restituiti al player.

La qualità visualizzata deriva dal manifest effettivo: `HD` per 720p e `FHD` per
1080p. Il flusso adattivo conserva comunque tutte le varianti pubblicate dal
provider. La ricerca esegue soltanto un controllo leggero; estrazione e gestione
DRM restano differite al momento della riproduzione tramite il normale endpoint
EasyProxy `/extractor/video.m3u8` con `redirect_stream=true`.


### ⚡ SuperVideo (Proxy Cloudflare Worker)
**SuperVideo** utilizza forti protezioni Cloudflare che spesso bloccano i server cloud (403 Forbidden). Per risolvere questo problema, è necessario configurare un **Cloudflare Worker** come proxy.

1.  Crea un nuovo Worker su Cloudflare.
2.  Incolla il codice contenuto nel file `worker.js` di questo repository.
3.  Salva e pubblica il worker per ottenere un URL (es. `https://mio-proxy.workers.dev/`).
4.  Imposta la variabile d'ambiente `CF_PROXY_URL` con l'URL del worker (consigliato):
    ```text
    CF_PROXY_URL=https://mio-proxy.workers.dev
    ```
---

## 🛠️ Sviluppo

-   **Struttura**: Ogni provider ha la sua cartella in `src/`.
-   **Build**: Lo script `build.js` compila i provider per Nuvio.
-   **Stremio**: Il file `stremio_addon.js` funge da server e adattatore per convertire i risultati dei provider nel formato Stremio.

---

**Powered by [realbestia1](https://github.com/realbestia1/)**
