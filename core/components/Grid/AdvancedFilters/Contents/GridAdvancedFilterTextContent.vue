/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridAdvancedFilterBaseContent
        :is-empty-record="value.isEmptyRecord"
        @input="onEmptyRecordChange">
        <div class="container">
            <TextField
                :value="filterValue"
                left-alignment
                small
                underline
                @input="onValueChange" />
        </div>
    </GridAdvancedFilterBaseContent>
</template>

<script>
import TextField from '~/core/components/Inputs/TextField';
import GridAdvancedFilterBaseContent from '~/core/components/Grid/AdvancedFilters/Contents/GridAdvancedFilterBaseContent';
import { FILTER_OPERATOR } from '~/defaults/operators';

export default {
    name: 'GridAdvancedFilterTextContent',
    components: {
        TextField,
        GridAdvancedFilterBaseContent,
    },
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        filterValue() {
            if (this.value[FILTER_OPERATOR.EQUAL]) return this.value[FILTER_OPERATOR.EQUAL];

            return '';
        },
    },
    methods: {
        onValueChange(value) {
            this.$emit('input', { value, operator: FILTER_OPERATOR.EQUAL });
        },
        onEmptyRecordChange(value) {
            this.$emit('emptyRecord', value);
        },
    },
};
</script>

<style lang="scss" scoped>
    .container {
        padding: 8px 12px;
    }
</style>
