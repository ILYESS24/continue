# 📊 Analyse Auth/Login - Résultats

## Fichiers directement Auth/Login (à supprimer)

### extensions/cli/src/auth/ (10 fichiers)

- authEnv.ts
- ensureAuth.ts
- orgSelection.ts + .test.ts
- uriUtils.ts
- workos.ts + .test.ts + .orgScope.test.ts
- workos.helpers.ts
- workos-org.test.ts

### extensions/cli/src/services/ (2 fichiers)

- AuthService.ts
- AuthService.test.ts

### extensions/cli/src/commands/ (2 fichiers)

- login.ts
- logout.ts

### gui/src/context/ (1 fichier)

- Auth.tsx

### extensions/vscode/src/stubs/ (3 fichiers)

- auth.ts
- WorkOsAuthProvider.ts
- WorkOsAuthProvider.vitest.ts

### extensions/intellij/auth/ (3 fichiers)

- AuthListener.kt
- ContinueAuthDialog.kt
- ContinueAuthService.kt

### core/control-plane/ (2 fichiers)

- AuthTypes.ts
- auth/index.ts

### core/context/mcp/ (2 fichiers)

- MCPOauth.ts
- MCPOauth.vitest.ts

**TOTAL FICHIERS AUTH/LOGIN: ~25 fichiers**

---

## Fichiers impactés (qui utilisent auth/login)

D'après l'analyse grep:

- **92 fichiers** importent/utilisent des modules auth
- **90 fichiers** utilisent controlPlane (lié à auth)
- **77 fichiers** utilisent WorkOs (système d'auth)

**Nombre de fichiers UNIQUES impactés: ~120-150 fichiers**

Ces fichiers devront être modifiés pour:

1. Supprimer les imports auth
2. Retirer les vérifications `isSignedIn`, `isAuthenticated`
3. Supprimer les appels `ensureAuth()`
4. Retirer les références à `ControlPlaneSessionInfo`
5. Simplifier la logique qui dépendait de l'auth

---

## Résumé

- **Fichiers auth/login à supprimer**: ~25 fichiers
- **Fichiers impactés à modifier**: ~120-150 fichiers
