import { useEffect, useMemo, useState } from "react";
import { useCreateQuote } from "./useCreateQuote";
import { useConfirmQuote } from "./useConfirmQuote";
import { useDebounce } from "../useDebounce";
import { ProductType, QuoteSide } from "@/types/quote.types";
import { toast } from "sonner";
import { normalizeNumericInput } from "@/components/GoldCalc";

export function useQuoteEngine(pricePerGram: number){
    // form-like state:
    const [mode, setMode] = useState<'buy' | 'sell'>('buy');
    const [inputType, setInputType] = useState<'rial' | 'mg'>('rial');
    const [value, setValue] = useState('');

    // api:
    const {
        mutateAsync: createQuote,
        data: quote,
        isPending: isQuoting,
        error: quoteError,
    } = useCreateQuote();

    const {
        mutateAsync: confirmQuote,
        isPending: isConfirming
    } = useConfirmQuote();

    // price:
    const pricePerMg = useMemo(
        () => (pricePerGram ? pricePerGram / 1000 : 0),
        [pricePerGram]
    );

    // mg calculation:
    
    const [resultMg, setResultMg] = useState<number | null>(null);
    const debouncedMg = useDebounce(resultMg, 400);

    useEffect(() => {
        if (!pricePerMg || !value.trim()) {
            setResultMg(null);
            return;
        }

        const num = Number(normalizeNumericInput(value));
        if (!num || num <= 0) {
            setResultMg(null);
            return;
        }

        setResultMg(
            inputType === 'mg'
            ? num
            : Math.floor(num / pricePerMg)
        )
    }, [value, inputType, pricePerMg])

    // createQuote:
    useEffect(() => {
        if (!debouncedMg || debouncedMg <= 0) return;

        createQuote({
            productType: ProductType.MeltedGold,
            amount: debouncedMg / 1000,
            side: mode === 'buy' ? QuoteSide.Buy : QuoteSide.Sell
        });
    }, [debouncedMg, mode ]);

    // timer:
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!quote?.data.expiresAtUtc) {
            setSecondsLeft(null);
            return;
        }

        const expiry = new Date(quote.data.expiresAtUtc).getTime();
        toast.info(expiry);

        const tick = () => {
            const diff = Math.floor((expiry - Date.now()) / 1000);
            setSecondsLeft(diff > 0 ? diff : 0);
        }

        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    }, [quote]);

    // ui helpers:
    const unitPrice = quote?.data.unitPrice
        ? quote.data.unitPrice / 1000
        : null;

    const totalPrice = quote?.data.totalPrice ?? null;

    const minAllowedMg = mode === 'buy' ? 1 : 2;
    const isValid = resultMg !== null && resultMg >= minAllowedMg;

    // preview:
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const openPreview = () => setIsPreviewOpen(true);
    const closePreview = () => setIsPreviewOpen(false);

    // confirm:
    const confirm = async () => {
        if (!quote?.data.id) return;
        try {
            await confirmQuote(quote.data.id);
            closePreview();
        } catch (err: any) {
            toast.error(err);
        }
    }

    return {
        // state
        mode,
        inputType,
        value,
        setMode,
        setInputType,
        setValue,

        // derived
        resultMg,
        unitPrice,
        totalPrice,
        secondsLeft,
        isValid,

        // ui
        isPreviewOpen,
        openPreview,
        closePreview,

        // actions
        isQuoting,
        isConfirming,
        quoteError,
        confirm,
    }
    
}