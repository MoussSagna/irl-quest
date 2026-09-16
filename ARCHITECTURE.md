# IRL Quest — architecture technique réelle

Ce document décrit l'architecture actuellement implémentée. Il ne décrit pas les modules futurs comme s'ils existaient déjà.

## Vue d'ensemble

```text
Web (Vite/React) ───────┐
                        ├─> API Client partagé ─> Hono API
Mobile (Expo/RN) ───────┘                         │
                                                  ├─> Better Auth
                                                  │    └─> Prisma Adapter
                                                  └─> Services API futurs
                                                       └─> Prisma
                                                            └─> PostgreSQL/Neon
```

Le Web et le Mobile partagent des packages TypeScript, mais l'interface Web métier n'est pas encore construite. Le Mobile utilise actuellement l'API partagée pour Better Auth et garde les données RPG dans des mocks locaux.

## Monorepo

Le repository est un workspace pnpm (`pnpm-workspace.yaml`) orchestré par Turborepo (`turbo.json`).

```text
apps/
├── api/
├── mobile/
└── web/
packages/
├── api-client/
├── config/
├── database/
├── types/
└── validation/
prisma/
├── migrations/
└── schema.prisma
```

## Applications

### `apps/api`

Responsabilités actuelles :

- démarrer le serveur Node avec `@hono/node-server` ;
- exposer l'application Hono ;
- valider les variables d'environnement via `envSchema` ;
- monter `/api/auth/*` vers Better Auth ;
- protéger `/api/me` avec le middleware de session ;
- servir `/health`.

Fichiers principaux :

- `src/app.ts`
- `src/index.ts`
- `src/auth/config.ts`
- `src/routes/auth.ts`
- `src/middleware/auth.ts`

### `apps/mobile`

Responsabilités actuelles :

- application Expo SDK 57 ;
- navigation Expo Router ;
- interface RPG Midnight Progression ;
- authentification mobile ;
- état serveur d'authentification avec TanStack Query ;
- données RPG mockées et état de quête local.

Les routes publiques sont Login/Register. Le groupe `app/(tabs)` contient les routes protégées Home, Quests, Goals, Achievements et Profile. `app/_layout.tsx` compose `AuthProvider`, `QuestProvider` et `AuthGate`.

### `apps/web`

Responsabilités actuelles :

- shell React/Vite ;
- configuration TypeScript, Tailwind, PostCSS et Vite.

Aucun écran métier Web n'est actuellement présent dans `apps/web/src`.

## Packages

### `packages/api-client`

Client HTTP partagé :

- construit les URLs à partir d'une base URL ;
- envoie GET/POST ;
- normalise les erreurs HTTP dans `ApiError` ;
- capture et persiste le cookie de session via une abstraction `CookieStorage` ;
- expose `health`, `me`, `signIn`, `signUp` et `signOut`.

Le Mobile fournit l'implémentation SecureStore de `CookieStorage`. Le Web pourra fournir une stratégie adaptée au navigateur.

### `packages/types`

Contient les types TypeScript partagés actuellement, notamment `HealthResponse`.

### `packages/validation`

Contient les schémas Zod partagés. `envSchema` valide `PORT`, `NODE_ENV`, `DATABASE_URL`, `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL`.

### `packages/database`

Expose le client Prisma partagé utilisé par Better Auth.

### `packages/config`

Expose la configuration partagée actuellement disponible, notamment le nom `IRL Quest`.

## Authentication et communication

### API

Better Auth est créé dans `apps/api/src/auth/config.ts` avec l'adaptateur Prisma PostgreSQL. Hono monte le handler sur `/api/auth/*`.

`requireAuth` appelle `auth.api.getSession` à partir des headers de la requête. Si aucune session n'est valide, l'API renvoie `401`. Sinon, la session est placée dans le contexte Hono et `/api/me` renvoie l'utilisateur issu de cette session.

### Mobile

Le flux mobile est :

```text
AuthScreen
  ↓
AuthProvider / TanStack Mutation
  ↓
packages/api-client
  ↓
HTTP /api/auth/* ou /api/me
  ↓
Set-Cookie → Expo SecureStore
```

Le client ajoute ensuite le cookie stocké aux requêtes suivantes. `signOut` tente l'appel serveur puis efface le cookie local dans un bloc `finally`.

### URL API

Le Mobile lit `EXPO_PUBLIC_API_URL`. Cette variable est publique par nature et ne doit contenir aucun secret. Elle est validée au démarrage :

- une valeur absente ou malformée produit un message de configuration explicite au lieu d'un écran vide ;
- une valeur attendue est une origine HTTP(S) complète ;
- une valeur de type `EXPO_PUBLIC_API_URL=EXPO_PUBLIC_API_URL=http://...` est rejetée.

Valeurs selon l'environnement :

- iOS Simulator : généralement `http://localhost:8787` ;
- Android Emulator : généralement `http://10.0.2.2:8787` ;
- appareil physique : adresse IP locale du Mac et API accessible sur le réseau.

Le serveur Node/Hono écoute explicitement sur `0.0.0.0` au port configuré afin d'accepter les connexions du réseau local. `BETTER_AUTH_SECRET` et `DATABASE_URL` restent exclusivement côté serveur.

## Database

Prisma utilise PostgreSQL et `DATABASE_URL`. Le schéma actuel contient uniquement les modèles nécessaires à Better Auth :

- `User`
- `Session`
- `Account`
- `Verification`

Les modèles RPG n'existent pas encore. La persistance des Goals, Quests, XP et Achievements est donc une étape future.

## State management

- TanStack Query : état serveur `/api/me` et mutations d'authentification.
- React Context : `AuthProvider` et `QuestProvider`.
- `QuestProvider` : état local temporaire pour la complétion et l'XP des quêtes mockées.
- Zustand : non installé, donc aucune architecture Zustand à maintenir.

## Design system mobile

`apps/mobile/src/design-system` centralise :

- tokens couleurs, spacing, radii et typographie ;
- primitives d'écran, carte et bouton ;
- composants de progression ;
- cartes de quête et d'objectif ;
- header et navigation basse.

La navigation basse utilise Lucide React Native et `react-native-svg`. Jest mappe Lucide vers un mock local uniquement pour les tests afin d'éviter le bundle ESM de la dépendance dans Jest ; le rendu de production utilise bien Lucide.

## Tests

### Mobile

Jest utilise le preset `jest-expo`. Les tests sont sous `apps/mobile/src` et testent composants, écrans, auth et interactions. La suite complète se lance avec :

```sh
cd apps/mobile
./node_modules/.bin/jest --runInBand --coverage
```

### API

Vitest exécute `apps/api/test/auth.test.ts`. Cette suite est une intégration PostgreSQL et est conditionnée à la présence de `DATABASE_URL`.

### Web

Aucune suite de tests Web n'est configurée actuellement.

## Scripts et validation

Les applications exposent des scripts `build`, `lint`, `typecheck` ou `test` selon leur rôle. Turborepo orchestre les tâches communes. Expo Web export et Expo Doctor ont été utilisés pour valider l'application mobile.

## Limites actuelles

- pas de modèle ou route RPG persistante ;
- pas d'interface Web métier ;
- pas de Game Master/OpenAI ;
- pas de CI/CD ni déploiement configuré ;
- parcours mobile réel nécessitant une API accessible non vérifié dans cet environnement.
