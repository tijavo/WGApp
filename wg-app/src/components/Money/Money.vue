<script>
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import CreateNewSheet from './CreateNewSheet.vue';
import Ausgaben from './Ausgaben.vue';
import Schulden from './Schulden.vue';

export default {
    name: 'Money',
    components: {
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        CreateNewSheet,
        Ausgaben,
        Schulden,
    },
    data() {
        return {
            // Data properties can be added here if needed
        };
    },
    methods: {
        // Methods for money management can be added here
    },
};
</script>

<template>
    <div class="flex flex-col items-center justify-center pb-20">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Ausgaben</Tab>
                <Tab value="1">Schulden</Tab>
                <Tab value="2">Create Sheet</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <Ausgaben />
                </TabPanel>
                <TabPanel value="1">
                    <Schulden />
                </TabPanel>
                <TabPanel value="2">
                    <CreateNewSheet />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>