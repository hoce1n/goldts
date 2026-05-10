'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCompleteRegistration } from "@/hooks/Auth/useCompleteRegistration";
import { CompleteRegistrationRequest } from "@/types/auth.types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { jalaliToGregorian } from "@/utils/dateUtils";
import { useAuthStore } from "@/stores/auth.store";


export default function RegisterForm() {
    const router = useRouter();
    const { mutate, isPending } = useCompleteRegistration();

    const { register, handleSubmit, formState: { errors } } =
        useForm<CompleteRegistrationRequest>(); 

    const onSubmit = (data: CompleteRegistrationRequest) => {

        const gregorianDate = jalaliToGregorian(data.birthDate as string);

        if (!gregorianDate) {
            toast.error('فرمت تاریخ تولد نامعتبر است. (مثال: 1380/7/27)');
            return;
        }
        const payload: CompleteRegistrationRequest = {
            ...data,
            birthDate: new Date(gregorianDate).toISOString(),
        };
        
        mutate(payload, {
            onSuccess: (res) => {
                if (res.success && res.data.accessToken) {
                    useAuthStore.getState().setAccessToken(res.data.accessToken);

                    router.push('/');
                } 
                else {
                    const details = res.error?.details as Record<string, string[]> | undefined;
                    const message = details && Object.values(details)[0]?.[0]
                        ? Object.values(details)[0][0]
                        : res.error?.message || 'خطایی رخ داده است.';
                    toast.error(message);
                }
            },
            onError: (err) => {
                const details = err.response?.data?.error?.details as Record<string, string[]> | undefined;
                const message = details && Object.values(details)[0]?.[0]
                    ? Object.values(details)[0][0]
                    : err.response?.data?.error?.message || 'خطایی رخ داده است.';
                toast.error(message);
            },
        });
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <Input
                        placeholder="نام"
                        autoFocus
                        {...register('firstName', { required: true })}
                    />
                    {errors.firstName && <span className="text-destructive mr-2 text-xs">الزامی است.</span>}
                </div>

                <div>
                    <Input
                        placeholder="نام خانوادگی"
                        {...register('lastName', { required: true })}
                    />
                    {errors.lastName && <span className="text-destructive text-xs mr-2">الزامی است.</span>}
                </div>

                <div className="col-span-full">
                    <Input
                        className=""
                        placeholder="کد ملی"
                        {...register('nationalCode', { 
                            required: true,
                            minLength: 10,
                            maxLength: 10,
                            pattern: /^[0-9]+$/,
                        })}
                    />
                    {errors.nationalCode && <span className="text-destructive text-xs mr-2">کد ملی باید ۱۰ رقم باشد.</span>}
                </div>

                <Input
                    className="col-span-full"
                    placeholder="ایمیل (اختیاری)"
                    {...register('email', { required: false })}
                />
                <div className="col-span-full">
                    <Input
                        placeholder="1380/7/27"
                        {...register('birthDate', { 
                            required: true,
                            pattern: {
                                value: /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/,
                                message: 'فرمت تاریخ باید به صورت 1380/7/27 باشد'
                            }
                         })}
                        type="text"
                    />
                    {errors.birthDate && <span className="text-destructive text-xs mr-2">errors.birthDate.message || الزامی است.</span>}
                </div>

            </div>
            <Button 
                type="submit" 
                className="mt-8 w-full" 
                disabled={isPending}
            >
                {isPending ? 'در حال ارسال...' : 'تایید'}
            </Button>
        </form>
    );
}