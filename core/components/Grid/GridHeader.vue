/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div :class="['grid-header', {'grid-header--disabled': isFilterExists}]">
        <div class="grid-header__settings">
            <div class="grid-header__actions">
                <!--                TODO: Uncomment when mass actions are implemented-->
                <!--                <MenuButton-->
                <!--    :class="{'actions-button&#45;&#45;custom-theme': !isActionsSelected}"-->
                <!--                    title="ACTIONS"-->
                <!--      :theme="isActionsSelected ? theme.PRIMARY : theme.SECONDARY"-->
                <!--                    :size="smallSize"-->
                <!--                    :options="[]">-->
                <!--                    <template #icon="{ fillColor }">-->
                <!--                        <IconArrowDropDown :fill-color="fillColor" />-->
                <!--                    </template>-->
                <!--                </MenuButton>-->
                <Button
                    :class="{'actions-button--custom-theme': !isFiltersExpanded}"
                    :size="smallSize"
                    :theme="isFiltersExpanded ? theme.PRIMARY : theme.SECONDARY"
                    title="FILTERS"
                    @click.native="onFiltersExpand">
                    <template #prepend="{ color }">
                        <IconArrowDouble
                            :fill-color="color"
                            :state="iconExpandedState" />
                    </template>
                    <template #append>
                        <div
                            :class="[
                                'filters-number',
                                { 'filters-number--selected': isFiltersExpanded },
                            ]">
                            <NumericBadge :number="filtersNumber" />
                        </div>
                    </template>
                </Button>
            </div>
            <div class="grid-header__layout-configuration">
                <FabButton
                    :theme="theme.SECONDARY"
                    @click.native="onSelectLayout(gridLayouts.TABLE)">
                    <template #icon="{ fillColor }">
                        <IconListMedium
                            :fill-color="layout === gridLayouts.TABLE
                                ? greenColor
                                : fillColor" />
                    </template>
                </FabButton>
                <!--                TODO: Uncomment when Image layout is rdy-->
                <!--                <FabButton-->
                <!--                    :theme="theme.SECONDARY"-->
                <!--                    @click.native="onSelectLayout(gridLayouts.GRID)">-->
                <!--                    <template #icon="{ fillColor }">-->
                <!--                        <IconGrid-->
                <!--                            :fill-color="layout === gridLayouts.GRID-->
                <!--                                ? greenColor-->
                <!--                                : fillColor" />-->
                <!--                    </template>-->
                <!--                </FabButton>-->
                <FabButton
                    :theme="theme.SECONDARY"
                    @click.native="isSettingsModal = true">
                    <template #icon="{ fillColor }">
                        <IconSettings :fill-color="fillColor" />
                    </template>
                </FabButton>
            </div>
        </div>
        <ModalForm
            title="Display settings"
            :value="isSettingsModal"
            @input="onDismissSettingsModal">
            <template #body>
                <FormGroup title="Table settings">
                    <Select
                        :value="rowHeightDescription"
                        solid
                        regular
                        label="Row height"
                        :options="rowHeightsDescriptions"
                        @input="onRowHeightChange" />
                </FormGroup>
            </template>
            <template #footer>
                <Button
                    title="SAVE SETTINGS"
                    @click.native="onApplySettings" />
                <Button
                    :theme="theme.SECONDARY"
                    title="CANCEL"
                    @click.native="onDismissSettingsModal" />
            </template>
        </ModalForm>
        <GridAdvancedFiltersContainer
            v-show="isFiltersExpanded"
            @mouseOverFilters="onMouseOverFilters">
            <GridAdvancedFilter
                v-for="(filter, index) in filters"
                :key="index"
                :index="index"
                :filter="filter"
                :is-mouse-over-filters="isMouseOverFilters"
                @mouseOverFilters="onMouseOverFilters"
                @clear="onClearFilterAtIndex"
                @apply="onApplyFilter"
                @update="onUpdateFilterAtIndex"
                @remove="onRemoveFilterAtIndex"
                @insert="onInsertFilterAtIndex"
                @setGhost="onSetGhostFilterAtIndex"
                @swap="onSwapFiltersPosition"
                @drop="onDropFilterAtIndex" />
            <GridAdvancedFilterPlaceholder v-if="!filters.length" />
            <GridAdvancedFiltersRemoveAllButton
                v-show="filtersNumber"
                @click.native="onRemoveAll" />
        </GridAdvancedFiltersContainer>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SIZES, THEMES } from '~/defaults/buttons';
import { ROW_HEIGHT, GRID_LAYOUT } from '~/defaults/grid';
import { GREEN } from '~/assets/scss/_variables/_colors.scss';
import { ARROW } from '~/defaults/icons';
import { toCapitalize } from '~/model/stringWrapper';
import { getKeyByValue } from '~/model/objectWrapper';

