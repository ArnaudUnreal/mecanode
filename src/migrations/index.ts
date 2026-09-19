import * as migration_20260919_115342_initial from './20260919_115342_initial';
import * as migration_20260919_120036_hero_et_appel_final from './20260919_120036_hero_et_appel_final';
import * as migration_20260919_122645_profil from './20260919_122645_profil';
import * as migration_20260919_125159_badge_profil from './20260919_125159_badge_profil';
import * as migration_20260919_133609_roles_utilisateurs from './20260919_133609_roles_utilisateurs';
import * as migration_20260919_143139_affiche_video from './20260919_143139_affiche_video';

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
    name: '20260919_125159_badge_profil',
  },
  {
    up: migration_20260919_133609_roles_utilisateurs.up,
    down: migration_20260919_133609_roles_utilisateurs.down,
    name: '20260919_133609_roles_utilisateurs',
  },
  {
    up: migration_20260919_143139_affiche_video.up,
    down: migration_20260919_143139_affiche_video.down,
    name: '20260919_143139_affiche_video'
  },
];
