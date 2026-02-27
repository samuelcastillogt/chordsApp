<script setup lang="ts">
    import { onMounted, ref } from 'vue';

    type ModeResponseItem = {
        data: {
            name: string;
        };
    };

    type NoteResponseItem = {
        note: {
            american: string;
        };
    };

    const modes = ref<ModeResponseItem[]>([]);
    const notes = ref<NoteResponseItem[]>([]);
    const modo = ref("");
    const nota = ref("");
    const scale = ref<string[]>([]);
    const currentIndex = ref(0);

    import { ApiService } from '../services/api.service';
    const apiService = new ApiService();
    onMounted(() => {
        apiService.getModes().then((response) => modes.value= response);
        apiService.getNotes().then((response) => notes.value= response);
    });
    import ChordDisplay from './ChordDisplay.vue';
    
    const getScales = () => {
        currentIndex.value = 0;
        console.log(nota.value, modo.value);
        apiService.getScales(nota.value, modo.value).then((response) => {
            scale.value = response;
        });
    }

    const nextChord = () => {
        if (currentIndex.value < scale.value.length - 1) {
            currentIndex.value++;
        }
    }

    const prevChord = () => {
        if (currentIndex.value > 0) {
            currentIndex.value--;
        }
    }
</script>
<template>
    <div class="main">
        <div class="menu">
            <h1>Selecciona un modo</h1>
            <select name="mode" id="modo" v-model="modo">
                <option v-for="mode in modes" :key="mode.data.name" :value="mode.data.name">{{ mode.data.name }}</option>
            </select>

            <h1>Selecciona una nota</h1>
            <select name="note" id="nota" v-model="nota">
                <option v-for="note in notes" :key="note.note.american" :value="note.note.american">{{ note.note.american }}</option>
            </select>

            <button @click="getScales()" class="btn success">Obtener escalas</button>
        </div>

        <div>
            <div v-if="scale.length > 0" class="carousel-container">
                <button @click="prevChord" :disabled="currentIndex === 0" class="nav-btn">❮</button>
                <div class="scales-chords-api-container">
                    <ChordDisplay :chord="scale[currentIndex]!" :index="currentIndex" />
                </div>
                <button @click="nextChord" :disabled="currentIndex === scale.length - 1" class="nav-btn">❯</button>
            </div>
            <p v-else class="empty-state">Selecciona modo y nota para ver los acordes.</p>
        </div>
    </div>
</template>
<style scoped>
.main{
    background: linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(79, 128, 158, 1) 100%);
    min-height: 100vh;
    padding: 28px 20px 140px;
}
.scales-chords-api-container {
  display:flex;
  flex-direction: column;
  align-items: center;
}
img{
    width: 200px;
    height: 250px;
}
.menu{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    color: white;
}
.menu h1 {
    margin: 0;
    font-size: 1.1rem;
}
.menu select{
    padding: 10px 12px;
    margin: 0;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background-color: #e2eeee;
    font-size: 1rem;
}
.btn {
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    background: #1f8a70;
    color: white;
    font-weight: 700;
    cursor: pointer;
}
.carousel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 24px;
}
.nav-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 3rem;
    cursor: pointer;
    padding: 0 20px;
    transition: transform 0.2s;
}
.nav-btn:hover:not(:disabled) {
    transform: scale(1.2);
}
.nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
.empty-state {
    margin-top: 28px;
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
    font-size: 1rem;
}

@media (max-width: 700px) {
    .menu {
        flex-direction: column;
        align-items: stretch;
        max-width: 380px;
        margin: 0 auto;
    }

    .carousel-container {
        gap: 6px;
    }

    .nav-btn {
        font-size: 2rem;
        padding: 0 6px;
    }
}
</style>
