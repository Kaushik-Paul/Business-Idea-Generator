import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Healthcare Consultation Assistant</title>
        <meta name="description" content="AI-powered medical consultation summaries" />
        <link rel="icon" href="https://storage.googleapis.com/kaushik-resources/kaushik-website-logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="https://storage.googleapis.com/kaushik-resources/kaushik-website-logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="https://storage.googleapis.com/kaushik-resources/kaushik-website-logo.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}