export default {
    name: 'GridHeader',
    components: {
        ModalForm: () => import('~/core/components/Modal/ModalForm'),
        FormGroup: () => import('~/core/components/Form/FormGroup'),
        // MenuButton: () => import('~/core/components/Buttons/MenuButton'),
        NumericBadge: () => import('~/core/components/Badges/NumericBadge'),
        Button: () => import('~/core/components/Buttons/Button'),
        Select: () => import('~/core/components/Inputs/Select/Select'),
        FabButton: () => import('~/core/components/Buttons/FabButton'),
        // IconGrid: () => import('~/components/Icon/Others/IconGrid'),
        IconSettings: () => import('~/components/Icon/Actions/IconSettings'),
        IconArrowDouble: () => import('~/components/Icon/Arrows/IconArrowDouble'),
        // IconArrowDropDown: () => import('~/components/Icon/Arrows/IconArrowDropDown'),
        IconListMedium: () => import('~/components/Icon/Others/IconListMedium'),
        GridAdvancedFiltersContainer: () => import('~/core/components/Grid/AdvancedFilters/GridAdvancedFiltersContainer'),
        GridAdvancedFilter: () => import('~/core/components/Grid/AdvancedFilters/GridAdvancedFilter'),
        GridAdvancedFiltersRemoveAllButton: () => import('~/core/components/Grid/AdvancedFilters/GridAdvancedFiltersRemoveAllButton'),
        GridAdvancedFilterPlaceholder: () => import('~/core/components/Grid/AdvancedFilters/GridAdvancedFilterPlaceholder'),
    },
    props: {
        rowHeight: {
            type: Number,
            default: ROW_HEIGHT.SMALL,
        },
        isActionsSelected: {
            type: Boolean,
            default: false,
        },
        layout: {
            type: String,
            default: GRID_LAYOUT.TABLE,
        },
        filters: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isFiltersExpanded: false,
            isSettingsModal: false,
            rowHeightDescription: '',
            isMouseOverFilters: false,
        };
    },
    created() {
        this.initializeRowHeightDescription();
    },
    watch: {
        isListElementDragging() {
            this.isMouseOverFilters = false;

            if (this.isListElementDragging) {
                if (!this.isFiltersExpanded) {
                    this.isFiltersExpanded = true;
                }
                this.addGhostFilter();
            } else {
                this.removeGhostFilter();
            }
        },
    },
    computed: {
        ...mapState('draggable', {
            isListElementDragging: (state) => state.isListElementDragging,
            draggedElement: (state) => state.draggedElement,
        }),
        filtersNumber() {
            return this.filters.filter((filter) => !filter.isGhost).length;
        },
        isFilterExists() {
            const draggedElIndex = this.filters.findIndex(
                (filter) => filter.id === this.draggedElement,
            );

            return draggedElIndex !== -1;
        },
        theme() {
            return THEMES;
        },
        greenColor() {
            return GREEN;
        },
        iconExpandedState() {
            return this.isFiltersExpanded ? ARROW.UP : ARROW.DOWN;
        },
        rowHeightsDescriptions() {
            return Object.keys(ROW_HEIGHT).map((key) => toCapitalize(key.toLowerCase()));
        },
        gridLayouts() {
            return GRID_LAYOUT;
        },
        smallSize() {
            return SIZES.SMALL;
        },
    },
    methods: {
        ...mapActions('draggable', [
            'setGhostFilterIndex',
        ]),
        initializeRowHeightDescription() {
            this.rowHeightDescription = toCapitalize(
                getKeyByValue(ROW_HEIGHT, this.rowHeight).toLowerCase(),
            );
        },
        onSelectLayout(layout) {
            this.$emit('layoutChange', layout);
        },
        onFiltersExpand() {
            this.isFiltersExpanded = !this.isFiltersExpanded;
        },
        onRowHeightChange(value) {
            this.rowHeightDescription = value;
        },
        onApplySettings() {
            this.isSettingsModal = false;
            this.$emit('rowHeightChange', ROW_HEIGHT[this.rowHeightDescription.toUpperCase()]);
        },
        onDismissSettingsModal() {
            this.isSettingsModal = false;
            this.initializeRowHeightDescription();
        },
        onMouseOverFilters(isOver) {
            this.isMouseOverFilters = isOver;
        },
        onDropFilterAtIndex(payload) {
            this.$emit('dropFilter', payload);
        },
        onUpdateFilterAtIndex(payload) {
            this.$emit('updateFilter', payload);
        },
        onRemoveFilterAtIndex(index) {
            this.$emit('removeFilter', index);
        },
        onInsertFilterAtIndex(payload) {
            this.$emit('insertFilter', payload);
        },
        onClearFilterAtIndex(index) {
            this.$emit('clearFilter', index);
        },
        onSetGhostFilterAtIndex(payload) {
            this.$emit('setGhostFilter', payload);
        },
        onSwapFiltersPosition(payload) {
            this.$emit('swapFilters', payload);
        },
        onApplyFilter() {
            this.$emit('applyFilter');
        },
        onRemoveAll() {
            this.$emit('removeAllFilters');
        },
        addGhostFilter() {
            if (!this.isFilterExists) {
                const ghostIndex = 0;

                this.onInsertFilterAtIndex({
                    index: ghostIndex,
                    filter: {
                        isGhost: true,
                    },
                });
                this.setGhostFilterIndex(ghostIndex);
            }
        },
        removeGhostFilter() {
            const ghostIndex = this.filters.findIndex(
                (filter) => filter.isGhost,
            );

            if (ghostIndex !== -1 && !this.isMouseOverFilters) {
                this.onRemoveFilterAtIndex(ghostIndex);
                this.setGhostFilterIndex();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .grid-header {
        display: flex;
        flex-direction: column;
        padding-bottom: 16px;
        box-sizing: border-box;
        background-color: $WHITE;
        border-left: $BORDER_1_GREY;

        &__settings {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            padding: 16px 16px 0;
            box-sizing: border-box;
            background-color: $WHITE;
        }

        &__layout-configuration {
            display: flex;
            align-items: center;
        }

        &__actions {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 8px;
        }

        &--disabled {
            pointer-events: none;
        }
    }

    .filters-number {
        margin: 0 4px;

        &--selected {
            .primary-badge {
                background-color: $GREEN_DARK;
            }
        }
    }

    .actions-button {
        &--custom-theme {
            background-color: $WHITESMOKE;
        }
    }
</style>
