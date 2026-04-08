export default function FAQSchemaScript() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What type of content does Game Visioning provide?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Game Visioning provides the latest news, analysis, and insights on AI, gaming, and technology industries.',
              },
            },
            {
              '@type': 'Question',
              name: 'How often is the content updated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Our content is updated daily with the latest news from multiple trusted sources including Bloomberg, Financial Times, and Reuters.',
              },
            },
          ],
        }),
      }}
    />
  );
}
