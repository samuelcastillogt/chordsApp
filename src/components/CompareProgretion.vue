<script setup lang="ts">
import { ref } from 'vue';
import { ApiService } from '../services/api.service';
import ChordDisplay from './ChordDisplay.vue';

const modes = ref<any[]>([]);
const notes = ref<any[]>([]);

// Scale 1 State
const mode1 = ref("");
const note1 = ref("");
const scale1 = ref<string[]>([]);

// Scale 2 State
const mode2 = ref("");
const note2 = ref("");
const scale2 = ref<string[]>([]);

const apiService = new ApiService();

// Load initial data
apiService.getModes().then((response) => modes.value = response);
apiService.getNotes().then((response) => notes.value = response);

const getScales = async () => {
    if (note1.value && mode1.value) {
        scale1.value = await apiService.getScales(note1.value, mode1.value);
    }
    if (note2.value && mode2.value) {
        scale2.value = await apiService.getScales(note2.value, mode2.value);
    }
};

const getMaxLength = () => {
    return Math.max(scale1.value.length, scale2.value.length);
};
</script>

<template>
    <div class="main">
        <div class="controls-container">
            <div class="scale-selector">
                <h2>Escala 1</h2>
                <select v-model="mode1">
                    <option disabled value="">Modo</option>
                    <option v-for="mode in modes" :key="mode.data.name" :value="mode.data.name">
                        {{ mode.data.name }}
                    </option>
                </select>
                <select v-model="note1">
                    <option disabled value="">Nota</option>
                    <option v-for="note in notes" :key="note.note.american" :value="note.note.american">
                        {{ note.note.american }}
                    </option>
                </select>
            </div>

            <div class="action-area">
                <button @click="getScales()" class="btn success">Comparar Escalas</button>
            </div>

            <div class="scale-selector">
                <h2>Escala 2</h2>
                <select v-model="mode2">
                    <option disabled value="">Modo</option>
                    <option v-for="mode in modes" :key="mode.data.name" :value="mode.data.name">
                        {{ mode.data.name }}
                    </option>
                </select>
                <select v-model="note2">
                    <option disabled value="">Nota</option>
                    <option v-for="note in notes" :key="note.note.american" :value="note.note.american">
                        {{ note.note.american }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="scale1.length > 0 || scale2.length > 0" class="comparison-grid">
            <div class="grid-header">Grado</div>
            <div class="grid-header">Escala 1 ({{ note1 }} {{ mode1 }})</div>
            <div class="grid-header">Escala 2 ({{ note2 }} {{ mode2 }})</div>

            <template v-for="i in getMaxLength()" :key="i">
                <div class="grade-cell">
                    {{ i }}
                </div>
                <div class="chord-cell">
                    <ChordDisplay v-if="scale1[i-1]" :chord="scale1[i-1]!" :index="i-1" />
                </div>
                <div class="chord-cell">
                    <ChordDisplay v-if="scale2[i-1]" :chord="scale2[i-1]!" :index="i-1" />
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.main {
    background: linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(79, 128, 158, 1) 100%);
    min-height: 100vh;
    padding: 20px 20px 140px;
    color: white;
    font-family: 'Inter', sans-serif;
}

.controls-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 40px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.scale-selector {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.scale-selector h2 {
    margin: 0;
    font-size: 1.2rem;
    text-align: center;
}

select {
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    background-color: #e2eeee;
    font-size: 16px;
    color: #333;
    min-width: 150px;
}

.action-area {
    padding-bottom: 20px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    transition: transform 0.2s, background-color 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn:hover {
    transform: translateY(-2px);
    background-color: #45a049;
}

.comparison-grid {
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 20px;
}

.grid-header {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(255,255,255,0.2);
}

.grade-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    color: rgba(255,255,255,0.8);
}

.chord-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    min-height: 320px;
}

@media (max-width: 900px) {
    .comparison-grid {
        grid-template-columns: 1fr;
    }

    .grid-header {
        border-bottom: none;
        padding-bottom: 0;
    }

    .grade-cell {
        padding-top: 12px;
    }
}
</style>
