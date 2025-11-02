# 🚀 Quick Start - Continue sur Cloudflare

## Démarrage rapide (5 minutes)

### 1. Configurer les API Keys (OBLIGATOIRE)

```bash
# Via Wrangler (plus rapide)
wrangler pages secret put OPENAI_API_KEY
# Entrez votre clé OpenAI quand demandé

# Ou ajoutez Anthropic
wrangler pages secret put ANTHROPIC_API_KEY
```

### 2. Accéder à l'application

1. Visitez : **https://fa86d60a.continue-6p4.pages.dev**
2. Le GUI se charge automatiquement
3. Commencez à chatter !

### 3. Tester

Envoyez un message comme : "Bonjour, explique-moi comment fonctionne Cloudflare Workers"

## ⚡ Providers rapides (sans config)

- **Groq** : Gratuit et très rapide (jusqu'à 30 req/min)

  ```bash
  wrangler pages secret put GROQ_API_KEY
  ```

- **Mistral** : Bon équilibre prix/performance
  ```bash
  wrangler pages secret put MISTRAL_API_KEY
  ```

## 🔍 Vérifier que tout fonctionne

```bash
# Vérifier les secrets
wrangler pages secret list

# Voir les logs en temps réel
wrangler pages tail
```

## ✅ C'est prêt !

Votre Continue est maintenant en ligne et fonctionnel !
