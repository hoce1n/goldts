import { z } from 'zod'
export const createCoinSchema = z.object({
  name: z.string().min(2, "نام محصول الزامی است"),

  weightInSoot: z.coerce.number().positive("وزن باید بزرگتر از صفر باشد"),
  karat: z.coerce.number().positive("عیار باید بزرگتر از صفر باشد"),
  mintingFee: z.coerce.number().min(0, "اجرت نمی‌تواند مقدار منفی باشد"),
  stock: z.coerce.number().int().min(0, "موجودی باید یک عدد صحیح بزرگتر یا مساوی صفر باشد"),

  description: z.string().optional(),
  imageUrl: z.string().optional(),

  isActive: z.coerce.boolean().default(true),
});

export type CreateCoinForm = z.infer<typeof createCoinSchema>;
