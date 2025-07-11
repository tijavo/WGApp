<script>
import { useLoadingStore } from '@/stores/loading';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

import { DatePicker } from 'primevue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';

export default {
    name: 'Ausgaben',
    components: {
        DatePicker,
        Button,
        InputNumber,
        InputText,
        FloatLabel
    },
    data() {
        return {
            date: new Date(), // Default to the current date
            desciption: '', // To store the description of the expense
            amount: null, // To store the amount of the expense


            loadingStore: useLoadingStore(), // Store for loading states
            userStore: useUserStore(), // Store for user data
            result: null // To store the result of the post request
        };
    },
    methods: {
        postAusgaben() {
            console.log('Posting expenses for date:', this.date);
            // Format the date to DD.MM.YYYY
            const formattedDate = `${String(this.date.getDate()).padStart(2, '0')}.${String(this.date.getMonth() + 1).padStart(2, '0')}.${this.date.getFullYear()}`;
            const payload = {
                'date': formattedDate,
                'user': this.userStore.user, // Get the current user from the store
                'path': 'insertAusgaben',
                'description': this.desciption, // Description of the expense
                'amount': this.amount, // Amount of the expense
            };
            console.log('Payload to send:', payload);
            this.loadingStore.startLoading(); // Start loading state
            axios.post(import.meta.env.VITE_GOOGLE_BACKEND_URL, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(response => {
                console.log('Expenses successfully posted:', response.data);
                this.result = response.data; // Store the result
                this.loadingStore.stopLoading(); // Stop loading state
            }).catch(error => {
                console.error('Error posting expenses:', error);
                this.loadingStore.stopLoading(); // Stop loading state
            });
        },
    },
    computed: {
        // Computed property to disable the button if any field is empty or loading
        disabledButton() {
            return !this.amount || !this.desciption || !this.date || this.loadingStore.isLoading;
        }
    },
};

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-6 px-5 pb-20">
         <div v-if="result" class="alert alert-success">
                <div v-if="result.status === 'error'" class="text-red-400">
                    <p>Error inserting Row: {{ result.message }}</p>
                </div>
                <div v-else class="green">
                    <p>{{result.message}}</p>
                </div>
            </div>
        <DatePicker v-model="date" dateFormat="dd.mm.yy" iconDisplay="input" showIcon class="w-full"/>
        <FloatLabel class="w-full">
            <InputText id="description" v-model="desciption" class="w-full"/>
            <label for="description">Description</label>
        </FloatLabel>
        <FloatLabel class="w-full">
            <InputNumber v-model="amount" mode="currency" currency="EUR" class="w-full" inputId="amount"/>
            <label for="amount">Preis</label>
        </FloatLabel>
        <Button label="Ausgaben eintragen" @click="postAusgaben" class="w-full p-button-outlined border" :disabled="disabledButton"/>
    </div>
</template>

<style scoped>

</style>