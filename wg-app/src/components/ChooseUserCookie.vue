<script>
import { useUserStore } from '@/stores/user';
import Cookies from 'js-cookie';
import ChooseUser from './ChooseUser.vue'; // Import the ChooseUser component

export default {
    name: 'ChooseUserCookie',
    components: {
        ChooseUser
    },
    data() {
        return {
            preSelectedUser: null, // This can be set to a default user if needed
        };
    },
    methods: {
        selectUser(user) {
            useUserStore().setUser(user);
            Cookies.set('selectedUser', user, { expires: 60 }); // Store selected user in cookies for 7 days
        },
    },
    mounted(){
        const selectedUser = Cookies.get('selectedUser');
        if (selectedUser) {
            console.log('User from cookies:', selectedUser);
            this.$refs.chooseUser.selectUser(selectedUser);
            useUserStore().setUser(selectedUser);
        }
    }
};
</script>

<template>
    <div class="choose-user">
        <ChooseUser ref="chooseUser" @user:updated="selectUser" />
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