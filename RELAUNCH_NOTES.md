# Relaunch Startseite: Face it 3.1

Stand 24.09.2026 · Branch `relaunch-3-1` (von `main`, nicht gepusht)

> **Achtung vor dem Merge:** Diese Datei liegt im Wurzelverzeichnis. Nach einem Merge nach `main` wäre sie unter `getfaceit.com/RELAUNCH_NOTES.md` öffentlich (GitHub Pages mit `.nojekyll`). Vor dem Merge löschen oder nach `_seo/` verschieben (dort gitignored).

## Kurz

- Die Startseite ist komplett neu auf die Positionierung von 3.1 gebaut: Selbsthilfe-Training für Menschen mit Panikattacken und Angst, Kernsatz „Durchziehen statt vermeiden“.
- URL, Canonical, Header-Navigation, Mega-Menü, Footer-Links, Tracking und App-Store-Link sind unverändert. Keine andere Seite ist angefasst; `quiz/`, `checkout/`, `attribution.js`, `styles.css`, `script.js` und `content.css` sind unverändert.
- **Go-live erst, wenn** (1) Version 3.1 im App Store live ist, (2) der Stimmen-Abschnitt entschieden ist und (3) der Konflikt mit dem SEO-Änderungslog (Startseiten-Title bis 28.10.) entschieden ist. Details unten.

## Was sich geändert hat

### Seite (`index.html`)

| # | Abschnitt | Inhalt | Bild / Video |
|---|---|---|---|
| 1 | Hero | „Panikattacken? Durchziehen statt vermeiden.“, Ein-Satz-Versprechen aus dem Research (Variante A, steht so auch auf der Paywall), CTA „Kostenlos laden“, Hinweis „Panikhilfe immer kostenlos“, Zeile „Die ersten zwei Tage kostenlos · danach 3 Tage Test · jederzeit kündbar“ | 01_today im CSS-Telefonrahmen |
| 2 | Erkennst du dich wieder? | Sechs Verhaltensweisen statt Diagnose: absagen, flüchten, Symptome googeln, zum dritten Mal nachfragen (Rückversicherung), nie ohne Absicherung los, Platz am Ausgang. Dazu „Jedes Mal wird es kurz besser. Genau das ist die Falle.“ (aus V1) | ohne |
| 3 | Warum Beruhigen nicht reicht | „Beruhigung wird zur Krücke. Und die Angst bleibt der Chef.“ (aus V4), drei kurze Absätze | Video V4 |
| 4 | So funktioniert Face it | 1 Panikhilfe (immer kostenlos), 2 tägliche Session mit Angst-Leiter, 28 Lektionen, festem Termin, Vermeidungs-Level, 3 Erwartungs-Check und „Deine Beweise“ (mit Beispielkarte), 4 Coach in der Tasche und KI-Coach im Chat | 02, 03, 04 + 05, 06 + 08 |
| 5 | Was Face it anders macht | „Bleiben statt beruhigen“, „Prüfen statt wegatmen“, „Hinschauen statt ablenken“, ohne Konkurrenz-Namen | ohne |
| 6 | Gründer | „Ich bin Sergej. Ich habe Face it gebaut.“ Nur belegte Aussagen, siehe Entscheidung 2 | Video V1 |
| 7 | Stimmen | „Sie haben es schon getan.“ Inhalt unverändert, nur Position und Styling. **Vom Gründer zu bestätigen**, siehe Entscheidung 1 | ohne |
| 8 | Preis | Pfad „Immer: Panikhilfe kostenlos“, „Tag 1 und 2: kostenlos“, „Ab Tag 3: 3 Tage kostenlos testen“, dazu Monats- und Jahresabo, Kündigungshinweis nach Apple 3.1.2. Kein Therapie-Vergleich | ohne |
| 9 | FAQ | Was ist die Panikhilfe? Für wen? Ersetzt Face it eine Therapie? Was kostet es? Wie geht Face it mit KI und Daten um (Einwilligung, OpenAI, Widerruf, Datenschutz-Link)? Android | ohne |
| 10 | Schluss-CTA | „Du musst nicht warten, bis die Angst weg ist.“ | ohne |

