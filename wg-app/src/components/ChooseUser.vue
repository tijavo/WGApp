<script>

export default {
    name: 'ChooseUser',
    data() {
        return {
            userList: import.meta.env.VITE_USERS.split(','), // Default users if not set,
            selectedUser: null, 
        };
    },
    emits: ['user:updated'],
    methods: {
        selectUser(user) {
            console.log('Selected user:', user);
            this.$emit('user:updated', user);
            this.selectedUser = user;
        },
    },
};
</script>

<template>
    <div class="choose-user">
        {{ userList.length > 0 ? '' : 'Keine Benutzer verfügbar, füge in der Env hinzu' }}
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