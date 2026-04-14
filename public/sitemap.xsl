<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - TSD Events &amp; Decor</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            color: #333;
            margin: 0;
            padding: 2rem;
            background: #f9f9f9;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
          }
          #header {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            border-left: 5px solid #991b1b;
          }
          h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            color: #991b1b;
          }
          p {
            margin: 0 0 5px 0;
            color: #666;
          }
          a {
            color: #991b1b;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          table {
            border: none;
            border-collapse: collapse;
            width: 100%;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
            color: #4b5563;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background-color: #fef2f2;
          }
          .badge {
            background-color: #fee2e2;
            color: #991b1b;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div id="header">
            <h1>XML Sitemap</h1>
            <p>This is an XML Sitemap for <strong>TSD Events &amp; Decor</strong>, meant to be consumed by search engines like Google or Bing.</p>
            <p>You can find more information about XML sitemaps on <a href="https://sitemaps.org" target="_blank">sitemaps.org</a>.</p>
            <p style="margin-top: 15px; font-weight: 500;">
              This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
            </p>
          </div>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Images</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:value-of select="count(image:image)"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
