interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto max-w-2xl" : "text-left max-w-2xl"}`}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-foreground-950 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm md:text-base text-foreground-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}