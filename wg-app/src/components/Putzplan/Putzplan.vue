<script>
import DatePicker from 'primevue/datepicker';
import axios from 'axios';

export default {
    name: 'Putzplan',
    components: {
        DatePicker
    },
    data() {
        return {
            date: new Date(),
        };
    },
    methods: {
        // Hier können Methoden für den Putzplan definiert werden
    },
    mounted() {
        const DATA = {
            // Ihre Daten hier
            path: 'getPutzplan',
            // weitere Daten falls nötig
        };

        axios.get(import.meta.env.VITE_GOOGLE_BACKEND_URL + '?path=putzplanItems').then(response => {
            console.log('Putzplan geladen:', response.data);
            // Hier kannst du den Putzplan weiterverarbeiten
        }).catch(error => {
            console.error('Fehler beim Laden des Putzplans:', error);
        });
    }
};
</script>

<template>
    <div class="putzplan flex flex-col items-center justify-center gap-5 p-5">
        <h1 class="putzplan-header">Putzplan</h1>
        <div>
            <label for="date">Wähle ein Datum:</label>
            <DatePicker v-model="date" showIcon fluid :showOnFocus="false" />
        </div>

    </div>
</template>

<style scoped>
.putzplan-header {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-heading);
}
</style>