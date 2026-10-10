"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-12 md:pt-20 md:pb-25.75 lg:pt-12 lg:pb-14">
      <div className="my-auto flex w-full flex-col items-center">
        <p className="text-logo md:text-logo-md font-sans">pomodoro</p>
        <h1 className="text-modal-title md:text-modal-title-md mt-12 text-center md:mt-20">
          Something stopped the clock
        </h1>
        <p className="mt-6 max-w-100 text-center text-sm leading-relaxed md:text-base">
          The timer hit an unexpected error. Your saved settings are untouched,
          so trying again should pick up where you left off.
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-apply bg-accent hover:bg-accent-light text-navy mt-10 inline-flex h-13.25 w-35 items-center justify-center rounded-full transition-colors duration-250 ease-out"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