- Videos: `preload="none"`, Poster mit der Untertitelzeile an dieser Stelle, eigener Play-Knopf („Video ansehen · 1 Min.“); ohne JavaScript bleiben die normalen Browser-Steuerelemente. Unter jedem Video „Mit KI erstellt“ plus der Satz aus der App („Die Videos zeigen Sergej als KI-Avatar, gesprochen nach seinem Skript.“) und ein aufklappbares Transkript (O-Ton aus `release1/strings_video2.json`).
- Drei neue interne Kontextlinks: `/vermeidung-konfrontation/sicherheitsverhalten-abbauen/`, `/warum-funktioniert-nicht/beruhigung-verschlimmert-angst/`, `/panikattacken-app/app-statt-therapie-sinnvoll/`.
- CTA-Text auf der Startseite überall „Kostenlos laden“ (Header, Hero, Gründer, Preis, Schluss, Sticky). `data-cta`-Namen: header, hero, founder, reviews, final, sticky wie bisher; `price` ersetzt price-monthly, price-yearly und price-free (jetzt ein Knopf unter den Preisen).
- Neues GA4-Event `video_play` (Parameter `video`), bewusst nicht an Meta.

### Meta und strukturierte Daten

- Title: „Face it: App gegen Panikattacken und Angst. Durchziehen statt vermeiden.“ (72 Zeichen)
- Description (153 Zeichen): „Selbsthilfe-Training bei Panikattacken und Angst: jeden Tag ein kleiner Schritt zurück in die Situationen, die du vermeidest. Panikhilfe immer kostenlos.“
- OG und Twitter: Titel „Panikattacken? Durchziehen statt vermeiden.“, neues Bild `assets/og-startseite.jpg` mit Maßen und Alt-Text.
- JSON-LD als `@graph`: WebSite und Organization (gleiche `@id` wie auf den Ratgeber-Seiten), WebPage, MobileApplication („Face it: Angst & Panikattacken“, Download 0 €, Abo-Preise in der Offer-Beschreibung), FAQPage (deckungsgleich mit der sichtbaren FAQ).
- `aggregateRating` entfernt: Es stand auf 5.0 aus 16, der App Store DE zeigt am 24.09.2026 4,59 aus 22. Außerdem erlaubt Google im eigenen Markup keine Bewertungen, die von einer anderen Seite stammen.

### Gestaltung

- Neue Datei `home.css`, nur von der Startseite geladen (nach `styles.css`, gleiche Tokens): Telefonrahmen `.device` für echte Screens (abgerundete Ecken, dünner dunkler Rand, weicher Schatten, Dynamic Island), Verhaltens-Karten, Video-Block, Schritte, Preis-Pfad.
- Die Fußzeile der Startseite (einzige Seite mit zwei Link-Gruppen) war schon live gequetscht: Die zweite Gruppe landete ab 768 px in einer schmalen Spalte. `home.css` ordnet sie auf Desktop in drei Spalten, auf Tablet einspaltig. Links und Texte der Fußzeile sind unverändert.

### Assets (neu)

| Datei | Quelle | Größe |
|---|---|---|
| `assets/screens/01_today.webp` … `08_chat.webp` (7 Stück) | `Face it!/release1/screenshots_raw/de/`, 720 px breit, WebP | 26 bis 52 KB |
| `assets/video/v1-poster.jpg`, `v4-poster.jpg` | Standbild aus dem Video (V1 bei 4 s wie auf 07_video, V4 bei 7 s) plus Untertitelzeile im App-Stil, 1280 × 720 | je ca. 95 KB |
| `assets/og-startseite.jpg` | gerendert aus Headline, Hinweis und 01_today, 1200 × 630 | 77 KB |

Die Videos selbst lagen schon unter `videos/` (Commit `6b68448`) und werden nur verlinkt.

### Sonstiges

- `llms.txt`: Zusammenfassung oben an die neue Startseite angeglichen. Übrige Einträge unverändert.

## Go-live-Voraussetzungen

