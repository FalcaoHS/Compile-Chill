export function StructuredData() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://compileandchill.dev"
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Compile & Chill",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Portal de descompressão para desenvolvedores. Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X.",
    "sameAs": [
      "https://twitter.com/compileandchill"
    ]
  }

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Compile & Chill",
    "url": baseUrl,
    "description": "Portal de descompressão para desenvolvedores. Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/jogos?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

