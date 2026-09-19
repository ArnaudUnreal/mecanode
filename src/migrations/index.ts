import * as migration_20260919_115342_initial from './20260919_115342_initial';
import * as migration_20260919_120036_hero_et_appel_final from './20260919_120036_hero_et_appel_final';

export const migrations = [
  {
    up: migration_20260919_115342_initial.up,
    down: migration_20260919_115342_initial.down,
    name: '20260919_115342_initial',
  },
  {
    up: migration_20260919_120036_hero_et_appel_final.up,
    down: migration_20260919_120036_hero_et_appel_final.down,
    name: '20260919_120036_hero_et_appel_final'
  },
];
