import { SITE_NAME } from "@/app/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-12 md:pt-20 md:pb-25.75 lg:pt-12 lg:pb-14">
      <div className="my-auto flex w-full flex-col items-center">
        <p className="text-logo md:text-logo-md font-sans">pomodoro</p>
        <h1 className="text-timer md:text-timer-md tracking-timer serif:tracking-normal mono:tracking-timer-mono mono:font-normal mt-12 md:mt-20">
          404
        </h1>
        <p className="mt-6 max-w-100 text-center text-sm leading-relaxed md:text-base">
          We could not find that page. Head back to the timer and start your
          next session.
        </p>
        <Link
          href="/"
          className="text-apply bg-accent hover:bg-accent-light text-navy mt-10 inline-flex h-13.25 w-35 items-center justify-center rounded-full transition-colors duration-250 ease-out"
        >
          Back to timer
        </Link>
      </div>
    </main>
  );
}
