/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Card :title="selectedLanguage">
        <Form>
            <FormGroup>
                <TextField
                    v-model="nameValue"
                    solid
                    regular
                    label="Category name"
                    :disabled="!isUserAllowedToUpdate"
                    :error-messages="errorNameMessage" />
            </FormGroup>
        </Form>
    </Card>
</template>

<script>
import errorValidationMixin from '~/mixins/validations/errorValidationMixin';
import translationCardMixin from '~/mixins/card/translationCardMixin';
import TextField from '~/core/components/Inputs/TextField';
import Card from '~/core/components/Card/Card';
import FormGroup from '~/core/components/Form/FormGroup';
import Form from '~/core/components/Form/Form';

export default {
    name: 'CategoryTranslationForm',
    mixins: [errorValidationMixin, translationCardMixin],
    components: {
        Form,
        FormGroup,
        Card,
        TextField,
    },
    computed: {
        nameValue: {
            get() {
                return this.translations.name[this.languageCode];
            },
            set(newName) {
                const nameIndex = 'name';
                this.setTranslationPropertyValue(newName, nameIndex);
            },
        },
        isUserAllowedToUpdate() {
            return this.$hasAccess(['CATEGORY_UPDATE']);
        },
        errorNameMessage() {
            const nameIndex = `name_${this.languageCode}`;
            return this.elementIsValidate(nameIndex);
        },
    },
};
</script>
