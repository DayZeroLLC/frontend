/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Page>
        <TitleBar
            :title="title"
            :is-navigation-back="true"
            :is-read-only="$isReadOnly('TEMPLATE_DESIGNER')"
            @navigateBack="onDismiss">
            <template
                v-if="isEdit"
                #mainAction>
                <Button
                    :theme="secondaryTheme"
                    :size="smallSize"
                    title="REMOVE TEMPLATE"
                    :disabled="!$hasAccess(['TEMPLATE_DESIGNER_DELETE'])"
                    @click.native="onRemove">
                    <template #prepend="{ color }">
                        <IconDelete
                            :fill-color="color" />
                    </template>
                </Button>
            </template>
        </TitleBar>
        <HorizontalTabBar :items="tabs" />
        <Footer>
            <Button
                :title="isEdit ? 'SAVE TEMPLATE' : 'CREATE TEMPLATE'"
                :disabled="$isLoading('footerButton')"
                @click.native="onUpdate" />
        </Footer>
        <TrashCan v-show="draggedElementOnGrid" />
    </Page>
</template>

<script>
import { mapState } from 'vuex';
import { SIZES, THEMES } from '~/defaults/buttons';
import { getNestedTabRoutes } from '~/model/navigation/tabs';
import categoryManagementPageBaseMixin from '~/mixins/page/categoryManagementPageBaseMixin';

export default {
    name: 'TemplatePage',
    mixins: [categoryManagementPageBaseMixin],
    components: {
        TrashCan: () => import('~/components/DragAndDrop/TrashCan'),
    },
    computed: {
        ...mapState('draggable', {
            draggedElementOnGrid: (state) => state.draggedElementOnGrid,
        }),
        tabs() {
            return getNestedTabRoutes(this.$hasAccess, this.$router.options.routes, this.$route);
        },
        smallSize() {
            return SIZES.SMALL;
        },
        secondaryTheme() {
            return THEMES.SECONDARY;
        },
    },
};
</script>
