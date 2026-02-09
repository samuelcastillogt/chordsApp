<script setup lang="ts">
import SideMenu from './components/sideMenu.vue';
import { ApiService } from './services/api.service';



const apiService = new ApiService();
apiService.checkApi().then((response) => console.log(response));
</script>

<template>
  <nav>
    <RouterLink to="/">Escalas </RouterLink>
    <RouterLink to="/compare">Comparar Escalas</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 2rem;
  background-color: rgba(79, 128, 158, 0.95); /* Matches the darker tone of the gradient */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

nav a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

nav a:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

nav a.router-link-active {
  color: white;
  font-weight: 700;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
</style>
