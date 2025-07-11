<script>
import { useLoadingStore } from '@/stores/loading';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

import ChooseUser from '@/components/ChooseUser.vue';

import { DatePicker } from 'primevue';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel'; 

export default {
    name: 'Schulden',
    components: {
        DatePicker,
        Button,
        InputNumber,
        InputText,
        ChooseUser, 
        FloatLabel
    },
    data() {
        return {
            amount: null, 
            otherUser: null,
            desciption: '', 
            date: new Date(), 
            youInDebt: false,


            loadingStore: useLoadingStore(), 
            userStore: useUserStore(), 
            result: null 
        };
    },
    methods: {
        postSchulden() {
            console.log('Posting debts for date:', this.date);
            const formattedDate = `${String(this.date.getDate()).padStart(2, '0')}.${String(this.date.getMonth() + 1).padStart(2, '0')}.${this.date.getFullYear()}`;
            var payload = {
                'date': formattedDate,
                'path': 'insertSchulden',
                'description': this.desciption, 
                'amount': this.amount, 
            };
            if (this.youInDebt) {
                payload['userPaid'] = this.otherUser;
                payload['userInDebt'] = this.userStore.user; 
            } else {
                payload['userPaid'] = this.userStore.user; 
                payload['userInDebt'] = this.otherUser; 
            }

            console.log('Payload to send:', payload);
            this.loadingStore.startLoading(); 
            axios.post(import.meta.env.VITE_GOOGLE_BACKEND_URL, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(response => {
                console.log('Debts successfully posted:', response.data);
                this.result = response.data; 
                this.loadingStore.stopLoading(); 
            }).catch(error => {
                console.error('Error posting debts:', error);
                this.loadingStore.stopLoading(); 
            });
        },
        selectUser(user) {
            this.otherUser = user;
        },
    },
    computed: {
        disabledButton() {
            return !this.amount || !this.desciption || !this.otherUser || !this.date || this.loadingStore.isLoading;
        }
    },
};

</script>

<template>
    <div class="flex flex-col items-center justify-center px-5 gap-7">
        <div v-if="result" class="alert alert-success">
                <div v-if="result.status === 'error'" class="text-red-400">
                    <p>Error inserting Row: {{ result.message }}</p>
                </div>
                <div v-else class="green">
                    <p>{{result.message}}</p>
                </div>
        </div>
        <div class="flex flex-col items-center justify-center gap-1">
            <a class="UserTitle align-middle flex flex-row gap-2 items-center">
                <i @click="youInDebt = !youInDebt" class="pi pi-sync mr-5"></i>
                {{ youInDebt ? 'Wem schuldest du?' : 'Wer schuldet dir?' }}
            </a>
            <ChooseUser @user:updated="selectUser" />
        </div>
        <FloatLabel class="w-full">
            <InputNumber v-model="amount" mode="currency" currency="EUR" class="w-full" inputId="amount" />
            <label for="amount">Wieviel?</label>
        </FloatLabel>
        <FloatLabel class="w-full">
            <InputText id="desciption" v-model="desciption" class="w-full"/>
            <label for="desciption">Warum?</label>
        </FloatLabel>

        <FloatLabel class="w-full">
            <DatePicker id="date" v-model="date" dateFormat="dd.mm.yy" iconDisplay="input" showIcon class="w-full"/>
            <label for="date">Wann war das?</label>
        </FloatLabel>
        <Button label="Schulden eintragen" @click="postSchulden" class="p-button-outlined w-full border" :disabled="disabledButton"/>
    </div>
</template>

<style scoped>
.UserTitle {
    color: var(--color-heading);
    padding-bottom: 0px;
}
</style>