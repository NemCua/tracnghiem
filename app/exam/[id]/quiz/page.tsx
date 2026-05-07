import Link from "next/link";
import { notFound } from "next/navigation";
import { getExam } from "@/lib/exams";
import QuizRunner, { type QuizMode } from "./QuizRunner";

const VALID_MODES: QuizMode[] = ["sequential", "random", "repeat"];

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode: modeParam } = await searchParams;
  const exam = await getExam(id);
  if (!exam) notFound();

  const mode: QuizMode = VALID_MODES.includes(modeParam as QuizMode)
    ? (modeParam as QuizMode)
    : "sequential";

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-10">
        <Link
          href={`/exam/${exam.id}`}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← Đổi chế độ
        </Link>
        <header className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {exam.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Chế độ:{" "}
            {mode === "sequential"
              ? "Tuần tự"
              : mode === "random"
                ? "Ngẫu nhiên"
                : "Lặp lại"}
          </p>
        </header>
        <QuizRunner exam={exam} mode={mode} />
      </main>
    </div>
  );
}
