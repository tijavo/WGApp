<script setup>
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue';
import ChooseUserCookie from './components/ChooseUserCookie.vue';

import { computed } from 'vue';
const route = useRoute();
const pathname = computed(() => route.path);


</script>

<template>

  <main class="main-content">
    <ChooseUserCookie v-if="['/putzplan','/','/money'].includes(pathname)" />
    <RouterView />
    <BottomNav></BottomNav>
  </main>

</template>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-background);
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
