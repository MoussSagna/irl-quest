# IRL Quest — contexte persistant du projet

Dernière vérification : 16 septembre 2026
Branche vérifiée : `feature/mobile-app`
Dernier commit vérifié : `e9c10c0 docs: add persistent project context` (avant cette correction réseau)

Ce document décrit l'état réellement présent dans le repository. Il doit être relu avant toute intervention importante et corrigé lorsque le code évolue.

## 1. Projet

**Nom :** IRL Quest

IRL Quest est une application RPG qui transforme les objectifs de la vie réelle en quêtes, XP, niveaux, streaks, achievements et progression.

## 2. Vision produit

Le principe directeur est :

> Life goals → RPG experience

Le produit vise à permettre à un utilisateur de :

- définir des **Goals** (objectifs de vie) ;
- réaliser des **Quests** (actions concrètes) ;
- gagner de l'**XP** ;
- progresser par **Levels** ;
- maintenir des **Streaks** ;
- débloquer des **Achievements** ;
- suivre une **Main Quest** et une progression personnelle.

Un Game Master personnel basé sur l'IA est prévu dans la vision produit pour comprendre les objectifs, générer et adapter des quêtes, proposer des défis et analyser la progression. Il n'est pas implémenté dans l'état actuel du dépôt.

## 3. Stack réellement présente

### Web

- React `^19.0.0`
- React DOM `^19.0.0`
- Vite `^6.0.11`
- TypeScript `^5.7.3`
- React Router DOM `^7.1.5`
- Tailwind CSS `^3.4.17`
- PostCSS et Autoprefixer

L'application Web contient actuellement le shell Vite et ses fichiers de configuration ; aucun écran métier Web n'est présent dans `apps/web/src`.

### Mobile

- Expo `57.0.23`
- React Native `0.86.3`
- React `19.2.3`
- Expo Router `57.0.21`
- TypeScript `6.0.3`
- NativeWind `4.1.23`
- React Native Web
- Lucide React Native `1.46.0`
- `react-native-safe-area-context`
- `expo-secure-store`
- TanStack React Query `5.103.1`

### API

- Node.js runtime
- Hono `4.7.2`
- `@hono/node-server`
- TypeScript
- Zod via `@irl-quest/validation`
- Better Auth `1.7.5`
- Vitest `3.0.0` pour les tests API
- Le script API charge explicitement le `.env` racine avec `dotenv` avant d'importer Hono et Better Auth.

### Database

- PostgreSQL via Prisma
- Prisma Client `6.19.3`
- Neon est le fournisseur documenté et utilisé pour l'environnement cloud
- Une migration Prisma Better Auth existe dans `prisma/migrations/20260916140000_add_better_auth`

### Authentication

- Better Auth côté API
- Adaptateur Prisma
- Email/password activé
- Sessions persistées côté serveur dans PostgreSQL
- Le mobile persiste uniquement le cookie de session dans Expo SecureStore

### State management

- TanStack Query est utilisé côté mobile pour l'état serveur d'authentification.
- `QuestProvider` utilise React Context et un état local pour simuler les interactions de quêtes.
- Zustand n'est pas installé ni utilisé dans le repository.

### Testing

- API : Vitest
- Mobile : Jest `29.7`, `jest-expo`, React Native Testing Library, React Test Renderer
- Web : aucune configuration de tests Web détectée à ce jour
- Playwright n'est pas installé ou configuré dans le repository actuel

### Deployment

Aucune configuration de déploiement, CI/CD, hébergeur ou workflow GitHub Actions n'a été détectée dans le repository actuel. Les scripts disponibles sont locaux : développement, build, lint, typecheck, test et export Web mobile.

Le repository ne déclare actuellement pas de version Node via `.nvmrc`, `.node-version`, `mise.toml`, Volta ou `engines`. La version utilisée lors de cette vérification est Node.js 24.14.0.

## 4. Monorepo réel

Le workspace pnpm est défini par `pnpm-workspace.yaml` :

```text
apps/*
packages/*
```

Structure principale :

```text
apps/
  api/
  mobile/
  web/
packages/
  api-client/
  config/
  database/
  types/
  validation/
prisma/
  migrations/
  schema.prisma
```

Turborepo orchestre les tâches `build`, `dev`, `lint` et `typecheck` via `turbo.json`.

## 5. Authentication actuelle

### API

Better Auth est configuré dans `apps/api/src/auth/config.ts` avec :

- `prismaAdapter(db, { provider: 'postgresql' })` ;
- `BETTER_AUTH_SECRET` ;
- `BETTER_AUTH_URL` ;
- email/password activé.

Les endpoints Better Auth sont relayés par `apps/api/src/routes/auth.ts` sous :

```text
/api/auth/*
```

