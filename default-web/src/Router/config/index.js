import Layer from '../Layer';

import { Index, System } from '../../View/';

export default [
    {
        path: '/',
        component: Layer.Default,
        exact: true,
        children: [
            {
                path: '/',
                component: Index,
                exact: true,
            }
        ],
        rule: undefined,
        redirect: undefined,
    },
    {
        path: '*',
        component: System.NotFound,
    }
];