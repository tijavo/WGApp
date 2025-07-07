<script>
import DatePicker from 'primevue/datepicker';
import Listbox from 'primevue/listbox';

import axios from 'axios';
import { useLoadingStore } from '@/stores/loading'

export default {
    name: 'Putzplan',
    components: {
        DatePicker,
        Listbox
    },
    data() {
        return {
            date: new Date(),
            itemsToClean: [], // Hier können die Putzplan-Items Möglichkeiten gespeichert werden
            cleanedItems: [], // Hier können die ausgewählten Items gespeichert werden
            loadingStore: useLoadingStore() // Store für Ladezustände
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
        this.loadingStore.startLoading(); 
        axios.get(import.meta.env.VITE_GOOGLE_BACKEND_URL + '?path=putzplanItems').then(response => {
            console.log('Putzplan geladen:', response.data);
            this.loadingStore.stopLoading(); 
            this.itemsToClean = response.data.data; // Speichern der Putzplan-Items
            // Hier kannst du den Putzplan weiterverarbeiten
        }).catch(error => {
            console.error('Fehler beim Laden des Putzplans:', error);
            this.loadingStore.stopLoading();
        });
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <div class="putzplan flex flex-col items-center justify-center gap-5">
            <h1 class="putzplan-header">Putzplan</h1>
            <div class="w-full">
                <label for="date">Wähle ein Datum:</label>
                <DatePicker v-model="date" showIcon fluid :showOnFocus="false" />
            </div>
            <div class="w-full">
                <label for="items">Wähle die geputzten Dinge:</label>
                <Listbox v-model="cleanedItems" :options="itemsToClean" optionLabel="name" multiple scrollHeight="1000px" class="w-full" >
                    <template #option="{ option }">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-check" v-if="cleanedItems.includes(option)"></i>
                            <span>{{ option.name }} <a :class="[option.lastTime > option.frequency ? 'text-red-400' : 'text-green-400']">({{option.lastTime}} Tage her)</a></span>
                        </div>
                    </template>
                </Listbox>
            </div>
        </div>
    </div>
</template>

<style scoped>
.putzplan-header {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-heading);
}

.putzplan{
    width: 250px;
}
</style>