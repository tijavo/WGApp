
<script>
import { useLoadingStore } from '@/stores/loading';
import ProgressSpinner from 'primevue/progressspinner';
import Cookies from 'js-cookie';
export default {
    name: 'BottomNav',
    components: {
        ProgressSpinner
    },
    data() {
        return {
            // Pfad zu deinem PNG Icon - ersetze durch deinen eigenen Pfad
            centerIcon: '/images/BungerLogo.png',

            // Linke Navigation Items
            leftNavItems: [
                { name: 'putzen', label: 'Putzen', icon: 'pi-home', route: '/putzplan' },
            ],

            // Rechte Navigation Items
            rightNavItems: [
                { name: 'Money', label: 'Money', icon: 'pi-shopping-cart', route: '/money' },
            ],

            loadingStore: useLoadingStore() // Store für Ladezustände
        }
    },

    computed: {
        currentRoute() {
            return this.$route.path
        }
    },

    methods: {
        navigateTo(routePath) {
            this.$router.push(routePath)
        },

        onCenterIconClick() {
            // Hier kannst du definieren was beim Klick auf das mittlere Icon passiert
            // z.B. zur Hauptseite navigieren oder ein Modal öffnen
            this.$router.push('/')
            // oder
            // this.$emit('center-icon-clicked')
        }
    },
    mounted() {
        if (Cookies.get('authToken')) {
            this.rightNavItems = [
                { name: 'Money', label: 'Money', icon: 'pi-shopping-cart', route: '/money' },
                { name: 'Quittungen', label: 'Quittungen', icon: 'pi-list', route: '/quittungen' },
            ];
        }
    }
}
</script>

<template>
    <div class="bottom-nav">
        <nav class="bottom-nav__container">
            <!-- Linke Navigation Buttons -->
            <button v-for="item in leftNavItems" :key="item.name" @click="navigateTo(item.route)" :class="[
                'bottom-nav__item',
                { 'bottom-nav__item--active': currentRoute === item.route }
            ]">
                <div class="bottom-nav__icon">
                    <i class="pi" :class="item.icon"></i>
                </div>
                <span class="bottom-nav__label">{{ item.label }}</span>
            </button>

            <!-- Mittleres Logo/Icon -->
            <div class="bottom-nav__center">
                <div class="bottom-nav__center-background">
                <Transition name="fade" mode="out-in">
                    <img v-if="!loadingStore.isLoading" :src="centerIcon" alt="Logo" class="bottom-nav__center-icon" @click="onCenterIconClick" key="logo" />
                    <ProgressSpinner v-else strokeWidth="8" fill="transparent" class="bottom-nav__center-icon" aria-label="Custom ProgressSpinner" key="spinner" />
                </Transition>

                </div>
            </div>

            <!-- Rechte Navigation Buttons -->
            <button v-for="item in rightNavItems" :key="item.name" @click="navigateTo(item.route)" :class="[
                'bottom-nav__item',
                { 'bottom-nav__item--active': currentRoute === item.route }
            ]">
                <div class="bottom-nav__icon">
                    <i class="pi" :class="item.icon"></i>
                </div>
                <span class="bottom-nav__label">{{ item.label }}</span>
            </button>
        </nav>
    </div>
</template>

<style scoped>
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-top: 1px solid var(--color-border);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--color-background-soft);
    /* Für iPhone mit Home Indicator */
}

.bottom-nav__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 10px;
}

.bottom-nav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    min-width: 60px;
    transition: all 0.2s ease;
    color: var(--color-text-contrast);
    text-decoration: none;
    flex: 1;
}

.bottom-nav__item:hover {
    background-color: var(--color-background-mute);
    border-radius: 12px;
}

.bottom-nav__item--active {
    color: var(--color-text-contrast-active);
}

.bottom-nav__icon {
    width: 24px;
    height: 24px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bottom-nav__icon svg {
    width: 100%;
    height: 100%;
}

.bottom-nav__label {
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
}

.bottom-nav__center {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    cursor: pointer;
    position: relative;
    transform: translateY(-15px);
    /* Lässt das Icon nach oben herausragen */
}

.bottom-nav__center-background {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--color-background);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 3px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.bottom-nav__center-icon {
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    object-fit: contain;
    border-radius: 50%;
    transition: transform 0.2s ease;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
}

/* Smooth fade transition für Loading States */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0.8) rotate(180deg);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.8) rotate(180deg);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}



/* Sehr kleine Bildschirme */
@media (max-width: 320px) {
    .bottom-nav__container {
        height: 65px;
        padding: 0 5px;
    }

    .bottom-nav__label {
        font-size: 9px;
    }

    .bottom-nav__icon {
        width: 20px;
        height: 20px;
    }

    .bottom-nav__center {
        padding: 0 15px;
        transform: translateY(-12px);
    }

    .bottom-nav__center-icon {
        width: calc(100% - 12px);
        height: calc(100% - 12px);
    }

    .bottom-nav__center-background {
        width: 50px;
        height: 50px;
    }
}
</style>