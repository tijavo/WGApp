<script>
import { DatePicker } from 'primevue';
import Button from 'primevue/button';
import { useLoadingStore } from '@/stores/loading'
import axios from 'axios';

export default {
    name: 'CreateNewSheet',
    components: {
        DatePicker,
        Button,
    },
    data() {
        return {
            date: null, // Default to the current date
            loadingStore: useLoadingStore(), // Store for loading states
            result: null
        };
    },
    methods: {
        createSheet() {
            console.log('Sheet created for month:', this.date);
            //format to DD.MM.YYYY
            const formattedDate = `${String(this.date.getDate()).padStart(2, '0')}.${String(this.date.getMonth() + 1).padStart(2, '0')}.${this.date.getFullYear()}`;
            const payload = {
                'date': formattedDate,
                'path': 'createMoneySheet',
            }
            console.log('Payload to send:', payload);
            this.loadingStore.startLoading(); // Start loading state
            axios.post(import.meta.env.VITE_GOOGLE_BACKEND_URL, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(response => {
                console.log('Sheet successfully created:', response.data);
                this.result = response.data;
                this.loadingStore.stopLoading(); // Stop loading state
            }).catch(error => {
                console.error('Error creating sheet:', error);
                this.loadingStore.stopLoading(); // Stop loading state
            });
        },
    },
    mounted() {
        // Set the default date to the current month
        this.date = new Date();
        this.date.setDate(1); // Set to the first day of the month
    },
};

</script>

<template>
    <div class="create-new-sheet">
        <div class="flex flex-col items-center justify-center gap-5">
            <div v-if="result" class="alert alert-success">
                <div v-if="result.status === 'error'" class="text-red-400">
                    <p>Error creating sheet: {{ result.message }}</p>
                    <a v-if="result.sheetId" :href="'https://docs.google.com/spreadsheets/d/'+result.spreadsheetId +'/edit?gid=' + result.sheetId" target="_blank" rel="noopener noreferrer"> Hier geht es zum Sheet </a>
                </div>
                <div v-else class="green">
                    <p>Sheet created successfully: <br><a :href="'https://docs.google.com/spreadsheets/d/'+result.spreadsheetId +'/edit?gid=' + result.sheetId" target="_blank" rel="noopener noreferrer"> Hier geht es zum Sheet </a></p>
                </div>
            </div>
            <DatePicker v-model="date" placeholder="Monat auswählen" view="month" inline/>
            <Button label="Sheet erstellen" class="mt-3" @click="createSheet" :disabled="loadingStore.isLoading" />
        </div>
    </div>
</template>