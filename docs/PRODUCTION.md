# Mise en ligne

Le site tourne sur un VPS OVHcloud, `152.228.140.107`, Ubuntu 26.04 LTS.
Adresse publique : <https://mecanode.com>.

## Ce qui tourne

| Élément | Détail |
| --- | --- |
| Application | `/srv/mecanode/app`, service systemd `mecanode`, écoute sur `127.0.0.1:3000` |
| Serveur frontal | Caddy, `/etc/caddy/Caddyfile`, certificats Let's Encrypt automatiques |
| Base | SQLite, `/srv/mecanode/app/data/mecanode.db` |
| Médias | `/srv/mecanode/app/media` |
| Sauvegardes | `/srv/mecanode/backups`, chaque nuit à 3 h 30, quatorze jours d'historique |
| Pare-feu | ufw, seuls 22, 80 et 443 sont ouverts |

## Adresses

| Nom | Comportement |
| --- | --- |
| `mecanode.com` | sert le site |
| `www.mecanode.com` | redirection permanente vers `mecanode.com` |
| `mecanode.fr` et `www.mecanode.fr` | redirection permanente vers `mecanode.com` |

Les domaines restent chez Infomaniak, seule la zone DNS pointe sur le VPS.
Les enregistrements `AAAA` ne sont pas posés : l'IPv6 du serveur n'est pas configurée.

## Déployer

Depuis un poste de développement, une fois les modifications poussées sur `main` :

```bash
# 1. Envoyer le code, sans toucher aux données ni aux médias
tar czf - --exclude=node_modules --exclude=.next --exclude=.git --exclude=data --exclude=media . \
  | ssh ubuntu@152.228.140.107 "tar xzf - -C /srv/mecanode/app"

# 2. Installer, migrer, construire, redémarrer, vérifier
ssh ubuntu@152.228.140.107 "mecanode-deploy"
```

`mecanode-deploy` refuse de continuer si une étape échoue, et affiche le code HTTP
de quatre pages après le redémarrage.

## Exploiter

```bash
# État et journaux de l'application
systemctl status mecanode
journalctl -u mecanode -n 50 -f

# État et journaux du serveur frontal
systemctl status caddy
journalctl -u caddy -n 50

# Sauvegarde immédiate
mecanode-backup

# Prochaine sauvegarde programmée
systemctl list-timers mecanode-backup
```

## Vérifier l'envoi de courriel

```bash
mecanode-smtp-test
```

Affiche le serveur et l'identité utilisés, puis soit `authentification : OK` suivi de l'envoi
d'un message vers `CONTACT_TO`, soit la raison exacte du refus. Le mot de passe n'est jamais
affiché. Après toute correction du `.env` :

```bash
sudo systemctl restart mecanode
```

Un refus `535 5.7.0 Invalid login or password` ne distingue pas un mauvais mot de passe d'un
service mail encore en cours d'activation : Infomaniak répond la même chose dans les deux cas.

## Restaurer

```bash
sudo systemctl stop mecanode
cd /srv/mecanode/app
tar xzf /srv/mecanode/backups/mecanode-AAAAMMJJ-HHMMSS.tar.gz -C /tmp
cp /tmp/mecanode.db data/mecanode.db
rsync -a --delete /tmp/media/ media/
sudo systemctl start mecanode
```

À éprouver deux fois par an, sinon la sauvegarde n'est qu'une supposition.

## Accès

- SSH par clé uniquement, mot de passe désactivé.
- En cas de perte de la clé, console KVM depuis l'espace client OVHcloud.
- `ubuntu` peut redémarrer `mecanode` et recharger `caddy` sans mot de passe, rien d'autre.

## Ce qui manque

- **SMTP** : configuré avec la boîte `webmail@mecanode.com`, vers `contact@mecanode.com`.
  En attente de l'activation du service mail du domaine chez Infomaniak, annoncée sous 24 h.
  Vérifier avec `mecanode-smtp-test`.
- **IPv6** : adresse et passerelle à configurer sur l'interface, puis enregistrements `AAAA`.
- **Intégration continue** : le déploiement est manuel, deux commandes. Une action
  GitHub peut le déclencher à chaque poussée sur `main`.
- **Sauvegarde hors site** : les archives vivent sur le même disque que le site.
  Un envoi nocturne vers un stockage objet les mettrait à l'abri d'une perte du VPS.
