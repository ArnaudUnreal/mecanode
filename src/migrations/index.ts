import * as migration_20260919_115342_initial from './20260919_115342_initial';
import * as migration_20260919_120036_hero_et_appel_final from './20260919_120036_hero_et_appel_final';
import * as migration_20260919_122645_profil from './20260919_122645_profil';
import * as migration_20260919_125159_badge_profil from './20260919_125159_badge_profil';

export const migrations = [
  {
    up: migration_20260919_115342_initial.up,
    down: migration_20260919_115342_initial.down,
    name: '20260919_115342_initial',
  },
  {
    up: migration_20260919_120036_hero_et_appel_final.up,
    down: migration_20260919_120036_hero_et_appel_final.down,
    name: '20260919_120036_hero_et_appel_final',
  },
  {
    up: migration_20260919_122645_profil.up,
    down: migration_20260919_122645_profil.down,
    name: '20260919_122645_profil',
  },
  {
    up: migration_20260919_125159_badge_profil.up,
    down: migration_20260919_125159_badge_profil.down,
    name: '20260919_125159_badge_profil'
  },
];
