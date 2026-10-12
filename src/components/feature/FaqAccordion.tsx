import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`rounded-lg border bg-background-50 transition-colors ${
              isOpen ? "border-primary-300" : "border-background-200/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
            >
              <span className="font-heading text-base md:text-lg font-semibold text-foreground-950">
                {item.question}
              </span>
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 shrink-0">
                <i className={isOpen ? "ri-subtract-line" : "ri-add-line"} />
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 -mt-1 text-sm text-foreground-600 leading-relaxed">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}