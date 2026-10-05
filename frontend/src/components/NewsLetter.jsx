import { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // No mailing-list backend yet, so we only confirm to the shopper.
    toast.success("You're on the list. Watch your inbox for deals!");
    setEmail("");
  };

  return (
    <section className="my-16 rounded-2xl bg-brand px-6 py-12 text-center text-white md:py-16">
      <h2 className="text-2xl font-bold md:text-4xl">Get deals before they sell out</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-white/80 md:text-base">
        One short email a week with new arrivals and discounts. Unsubscribe any time.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-sun"
        />
        <button className="rounded-lg bg-sun px-7 py-3 text-sm font-bold text-ink transition hover:brightness-95">
          Subscribe
        </button>
      </form>
    </section>
  );
};
export default NewsLetter;
