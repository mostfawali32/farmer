# Configuration de la Synthèse Vocale (TTS)

## Solution Actuelle

Le système utilise **deux méthodes** pour la synthèse vocale :

### 1. API TTS Gratuite (Par défaut pour l'Arabe)
- Utilise Google Translate TTS (gratuit, non officiel)
- Fonctionne automatiquement pour l'arabe
- Aucune configuration nécessaire

### 2. Web Speech API (Pour le Français)
- Utilise les voix installées sur le système
- Fonctionne automatiquement si les voix sont installées

### 3. Google Cloud TTS (Optionnel - Payant)
- Qualité supérieure
- Nécessite une clé API

## Configuration Google Cloud TTS (Optionnel)

Si vous voulez utiliser Google Cloud TTS pour une meilleure qualité :

1. **Créer un compte Google Cloud**
   - Allez sur https://console.cloud.google.com
   - Créez un nouveau projet

2. **Activer l'API Text-to-Speech**
   - Dans la console, allez dans "APIs & Services" → "Library"
   - Recherchez "Cloud Text-to-Speech API"
   - Cliquez sur "Enable"

3. **Créer une clé API**
   - Allez dans "APIs & Services" → "Credentials"
   - Cliquez sur "Create Credentials" → "API Key"
   - Copiez la clé API

4. **Configurer la clé API**
   - Créez un fichier `.env` à la racine du projet
   - Ajoutez : `VITE_GOOGLE_TTS_API_KEY=votre_cle_api_ici`
   - Redémarrez le serveur de développement

## Test

1. Ouvrez la console du navigateur (F12)
2. Sélectionnez l'arabe comme langue
3. Cliquez sur "Lire tout"
4. Vérifiez dans la console :
   - `Using external TTS API for Arabic text` = API externe utilisée
   - `Using voice: [nom]` = Web Speech API utilisée

## Notes

- L'API gratuite (Google Translate TTS) fonctionne bien pour la plupart des cas
- Pour la production, considérez utiliser une API payante pour plus de fiabilité
- Les voix françaises utilisent toujours Web Speech API (gratuit)

