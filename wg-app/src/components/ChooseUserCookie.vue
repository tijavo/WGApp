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
        <h2>Wer bist du?</h2>
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

</style>