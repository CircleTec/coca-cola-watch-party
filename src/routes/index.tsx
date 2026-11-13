import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const heroImage = "/shik-in-the-garden.jpg";

type IndexSearch = {
  t?: string; // Obfuscated token for ticket type
};

type TicketType = "VIP" | "VVIP";

// The token in the invite link (?t=...) decides which ticket type, and so which form, a guest gets.
const TICKET_MAP: Record<string, TicketType> = {
  "v4k8m1": "VIP",
  "z9w3r5": "VVIP",
};

type FormConfig = {
  // The long ID from the form's public link: docs.google.com/forms/d/e/<formId>/viewform
  formId: string;
  // Each Google Form has its own field IDs, so they are listed per form.
  entries: {
    fullName: string;
    email: string;
    phone: string;
    organization: string;
  };
};

// One Google Form per ticket type. A type with an empty formId is treated as not open yet.
const FORMS: Record<TicketType, FormConfig> = {
  // "Shik VIP"
  VIP: {
    formId: "1FAIpQLSd7NuoGFVRay7lMpCsnHdMzaEbIJWe-6bqGyjVTLJknI8FNvw",
    entries: {
      fullName: "934219041",
      email: "812255169",
      phone: "1644894065",
      organization: "487064818",
    },
  },
  // "Shik VVIP" (a copy of the VIP form, so the field IDs are the same)
  VVIP: {
    formId: "1FAIpQLSeKMF9hJ-4I0YrLve0jEF7MbtrfV0zVC69korTFNbm-q3up8g",
    entries: {
      fullName: "934219041",
      email: "812255169",
      phone: "1644894065",
      organization: "487064818",
    },
  },
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearch => {
    return {
      t: search.t as string | undefined,
    };
  },
  component: Index,
});

type FormStatus = "idle" | "submitting" | "success";

function Index() {
  const { t } = Route.useSearch();
  // Map the random token to the ticket type. A missing or unknown token has no form to submit to.
  const ticketType = t ? TICKET_MAP[t] : undefined;
  const form = ticketType ? FORMS[ticketType] : undefined;
  const isFormReady = Boolean(form?.formId);

  const isRegistrationClosed = false; // We should probably keep this false if they're actively sending links!
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form || !form.formId) return;
    setStatus("submitting");

    const formUrl = `https://docs.google.com/forms/d/e/${form.formId}/formResponse`;

    const formDataParams = new URLSearchParams();
    formDataParams.append(`entry.${form.entries.fullName}`, formData.fullName);
    formDataParams.append(`entry.${form.entries.email}`, formData.email);
    formDataParams.append(`entry.${form.entries.phone}`, formData.phone);
    formDataParams.append(`entry.${form.entries.organization}`, formData.organization);

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
        <section className="relative flex flex-col overflow-hidden bg-coke-black lg:min-h-screen">
          {/* The poster already carries the Mera × Coca-Cola logos and the title, so it is shown
              uncovered (cropped from the bottom on desktop) with the copy below it. */}
          <div className="relative aspect-[1080/972] w-full lg:aspect-auto lg:min-h-[45vh] lg:flex-1">
            <img
              src={heroImage}
              alt="Mera Events and Coca-Cola present Shik in the Garden, with Dawit Melese, Efrem Tamiru and Micheal Belayneh"
              className="absolute inset-0 h-full w-full object-cover object-top"
              width={1080}
              height={972}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-coke-black to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:px-16 lg:pb-16 lg:pt-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coke-white/20 bg-coke-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-coke-red" />
              <span className="text-xs font-semibold uppercase tracking-widest text-coke-white">
                RSVP by Friday, Nov 13
              </span>
            </div>

            <h1 className="font-you2013 text-5xl leading-[0.9] tracking-tight text-coke-white sm:text-6xl xl:text-7xl">
              SHIK <span className="text-coke-red">IN THE</span>
              <br />
              GARDEN
            </h1>

            <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-coke-white/90 sm:text-xl">
              Join us for an unforgettable evening in the garden. Live music
              from Dawit Melese, Efrem Tamiru and Micheal Belayneh, ice-cold
              Coca-Cola, and a night you won&apos;t forget.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium uppercase tracking-wider text-coke-white/80">
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>Nov 14, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon />
                <span>6:00 PM kickoff</span>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon />
                <span>Ghion Hotel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form side */}
        <section className="relative flex flex-col justify-center bg-coke-black px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coke-red">
                Mera Events × Coca-Cola present
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-tight text-coke-white sm:text-5xl">
                {isRegistrationClosed ? "RSVP CLOSED" : "RESERVE YOUR SPOT"}
              </h2>
              {(isRegistrationClosed || isFormReady) && (
                <p className="mt-3 text-coke-white/70">
                  {isRegistrationClosed
                    ? "The RSVP window has ended. Please reach out to the organizers if you have any questions."
                    : "Fill in your details below to confirm your RSVP. We'll send your entry pass via email once approved by the organizer."}
                </p>
              )}
            </div>

            {isRegistrationClosed ? (
              <div className="rounded-2xl border border-coke-white/20 bg-coke-white/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coke-red text-coke-white">
                  <InfoIcon />
                </div>
                <h3 className="font-display text-3xl text-coke-white">
                  REGISTRATION CLOSED
                </h3>
                <p className="mt-3 text-coke-white/80">
                  The RSVP window has closed. Thank you for your interest!
                </p>
              </div>
            ) : !isFormReady ? (
              <div className="rounded-2xl border border-coke-white/20 bg-coke-white/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coke-red text-coke-white">
                  <InfoIcon />
                </div>
                <h3 className="font-display text-3xl text-coke-white">
                  {ticketType ? `${ticketType} RSVP OPENS SOON` : "INVITATION LINK NEEDED"}
                </h3>
                <p className="mt-3 text-coke-white/80">
                  {ticketType
                    ? "Registration for this invitation isn't open yet. Please check back shortly."
                    : "This event is by invitation. Please open the personal link you received to RSVP."}
                </p>
              </div>
            ) : status === "success" ? (
              <div className="rounded-2xl border border-coke-red/30 bg-coke-red/10 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-coke-red text-coke-white">
                  <CheckIcon />
                </div>
                <h3 className="font-display text-3xl text-coke-white">
                  RSVP RECEIVED
                </h3>
                <p className="mt-3 text-coke-white/80">
                  Your RSVP is being reviewed. We&apos;ll send your entry pass
                  once the organizer confirms your spot!
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      fullName: "",
                      email: "",
                      phone: "",
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
                aria-label="Event registration form"
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
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 911 000 000"
                    className="w-full rounded-xl border border-coke-white/15 bg-coke-white/5 px-4 py-3 text-coke-white placeholder:text-coke-white/30 focus:border-coke-red focus:outline-none focus:ring-1 focus:ring-coke-red"
                  />
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
                  By registering, you agree to receive event updates from Coca-Cola. 18+ only.
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

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
