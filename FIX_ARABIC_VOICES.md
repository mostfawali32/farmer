# Comment résoudre l'erreur d'installation des voix arabes (0x80240023)

## Solutions pour corriger l'erreur 0x80240023

### Solution 1 : Réparer Windows Update
1. Ouvrez PowerShell en tant qu'administrateur
2. Exécutez ces commandes :
```powershell
net stop wuauserv
net stop cryptSvc
net stop bits
net stop msiserver
ren C:\Windows\SoftwareDistribution SoftwareDistribution.old
ren C:\Windows\System32\catroot2 catroot2.old
net start wuauserv
net start cryptSvc
net start bits
net start msiserver
```
3. Redémarrez votre ordinateur
4. Réessayez d'installer les voix arabes

### Solution 2 : Utiliser le Panneau de configuration
1. Ouvrez "Panneau de configuration" → "Horloge et région" → "Région"
2. Cliquez sur l'onglet "Claviers et langues"
3. Cliquez sur "Installer ou désinstaller des langues d'affichage"
4. Suivez les instructions pour installer l'arabe

### Solution 3 : Utiliser WSReset
1. Appuyez sur Windows + R
2. Tapez : `wsreset.exe`
3. Appuyez sur Entrée
4. Attendez que la fenêtre se ferme
5. Réessayez l'installation

### Solution 4 : Vérifier les services Windows
1. Appuyez sur Windows + R
2. Tapez : `services.msc`
3. Trouvez "Windows Update"
4. Assurez-vous qu'il est "En cours d'exécution"
5. Si non, cliquez droit → Démarrer

## Alternative : Utiliser Chrome/Edge

Si l'installation Windows échoue, Chrome et Edge téléchargent automatiquement les voix lors de la première utilisation :

1. Utilisez Chrome ou Edge pour votre site
2. Sélectionnez l'arabe
3. Cliquez sur "Lire tout"
4. Le navigateur téléchargera automatiquement les voix (première fois uniquement)
5. Attendez quelques secondes

## Note

Même sans voix arabe installée, le site fonctionne maintenant avec Web Speech API en utilisant le code langue arabe. La qualité sera meilleure avec les voix installées, mais cela fonctionne quand même.

