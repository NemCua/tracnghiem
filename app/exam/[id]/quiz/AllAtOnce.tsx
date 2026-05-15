"use client";

import { useState } from "react";
import Link from "next/link";
import type { Exam } from "@/lib/exams";

export default function AllAtOnce({ exam }: { exam: Exam }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;

  function choose(questionId: string, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function submit() {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const correct = submitted
    ? exam.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {submitted && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Kết quả
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Đúng{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {correct}
            </span>{" "}
            / {total} câu ({pct}%)
          </p>
          <div className="mt-4 flex gap-3">
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
      )}

      {exam.questions.map((q, idx) => {
        const selected = answers[q.id] ?? null;
        const isCorrect = selected === q.correctIndex;

        return (
          <div
            key={q.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Câu {idx + 1}
            </p>
            <h2 className="text-base font-medium whitespace-pre-line text-zinc-900 dark:text-zinc-50">
              {q.question}
            </h2>

            <ul className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                let cls =
                  "w-full text-left rounded-lg border px-4 py-3 transition text-sm";
                if (!submitted) {
                  cls +=
                    selected === i
                      ? " border-zinc-900 bg-zinc-100 dark:border-zinc-50 dark:bg-zinc-800"
                      : " border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600";
                } else {
                  if (i === q.correctIndex) {
                    cls +=
                      " border-green-500 bg-green-50 dark:bg-green-950/40";
                  } else if (selected === i) {
                    cls += " border-red-500 bg-red-50 dark:bg-red-950/40";
                  } else {
                    cls +=
                      " border-zinc-200 dark:border-zinc-800 opacity-60";
                  }
                }
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => choose(q.id, i)}
                      disabled={submitted}
                      className={cls}
                    >
                      <span className="mr-2 font-mono text-zinc-500">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>

            {submitted && (
              <div className="mt-4 space-y-2">
                <p
                  className={
                    isCorrect
                      ? "text-sm text-green-700 dark:text-green-400"
                      : "text-sm text-red-700 dark:text-red-400"
                  }
                >
                  {selected === null
                    ? `Chưa trả lời. Đáp án đúng: ${String.fromCharCode(65 + q.correctIndex)}.`
                    : isCorrect
                      ? "Chính xác!"
                      : `Sai. Đáp án đúng là ${String.fromCharCode(65 + q.correctIndex)}.`}
                </p>
                {q.explanation && (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Giải thích
                    </p>
                    <p className="whitespace-pre-line">{q.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div className="sticky bottom-6 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500">
            Đã chọn{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {answered}
            </span>{" "}
            / {total} câu
          </p>
          <button
            onClick={submit}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Hoàn thành
          </button>
        </div>
      )}
    </div>
  );
}
