/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import { Pages, Tabs, Icons } from './config/imports';
import Privileges from './config/privileges';

export default {
    name: '@ergo/status-transitions',
    type: 'page',
    moduleRelations: [
        '@ergo/conditions',
        '@ergo/product-statuses',
    ],
    privileges: Privileges,
    nuxt: {
        aliases: {
            '@Transitions': '/',
        },
    },
    router: [
        {
            name: 'status-transitions',
            path: '/status-transitions',
            component: Pages.StatusTransitions,
            meta: {
                access: true,
                title: 'Status transitions',
                group: {
                    title: 'Workflow',
                    menuPosition: 7,
                    icon: Icons.Flow,
                },
                isMenu: true,
                menuPosition: 2,
                privileges: {
                    namespace: Privileges.WORKFLOW.namespace,
                    read: Privileges.WORKFLOW.read,
                },
                redirectTo: 'status-transitions-grid',
            },
            children: [
                {
                    name: 'status-transitions-grid',
                    path: 'grid',
                    component: Tabs.TransitionsGridTab,
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
            name: 'transition-edit-source-destination',
            path: '/status-transitions/transition/edit/:id',
            component: Pages.StatusTransitionEdit,
            meta: {
                isMenu: false,
                redirectTo: 'transition-edit-id-general',
            },
            children: [
                {
                    name: 'transition-edit-id-general',
                    path: 'general',
                    component: Tabs.StatusTransitionBaseTab,
                    meta: {
                        title: 'General options',
                        breadcrumbs: [
                            {
                                title: 'Workflow',
                                icon: Icons.Flow,
                            },
                            {
                                title: 'Status transitions',
                                routePath: '/status-transitions',
                            },
                        ],
                        privileges: [],
                    },
                },
                {
                    name: 'transition-edit-id-designer',
                    path: 'designer',
                    component: Tabs.ConditionSetDesignTab,
                    meta: {
                        title: 'Designer',
                        breadcrumbs: [
                            {
                                title: 'Workflow',
                                icon: Icons.Flow,
                            },
                            {
                                title: 'Status transitions',
                                routePath: '/status-transitions',
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
            directory: 'transitions',
            name: 'transitions',
        },
    ],
};