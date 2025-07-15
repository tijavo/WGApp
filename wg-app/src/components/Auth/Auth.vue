<script>

import { InputText } from 'primevue';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import { useLoadingStore } from '@/stores/loading';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';

export default {
    name: 'Auth',
    components: {
        InputText,
        FloatLabel,
        Button
    },
    data() {
        return {
            password: '', // To store the password input by the user
            loadingStore: useLoadingStore(), // Store for loading states
            result: null, // To store the result of the authentication,
            userStore: useUserStore() // Store for user data
        };
    },
    methods: {
        // Methods for authentication can be added here
        login() {
            const base64_encode = btoa(this.password);
            console.log('Logging in with password:', base64_encode);
            const payload = {
                path: 'auth',
                user: this.userStore.user, // Assuming user is stored in userStore
                password: base64_encode
            };
            const url= import.meta.env.VITE_GOOGLE_BACKEND_URL;
            this.loadingStore.startLoading(); // Ladezustand starten
            axios.post(import.meta.env.VITE_GOOGLE_BACKEND_URL, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'text/plain'
                }
            }).then(response => {
                    console.log('Auth:', response.data);
                    this.result = response.data; // Store the result of the authentication
                    if (response.data.status === 'success') {
                        Cookies.set('authToken', base64_encode, { expires: 30 }); 
                    }
                    this.loadingStore.stopLoading(); // Ladezustand stoppen
            })
            .catch(error => {
                console.error('Fehler beim Authentifizieren:', error);
                this.loadingStore.stopLoading(); // Ladezustand stoppen
            });
        }
    },
    mounted() {
        if(Cookies.get('authToken')) {
            console.log('User is already authenticated');
            this.result = { status: 'success', message: 'User is already authenticated' };
        } else {
            console.log('No authentication token found');
        }
    },
};

</script>

<template>
    <div class="flex flex-col items-center justify-center pb-20 gap-5">
        <h1 class="text-2xl font-bold mb-4">Authentication</h1>
        <div v-if="result" class="alert alert-success">
            <div v-if="result.status === 'failed'" class="text-red-400">
                <p>{{ result.message }}</p>
            </div>
            <div v-else class="green">
                <p>{{ result.message }}. <br> Deine Cookies speichern den Auth Token für 30 Tage</p>
            </div>
        </div>
        <FloatLabel class="w-full">
            <InputText v-model="password" type="password" class="w-full" inputId="password" />
            <label for="password">Passwort</label>
        </FloatLabel>
        <Button label="Login" @click="login" class="p-button-outlined w-full border" />
    </div>
</template>