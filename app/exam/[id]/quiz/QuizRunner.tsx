"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Exam, Question } from "@/lib/exams";

export type QuizMode = "sequential" | "random" | "repeat";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOrder(questions: Question[], mode: QuizMode): Question[] {
  if (mode === "random") return shuffle(questions);
  return questions.slice();
}

export default function QuizRunner({
  exam,
  mode,
}: {
  exam: Exam;
  mode: QuizMode;
}) {
  const [seed, setSeed] = useState(0);
  const order = useMemo(
    () => buildOrder(exam.questions, mode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exam, mode, seed],
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, answered: 0 });
  const [finished, setFinished] = useState(false);

  const total = order.length;
  const current = order[index];

  function choose(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    setStats((s) => ({
      correct: s.correct + (i === current.correctIndex ? 1 : 0),
      answered: s.answered + 1,
    }));
  }

  function next() {
    const isLast = index === total - 1;
    if (isLast) {
      if (mode === "repeat") {
        setIndex(0);
        setSeed((s) => s + 1);
        setSelected(null);
        setRevealed(false);
        return;
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setSeed((s) => s + 1);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setStats({ correct: 0, answered: 0 });
    setFinished(false);
  }

  if (finished) {
    const pct = stats.answered
      ? Math.round((stats.correct / stats.answered) * 100)
      : 0;
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Hoàn thành!
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Đúng {stats.correct} / {stats.answered} câu ({pct}%)
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Làm lại
          </button>
          <Link
            href={`/exam/${exam.id}`}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Đổi chế độ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Câu {index + 1} / {total}
          {mode === "repeat" && " (lặp lại)"}
        </span>
        <span>
          Đúng {stats.correct} / {stats.answered}
        </span>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {current.question}
        </h2>

        <ul className="mt-5 space-y-2">
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === current.correctIndex;
            let cls =
              "w-full text-left rounded-lg border px-4 py-3 transition border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600";
            if (revealed) {
              if (isCorrect) {
                cls =
                  "w-full text-left rounded-lg border px-4 py-3 border-green-500 bg-green-50 dark:bg-green-950/40";
              } else if (isSelected) {
                cls =
                  "w-full text-left rounded-lg border px-4 py-3 border-red-500 bg-red-50 dark:bg-red-950/40";
              } else {
                cls =
                  "w-full text-left rounded-lg border px-4 py-3 border-zinc-200 dark:border-zinc-800 opacity-70";
              }
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={cls}
                >
                  <span className="mr-2 inline-block w-6 font-mono text-sm text-zinc-500">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>

        {revealed && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p
                className={
                  selected === current.correctIndex
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }
              >
                {selected === current.correctIndex
                  ? "Chính xác!"
                  : `Sai. Đáp án đúng là ${String.fromCharCode(65 + current.correctIndex)}.`}
              </p>
              <button
                onClick={next}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {index === total - 1
                  ? mode === "repeat"
                    ? "Lặp lại từ đầu"
                    : "Kết thúc"
                  : "Câu tiếp theo"}
              </button>
            </div>
            {current.explanation && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Giải thích
                </p>
                <p className="whitespace-pre-line">{current.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
