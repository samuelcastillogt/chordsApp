<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { ApiService } from './services/api.service';
import { authState, signOutUser } from './services/auth.service';

type DockItem = {
  to: string;
  label: string;
  iconPath: string;
};

const hoveredIndex = ref<number | null>(null);
const route = useRoute();

const dockItems: DockItem[] = [
  {
    to: '/',
    label: 'Escalas',
    iconPath: 'M4.5 6.75h15m-15 5.25h15m-15 5.25h15',
  },
  {
    to: '/compare',
    label: 'Comparar',
    iconPath: 'M7.5 6h9m-9 12h9M6 10.5l3 3-3 3m12-6-3 3 3 3',
  },
];

const dockScale = (index: number) => {
  if (hoveredIndex.value === null) {
    return 1;
  }

  const distance = Math.abs(hoveredIndex.value - index);
  if (distance === 0) return 1.22;
  if (distance === 1) return 1.1;
  return 1;
};

const dockLift = (index: number) => {
  if (hoveredIndex.value === null) {
    return 0;
  }
  return Math.abs(hoveredIndex.value - index) === 0 ? -8 : -3;
};

const isSigningOut = shallowRef(false);
const signOutError = shallowRef('');

const isAuthReady = computed(() => authState.authReady.value);
const currentUser = computed(() => authState.currentUser.value);
const isAuthenticated = computed(() => Boolean(currentUser.value));
const showDock = computed(() => isAuthenticated.value && route.path !== '/login');

const logout = async () => {
  signOutError.value = '';
  isSigningOut.value = true;
  try {
    await signOutUser();
    window.location.reload()
  } catch (error) {
    signOutError.value = 'No se pudo cerrar sesion.';
    console.error(error);
  } finally {
    isSigningOut.value = false;
  }
};

const apiService = new ApiService();
apiService.checkApi().then((response) => console.log('API status:', response));
</script>

<template>
  <div v-if="!isAuthReady" class="auth-loader">Comprobando sesion...</div>
  <RouterView v-else />

  <nav v-if="showDock" class="dock-shell" aria-label="Navegacion principal">
    <div class="dock">
      <RouterLink
        v-for="(item, index) in dockItems"
        :key="item.to"
        :to="item.to"
        class="dock-item"
        :style="{ transform: `translateY(${dockLift(index)}px) scale(${dockScale(index)})` }"
        @mouseenter="hoveredIndex = index"
        @focus="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        @blur="hoveredIndex = null"
      >
        <span class="dock-icon-wrap">
          <svg class="dock-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="item.iconPath" />
          </svg>
        </span>
        <span class="dock-label">{{ item.label }}</span>
      </RouterLink>

      <button
        class="dock-item dock-action"
        :style="{ transform: `translateY(${dockLift(dockItems.length)}px) scale(${dockScale(dockItems.length)})` }"
        :disabled="isSigningOut"
        @mouseenter="hoveredIndex = dockItems.length"
        @focus="hoveredIndex = dockItems.length"
        @mouseleave="hoveredIndex = null"
        @blur="hoveredIndex = null"
        @click="logout"
      >
        <span class="dock-icon-wrap dock-danger">
          <svg class="dock-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9A2.25 2.25 0 0 0 18.75 18V6A2.25 2.25 0 0 0 16.5 3.75Z" />
            <path d="M9 12h9m0 0-2.25-2.25M18 12l-2.25 2.25" />
          </svg>
        </span>
        <span class="dock-label">{{ isSigningOut ? 'Saliendo...' : 'Salir' }}</span>
      </button>
    </div>
    <p v-if="signOutError" class="auth-error">{{ signOutError }}</p>
  </nav>
</template>

<style scoped>
.auth-loader {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  color: #f8fcff;
  font-weight: 700;
  background: linear-gradient(145deg, #0f3855 0%, #1c7a88 100%);
}

.auth-error {
  position: absolute;
  bottom: 92px;
  margin: 0;
  color: #8a1e2e;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  padding: 4px 8px;
}

.dock-shell {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 14px;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 1000;
}

.dock {
  pointer-events: auto;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.28) 100%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 30px rgba(4, 21, 37, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(14px) saturate(1.2);
}

.dock-item {
  border: none;
  text-decoration: none;
  color: #16324a;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 140ms ease;
  transform-origin: bottom center;
  cursor: pointer;
  background: transparent;
}

.dock-item:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

.dock-icon-wrap {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(170deg, #f4fbff 0%, #cae9ff 100%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 14px rgba(9, 46, 74, 0.25);
}

.dock-icon {
  width: 26px;
  height: 26px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dock-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: rgba(9, 33, 54, 0.95);
}

.dock-item.router-link-active .dock-icon-wrap {
  background: linear-gradient(170deg, #dbf1ff 0%, #9fd1ff 100%);
  box-shadow: 0 10px 18px rgba(7, 47, 78, 0.32);
}

.dock-item.router-link-active::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: -2px;
  background-color: rgba(17, 73, 114, 0.9);
}

.dock-danger {
  background: linear-gradient(170deg, #ffe9ec 0%, #ffc9d1 100%);
}

@media (max-width: 620px) {
  .dock {
    width: calc(100% - 24px);
    justify-content: space-evenly;
  }

  .dock-icon-wrap {
    width: 48px;
    height: 48px;
  }
}
</style>
