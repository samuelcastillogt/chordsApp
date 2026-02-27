<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  chord: string,
  index: number
}>();

const safeChord = computed(() => props.chord.replace(/"/g, '&quot;'));

const srcDoc = computed(() => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background: transparent;
      }
      img {
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
        display: block;
      }
    </style>
  </head>
  <body>
    <ins class="scales_chords_api" chord="${safeChord.value}" output="image"></ins>
    <script async type="text/javascript" src="https://www.scales-chords.com/api/scales-chords-api.js"><\/script>
  </body>
</html>
`);

const toRoman = (num: number) => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return roman[num] || (num + 1).toString();
};

const romanDigit = computed(() => toRoman(props.index));
</script>

<template>
  <div class="chord-wrapper">
    <p class="chord-name">{{ chord }}</p>
    <iframe 
      :key="`${chord}-${index}`"
      :srcdoc="srcDoc" 
      title="Chord Display"
      class="chord-frame"
      scrolling="no"
    ></iframe>
    <div class="roman-numeral">{{ romanDigit }}</div>
  </div>
</template>

<style scoped>
.chord-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 10px;
  min-width: 240px;
}

.chord-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: white;
}

.chord-frame {
  border: none;
  width: min(100%, 320px);
  height: 250px;
}

.roman-numeral {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
  opacity: 0.92;
}
</style>
