interface EditorialSectionProps {
  image: string;
  imageAlt: string;
  title: string;
  children: React.ReactNode;
  quote?: string;
}

export function EditorialSection({ image, imageAlt, title, children, quote }: EditorialSectionProps) {
  return (
    <section className="bg-surface-container py-32 px-8">
      <div className="max-w-screen-2xl mx-auto grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 relative">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-[600px] object-cover rounded-xl shadow-lg"
          />
          {quote && (
            <div className="absolute -top-6 -right-6 md:w-64 p-8 bg-background shadow-2xl rounded-lg hidden md:block">
              <span className="font-serif text-3xl italic text-primary">{quote}</span>
            </div>
          )}
        </div>
        <div className="md:col-span-5 md:pl-12">
          <h2 className="text-5xl font-serif text-on-surface mb-8 leading-tight">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}