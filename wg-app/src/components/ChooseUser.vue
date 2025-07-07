<script>
import { useUserStore } from '@/stores/user';
import Cookies from 'js-cookie';

export default {
    name: 'ChooseUser',
    props: {
    },
    data() {
        return {
            userList: import.meta.env.VITE_USERS.split(','), // Default users if not set,
            selectedUser: useUserStore().user || null, 
        };
    },
    emits: ['user:updated'],
    methods: {
        selectUser(user) {
            useUserStore().setUser(user);
            this.selectedUser = user;
            Cookies.set('selectedUser', user, { expires: 60 }); // Store selected user in cookies for 7 days
        },
    },
    mounted(){
        const selectedUser = Cookies.get('selectedUser');
        if (selectedUser) {
            console.log('User from cookies:', selectedUser);
            useUserStore().setUser(selectedUser);
            this.selectedUser = selectedUser;
        }
    }
};
</script>

<template>
    <div class="choose-user">
        {{ userList.length > 0 ? '' : 'Keine Benutzer verfügbar, füge in der Env hinzu' }}
        <h2>Wer bist du?</h2>
        <div class="flex flex-row justify-center gap-5">
            <div v-for="user in userList" :key="user">
                <button @click="selectUser(user)" :class="[user == selectedUser ? 'selected-user-button' : '']">{{ user
                }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.choose-user {
    text-align: center;
    margin: 20px;
}

.choose-user h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: var(--color-heading);
}

.choose-user ul {
    list-style-type: none;
    padding: 0;
}

.choose-user li {
    margin: 10px 0;
}

.choose-user button {
    padding: 10px 20px;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 5px;
    cursor: pointer;
}

.choose-user button:hover {
    background-color: var(--color-background-soft);
}

.choose-user .selected-user-button {
    background-color: var(--color-text-contrast) !important;
    color: black;
}


.choose-user p {
    margin-top: 20px;
    font-size: 18px;
}
</style>