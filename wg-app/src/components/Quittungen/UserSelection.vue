<script>

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';

export default {
    name: 'UserSelection',
    components: {
        IconField,
        InputIcon,
        InputText,
        Button,
        ButtonGroup,
    },
    data() {
        return {
            users: [] // This will hold the list of users
        };
    },
    methods: {
        addUser(index) {
            if (index !== undefined) {
                this.users.splice(index + 1, 0, ''); // Add a new user after the current one
            }
        },
        removeUser(index) {
            this.users.splice(index, 1);
        }
    },
    mounted() {
    }
}
</script>

<template>
    <div class="user-selection flex flex-col items-center justify-center gap-1">
        <h2>Select users</h2>
        <div v-for="(user, index) in users" :key="index" class="user-input flex flex-row items-center justify-between">
            <IconField>
                <InputIcon class="pi pi-user" />
                <InputText v-model="users[index]" placeholder="User" />
            </IconField>
            <ButtonGroup>
                <Button icon="pi pi-plus" class="p-button-success" @click="addUser(index)" />
                <Button icon="pi pi-minus" class="p-button-danger" @click="removeUser(index)" />
            </ButtonGroup>
        </div>
        
        <Button v-if="users.length < 1" icon="pi pi-plus" class="p-button-success" @click="addUser" />
    </div>
</template>

<style scoped>
.user-selection h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-heading);
}
</style>
