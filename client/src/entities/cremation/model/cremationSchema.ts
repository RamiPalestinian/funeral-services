import { z } from "zod";

const forbidden = [
  "труп",
  "смерть",
  "ритуалка",
  "разлагаться",
  "дешево",
  "бесплатно",
  "обман",
];

function noForbiddenWords(value: string) {
  return !forbidden.some((word) =>
    value.toLowerCase().includes(word.toLowerCase()),
  );
}

export const cremationSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, { message: "Название должно быть не менее 3 символов" })
    .max(100, { message: "Название должно быть не более 100 символов" })
    .refine(noForbiddenWords, {
      message: "Название не может содержать запрещенные слова",
    }),
  description: z
    .string()
    .min(10, { message: "Описание должно быть не менее 10 символов" })
    .max(1000, { message: "Описание должно быть не более 1000 символов" })
    .refine(noForbiddenWords, {
      message: "Описание не может содержать запрещенные слова",
    }),
  price: z.coerce.number().min(0),
  image: z.string().url(),
  category: z
    .string()
    .min(3, { message: "Категория должна быть не менее 3 символов" })
    .max(100, { message: "Категория должна быть не более 100 символов" })
    .refine(noForbiddenWords, {
      message: "Категория не может содержать запрещенные слова",
    }),
  userId: z.number().min(1, { message: "Пользователь должен быть выбран" }),
});

export type CremationSchema = z.infer<typeof cremationSchema>;
export type CremationFormInput = z.input<typeof cremationSchema>;
