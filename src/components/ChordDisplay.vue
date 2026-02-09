<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  chord: string,
  index: number
}>();

const srcDoc = computed(() => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden;}
      img { max-width: 85%; max-height: 85%; object-fit: contain; display: block; }
    </style>
  </head>
  <body>
    <ins class="scales_chords_api" chord="${props.chord}" output="image"></ins>
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
    <iframe 
      :srcdoc="srcDoc" 
      title="Chord Display"
      style="border: none; width: 300px; height: 250px;"
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
  margin: 10px;
}

.roman-numeral {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333; /* Or keep it white depending on background, checking sideMenu: it has a gradient background, but this file is white? sideMenu has white text color rule. Let's make it inherit or white */
  color: white; /* sideMenu sets text color white, but let's be safe */
  margin-top: -20px;
  margin-bottom: 10px;
}
</style>
