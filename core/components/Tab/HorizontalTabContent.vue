/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <NuxtChild
        :key="$route.name"
        class="tab-content"
        keep-alive
        v-bind="item.props" />
</template>

<script>
export default {
    name: 'HorizontalTabContent',
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
    .tab-content {
        border-top: $BORDER_1_GREY;
    }
</style>
