<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { RouterLink } from 'vue-router';
import { authState, signInWithGoogle } from '../services/auth.service';

const isSubmitting = shallowRef(false);
const errorMessage = shallowRef('');

const user = computed(() => authState.currentUser.value);

const loginWithGoogle = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    await signInWithGoogle();
  } catch (error) {
    errorMessage.value = 'No se pudo iniciar sesion con Google. Intenta de nuevo.';
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <p class="eyebrow">Guitarra</p>
      <h1>Inicia sesion para continuar</h1>
      <p class="copy">Usa tu cuenta de Google para acceder a escalas y comparaciones.</p>

      <button class="google-btn" :disabled="isSubmitting" @click="loginWithGoogle">
        <span class="google-icon" aria-hidden="true">G</span>
        <span>{{ isSubmitting ? 'Conectando...' : 'Entrar con Google' }}</span>
      </button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <p v-if="user" class="logged-in-note">
        Sesion activa como {{ user.displayName || user.email }}.
        <RouterLink to="/">Ir a la app</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px 20px 120px;
  background: radial-gradient(circle at 20% 10%, #9dd6ff 0%, transparent 50%),
    radial-gradient(circle at 85% 90%, #65d3c4 0%, transparent 45%),
    linear-gradient(145deg, #0f3855 0%, #1c7a88 100%);
}

.login-card {
  width: min(460px, 100%);
  padding: 32px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 50px rgba(5, 27, 41, 0.25);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #276d89;
  font-weight: 700;
}

h1 {
  margin: 0;
  color: #0f2940;
}

.copy {
  margin: 10px 0 20px;
  color: #35546c;
}

.google-btn {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  color: #1d3e55;
  cursor: pointer;
  background: linear-gradient(180deg, #ffffff 0%, #eaf4ff 100%);
  box-shadow: inset 0 0 0 1px #c7dded;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  color: white;
  font-size: 0.8rem;
  background: conic-gradient(from 200deg, #34a853, #4285f4, #ea4335, #fbbc05, #34a853);
}

.error {
  margin: 12px 0 0;
  color: #b42318;
}

.logged-in-note {
  margin: 14px 0 0;
  color: #25516d;
}

.logged-in-note a {
  margin-left: 6px;
  color: #0d5a86;
  font-weight: 700;
}
</style>
