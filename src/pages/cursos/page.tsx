import { useState } from "react";
import SectionHeading from "@/components/feature/SectionHeading";
import CourseCard from "@/components/feature/CourseCard";
import CTASection from "@/components/feature/CTASection";
import { courses, courseTypes } from "@/mocks/courses";

export default function Cursos() {
  const [active, setActive] = useState("todos");
  const filtered = active === "todos" ? courses : courses.filter((c) => c.typeKey === active);

  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="Cursos, charlas y capacitaciones"
            title="Aprende y crece en comunidad"
            description="Encuentros en vivo por videollamada de WhatsApp o Google Meet. Herramientas prácticas para tu bienestar y el de tu familia."
            align="left"
          />
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap gap-2">
            {courseTypes.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setActive(type.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                  active === type.key
                    ? "bg-primary-500 text-background-50 dark:text-foreground-950"
                    : "bg-background-100 text-foreground-700 hover:bg-primary-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                type={course.type}
                description={course.description}
                modality={course.modality}
                dateLabel={course.dateLabel}
                timeLabel={course.timeLabel}
                duration={course.duration}
                priceCrc={course.priceCrc}
                priceUsd={course.priceUsd}
                cover={course.cover}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}