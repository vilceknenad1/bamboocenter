# Bamboo Center of Development, sajt

Jednostranični sajt centra za rani razvoj i podršku deci i roditeljima u Kragujevcu.
Čist HTML, CSS i JavaScript, bez build alata. Radi na GitHub Pages ili bilo kom statičkom hostingu.

Dizajn i izrada: Nenad Vilček, vilcekwebdesign@gmail.com

## Struktura

```
index.html              cela strana
favicon.png
robots.txt
.nojekyll               GitHub Pages: fajlovi se služe takvi kakvi jesu
assets/css/style.css    stilovi
assets/js/main.js       meni, listovi usluga, „Kome pomažemo“, formular, animacije
assets/vendor/          GSAP, ScrollTrigger, Lenis (lokalno, bez CDN-a)
assets/img/             fotografije (isečene, bez utisnutih logoa i adresa)
```

## Objavljivanje na GitHub Pages

1. Na github.com napravite novi repozitorijum, na primer `bamboo-centar` (može biti Public).
2. Otpremite sadržaj ovog foldera u koren repozitorijuma: **Add file › Upload files**, prevucite sve fajlove i foldere, pa **Commit changes**. Ili iz terminala:
   ```
   git init
   git add .
   git commit -m "Sajt Bamboo centra"
   git branch -M main
   git remote add origin https://github.com/KORISNIK/bamboo-centar.git
   git push -u origin main
   ```
3. U repozitorijumu otvorite **Settings › Pages**. Pod **Build and deployment** izaberite **Deploy from a branch**, granu `main` i folder `/ (root)`, pa **Save**.
4. Posle minut-dva sajt je na adresi `https://KORISNIK.github.io/bamboo-centar/`.

## Sopstveni domen (npr. bamboocenter.rs)

1. U **Settings › Pages › Custom domain** upišite domen i sačuvajte. GitHub će dodati fajl `CNAME`.
2. Kod registrara domena podesite DNS:
   - za `bamboocenter.rs`: četiri A zapisa ka `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - za `www`: CNAME zapis ka `KORISNIK.github.io`
3. Kad DNS proradi, uključite **Enforce HTTPS**.
4. U `index.html` zamenite `https://vilceknenad1.github.io/bamboocenter/` novim domenom u `og:url` i `og:image` (slika za pregled linka na Viberu, WhatsApp-u i mrežama).

## Formular za upit (obavezno pre objave)

Dok formular nije povezan, posle slanja se prikazuje poruka da upit nije poslat, uz telefon i email centra.

1. Napravite besplatan nalog na formspree.io i novu formu, sa emailom centra (bamboobcd@gmail.com) kao primaocem.
2. Kopirajte ID forme (npr. `xyzabcd`).
3. U `index.html` pronađite `https://formspree.io/f/YOUR_FORM_ID` i zamenite `YOUR_FORM_ID` tim ID-jem.

Posle toga upiti stižu na email centra. Ako slanje ne uspe, posetilac vidi poruku sa telefonom i emailom.

## Šta još treba dobiti od centra

Na strani su označeni žutim oznakama `[PLACEHOLDER: ...]`:

- radno vreme (kontakt i pitanja)
- uzrast dece sa kojom rade
- imena i uloge ostalih članova tima, uključujući logopeda
- kako se može nabaviti igra „Luka i Mia“
- kratak opis muzikoterapije
- kalendar predstojećih edukacija
- cenovnik: tabela cena već postoji u `index.html`, sakrivena (`<div class="prices" hidden>`). Upišite cene i uklonite `hidden`.

Takođe: vektorski logo (sadašnji je 200 px), veće fotografije tima bez vodenog žiga i potvrda adrese (Mokranjčeva 58 ili 58/1).

## Napomene

- Fontovi: Alegreya i Alegreya Sans (Google Fonts), sa latinicom i ćirilicom.
- Animacije se isključuju kod korisnika koji u sistemu traže manje pokreta (prefers-reduced-motion).
- Opis za Google i podaci o firmi (adresa, telefon) već su u `<head>` strane.
