import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const heroImage = "/hero-party.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

type FormStatus = "idle" | "submitting" | "success";

function Index() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: "1",
    organization: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2uFM7SHGSHIQK3ZZ_TjOpmApQljKiMIDhGjhCSXMr2elNSw/formResponse";
    
    const formDataParams = new URLSearchParams();
    formDataParams.append("entry.84460810", formData.fullName);
    formDataParams.append("entry.1720692364", formData.email);
    formDataParams.append("entry.340016205", formData.phone);
    formDataParams.append("entry.546205829", formData.guests);
    formDataParams.append("entry.1711070704", formData.organization);

    try {
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formDataParams.toString(),
      });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("success");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="relative min-h-screen bg-coke-black text-coke-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Hero side */}
        <section className="relative flex min-h-[40vh] flex-col justify-end overflow-hidden lg:min-h-screen">
          <img
            src={heroImage}
            alt="Crowded Coca-Cola World Cup finals watch party at night with a giant screen and stadium lights"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coke-black via-coke-black/70 to-transparent" />
          <div className="absolute inset-0 bg-coke-red/10 mix-blend-multiply" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coke-white/20 bg-coke-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-coke-red" />
              <span className="text-xs font-semibold uppercase tracking-widest text-coke-white">
                RSVP by July 17th
              </span>
            </div>

            <h1 className="font-display text-6xl leading-[0.9] tracking-tight text-coke-white sm:text-7xl lg:text-8xl">
              WORLD CUP
              <br />
              <span className="text-coke-red">FINALS</span>
              <br />
              WATCH PARTY
            </h1>

            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-coke-white/90 sm:text-xl">
              Join us for the ultimate watch party. Experience the biggest match
              of the year with giant screens, ice-cold Coca-Cola, and
              finals-night energy you won&apos;t forget.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium uppercase tracking-wider text-coke-white/80">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>July 19, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon />
                <span>6:00 PM kickoff</span>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon />
                <span>Skylight Hotel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form side */}
        <section className="relative flex flex-col justify-center bg-coke-black px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coke-red">
                Coca-Cola presents
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-tight text-coke-white sm:text-5xl">
                RESERVE YOUR SPOT
              </h2>
              <p className="mt-3 text-coke-white/70">
                Fill in your details below to confirm your RSVP. We&apos;ll send your entry pass via email once approved by the organizer.
              </p>
            </div>

            {status === "success" ? (
              <div className="rounded-2xl border border-coke-red/30 bg-coke-red/10 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coke-red text-coke-white">
                  <CheckIcon />
                </div>
                <h3 className="font-display text-3xl text-coke-white">
                  RSVP RECEIVED
                </h3>
                <p className="mt-3 text-coke-white/80">
                  Your RSVP is being reviewed. We&apos;ll send your watch party pass
                  once the organizer confirms your spot!
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
                      guests: "1",
                      organization: "",
                    });
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-coke-white/20 px-6 py-2.5 text-sm font-semibold text-coke-white transition-colors hover:bg-coke-white/10"
                >
                  Register another guest
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                aria-label="Watch party registration form"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-xs font-semibold uppercase tracking-wider text-coke-white/70"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white placeholder:text-coke-white/30 focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-coke-white/70"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white placeholder:text-coke-white/30 focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="text-xs font-semibold uppercase tracking-wider text-coke-white/70"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 911 000 000"
                      className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white placeholder:text-coke-white/30 focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="guests"
                      className="text-xs font-semibold uppercase tracking-wider text-coke-white/70"
                    >
                      Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option
                          key={n}
                          value={n}
                          className="bg-coke-black text-coke-white"
                        >
                          {n} {n === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="organization"
                    className="text-xs font-semibold uppercase tracking-wider text-coke-white/70"
                  >
                    Organization / Brand
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white placeholder:text-coke-white/30 focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative w-full overflow-hidden rounded-full bg-coke-red px-8 py-4 text-center font-display text-xl tracking-wide text-coke-white transition-all hover:bg-coke-red-glow disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === "submitting" ? (
                      <>
                        <Spinner />
                        Securing your spot...
                      </>
                    ) : (
                      "CLAIM YOUR SPOT"
                    )}
                  </span>
                </button>

                <p className="text-center text-xs text-coke-white/40">
                  By registering, you agree to receive event updates from
                  Coca-Cola. 18+ only.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
