/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import { Pages, Tabs, Icons } from './config/imports';
import Privileges from './config/privileges';

export default {
    name: '@ergo/product-statuses',
    type: 'page',
    moduleRelations: [],
    privileges: Privileges,
    nuxt: {
        aliases: {
            '@Statuses': '/',
        },
    },
    router: [
        {
            name: 'product-statuses',
            path: '/product-statuses',
            component: Pages.ProductStatuses,
            meta: {
                title: 'Product statuses',
                group: {
                    title: 'Workflow',
                    menuPosition: 7,
                    icon: Icons.Flow,
                },
                isMenu: true,
                menuPosition: 1,
                privileges: {
                    namespace: Privileges.WORKFLOW.namespace,
                    read: Privileges.WORKFLOW.read,
                },
                redirectTo: 'product-statuses-grid',
            },
            children: [
                {
                    name: 'product-statuses-grid',
                    path: 'grid',
                    component: Tabs.ProductStatusGridTab,
                    meta: {
                        title: '',
                        breadcrumbs: [
                            {
                                title: 'Workflow',
                                icon: Icons.Flow,
                            },
                        ],
                        privileges: [],
                    },
                },
            ],
        },
        {
            name: 'product-status-edit-id',
            path: '/product-statuses/status/edit/:id',
            component: Pages.ProductStatusEdit,
            meta: {
                isMenu: false,
                redirectTo: 'product-status-edit-id-general',
            },
            children: [
                {
                    name: 'product-status-edit-id-general',
                    path: 'general',
                    component: Tabs.ProductStatusBaseTab,
                    meta: {
                        title: 'General options',
                        breadcrumbs: [
                            {
                                title: 'Workflow',
                                icon: Icons.Flow,
                            },
                            {
                                title: 'Product statuses',
                                routePath: '/product-statuses',
                            },
                        ],
                        privileges: [],
                    },
                },
                {
                    name: 'product-status-edit-id-general-translations',
                    path: 'translations',
                    component: Tabs.ProductStatusTranslationsTab,
                    meta: {
                        title: 'Translations',
                        breadcrumbs: [
                            {
                                title: 'Workflow',
                                icon: Icons.Flow,
                            },
                            {
                                title: 'Product statuses',
                                routePath: '/product-statuses',
                            },
                        ],
                        privileges: [],
                    },
                },
            ],
        },
    ],
    store: [
        {
            directory: 'productStatus',
            name: 'productStatus',
        },
    ],
};