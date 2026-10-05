import { features } from "../assets/assets";

const Features = () => (
  <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
    {features.map((f) => (
      <div key={f.title} className="card flex items-center gap-3 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
          <img src={f.icon} alt="" className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-semibold">{f.title}</p>
          <p className="hidden text-xs text-muted sm:block">{f.description}</p>
        </div>
      </div>
    ))}
  </section>
);
export default Features;
