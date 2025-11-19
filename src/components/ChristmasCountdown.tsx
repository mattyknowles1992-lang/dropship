"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getNextChristmas(): Date {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 11, 25, 0, 0, 0, 0);
}

function diffToTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const distance = Math.max(target.getTime() - now, 0);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function ChristmasCountdown() {
  const [target, setTarget] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const next = getNextChristmas();
    setTarget(next);
    setTimeLeft(diffToTimeLeft(next));

    const interval = setInterval(() => {
      setTimeLeft(diffToTimeLeft(next));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isChristmas = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-[#D9A441]/60 bg-[#FFF9F2] px-5 py-4 text-xs text-[#1A1A1A] shadow-sm shadow-black/20">
      <span className="text-xl" aria-hidden="true">
        🎁
      </span>
      {isChristmas ? (
        <p className="text-sm font-semibold text-[#B3202A]">
          It&apos;s Christmas Day! Last-minute gifts now become New Year treats.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B3202A]">
            Countdown to Christmas
          </p>
          <div className="flex gap-2">
            {([
              ["Days", timeLeft.days],
              ["Hours", timeLeft.hours],
              ["Mins", timeLeft.minutes],
              ["Secs", timeLeft.seconds],
            ] as const).map(([label, value]) => (
              <div
                key={label}
                className="flex min-w-[3.2rem] flex-col items-center rounded-xl bg-[#B3202A] px-2 py-1"
              >
                <span className="text-sm font-semibold text-[#FFF9F2] tabular-nums">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-[#D9A441]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
