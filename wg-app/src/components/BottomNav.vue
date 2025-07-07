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
                <img :src="centerIcon" alt="Logo" class="bottom-nav__center-icon" @click="onCenterIconClick" />
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

<script>

export default {
    name: 'BottomNav',
    data() {
        return {
            // Pfad zu deinem PNG Icon - ersetze durch deinen eigenen Pfad
            centerIcon: '/src/assets/BungerLogo.png',

            // Linke Navigation Items
            leftNavItems: [
                { name: 'putzen', label: 'Putzen', icon: 'pi-home', route: '/putzplan' },
            ],

            // Rechte Navigation Items
            rightNavItems: [
                { name: 'Money', label: 'Money', icon: 'pi-shopping-cart', route: '/money' },
            ]
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
    }
}
</script>

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

.bottom-nav__center-icon {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 50%;
    transition: transform 0.2s ease;
    background: var(--color-background);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 3px solid var(--color-border);
    padding: 8px;
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
        width: 50px;
        height: 50px;
        padding: 6px;
    }
}
</style>