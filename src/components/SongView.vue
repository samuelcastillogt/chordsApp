<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ApiService, type SongPayload } from '../services/api.service';

const route = useRoute();
const apiService = new ApiService();

const isLoading = shallowRef(true);
const loadError = shallowRef('');
const song = shallowRef<SongPayload | null>(null);

const selectedChord = shallowRef('');
const selectedChordSvg = shallowRef('');
const chordError = shallowRef('');

const chordSvgCache = new Map<string, string>();

const songName = computed(() => String(route.params.songName ?? ''));
const songMeta = computed(() => {
  if (!song.value) {
    return '';
  }
  return `${song.value.artist} · ${song.value.album} · ${song.value.tonality} · ${song.value.bpm} BPM`;
});

const normalizeChordName = (name: string) => {
  const alias: Record<string, string> = {
    Em: 'Emin',
    Am: 'Amin',
    C: 'Cmaj',
    D: 'Dmaj',
    G: 'Gmaj',
  };
  return alias[name] || name;
};

const rowLength = (lyrics: string) => Math.max(lyrics.length + 2, 12);

const loadChord = async (chordName: string) => {
  const normalized = normalizeChordName(chordName);
  selectedChord.value = chordName;
  chordError.value = '';

  if (chordSvgCache.has(normalized)) {
    selectedChordSvg.value = chordSvgCache.get(normalized) ?? '';
    return;
  }

  try {
    const svg = await apiService.getChordSvg(normalized);
    chordSvgCache.set(normalized, svg);
    selectedChordSvg.value = svg;
  } catch (error) {
    selectedChordSvg.value = '';
    chordError.value = `Acorde no disponible en API: ${chordName}`;
    console.error(error);
  }
};

const loadSong = async () => {
  if (!songName.value) {
    return;
  }

  isLoading.value = true;
  loadError.value = '';
  song.value = null;
  selectedChord.value = '';
  selectedChordSvg.value = '';
  chordError.value = '';

  try {
    const response = await apiService.getSong(songName.value);
    song.value = response;

    const firstChord = response.lines?.[0]?.chords?.[0]?.name;
    if (firstChord) {
      await loadChord(firstChord);
    }
  } catch (error) {
    loadError.value = 'No se pudo cargar la cancion.';
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

watch(songName, () => {
  loadSong();
}, { immediate: true });
</script>

<template>
  <main class="song-layout">
    <section class="song-content">
      <article class="song-main">
        <h1 v-if="song">{{ song.title }}</h1>
        <h1 v-else>Cargando...</h1>
        <p class="song-meta">{{ songMeta }}</p>

        <p v-if="isLoading" class="status-message">Cargando cancion...</p>
        <p v-else-if="loadError" class="status-message error-message">{{ loadError }}</p>

        <div v-else class="song-lines">
          <article v-for="(line, lineIndex) in (song?.lines ?? [])" :key="lineIndex" class="song-line">
            <div
              class="chord-row"
              :style="{ gridTemplateColumns: `repeat(${rowLength(line.lyrics)}, minmax(0, 1ch))` }"
            >
              <button
                v-for="(chord, chordIndex) in line.chords"
                :key="`${lineIndex}-${chordIndex}`"
                type="button"
                class="chord-chip"
                :style="{ gridColumn: `${chord.position + 1} / span 6` }"
                @click="loadChord(chord.name)"
              >
                {{ chord.name }}
              </button>
            </div>
            <pre class="lyric-row">{{ line.lyrics }}</pre>
          </article>
        </div>
      </article>

      <aside class="song-side">
        <h2>Acorde seleccionado</h2>
        <p class="selected-chord-name">{{ selectedChord || '-' }}</p>

        <div class="chord-svg-box">
          <div v-if="selectedChordSvg" v-html="selectedChordSvg"></div>
          <p v-else class="song-help">Haz clic en un acorde de la letra para ver su diagrama.</p>
        </div>

        <p v-if="chordError" class="chord-error">{{ chordError }}</p>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.song-layout {
  width: min(1160px, calc(100% - 24px));
  margin: 12px auto 116px;
  border: 1px solid #cfd6dc;
  border-radius: 14px;
  background: rgba(248, 250, 250, 0.95);
  box-shadow: 0 18px 40px rgba(15, 35, 48, 0.16);
  overflow: hidden;
}

.song-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 0;
}

.song-main {
  padding: 20px 20px 28px;
}

.song-main h1 {
  margin: 0;
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  color: #19262f;
}

.song-meta {
  margin: 8px 0 18px;
  color: #4c5f6e;
  font-size: 0.95rem;
}

.status-message {
  margin: 0;
  color: #2f4958;
}

.error-message {
  color: #b3261e;
}

.song-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.song-line {
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(207, 214, 220, 0.6);
  background: rgba(255, 255, 255, 0.75);
}

.chord-row {
  display: grid;
  min-height: 20px;
  margin-bottom: 4px;
}

.chord-chip {
  justify-self: start;
  border: none;
  cursor: pointer;
  background: transparent;
  color: #195ec8;
  font-weight: 700;
  padding: 0;
  font-family: "SF Mono", Menlo, monospace;
}

.chord-chip:hover {
  text-decoration: underline;
}

.lyric-row {
  margin: 0;
  white-space: pre;
  font-family: "SF Mono", Menlo, monospace;
  font-size: 1.05rem;
  line-height: 1.42;
  color: #19262f;
}

.song-side {
  border-left: 1px solid #cfd6dc;
  padding: 20px 16px;
  background: linear-gradient(180deg, #fbfcfd, #f1f4f7);
}

.song-side h2 {
  margin: 0;
  font-size: 1rem;
  color: #253846;
}

.selected-chord-name {
  margin: 8px 0 10px;
  color: #195ec8;
  font-size: 1.35rem;
  font-weight: 800;
}

.chord-svg-box {
  min-height: 360px;
  border: 1px solid #cfd6dc;
  border-radius: 10px;
  background: white;
  display: grid;
  place-items: center;
  padding: 10px;
}

.song-help {
  margin: 0;
  text-align: center;
  color: #4c5f6e;
}

.chord-error {
  margin-top: 10px;
  color: #b3261e;
  font-weight: 700;
}

@media (max-width: 900px) {
  .song-content {
    grid-template-columns: 1fr;
  }

  .song-side {
    border-left: none;
    border-top: 1px solid #cfd6dc;
  }
}
</style>
