import "server-only";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

function mapRow(row: { id: number; text: string; done: boolean }): Todo {
  return { id: row.id, text: row.text, done: row.done };
}

export async function listTodos(): Promise<Todo[]> {
  const rows = await sql`
    SELECT id, text, done FROM todos ORDER BY done ASC, created_at ASC
  `;
  return rows.map(mapRow as (row: unknown) => Todo);
}

export async function createTodo(text: string): Promise<void> {
  await sql`INSERT INTO todos (text) VALUES (${text})`;
}

export async function setTodoDone(id: number, done: boolean): Promise<void> {
  await sql`UPDATE todos SET done = ${done} WHERE id = ${id}`;
}

export async function deleteTodo(id: number): Promise<void> {
  await sql`DELETE FROM todos WHERE id = ${id}`;
}

export async function getTodoText(id: number): Promise<string | null> {
  const rows = await sql`SELECT text FROM todos WHERE id = ${id}`;
  return rows.length > 0 ? (rows[0] as { text: string }).text : null;
}