Les routes explicitement validées par les tests sont :

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out` utilisé par le client mobile

Le client HTTP n'ajoute `Content-Type: application/json` que lorsqu'un corps est présent. Cela permet au logout Better Auth d'envoyer un `POST` sans corps JSON invalide.

`GET /api/me` est protégé par `requireAuth`, lit la session depuis les headers et renvoie l'utilisateur authentifié. L'identité ne vient pas d'un `userId` fourni par le client.

### Mobile

Le client partagé `packages/api-client/src/index.ts` gère les requêtes HTTP, les erreurs, le cookie `Set-Cookie` et l'envoi du cookie courant.

`apps/mobile/src/features/auth/api.ts` configure ce client avec :

- `EXPO_PUBLIC_API_URL` ;
- `expo-secure-store` ;
- la clé locale `irl-quest-session-cookie`.

`AuthProvider` utilise TanStack Query pour `GET /api/me` et expose `isLoading`, `isAuthenticated`, `user`, `signIn`, `signUp`, `signOut` et `error`.

`apps/mobile/app/_layout.tsx` protège les routes :

- utilisateur non connecté → `/login` ;
- utilisateur connecté sur Login/Register → `/(tabs)`.

Les écrans Login et Register sont présents et le Profile Screen affiche le nom et l'email réels puis propose Logout.

### Tests

Les tests API d'authentification sont des tests d'intégration Vitest et sont ignorés si `DATABASE_URL` n'est pas définie. Les tests mobiles mockent les appels API et couvrent `AuthProvider`, Login/Register et Logout.

### Reste à faire

- Vérifier le parcours réel sur un simulateur ou appareil avec une API accessible.
- Ajouter la gestion éventuellement nécessaire d'une session expirée avec invalidation et message dédié.
- Ajouter les autres fonctionnalités serveur protégées au fur et à mesure.

## 6. Database

Le datasource Prisma utilise `env("DATABASE_URL")` avec le provider PostgreSQL.

Modèles réellement présents :

- `User`
- `Session`
- `Account`
- `Verification`
- `Goal` relié à `User` par `userId`, avec titre, description, catégorie, cible, progression, unité, statut et timestamps.

Ces modèles servent à Better Auth. Les modèles `Quest`, `Achievement`, `XP` et les statistiques RPG persistantes n'existent pas encore.

Migration réellement présente :

```text
prisma/migrations/20260916140000_add_better_auth/migration.sql
prisma/migrations/20260916220000_add_goals/migration.sql
```

Elle crée les quatre modèles Better Auth, leurs index et leurs relations.

## 7. Mobile actuel

### Navigation

Expo Router utilise un layout racine et un groupe de tabs :

- `Home` — `app/(tabs)/index.tsx`
- `Quests` — `app/(tabs)/quests.tsx`
- `Goals` — `app/(tabs)/goals.tsx`
- `Achievements` — `app/(tabs)/achievements.tsx`
- `Profile` — `app/(tabs)/profile.tsx`

La Bottom Navigation est une barre icon-only avec Lucide :

- `House`
- `Swords`
- `Target`
- `Trophy`
- `UserRound`

Elle gère safe area, état actif/inactif, feedback tactile et labels d'accessibilité.

### Écrans

Les écrans métier mobiles présents sont :

- Home : dashboard de progression, XP, streak, main quest, quêtes du jour, goals et achievements ;
- Quests : filtres et statuts de quêtes, complétion locale ;
- Goals : objectifs et progression ;
- Achievements : raretés, progression et états débloqué/verrouillé ;
- Profile : identité Better Auth, statistiques RPG mockées, settings visuels et logout ;
- Login/Register : authentification Better Auth.

### Design System

Le design system se trouve sous `apps/mobile/src/design-system` :

- tokens Midnight Progression ;
- primitives `Screen`, `Card`, `Button` ;
- `ProgressBar`, `XPBar`, `LevelBadge`, `StreakBadge`, `AchievementBadge`, `Avatar` ;
- `QuestCard`, `GoalCard`, `ScreenHeader`, `BottomNavigation`.

### Données et état

Les Goals sont chargés depuis `GET /api/goals` avec TanStack Query dans `features/goals/useGoals.ts`. L'écran gère le chargement, l'erreur, le retry, l'état vide et la création. Les autres données RPG restent centralisées dans `features/shared/mockData.ts`.

`features/quests/QuestProvider.tsx` simule la complétion d'une quête et l'augmentation d'XP. Ces données ne sont pas encore synchronisées avec l'API ou la base de données.

## 8. Tests mobiles actuels

Configuration :

- `apps/mobile/jest.config.js`
- preset `jest-expo`
- setup global `apps/mobile/src/test/setup.ts`
- mock Jest isolé de Lucide dans `apps/mobile/src/test/lucideMock.tsx`

Emplacements :

- tests des composants dans `design-system/components/__tests__` ;
- tests des écrans et features sous `features/**/__tests__` ou `features/screens.test.tsx`.

Commande principale :

```sh
cd apps/mobile
./node_modules/.bin/jest --runInBand
```

Dernière vérification connue après l'intégration Better Auth :

- 12 suites ;
- 34 tests ;
- 34 réussis lors de la dernière exécution ;
- couverture : 79,67 % statements, 81,28 % branches, 73,97 % functions, 88,57 % lines.

## 9. Design

La direction artistique implémentée est **Midnight Progression** :

- fond sombre bleu nuit ;
- surfaces profondes et bordures discrètes ;
- accent menthe pour la progression ;
- accents violet, ambre, bleu et corail ;
- hiérarchie forte et espaces généreux ;
- cartes sobres avec profondeur ;
- gamification premium, non cartoon et non SaaS générique ;
- animations et feedbacks légers.

Habitica est uniquement une référence de gamification et non une direction visuelle à copier.

## 10. Git

Branches locales et distantes observées :

- `main`
- `feature/mobile-app`
- `chore/auth-neon-mobile-foundation`

La branche de travail actuelle est `feature/mobile-app`, suivie par `origin/feature/mobile-app`.

Convention : Conventional Commits en anglais, commits atomiques. Les derniers commits importants sont :

- `6832250 feat: initialize IRL Quest monorepo`
- `d6e9604 feat(auth): add Better Auth email authentication`
- `af053ca chore(mobile): upgrade expo sdk to 57`
- `33667ee test(mobile): setup Expo unit testing`
- `af3a0a2 feat(mobile): add RPG navigation and shared quest state`
- `243e951 feat(mobile): add RPG home and progression screens`
- `93d70e5 test(mobile): cover RPG screens and quest interactions`
- `a8ec8b4 refactor(mobile): redesign bottom navigation`
- `1766011 feat(mobile): integrate better auth`

## 11. Fonctionnalités terminées

- Monorepo pnpm/Turborepo initialisé.
- API Hono minimale et validation d'environnement Zod.
- Prisma PostgreSQL et migration Better Auth.
- Better Auth email/password côté API.
- Route protégée `/api/me`.
- Client API partagé avec gestion d'erreurs et cookies.
- Authentification mobile Login/Register, session SecureStore et logout.
- Goals persistants : CRUD API protégé par session, validation Zod, migration Prisma et affichage/création mobile.
- Garde de navigation authentifiée/non authentifiée.
- Fondation du design system mobile Midnight Progression.
- Navigation RPG mobile à cinq destinations.
- Écrans Home, Quests, Goals, Achievements et Profile.
- Données mockées centralisées et QuestProvider local.
- Complétion locale d'une quête et progression XP simulée.
- Infrastructure Jest mobile et tests des écrans/composants/auth.
- Export Web Expo validé et Expo Doctor validé lors des dernières vérifications.

## 12. Fonctionnalités en cours ou non persistées

- Les Quests, Achievements, XP et statistiques RPG restent des données mockées côté mobile.
- La synchronisation entre API, base, Web et Mobile n'est pas encore implémentée.
- L'application Web n'a pas encore d'interface métier.
- Le Game Master IA/OpenAI n'est pas implémenté.

## 13. Prochaines étapes réalistes

1. Vérifier le parcours Better Auth réel sur iOS Simulator, Android Emulator et appareil physique.
2. Ajouter la persistance des Quests et leur progression.
3. Ajouter les modèles Prisma RPG restants et leurs migrations.
4. Remplacer progressivement `mockData` et `QuestProvider` par TanStack Query et API protégée.
5. Construire l'interface Web avec les types et le client partagés.
6. Ajouter la gestion robuste des sessions expirées et des erreurs réseau.
7. Ajouter les tests API des ressources RPG et les tests E2E Web lorsque l'interface Web existera.
8. Concevoir l'intégration OpenAI côté backend avec sortie structurée validée par Zod.

## 14. Décisions techniques à préserver

- OpenAI, les secrets et les accès PostgreSQL restent exclusivement côté backend.
- Better Auth est le système d'authentification unique ; ne pas recréer un système parallèle.
- Les données serveur doivent utiliser TanStack Query ; Zustand n'est pas nécessaire tant qu'aucun état client global ne le justifie.
- Les types et validations réutilisables doivent vivre dans les packages partagés.
- Les sessions mobiles utilisent SecureStore pour le cookie, jamais un mot de passe.
- Sur un appareil physique, `EXPO_PUBLIC_API_URL` doit utiliser l'origine LAN de l'API, jamais `localhost`.
- Le serveur API de développement écoute sur `0.0.0.0` pour être joignable par un appareil du même réseau.
- Les données RPG mockées restent centralisées jusqu'à la disponibilité des routes et modèles persistants.
- Les changements doivent rester modulaires et testables.

## 15. Problèmes connus

- L'adresse `EXPO_PUBLIC_API_URL` doit être adaptée au contexte réseau : localhost pour le simulateur iOS, `10.0.2.2` pour l'émulateur Android, ou `http://<MAC_LAN_IP>:8787` pour un appareil physique.
- Une déclaration Expo malformée comme `EXPO_PUBLIC_API_URL=EXPO_PUBLIC_API_URL=http://...` est invalide et peut empêcher le démarrage utile de l'application ; l'application affiche maintenant une erreur de configuration explicite.
- Le serveur API doit être démarré avec une écoute réseau (`0.0.0.0`) pour les appareils physiques.
- Le parcours mobile réel contre une API distante n'a pas été validé dans ce workspace.
- L'export Web affiche un avertissement NativeWind indiquant qu'aucune classe utilitaire n'a été détectée ; l'export reste réussi.
- Aucun pipeline de déploiement ou CI n'est présent dans le repository.
