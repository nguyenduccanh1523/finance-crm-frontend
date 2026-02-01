"use client";

import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const { t } = useTranslation();
  const billing = t("billing", { returnObjects: true }) as any;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        {billing.faq.title}
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {billing.faq.items.map((item: any, idx: number) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 data-[state=open]:border-blue-400 dark:data-[state=open]:border-blue-500"
          >
            <div className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
              <AccordionTrigger className="px-6 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                {item.question}
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-6 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
