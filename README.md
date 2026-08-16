# Site V-Pays Permis

Site vitrine de **V-Pays Permis**, auto-moto-école agréée à Villeneuve-le-Roi
(94) — agrément préfectoral E2609400180, exploitée par la SAS LDJI Corp.

Site statique : HTML, CSS et JavaScript natif, sans dépendance ni étape de
build. Le contenu de ce dépôt est déployé tel quel dans `public_html`.

## Déploiement

Déploiement Git natif d'Hostinger : hPanel → *Sites web* → *Tableau de bord* →
*Avancé* → *Git*. Branche `main`, répertoire de destination `public_html`.
Chaque `git push` sur `main` déclenche un déploiement via le webhook.

## Aperçu local

```bash
python3 -m http.server 8000    # puis http://localhost:8000
```

## Sources et documentation

Le dépôt de travail (documentation, données client, journal des décisions) est
séparé et n'est pas publié.
