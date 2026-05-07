import Link from "next/link";
import { getExams } from "@/lib/exams";

export default async function Home() {
  const exams = await getExams();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Ôn tập trắc nghiệm
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Chọn một đề để bắt đầu ôn tập. Không có thời gian giới hạn.
          </p>
        </header>

        {exams.length === 0 ? (
          <p className="text-zinc-500">
            Chưa có đề thi nào. Hãy thêm file JSON vào thư mục{" "}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">
              data/exams
            </code>
            .
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {exams.map((exam) => (
              <li key={exam.id}>
                <Link
                  href={`/exam/${exam.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
                >
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {exam.title}
                  </h2>
                  {exam.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {exam.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-zinc-500">
                    {exam.questions.length} câu hỏi
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