1. **Version 3.1 muss live sein.** Live ist am 24.09.2026 Version 3.0.2. Die Seite beschreibt Funktionen aus 3.1 (neue Panikhilfe, Erwartungs-Check und Beweise, Termin, Gründer-Videos, Coach in der Tasche, KI-Einwilligung, „Methode und Quellen“). Vorher würde sie etwas versprechen, das die App noch nicht hat (Apple 2.3.1(a), UWG).
2. **SEO-Änderungslog:** Dort steht „Nicht anfassen bis dahin [Messung ab 28.10.2026]: Startseiten-Title“. Der Relaunch ändert Title und Inhalt. Entweder nach dem 28.10. live gehen oder bewusst vorziehen (die Startseite rankt vor allem für die Marke, Hebel 1 und 2 liegen auf anderen Seiten). Beim Go-live den Eintrag unten übernehmen und in `sitemap.xml` das `lastmod` der Startseite auf das Go-live-Datum setzen.
3. **Stimmen-Abschnitt** entscheiden (Entscheidung 1).
4. Nach dem Go-live: OG-Vorschau neu einlesen lassen (Facebook Sharing Debugger), URL-Prüfung in der Search Console.

## Offene Entscheidungen für dich

### 1. Stimmen „Sie haben es schon getan.“ (vom Gründer zu bestätigen)

Inhalt unverändert übernommen. Geändert sind nur Position (nach dem Gründer) und Styling (breitere Karten; der Zuordnungsstrich vor „App Store User“ ist jetzt eine Linie statt „—“, der Wortlaut ist gleich). Vor Go-live klären:

- Die Zeile „5.0 · 16 Reviews · App Store Top Mental Health Apps“ stimmt nicht mehr: Die öffentliche App-Store-Abfrage (DE, 24.09.2026) liefert 4,59 Sterne aus 22 Bewertungen. „Top Mental Health Apps“ ist nicht belegt.
- Herkunft der drei Zitate: Sind es echte App-Store-Rezensionen mit genau diesem Wortlaut? Der Research-Bericht vom 23.09. beschreibt bei den vorhandenen Rezensionen Merkmale nicht-organischer Bewertungen.
- Zitat 1 vergleicht mit Therapie („mehr gesagt als drei Monate Therapie“). Das widerspricht deinen Copy-Regeln und § 11 HWG (Nutzerzitate mit Wirkungsaussage). Alle drei Zitate handeln von KI und Ehrlichkeit, nicht von Panik.
- Mein Vorschlag: Zahlenzeile streichen und den Abschnitt ausblenden, bis nach 3.1 echte, organische Bewertungen mit Panik-Bezug da sind.

### 2. Gründer-Abschnitt

Der alte, seit Mai ausgeblendete Gründer-Text ist von „Stephan“ und nutzt `assets/stephan.jpg`. Das Foto trägt unten rechts das Gemini-Wasserzeichen (vierzackiger Stern), ist also KI-generiert, und zeigt nicht die Person aus den Videos. In App und Store-Text 3.1 ist Sergej der Gründer. Deshalb habe ich weder die Stephan-Geschichte noch das Foto übernommen.

Der neue Abschnitt enthält nur belegte Aussagen: „Ich bin Sergej, ich habe Face it gebaut“ und „Eins verspreche ich dir: Es wird unangenehm“ (V1), „kennt Panikattacken selbst“ (Store-Beschreibung 3.1), „kein Therapeut, die Übungen kommen aus der Verhaltenstherapie, Face it ersetzt keine Therapie“ (Videokonzept und Onboarding der App). Statt eines Fotos steht dort Video V1.

- Frage: Ist die Stephan-Geschichte deine eigene? Wenn ja, steht ganz unten ein angepasster Absatz nur aus Sätzen des alten Textes, zum Einfügen nach deiner Freigabe. Wenn nein, bitte nicht verwenden.
- Außerhalb der Startseite (nicht angefasst): 31 Ratgeber-Seiten und `/apps-gegen-angst/` nennen „Stephan“ als Autor und Gründer, mit JSON-LD `Person` und dem KI-Foto. Das passt nicht zu „Videos von Sergej, dem Gründer“ und ist nach § 3 HWG (irreführende Angaben über die Person des Herstellers) ein Risiko. Das wäre eine eigene Aufgabe.

### 3. Videos als KI-Avatar

