<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap — Face it</title>
        <style>
          :root { --bg:#F2EEE5; --card:#FAF7F0; --ink:#0A0A0A; --muted:#5A5754; --line:#D9D2C2; --gold:#C9A961; }
          * { box-sizing: border-box; }
          body { margin:0; background:var(--bg); color:var(--ink);
            font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            line-height:1.5; -webkit-font-smoothing:antialiased; }
          .wrap { max-width:980px; margin:0 auto; padding:2.5rem 1.5rem 4rem; }
          h1 { font-size:1.9rem; font-weight:900; letter-spacing:-0.02em; margin:0 0 .4rem; }
          .lead { color:var(--muted); font-size:.95rem; margin:0 0 1.8rem; }
          .lead a { color:var(--ink); }
          .count { display:inline-block; background:var(--ink); color:var(--bg);
            font-size:.8rem; font-weight:700; padding:.25rem .7rem; border-radius:999px; margin-left:.5rem; }
          table { width:100%; border-collapse:collapse; background:var(--card);
            border:1px solid var(--line); border-radius:14px; overflow:hidden; font-size:.9rem; }
          thead th { text-align:left; background:#EDE8DC; color:var(--ink); font-weight:700;
            padding:.7rem 1rem; font-size:.78rem; text-transform:uppercase; letter-spacing:.08em; }
          tbody td { padding:.7rem 1rem; border-top:1px solid var(--line); vertical-align:top; }
          tbody tr:hover { background:#fff; }
          td.url a { color:var(--ink); text-decoration:none; border-bottom:2px solid var(--gold);
            word-break:break-all; }
          td.url a:hover { background:rgba(201,169,97,.18); }
          td.num { font-variant-numeric:tabular-nums; color:var(--muted); white-space:nowrap; }
          .foot { margin-top:1.4rem; font-size:.8rem; color:var(--muted); }
          @media (max-width:640px){ .hide-sm{ display:none; } h1{ font-size:1.5rem; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Face it — Sitemap
            <span class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span>
          </h1>
          <p class="lead">XML-Sitemap für Suchmaschinen. Maschinenlesbar unter
            <a href="/sitemap.xml">/sitemap.xml</a> · <a href="/">zurück zur Startseite</a></p>
          <table>
            <thead>
              <tr>
                <th>Adresse</th>
                <th class="hide-sm">Priorität</th>
                <th class="hide-sm">Frequenz</th>
                <th>Geändert</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td class="num hide-sm"><xsl:value-of select="s:priority"/></td>
                  <td class="num hide-sm"><xsl:value-of select="s:changefreq"/></td>
                  <td class="num"><xsl:value-of select="s:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <p class="foot">Made with tough love.</p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
