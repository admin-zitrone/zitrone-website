"use client"

import * as Accordion from "@radix-ui/react-accordion"

type ArticleFaqItem = {
  question: string
  answer: string
}

type ArticleFaqProps = {
  title: string
  titleId: string
  items: ArticleFaqItem[]
}

export function ArticleFaq({ title, titleId, items }: ArticleFaqProps) {
  return (
    <section className="ds-article-faq" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
      <Accordion.Root type="single" collapsible className="ds-article-faq-list">
        {items.map((item) => (
          <Accordion.Item
            key={item.question}
            value={item.question}
            className="ds-article-faq-item"
          >
            <Accordion.Header asChild>
              <h3>
                <Accordion.Trigger className="ds-article-faq-trigger">
                  <span className="ds-article-faq-question">{item.question}</span>
                  <span className="ds-article-faq-indicator" aria-hidden="true" />
                </Accordion.Trigger>
              </h3>
            </Accordion.Header>
            <Accordion.Content className="ds-article-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
