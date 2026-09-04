import FaqItem from "./FaqItem";

type Faq = {
  question: string;
  answer: string;
  _id: string;
};

type FaqListProps = {
  faqs: Faq[];
};

export default function FaqList({ faqs }: FaqListProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Find answers to the most common questions about our learning platform.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <FaqItem key={faq._id} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
