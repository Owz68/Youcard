# YouCard

Application de cartes de visite numériques (552 modèles, QR codes dynamiques, rendez-vous, administration).
Backend : Supabase (projet « Youcard », schéma + RLS déjà appliqués). Hébergement : Cloudflare Pages.

## 1. Clé Supabase
Dans `config.js`, remplacez `COLLER_ICI_LA_CLE_PUBLIQUE` par la clé publique (Supabase > Settings > API > publishable / anon key). Ne jamais mettre la clé `service_role`.

## 2. GitHub
```
git init && git add . && git commit -m "YouCard v1"
git branch -M main
git remote add origin https://github.com/<votre-compte>/youcard.git
git push -u origin main
```

## 3. Cloudflare Pages
Workers & Pages > Create > Pages > Connect to Git > dépôt `youcard`. Build command : vide. Output directory : `/`.
(ou : `npx wrangler pages deploy . --project-name youcard`)

## 4. Supabase Auth
Authentication > URL Configuration : Site URL = l’adresse Cloudflare (ex. https://youcard.pages.dev) et ajoutez-la aux Redirect URLs.

## 5. Premier compte
Inscrivez-vous avec contactezowz@gmail.com : seul cet e-mail est autorisé et le premier compte devient administrateur.

## 6. Ouvrir au public plus tard
```sql
update public.settings set value='true' where key='open_signup';
```
Les plans (`free`, `pro`, `premium`) existent déjà dans `public.profiles.plan` pour réserver les modèles premium.
