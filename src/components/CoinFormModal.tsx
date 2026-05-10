'use client';

import { useCreateCoin } from "@/hooks/Coin/useCreateCoin";
import { useUpdateCoin } from "@/hooks/Coin/useUpdateCoin";
import { CreateCoinForm, createCoinSchema } from "@/schemas/coin.schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@headlessui/react";
import { SelectField, TextField } from "./Fields";
import { Button } from "./Button";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Props = {
    open: boolean;
    mode: "create" | "edit";
    onClose: () => void;

    initialData?: Partial<CreateCoinForm> & { id?: string };
};

export function CoinFormModal({ open, mode, onClose, initialData }: Props) {

    const createMutation = useCreateCoin();
    const updateMutation = useUpdateCoin();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateCoinForm>({
        resolver: zodResolver(createCoinSchema) as any,
        defaultValues: initialData ?? {}
    });

    useEffect(() => {
        if (open) {
            reset(initialData ?? {});
        }
    }, [open, initialData, reset]);

    const onSubmit: SubmitHandler<CreateCoinForm> = async (data) => {
        
        if (mode === "create") {
            await createMutation.mutateAsync(data);
        } else {
            if (!initialData?.id) {
                toast.error("Missing id for update");
                return;
            }
            await updateMutation.mutateAsync({ 
                id: initialData?.id,
                payload: {
                    name: data.name,
                    weightInSoot: data.weightInSoot,
                    karat: data.karat,
                    mintingFee: data.mintingFee,
                    stock: data.stock,
                    description: data.description,
                    imageUrl: data.imageUrl
                },
            });
        }

        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-xl p-6">
                    
                    <Dialog.Title className="text-lg font-semibold mb-6">
                        {mode === "create" ? "افزودن محصول" : "ویرایش محصول"}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <TextField 
                                    label="نام"
                                    placeholder="نام محصول"
                                    autoFocus
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            <div>
                                <TextField 
                                    label="وزن"
                                    placeholder="بر اساس سوت"
                                    type="number"
                                    {...register("weightInSoot")}
                                />
                                {errors.weightInSoot && <p className="text-red-500 text-sm">{errors.weightInSoot.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <SelectField label="عیار" {...register("karat")}>
                                    <option value="">انتخاب کنید</option>
                                    <option value={18}>18</option>
                                    <option value={21}>21</option>
                                    <option value={22}>22</option>
                                    <option value={24}>24</option>
                                </SelectField>
                            </div>

                            <div>
                                <TextField 
                                    label="موجودی"
                                    type="number"
                                    {...register("stock")}
                                    disabled={mode === 'edit'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <TextField 
                                    label="اجرت"
                                    type="number"
                                    {...register("mintingFee")}
                                    disabled={mode === 'edit'}
                                />
                            </div>

                            <div>
                                <TextField 
                                    label="آدرس تصویر"
                                    placeholder="image.png"
                                    {...register("imageUrl")}
                                />
                            </div>
                        </div>

                        <textarea
                            {...register("description")}
                            placeholder="توضیحات"
                            className="w-full border p-2 rounded"
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            
                            <Button variant='outline' type="button" onClick={onClose}>
                                انصراف
                            </Button>

                            <Button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                {(createMutation.isPending || updateMutation.isPending)
                                    ? <Loader2 className="animate-spin" />
                                    : mode === "create" ? "ذخیره" : "ویرایش"}
                            </Button>

                        </div>

                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
