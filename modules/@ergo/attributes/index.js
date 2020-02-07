/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import { Pages, Tabs, Icons } from './config/imports';
import Privileges from './config/privileges';

export default {
    name: '@ergo/attributes',
    type: 'page',
    moduleRelations: [],
    privileges: Privileges,
    nuxt: {
        aliases: {
            '@Attributes': '/',
        },
    },
    dictionaries: [
        {
            stateProp: 'currencies',
            dataFormat: {},
            requestPath: '/dictionary/currencies',
        },
        {
            stateProp: 'units',
            dataFormat: {},
            requestPath: '/dictionary/units',
        },
        {
            stateProp: 'dateFormats',
            dataFormat: {},
            requestPath: '/dictionary/date_format',
        },
        {
            stateProp: 'attrTypes',
            dataFormat: {},
            requestPath: '/dictionary/attributes/types',
        },
    ],
    router: [
        {
            name: 'attributes',
            path: '/attributes',
            component: Pages.Attributes,
            meta: {
                access: true,
                title: 'Attributes',
                group: {
                    title: 'Product design',
                    menuPosition: 3,
                    icon: Icons.Templates,
                },
                isMenu: true,
                menuPosition: 1,
                privileges: {
                    namespace: Privileges.ATTRIBUTE.namespace,
                    read: Privileges.ATTRIBUTE.read,
                },
                redirectTo: 'attributes-grid',
            },
            children: [
                {
                    name: 'attributes-grid',
                    path: 'grid',
                    component: Tabs.AttributeGridTab,
                    meta: {
                        title: '',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                        ],
                        privileges: [],
                    },
                },
            ],
        },
        {
            name: 'attribute-edit-id',
            path: '/attributes/attribute/edit/:id',
            component: Pages.AttributeEdit,
            meta: {
                isMenu: false,
                redirectTo: 'attribute-edit-id-general',
            },
            children: [
                {
                    name: 'attribute-edit-id-general',
                    path: 'general',
                    component: Tabs.AttributeBaseTab,
                    meta: {
                        title: 'General options',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                            {
                                title: 'Attributes',
                                routePath: '/attributes',
                            },
                        ],
                        privileges: [],
                    },
                },
                {
                    name: 'attribute-edit-id-translations',
                    path: 'translations',
                    component: Tabs.AttributeTranslationsTab,
                    meta: {
                        title: 'Translations',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                            {
                                title: 'Attributes',
                                routePath: '/attributes',
                            },
                        ],
                        privileges: [],
                    },
                },
            ],
        },
        {
            name: 'attribute-groups',
            path: '/attribute-groups',
            component: Pages.AttributeGroups,
            meta: {
                access: true,
                title: 'Attribute groups',
                group: {
                    title: 'Product design',
                    menuPosition: 3,
                    icon: Icons.Templates,
                },
                isMenu: true,
                menuPosition: 2,
                privileges: {
                    namespace: Privileges.ATTRIBUTE_GROUP.namespace,
                    read: Privileges.ATTRIBUTE_GROUP.read,
                },
                redirectTo: 'attribute-groups-grid',
            },
            children: [
                {
                    name: 'attribute-groups-grid',
                    path: 'grid',
                    component: Tabs.AttributeGroupGridTab,
                    meta: {
                        title: '',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                        ],
                        privileges: [],
                    },
                },
            ],
        },
        {
            name: 'attribute-group-edit-id',
            path: '/attribute-groups/group/edit/:id',
            component: Pages.AttributeGroupEdit,
            meta: {
                isMenu: false,
                redirectTo: 'attribute-group-edit-id-general',
            },
            children: [
                {
                    name: 'attribute-group-edit-id-general',
                    path: 'general',
                    component: Tabs.AttributeGroupBaseTab,
                    meta: {
                        title: 'General options',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                            {
                                title: 'Attribute groups',
                                routePath: '/attribute-groups',
                            },
                        ],
                        privileges: [],
                    },
                },
                {
                    name: 'attribute-group-edit-id-translations',
                    path: 'translations',
                    component: Tabs.AttributeGroupTranslationsTab,
                    meta: {
                        title: 'Translations',
                        breadcrumbs: [
                            {
                                title: 'Product design',
                                icon: Icons.Templates,
                            },
                            {
                                title: 'Attribute groups',
                                routePath: '/attribute-groups',
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
            directory: 'attribute',
            name: 'attribute',
        },
        {
            directory: 'attributeGroup',
            name: 'attributeGroup',
        },
    ],
};