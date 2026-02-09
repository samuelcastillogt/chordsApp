<script setup lang="ts">
    import { ref } from 'vue';
    const modes = ref([]);
    const notes = ref([]);
    const modo = ref("");
    const nota = ref("");
    const scale = ref([]);
    const currentIndex = ref(0);

    import { ApiService } from '../services/api.service';
    const apiService = new ApiService();
    apiService.getModes().then((response) => modes.value= response);
    apiService.getNotes().then((response) => notes.value= response);
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
        <h1>Selecciona un tono</h1>
        <select name="mode" id="modo" v-model="modo">
            <option v-for="mode in modes" :key="mode" :value="mode.data.name">{{ mode.data.name }}</option>
        </select>
                <h1>Selecciona una nota</h1>
        <select name="note" id="nota" v-model="nota">
            <option v-for="note in notes" :key="note" :value="note.note.american">{{ note.note.american }}</option>
        </select>
        <button @click="getScales()" class="btn success">Obtener escalas</button>
    </div>
    <div>
        <div v-if="scale.length > 0" class="carousel-container">
            <button @click="prevChord" :disabled="currentIndex === 0" class="nav-btn">❮</button>
            <div id="scales-chords-api-container">
                <ChordDisplay :chord="scale[currentIndex]!" :index="currentIndex" />
            </div>
            <button @click="nextChord" :disabled="currentIndex === scale.length - 1" class="nav-btn">❯</button>
        </div>
    </div>

    </div>
</template>
<style scoped>
.main{
    background: linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(79, 128, 158, 1) 100%);
    padding: 20px;
    height: 100vh;
}
.scales-chords-api-container {
  display:flex;
  flex-direction: column;
}
img{
    width: 200px;
    height: 250px;
    }
    .menu{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        color: white
    }
    .menu select{
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        background-color: #e2eeee;
        font-size: 20px;
    }
    .carousel-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
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
</style>