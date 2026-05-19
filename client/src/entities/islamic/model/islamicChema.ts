import { z } from "zod";

const forbiddenWords = [
  "казино",
  "криптовалюта",
  "крипта",
  "биржа",
  "дешево",
  "бесплатно",
  "обман",
  "полиция",
  "радар",
];

const noForbiddenWords = (value: string) => {
  return !forbiddenWords.some((word) =>
    value.toLowerCase().includes(word.toLowerCase()),
  );
};

export const islamicSchema = z.object({
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
  price: z.coerce.number().min(0, { message: "Цена не может быть отрицательной" }),
  image: z.string().url({ message: "Укажите корректную ссылку на изображение" }),
  category: z
    .string()
    .min(3, { message: "Категория должна быть не менее 3 символов" })
    .max(100, { message: "Категория должна быть не более 100 символов" })
    .refine(noForbiddenWords, {
      message: "Категория не может содержать запрещенные слова",
    }),
  userId: z.number().min(1, { message: "Пользователь должен быть выбран" }),
});

export type IslamicSchema = z.infer<typeof islamicSchema>;
export type IslamicFormInput = z.input<typeof islamicSchema>;
export type IslamicSchemaType = IslamicSchema;