Laut `release1/VIDEOS_README.md` und dem App-Text zeigen die Videos „Sergej als KI-Avatar, gesprochen nach seinem Skript“. Die Seite kennzeichnet beide Videos genauso. Bitte bestätigen, dass Avatar und Stimme auf dir beruhen und du mit der Nutzung auf der Website einverstanden bist. In den Transkripten (dein O-Ton) stehen zwei Formulierungen, die ich in eigenem Text nicht verwenden würde: „fängt es an, besser zu werden“ (V1) und „heil rausgekommen“ (V4). Unverändert gelassen, weil es der Wortlaut im Video ist.

### 4. OG-Bild

Neu ist `assets/og-startseite.jpg` (Vorschau: `_seo/relaunch_preview/og-startseite.png`). Vorher stand dort `gallery-chat.jpg`: Hochformat, alte Oberfläche mit englischem Chat. Das alte Bild bleibt auf den übrigen 33 Seiten das OG-Bild. Bitte freigeben oder ersetzen.

### 5. Preise und kostenlose Tage

9,99 €/Monat und 59,99 €/Jahr (entspricht 5 € im Monat) aus der alten Seite, gegengeprüft mit der öffentlichen App-Store-Seite DE am 24.09.2026 (In-App-Käufe 9,99 € und 59,99 €). Abweichungen an anderer Stelle: Quiz und Web-Checkout nennen 8,99 €/Monat; der Paywall-Screenshot zeigt US-Preise. Die Kostenlos-Logik folgt dem Store-Text 3.1 (Panikhilfe immer, Tag 1 und 2 ohne Abo, dann 3 Tage Test). Bitte bestätigen, dass das in 3.1 so bleibt.

### 6. Texte außerhalb der Startseite, die nicht mehr ganz passen (nicht angefasst)

- Header-CTA der anderen Seiten: „3 Tage gratis testen“ (Startseite jetzt „Kostenlos laden“).
- Footer-Claim auf allen Seiten, auch der Startseite: „Die KI, die dich konfrontiert statt beruhigt.“ Laut Auftrag bleibt der Footer, passt aber nicht mehr zu „Durchziehen statt vermeiden“.
- CTA-Bänder der Ratgeber-Seiten: „Reality Check für immer kostenlos“, Gedankenstriche, „die KI, die dich konfrontiert“.

### 7. Bewusst nicht übernommen

- Therapie-Vergleiche und Kosten („€80–120 / Stunde“, „Bessere Rendite als jede Therapiestunde“, „Therapeuten dürfen es nicht“), Konkurrenz-Namen, Funktionen, die es in 3.1 so nicht gibt („Reality Check“, „Fear Profile“, „tägliche Aufträge“), die Hero-Zeile „5.0 auf dem App Store“ und Angst-Aussagen nach dem Muster „es wird immer schlimmer“ (§ 11 HWG Nr. 7).
- Alte FAQ-Aussage „Gespräche verschlüsselt, jederzeit löschbar, keine Daten an Dritte verkauft, anonym nutzbar“: ungeprüft, deshalb ersetzt durch die Einwilligungstexte der App 3.1. Laut Research meldet die App die Panikhilfe-Nutzung als Event an Meta; das sollte geklärt sein, bevor die Website mehr über Datenschutz verspricht.

### 8. Android

„Aktuell nur für iOS, also iPhone und iPad. Eine Android-Version ist in Arbeit.“ stammt aus der alten FAQ. Stimmt das noch?

## Wird nach den neuen Store-Screenshots ausgetauscht

- `assets/screens/05_expectation_result.webp` (zeigt „4.8 → 4.7“ mit Dezimalpunkt)
- `assets/screens/08_chat.webp` (Chat-Header „Face It“)

Gleiche Dateinamen behalten, dann ändert sich am HTML nichts. Im Landing-Repo:

```sh
python3 - <<'PY'
from PIL import Image
src = '/Users/sergejmarkwart/Downloads/Face it!/Face it!/release1/screenshots_raw/de/'
for n in ['05_expectation_result', '08_chat']:
    im = Image.open(src + n + '.png').convert('RGB')
    im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS).save(
        f'assets/screens/{n}.webp', 'WEBP', quality=86, method=6)
PY
```

Danach die Alt-Texte der beiden Bilder in `index.html` mit dem neuen Bildinhalt abgleichen. Wird 01_today neu aufgenommen, auch das OG-Bild neu rendern.

