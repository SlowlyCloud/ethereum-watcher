import type { INestApplication, INestApplicationContext } from '@nestjs/common';

let DEPENDENCY_CONTAINER: INestApplication;
let initialized = false;

export const setDependencyContainer = (ioc: INestApplication) => {
    if (initialized) throw new Error('dependency container is initialized');

    DEPENDENCY_CONTAINER = ioc;
    initialized = true;
};

export const getDependencyContainer = (): Pick<
    INestApplicationContext,
    'get'
> => {
    if (!initialized)
        throw new Error('dependency container is not initialized');

    return DEPENDENCY_CONTAINER;
};
