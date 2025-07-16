<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLoadingStore } from '@/stores/loading';
import { Button } from 'primevue';
import UserSelection from './UserSelection.vue';
import { getGoogleApi } from '@/googleApi';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';


export default{
    name: 'Quittung',
    components: {
        Button,
        UserSelection,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    },
    data() {
        return {
            result: null,
            loadingStore: useLoadingStore(), // Store for loading states
            spreadSheetLink: '',
            sheetName: '',
            users: [], 
        }
    },
    methods: {
        getQuittung() {

            this.loadingStore.startLoading(); 
            const payload = {
                sheetName: this.sheetName,
                authToken: Cookies.get('authToken'),
                path: 'quittung'
            };
            getGoogleApi(payload).then(response => {
                    console.log('Auth:', response.data);
                    this.result = response.data; // Store the result of the authentication
                    this.spreadSheetLink = response.data.link; // Store the spreadsheet link
                    this.totalRecords = response.data.totalItems; // Update total records for pagination
                    this.loadingStore.stopLoading(); // Ladezustand stoppen
            })
            .catch(error => {
                console.error('Fehler beim Quittung holen:', error);
                this.loadingStore.stopLoading(); // Ladezustand stoppen
            });
        },
        updateUsers() {
            if (!this.sheetName) {
                console.error('Kein Sheet-Name angegeben');
                this.loadingStore.stopLoading(); // Ladezustand stoppen
                return;
            }
            if (this.users.length === 0) {
                console.error('Keine Benutzer ausgewählt');
                this.loadingStore.stopLoading(); // Ladezustand stoppen
                return;
            }
            const payload = {
                sheetName: this.sheetName,
                users: this.users,
                auth: Cookies.get('authToken')
            };
            getGoogleApi(payload).then(response => {
                console.log('Auth:', response.data);
                this.result = response.data; // Store the result of the authentication
                this.spreadSheetLink = response.data.link; // Store the spreadsheet link
                this.totalRecords = response.data.totalItems; // Update total records for pagination
                this.loadingStore.stopLoading(); // Ladezustand stoppen
            })
            .catch(error => {
                console.error('Fehler beim Quittung holen:', error);
                this.loadingStore.stopLoading(); // Ladezustand stoppen
            });
        },
        updateUsers() {
            if (!this.sheetName) {
                console.error('Kein Sheet-Name angegeben');
                return;
            }
            if (this.users.length === 0) {
                console.error('Keine Benutzer ausgewählt');
                return;
            }
            const payload = {
                sheetName: this.sheetName,
                users: this.users,
                auth: Cookies.get('authToken')
            };

        },
    },
    mounted() {
        this.sheetName = this.$route.params.name; // Get the sheet name from route params
        if (!this.sheetName) {
            console.error('Kein Sheet-Name angegeben');
            this.$router.push('/quittungen'); // Redirect to quittungen if no sheet name is provided
            return;
        }
        this.getQuittung(); // Fetch quittungen on component mount
    }
}

</script>

<template>
        <Tabs value="0"  class="putzplan flex flex-col items-center justify-center gap-5">
            <TabList>
                <Tab value="0">Quittung</Tab>
                <Tab value="1">Users</Tab>
                <Tab value="2">Debt</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <div class="">
                        <h1 class="quittung-header"><a :href="spreadSheetLink" target="_blank" rel="noopener noreferrer">{{ sheetName }}</a></h1>
                        <div v-if="!result || result.status === 'error'" class="flex flex-col items-center justify-center gap-5">
                            <p>{{ loadingStore.isLoading ? 'Lade...' : 'Keine Items gefunden.' }}</p>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center w-full">
                            <div v-for="(items, index) in result.data" :key="index" class="quittung-item w-full">
                                <div class="flex flex-row items-center justify-between">
                                    <div class="quittung-details">
                                        <span>{{items.count}}x {{ items.name }}</span>
                                    </div>
                                    <div class="quittung-amount">
                                        {{ items.price }} €
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="1" class="flex flex-col items-center justify-center gap-2">
                    <UserSelection :users="users"/>
                    <Button label="Save Users" class="p-button-success" @click="updateUsers" />
                </TabPanel>
                <TabPanel value="2">
                    <p class="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabPanels>
        </Tabs>
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