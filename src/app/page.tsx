import { Pomodoro } from "@/components/pomodoro";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-12 md:pt-20 md:pb-25.75 lg:pt-12 lg:pb-14">
      <div className="my-auto flex w-full flex-col items-center">
        <h1 className="text-logo md:text-logo-md font-sans">pomodoro</h1>
        <Pomodoro />
      </div>
    </main>
  );
}
