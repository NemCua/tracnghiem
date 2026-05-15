import Link from "next/link";
import { notFound } from "next/navigation";
import { getExam } from "@/lib/exams";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getExam(id);
  if (!exam) notFound();

  const modes = [
    {
      key: "sequential",
      title: "Tuần tự",
      description: "Làm các câu hỏi theo đúng thứ tự trong đề.",
    },
    {
      key: "random",
      title: "Ngẫu nhiên",
      description: "Câu hỏi được xáo trộn ngẫu nhiên mỗi lượt làm.",
    },
    {
      key: "repeat",
      title: "Lặp lại",
      description:
        "Lặp vô hạn — sau khi hết câu hỏi sẽ quay lại từ đầu để luyện thuộc.",
    },
    {
      key: "all-at-once",
      title: "Làm tất cả",
      description:
        "Hiển thị toàn bộ câu hỏi, chọn đáp án rồi nhấn Hoàn thành để xem kết quả.",
    },
  ] as const;

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← Tất cả đề
        </Link>

        <header className="mt-4 mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {exam.title}
          </h1>
          {exam.description && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {exam.description}
            </p>
          )}
          <p className="mt-3 text-sm text-zinc-500">
            {exam.questions.length} câu hỏi
          </p>
        </header>

        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Chọn chế độ ôn tập
        </h2>
        <ul className="grid gap-4">
          {modes.map((mode) => (
            <li key={mode.key}>
              <Link
                href={`/exam/${exam.id}/quiz?mode=${mode.key}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {mode.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {mode.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
