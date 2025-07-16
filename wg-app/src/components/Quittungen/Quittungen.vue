<script>
import axios, { spread } from 'axios';
import Cookies from 'js-cookie';
import { useLoadingStore } from '@/stores/loading';
import { Button } from 'primevue';
import Paginator from 'primevue/paginator';

export default{
    name: 'Quittungen',
    components: {
        Button,
        Paginator
    },
    data() {
        return {
            result: null,
            loadingStore: useLoadingStore(), // Store for loading states
            spreadSheetLink: '',
            totalRecords: 0,
            page: 1, // Current page for pagination
            rows: 5 // Number of rows per page
        }
    },
    methods: {
        getPage(e){
            this.page = e.page +1; // PrimeVue paginator uses 0-based index, so we add 1
            console.log('Page changed', e);
            this.getQuittungen(); // Fetch quittungen for the new page
            this.result = null; // Reset result for new page
        },
        getQuittungen() {

            this.loadingStore.startLoading(); 
            axios.get(import.meta.env.VITE_GOOGLE_BACKEND_URL + '?path=quittungen&page=' + this.page + '&pageSize=' + this.rows + '&authToken=' +encodeURIComponent(Cookies.get('authToken'))).then(response => {
                    console.log('Auth:', response.data);
                    this.result = response.data; // Store the result of the authentication
                    this.spreadSheetLink = response.data.link; // Store the spreadsheet link
                    this.totalRecords = response.data.totalItems; // Update total records for pagination
                    this.loadingStore.stopLoading(); // Ladezustand stoppen
            })
            .catch(error => {
                console.error('Fehler beim Authentifizieren:', error);
                this.loadingStore.stopLoading(); // Ladezustand stoppen
            });
        },
        routeToQuittung(name) {
            this.$router.push({ name: 'quittung', params: { name } }); // Navigate to the quittung component with the name as a parameter
        }
    },
    mounted() {
        this.getQuittungen(); // Fetch quittungen on component mount
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center pb-20 gap-5">
        <div class="putzplan flex flex-col items-center justify-center gap-5">
            <h1 class="quittung-header"><a :href="spreadSheetLink" target="_blank" rel="noopener noreferrer">Quittungen</a></h1>
            <div v-if="!result || result.status === 'error'" class="flex flex-col items-center justify-center gap-5">
                <p>{{ loadingStore.isLoading ? 'Lade...' : 'Keine Quittungen gefunden.' }}</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center w-full">
                <div @click="routeToQuittung(quittung.name)" v-for="(quittung, index) in result.data" :key="index" class="quittung-item w-full">
                    <div class="flex flex-row items-center justify-between">
                        <div class="quittung-details">
                            <h2>{{ quittung.name }}</h2>
                            <p>{{ quittung.itemCount }} Items</p>
                        </div>
                        <div class="quittung-amount">
                            {{ quittung.amount }} €
                        </div>
                    </div>
                </div>
            </div>
            <paginator :rows="5" :totalRecords="totalRecords" :pageLinkSize="3" class="" template="PrevPageLink PageLinks NextPageLink"
                @page="getPage" />
        </div>
    </div>
</template>

<style scoped>

.quittung-item {
    border: 1px solid var(--color-border);
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    background-color: var(--color-background);
}

.quittung-item h2 {
    margin: 0;
    font-size: 1.25rem;
}

.quittung-header {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-heading);
    padding-bottom: 0px;
}

.quittung-header a {
    color: var(--color-text-contrast);
    text-decoration: none;
}

.quittung-header a:hover {
    text-decoration: underline;
}

.putzplan{
    width: 250px;
}

.quittung-amount {
    font-weight: bold;
    color: var(--color-text-contrast);
    text-wrap: nowrap;
}
</style>