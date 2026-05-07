import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Exam = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

const EXAMS_DIR = path.join(process.cwd(), "data", "exams");

export async function getExams(): Promise<Exam[]> {
  const files = await fs.readdir(EXAMS_DIR);
  const exams = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(EXAMS_DIR, f), "utf-8");
        return JSON.parse(raw) as Exam;
      }),
  );
  return exams.sort((a, b) => a.title.localeCompare(b.title, "vi"));
}

export async function getExam(id: string): Promise<Exam | null> {
  try {
    const raw = await fs.readFile(
      path.join(EXAMS_DIR, `${id}.json`),
      "utf-8",
    );
    return JSON.parse(raw) as Exam;
  } catch {
    return null;
  }
}
