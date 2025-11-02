# Debug - Problèmes de fonctionnement

## Vérifications à faire

1. **Ouvrir la console du navigateur (F12)**

   - Aller sur https://4724c1bd.continue-6p4.pages.dev
   - Ouvrir la console (F12 > Console)
   - Vérifier les erreurs JavaScript

2. **Vérifier les requêtes réseau**

   - F12 > Network
   - Filtrer par "api" ou "fetch"
   - Vérifier les requêtes vers `/api/config` et `/api/message`
   - Regarder les réponses retournées

3. **Vérifier les API keys**

   ```bash
   wrangler pages secret list
   ```

   - Vérifier que `ANTHROPIC_API_KEY` est bien configuré

4. **Vérifier les logs Cloudflare**
   ```bash
   wrangler pages tail
   ```

## Problèmes connus et solutions

### "Loading session" qui reste

- Le GUI attend `config/getSerializedProfileInfo` avec un format très spécifique
- ✅ Corrigé dans la dernière version

### "Aucun modèle IA configuré"

- Vérifier que les API keys sont bien dans les secrets Cloudflare
- Le backend détecte automatiquement les clés disponibles

### Les boutons ne marchent pas

- Le GUI fait beaucoup d'appels `post()` qui ne retournent rien
- ✅ Handler générique ajouté pour tous les messages

## Tester manuellement

```bash
# Tester l'endpoint config
curl https://4724c1bd.continue-6p4.pages.dev/api/config

# Devrait retourner la configuration avec les modèles
```
