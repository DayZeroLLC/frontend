/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridViewTemplate>
        <template #sidebar>
            <VerticalTabBar :items="verticalTabs" />
        </template>
        <template #grid>
            <TemplateGridDesigner @rowsCount="onRowsCountChange">
                <TemplateGridDraggableLayer
                    :style="gridStyles"
                    :rows-number="maxLayoutRow"
                    :columns-number="columnsNumber"
                    :highlighted-positions="highlightedPositions"
                    @drop="updateLayoutElement">
                    <template #elements>
                        <TemplateGridPlaceholderItem v-if="!layoutElements.length" />
                        <LayoutElement
                            v-for="(element, index) in layoutElements"
                            :key="`${element.row}/${element.column}`"
                            :style="getLayoutElementPosition(element)"
                            :index="index"
                            :element="element"
                            :columns-number="columnsNumber"
                            :rows-number="maxLayoutRow"
                            :disabled="!isUserAllowedToUpdate"
                            @highlightedPositionChange="onHighlightedPositionsChange"
                            @resizingElMaxRow="onResizingElMaxRow">
                            <template #content>
                                <AttributeElementContent
                                    v-if="element.type !== 'SECTION TITLE'"
                                    :element="element"
                                    :disabled="!isUserAllowedToUpdate"
                                    :index="index" />
                                <SectionElementContent
                                    v-else
                                    :element="element"
                                    :index="index"
                                    :disabled="!isUserAllowedToUpdate"
                                    @editTitle="onEditSectionTitle" />
                            </template>
                        </LayoutElement>
                    </template>
                </TemplateGridDraggableLayer>
                <SectionTemplateModalForm
                    :value="isSectionAdded"
                    :section-position="sectionPosition"
                    :section-title="sectionTitle"
                    :section-index="sectionIndex"
                    @input="onCloseSectionModal" />
            </TemplateGridDesigner>
        </template>
    </GridViewTemplate>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getObjectWithMaxValueInArrayByObjectKey } from '~/model/arrayWrapper';
import {
    getHighlightingLayoutDropPositions,
} from '~/model/template_designer/layout/LayoutCalculations';
import TemplateGridDesigner from '~/components/Template/Base/TemplateGridDesigner';
import TemplateGridDraggableLayer from '~/components/Template/Base/TemplateGridDraggableLayer';
import GridViewTemplate from '~/core/components/Layout/Templates/GridViewTemplate';

export default {
    name: 'TemplateDesignerTab',
    components: {
        GridViewTemplate,
        TemplateGridDesigner,
        TemplateGridDraggableLayer,
        VerticalTabBar: () => import('~/core/components/Tab/VerticalTabBar'),
        SectionTemplateModalForm: () => import('~/components/Modals/SectionTemplateModalForm'),
        TemplateGridPlaceholderItem: () => import('~/components/Template/Base/TemplateGridPlaceholderItem'),
        LayoutElement: () => import('~/components/Template/ProductDesigner/LayoutElement'),
        AttributeElementContent: () => import('~/components/Template/ProductDesigner/AttributeElementContent'),
        SectionElementContent: () => import('~/components/Template/ProductDesigner/SectionElementContent'),
    },
    data() {
        return {
            highlightedPositions: [],
            isSectionAdded: false,
            sectionPosition: null,
            sectionIndex: null,
            sectionTitle: '',
            columnsNumber: 4,
            maxRow: 0,
        };
    },
    watch: {
        isListElementDragging() {
            if (this.isListElementDragging) {
                this.highlightedPositions = getHighlightingLayoutDropPositions({
                    draggedElWidth: 1,
                    draggedElHeight: 1,
                    layoutWidth: this.columnsNumber,
                    layoutHeight: this.maxLayoutRow,
                    layoutElements: this.layoutElements,
                });
            } else {
                this.highlightedPositions = [];
            }
        },
    },
    computed: {
        ...mapState('templateDesigner', {
            templateGroups: (state) => state.templateGroups,
            layoutElements: (state) => state.layoutElements,
            titleValidationError: (state) => state.titleValidationError,
            title: (state) => state.title,
        }),
        ...mapState('draggable', {
            draggedElement: (state) => state.draggedElement,
            isListElementDragging: (state) => state.isListElementDragging,
        }),
        verticalTabs() {
            return [
                {
                    title: 'Attributes',
                    component: () => import('~/components/Card/Lists/AttributesListTab'),
                    props: {
                        isSelectLanguage: false,
                        disabled: !this.$hasAccess(['TEMPLATE_DESIGNER_UPDATE']),
                    },
                    iconPath: 'Menu/IconAttributes',
                },
                {
                    title: 'Widgets',
                    component: () => import('~/components/Card/Lists/WidgetsListTab'),
                    iconPath: 'Widgets/IconWidget',
                },
            ];
        },
        isUserAllowedToUpdate() {
            return this.$hasAccess(['TEMPLATE_DESIGNER_UPDATE']);
        },
        errorMessages() {
            return this.titleValidationError ? [this.titleValidationError] : null;
        },
        gridStyles() {
            return {
                gridTemplateColumns: `repeat(${this.columnsNumber}, 1fr)`,
                gridTemplateRows: `repeat(${this.maxRow}, 62px)`,
            };
        },
        maxLayoutRow() {
            const layoutElement = getObjectWithMaxValueInArrayByObjectKey(this.layoutElements, 'row');

            if (layoutElement) {
                const { row, height } = layoutElement;

                return Math.max(this.maxRow, row + height);
            }

            return this.maxRow;
        },
    },
    methods: {
        ...mapActions('templateDesigner', [
            'setTemplateDesignerTitle',
            'addListElementToLayout',
            'updateLayoutElementPosition',
        ]),
        onResizingElMaxRow(row) {
            if (row > this.maxRow) {
                this.maxRow = row;
            }
        },
        onRowsCountChange({ value }) {
            this.maxRow = value;
        },
        onHighlightedPositionsChange(positions) {
            this.highlightedPositions = positions;
        },
        updateLayoutElement(position) {
            this.highlightedPositions = [];

            if (typeof this.draggedElement === 'object') {
                const { row, column } = position;
                const index = this.layoutElements.findIndex(
                    (el) => el.id === this.draggedElement.id,
                );

                this.updateLayoutElementPosition({ index, row, column });
            } else if (this.draggedElement === 'SECTION') {
                this.sectionPosition = position;
                this.isSectionAdded = true;
            } else {
                this.addListElementToLayout(position);
            }
        },
        onEditSectionTitle(index) {
            const { [index]: layoutElement } = this.layoutElements;
            this.sectionTitle = layoutElement.label;
            this.sectionIndex = index;
            this.isSectionAdded = true;
        },
        onCloseSectionModal() {
            this.sectionPosition = null;
            this.isSectionAdded = false;
            this.sectionTitle = '';
            this.sectionIndex = null;
        },
        getLayoutElementPosition({
            row, column, width, height,
        }) {
            return { gridArea: `${row} / ${column} / ${row + height} / ${column + width}` };
        },
    },
};
</script>

<style lang="scss" scoped>
    .template-grid {
        overflow: auto;
        border-left: $BORDER_1_GREY;
    }
</style>
