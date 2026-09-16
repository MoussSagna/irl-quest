# IRL Quest — instructions permanentes pour les agents

Ce fichier définit les règles de travail applicables à toute intervention future dans le dépôt. Le code réel reste la source de vérité finale.

## Avant toute intervention importante

1. Lire `AGENTS.md`.
2. Lire `PROJECT_CONTEXT.md`.
3. Lire `ARCHITECTURE.md`.
4. Vérifier la branche et `git status`.
5. Inspecter les fichiers réellement concernés avant de modifier.

Si la documentation contredit le code, analyser le code, signaler la divergence et mettre la documentation à jour.

## Git

- Ne jamais travailler directement sur `main`.
- Utiliser `develop` et des branches `feature/*`, `fix/*`, `refactor/*`, `test/*`, `chore/*` ou `docs/*`.
- Vérifier `git status` avant toute modification.
- Ne jamais utiliser `git reset --hard`.
- Ne jamais utiliser `git clean -fd`.
- Ne jamais utiliser `git push --force` ou `git push --force-with-lease`.
- Ne jamais écraser ou réinitialiser le travail existant.
- Préserver les modifications présentes et demander confirmation si elles entrent en conflit avec la tâche.
- Utiliser Conventional Commits en anglais.
- Préférer des commits atomiques qui regroupent une seule intention cohérente.
- Ne pas pousser sans autorisation explicite de l'utilisateur.
- Ne pas amender un commit existant sans autorisation explicite.

## Code

- Utiliser TypeScript strict et préserver la sécurité de typage.
- Respecter l'architecture et les conventions existantes avant d'ajouter une abstraction.
- Séparer UI, logique métier, accès aux données, API, validation, configuration et état.
- Préférer les composants réutilisables et les modules ciblés.
- Éviter les composants monolithiques, la duplication et la sur-ingénierie.
- Ne modifier que les parties liées à la tâche.
- Réutiliser les types, validations et helpers partagés lorsqu'ils existent.
- Ne jamais exposer de secret côté frontend ou mobile.

## Tests et validation

Toute fonctionnalité importante doit avoir des tests qui vérifient le comportement observable plutôt que l'implémentation interne.

Avant de considérer une fonctionnalité terminée, exécuter les vérifications pertinentes :

- tests ciblés puis suite complète ;
- typecheck ;
- lint ;
- build ou export lorsque pertinent ;
- vérification de la sécurité et des fichiers générés.

Les tests mobiles utilisent Jest avec `jest-expo` et React Native Testing Library. Les tests d'intégration API sont séparés et peuvent nécessiter `DATABASE_URL`.

## Sécurité

Ne jamais :

- exposer ou committer `DATABASE_URL` ;
- exposer ou committer `BETTER_AUTH_SECRET` ;
- committer un fichier `.env` réel ;
- mettre une clé privée ou un secret dans le bundle mobile ;
- stocker des mots de passe ;
- contourner l'authentification ou accepter une identité fournie par le client ;
- masquer une erreur réseau, serveur ou validation par un faux succès.

Les exemples de configuration doivent utiliser des valeurs fictives et des fichiers `.env.example`.

## Documentation

Après une fonctionnalité importante, mettre à jour si nécessaire :

- `PROJECT_CONTEXT.md` pour l'état courant ;
- `ARCHITECTURE.md` pour un changement structurel ;
- `CHANGELOG.md` pour une étape livrée ou une décision importante.

Ne pas inventer une fonctionnalité, une dépendance, une migration, un déploiement ou un test qui n'existe pas dans le dépôt.
