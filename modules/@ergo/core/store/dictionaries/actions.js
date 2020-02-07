/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import { modulesConfig } from '~/plugins/moduleLoader';
import { types } from './mutations';

export default {
    getDictionaries({ commit, rootState }) {
        const { dictionaries: modulesDictionaries } = modulesConfig;
        const { language: userLanguageCode } = rootState.authentication.user;
        const promises = modulesDictionaries.map(({ stateProp, requestPath }) => {
            const requestPromise = this.app.$axios.$get(`${userLanguageCode}${requestPath}`).then((response) => {
                commit(types.SET_CUSTOM_STATE_PROPERTY, { stateProp, value: response });
            });

            return requestPromise;
        });

        return Promise.all(promises);
    },
    getLanguagesDictionary({ commit, rootState }) {
        const { language: userLanguageCode } = rootState.authentication.user;

        return this.app.$axios.$get(`${userLanguageCode}/dictionary/languages`).then((response) => {
            commit(types.SET_CUSTOM_STATE_PROPERTY, { stateProp: 'languages', value: response });
        });
    },
    clearStorage({ commit }) {
        commit(types.CLEAR_STATE);
    },
};