## Qualitätscheck (24.09.2026)

- Gerendert mit Headless-Chrome 153 über das DevTools-Protokoll (die Kommandozeile mit `--screenshot` blieb nach dem Bild hängen). Beim Rendern waren GA4, Meta, Clarity und `recordLandingVisit` blockiert, damit keine Testbesuche in den Statistiken landen.
- Kein horizontales Scrollen bei 320, 360, 390, 414, 768, 820, 1024, 1280, 1440 und 1920 px.
- Alle 9 Bilder und beide Poster laden, keine JavaScript-Fehler. Play-Knopf mit echtem Mausklick getestet: Das Video startet, die Steuerleiste erscheint, ein zweites Video pausiert das erste.
- Alle 40 internen Linkziele existieren (Navigation, Mega-Menü, Footer, Kontextlinks, Assets).
- Tracking-Blöcke, Navigation, Mega-Menü, Footer-Markup und Skript-Einbindung sind byte-gleich zu `main`, der Header bis auf den CTA-Text.
- Texte: keine „—“ oder „–“, kein „ausweichen“, keine Heil-, Linderungs- oder Therapieversprechen im eigenen Text; „ersetzt keine Therapie“ nur als Hinweis. Bewusst unverändert: Stimmen-Zitat 1 und der O-Ton in den Transkripten.
- JSON-LD gültig; FAQ-Markup deckt sich mit der sichtbaren FAQ.
- Seitenlänge: mobil 15.661 px (alt 22.518), Desktop 11.801 px (alt 17.839).

Vorschaubilder in `_seo/relaunch_preview/` (lokal; `_seo/` ist gitignored und wird weder committet noch deployt):

- `mobil-390-erster-screen.png`, `mobil-390-ganze-seite.png`
- `desktop-1440-erster-screen.png`, `desktop-1440-ganze-seite.png`
- `tablet-820-erster-screen.png`, `og-startseite.png`

## Eintrag für `SEO_CHANGELOG.md` beim Go-live (Vorschlag)

```
### TT.MM.2026: Relaunch Startseite auf Face it 3.1
- Title von „Face it — Die KI, die dich konfrontiert statt beruhigt“ auf „Face it: App gegen Panikattacken und Angst. Durchziehen statt vermeiden.“; Description, OG-Tags und Inhalt komplett neu (Positionierung 3.1). URL, Navigation, Footer und bestehende interne Links unverändert; neu verlinkt: Sicherheitsverhalten, Beruhigung, App statt Therapie.
- JSON-LD: MobileApplication und FAQPage, aggregateRating entfernt.
- Messen: Klicks und CTR der Markenanfragen, Impressionen für „panikattacken app“, Klicks auf die drei Kontextlinks, GA4 cta_click und video_play.
```

## Optional aufräumen (nicht gemacht)

Von keiner Seite mehr eingebunden: `assets/promo.mp4` (46 MB), `screen-chat.png`, `screen-ladder.png`, `screen-reality.png`, `hero-illustration.jpg`, `gallery-challenge.jpg`, `gallery-reflect.jpg`, `gallery-tools.jpg`, `illust-*.png`. Im geteilten CSS und JS ungenutzt, aber harmlos: die `.fad-*`-Stile in `styles.css` und die Hero-Animation in `script.js` (bricht ohne ihr Markup sofort ab).

## Angepasster Gründer-Absatz (nur falls die Stephan-Geschichte deine ist)

Nur Sätze aus dem alten Text, auf Panik gekürzt, ohne Konkurrenz-Namen und ohne Therapie-Vergleich. Einfügen nach „Ich kenne Panikattacken selbst. Und ich bin kein Therapeut.“:

> Ich habe das Haus drei Wochen lang nicht verlassen. Nicht weil ich faul war. Weil mein Körper mich nicht ließ: Panikattacken, wenn ich nur an die Tür dachte.
>
> In zwei Jahren habe ich alles probiert. Es hat alles ein bisschen geholfen. Nichts hat es gelöst.
>
> Alle haben mich gestreichelt. Und wer gestreichelt wird, bleibt sitzen.
>
> Ich habe Face it gebaut, weil ich genau diese App gebraucht hätte, als ich am Boden lag.
