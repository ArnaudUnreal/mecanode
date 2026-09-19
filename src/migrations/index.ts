import * as migration_20260919_115342_initial from './20260919_115342_initial';

export const migrations = [
  {
    up: migration_20260919_115342_initial.up,
    down: migration_20260919_115342_initial.down,
    name: '20260919_115342_initial'
  },
];
