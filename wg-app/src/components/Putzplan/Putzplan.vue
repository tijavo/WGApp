<script>
import DatePicker from 'primevue/datepicker';
import Listbox from 'primevue/listbox';
import Button from 'primevue/button';

import axios from 'axios';
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user';

export default {
    name: 'Putzplan',
    components: {
        DatePicker,
        Listbox,
        Button
    },
    data() {
        return {
            date: new Date(),
            itemsToClean: [], // Hier können die Putzplan-Items Möglichkeiten gespeichert werden
            cleanedItems: [], // Hier können die ausgewählten Items gespeichert werden
            loadingStore: useLoadingStore(), // Store für Ladezustände
            spreadSheetLink: ''
        };
    },
    methods: {
        formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() ist 0-basiert
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        postMessage() {

            if (this.cleanedItems.length === 0) {
                console.error('Keine Items ausgewählt');
                return;
            }
            const user = useUserStore().user;
            if (!user) {
                console.error('Kein Benutzer ausgewählt');
                return;
            }
            const payload = {
                path: 'putzplanItems',
                date: this.formatDate(this.date), // Formatieren des Datums
                cleanedItems: this.cleanedItems.map(item => item.name), // Nur die Namen der Items senden
                user: user,
                debug: false
            };
            const url= import.meta.env.VITE_GOOGLE_BACKEND_URL;
            console.log('Payload zum Senden:', payload);
            console.log('Sende Daten an URL:', url);
            this.loadingStore.startLoading(); // Ladezustand starten
            axios.post(import.meta.env.VITE_GOOGLE_BACKEND_URL, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(response => {
                    console.log('Putzplan erfolgreich aktualisiert:', response.data);
                    this.getPutzplanItems(); // Putzplan-Items neu laden
                })
                .catch(error => {
                    console.error('Fehler beim Aktualisieren des Putzplans:', error);
                    this.loadingStore.stopLoading(); // Ladezustand stoppen
                });
        },
        getPutzplanItems() {
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
                this.spreadSheetLink = response.data.link; // Link zum Spreadsheet speichern
                // Hier kannst du den Putzplan weiterverarbeiten
            }).catch(error => {
                console.error('Fehler beim Laden des Putzplans:', error);
                this.loadingStore.stopLoading();
            });
        }
    },
    mounted() {
        this.getPutzplanItems(); // Putzplan-Items beim Laden der Komponente abrufen
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <div class="putzplan flex flex-col items-center justify-center gap-5">
            <h1 class="putzplan-header"><a :href="spreadSheetLink" target="_blank" rel="noopener noreferrer">Putzplan</a></h1>
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
            <Button label="Putzplan aktualisieren" class="p-button-outlined w-full border" @click="postMessage" :disabled="loadingStore.isLoading"/>
        </div>
    </div>
</template>

<style scoped>
.putzplan-header {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-heading);
    padding-bottom: 0px;
}

.putzplan-header a {
    color: var(--color-text-contrast);
    text-decoration: none;
}

.putzplan-header a:hover {
    text-decoration: underline;
}

.putzplan{
    width: 250px;
}
</style>