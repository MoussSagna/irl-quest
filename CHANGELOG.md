# Changelog

Historique des principales étapes réellement présentes dans l'historique Git d'IRL Quest.

## 2026-09-16 — Logout et Goals persistants

- Correction du client API : les requêtes sans corps, notamment `POST /api/auth/sign-out`, n'annoncent plus un JSON vide à Better Auth.
- Ajout du modèle Prisma `Goal` et de sa migration PostgreSQL.
- Ajout des schémas Zod et des routes protégées `GET/POST/PATCH/DELETE /api/goals`.
- L'identité et l'isolation des Goals proviennent exclusivement de la session serveur.
- Ajout du client API Goals, des hooks TanStack Query et de l'écran mobile avec états loading/error/empty et création.
- Ajout des tests d'intégration API et des tests mobiles Goals.

## 2026-09-16 — Correction de la connectivité API mobile

- Correction de la configuration locale `EXPO_PUBLIC_API_URL` malformée.
- Validation explicite de l'origine API mobile et écran d'erreur lisible en cas de variable absente ou invalide.
- Configuration du serveur API pour écouter sur `0.0.0.0`.
- Ajout de tests pour la configuration réseau mobile.
- Vérification de `401 Unauthorized` sur localhost et sur l'adresse LAN, sans session.

## 2026-09-16 — Intégration Better Auth mobile

Commit : `1766011 feat(mobile): integrate better auth`

- Ajout du client API partagé avec gestion des erreurs et des cookies.
- Ajout de TanStack Query côté mobile.
- Ajout de `expo-secure-store` pour persister le cookie de session.
- Ajout des écrans Login et Register.
- Ajout de `AuthProvider` et de la garde de navigation Expo Router.
- Connexion du Profile Screen à l'utilisateur réel et ajout du logout.
- Ajout de tests unitaires d'authentification et du profil.

## 2026-09-16 — Refonte de la Bottom Navigation

Commit : `a8ec8b4 refactor(mobile): redesign bottom navigation`

- Remplacement des labels visibles par une navigation icon-only.
- Adoption de Lucide React Native.
- Ajout des états actif/inactif, feedback tactile, safe area et labels d'accessibilité.
- Ajout du mock Jest isolé pour le bundle ESM de Lucide.

## 2026-09-16 — Couverture des écrans RPG et interactions

Commit : `93d70e5 test(mobile): cover RPG screens and quest interactions`

- Tests des écrans Home, Quests, Goals, Achievements et Profile.
- Tests de complétion d'une quête et de mise à jour de son état.

## 2026-09-16 — Écrans Home et progression RPG

Commit : `243e951 feat(mobile): add RPG home and progression screens`

- Construction du Home Screen comme dashboard de personnage.
- Ajout de l'affichage de progression et des écrans RPG principaux.

## 2026-09-16 — Navigation RPG et état partagé des quêtes

Commit : `af3a0a2 feat(mobile): add RPG navigation and shared quest state`

- Ajout des cinq destinations Expo Router : Home, Quests, Goals, Achievements et Profile.
- Ajout de `QuestProvider` pour les interactions locales.
- Centralisation des données mockées.

## 2026-09-16 — Tests mobiles Expo

Commits :

- `33667ee test(mobile): setup Expo unit testing`
- `6d01dc7 test(mobile): cover core and home components`

- Adoption de Jest avec `jest-expo`.
- Ajout de React Native Testing Library et React Test Renderer.
- Ajout des premiers tests de composants et de Home.

## 2026-09-16 — Mise à niveau Expo SDK 57

Commit : `af053ca chore(mobile): upgrade expo sdk to 57`

- Mise à niveau vers Expo SDK 57, React Native 0.86.3, React 19.2.3 et Expo Router 57.
- Validation Expo Doctor, exports Web/iOS/Android lors de l'étape.

## 2026-09-16 — Fondation du design mobile

Commits :

- `9b93b2e feat(mobile): add design tokens`
- `36fcd56 feat(mobile): add reusable ui components`
- `14138f3 feat(mobile): add quest and goal cards`
- `2cf1f0e feat(mobile): build gamified home screen`
- `32166cb test(mobile): add progression component tests`

- Définition de la direction Midnight Progression.
- Ajout des tokens, primitives, progression, cartes Quest/Goal et Home initial.

## 2026-09-16 — Fondations backend et Neon

Commits :

- `6832250 feat: initialize IRL Quest monorepo`
- `d6e9604 feat(auth): add Better Auth email authentication`
- `808a77f docs(neon): document cloud PostgreSQL setup`
- `2e3cdb9 fix(mobile): align Expo NativeWind configuration`
- `91d896c merge: integrate auth neon and mobile foundation`

- Initialisation du monorepo pnpm/Turborepo.
- Ajout des applications API, Web et Mobile et des packages partagés.
- Ajout de Prisma/PostgreSQL et de la migration Better Auth.
- Configuration Better Auth côté Hono avec tests d'intégration.
- Documentation et configuration Neon.
- Correction de la configuration Expo/NativeWind.

## 2026-09-16 — Règles Expo générées

Commit : `834a44c chore(mobile): track Expo generated ignore rules`

- Ajout des règles d'ignore générées par Expo.
