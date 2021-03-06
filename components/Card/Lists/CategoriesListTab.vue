/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <VerticalTabBarListWrapper>
        <ListSearchHeader
            header="Categories"
            :is-expanded="isExpanded"
            @expand="onExpand"
            @searchResult="onSearch" />
        <CategoriesList :language-code="userLanguageCode" />
        <div class="add-fab-button">
            <FabButton
                :disabled="!$hasAccess(['CATEGORY_CREATE'])"
                @click.native="addCategory">
                <template #icon="{ fillColor }">
                    <IconAdd :fill-color="fillColor" />
                </template>
            </FabButton>
        </div>
    </VerticalTabBarListWrapper>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
    WHITE,
} from '~/assets/scss/_variables/_colors.scss';

export default {
    name: 'CategoriesListTab',
    components: {
        VerticalTabBarListWrapper: () => import('~/core/components/Tab/VerticalTabBarListWrapper'),
        ListSearchHeader: () => import('~/core/components/List/ListSearchHeader'),
        CategoriesList: () => import('~/components/List/Categories/CategoriesList'),
        IconAdd: () => import('~/components/Icon/Actions/IconAdd'),
        FabButton: () => import('~/core/components/Buttons/FabButton'),
    },
    props: {
        isExpanded: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapState('authentication', {
            userLanguageCode: (state) => state.user.language,
        }),
        whiteColor() {
            return WHITE;
        },
    },
    methods: {
        ...mapActions('list', [
            'setFilter',
            'getElements',
        ]),
        onExpand(isExpanded) {
            this.$emit('expand', isExpanded);
        },
        onSearch(value) {
            this.setFilter(value);
            this.getElements({
                listType: 'categories',
                languageCode: this.userLanguageCode,
            });
        },
        addCategory() {
            this.$router.push({ name: 'category-new-general' });
        },
    },
};
</script>

<style lang="scss" scoped>
    .add-fab-button {
        position: absolute;
        bottom: 12px;
        right: 12px;
    }
</style>
