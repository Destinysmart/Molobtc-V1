import { Helmet } from "react-helmet-async";
import molobtcLogo from "../assets/images/molobtc_official_logo_1781542833685.jpg";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleBody?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  keyTakeaways?: string[];
}

export function SEO({
  title = "Molo BTC - Beginner-Friendly Bitcoin Research Workspace",
  description = "Breaking down the physical, digital, and monetary complexity of Bitcoin into beautiful, easily digestible open-source research summaries.",
  image = "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2670&auto=format&fit=crop",
  url = "https://github.com/MoloBTC-Org",
  type = "website",
  publishedTime,
  modifiedTime,
  authorName = "Molo BTC Research Lab",
  articleBody,
  faqItems,
  keyTakeaways
}: SEOProps) {

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://github.com/MoloBTC-Org";
  const currentUrl = url && !url.includes("bitlance.com") ? url : (typeof window !== "undefined" ? window.location.href : "https://github.com/MoloBTC-Org");
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": currentOrigin,
    "name": "Molo BTC Portfolio",
    "description": "Breaking down the physical, digital, and monetary complexity of Bitcoin into beautiful, easily digestible open-source research summaries.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${currentOrigin}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Molo BTC Research Lab",
    "url": currentOrigin,
    "logo": `${currentOrigin}${molobtcLogo}`,
    "sameAs": [
      "https://github.com/MoloBTC-Org",
      "https://x.com/moloBTC"
    ]
  };

  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": ["Article", "ScholarlyArticle"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "headline": title,
    "description": description,
    "image": [image],
    "datePublished": publishedTime || new Date().toISOString(),
    "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": authorName,
      "url": currentOrigin
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Molo BTC Research Lab",
      "logo": {
        "@type": "ImageObject",
        "url": `${currentOrigin}${molobtcLogo}`
      }
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Bitcoin",
        "sameAs": "https://en.wikipedia.org/wiki/Bitcoin"
      },
      {
        "@type": "Thing",
        "name": "Proof of Work",
        "sameAs": "https://en.wikipedia.org/wiki/Proof_of_work"
      }
    ],
    "educationalLevel": "Beginner-Friendly Science Workspace",
    "learningResourceType": "Analytical Research Study",
    ...(articleBody ? { "articleBody": articleBody.substring(0, 10000) } : {}),
    ...(keyTakeaways ? { "abstract": keyTakeaways.join(". ") } : {})
  } : null;

  const faqSchema = (faqItems && faqItems.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}
