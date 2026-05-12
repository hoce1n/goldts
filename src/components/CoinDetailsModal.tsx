"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "./Button";

import { useGetCoin } from "@/hooks/Coin/useGetCoin";

import {
  ProductType,
  QuoteSide,
  CreateQuoteResponse,
} from "@/types/quote.types";

import { useCreateQuote } from "@/hooks/Quote/useCreateQuote";
import { useConfirmQuote } from "@/hooks/Quote/useConfirmQuote";

export function CoinDetailsModal({
  open,
  onClose,
  coinId,
}: any) {
  const { data, isLoading } = useGetCoin(coinId);

  const coin = data?.data;

  const [amount, setAmount] = useState(1);

  const [side, setSide] = useState<QuoteSide>(
    QuoteSide.Buy
  );

  const [quote, setQuote] =
    useState<CreateQuoteResponse | null>(null);

  const createQuoteMutation = useCreateQuote();

  const confirmQuoteMutation = useConfirmQuote();

  const isExpired = useMemo(() => {
    if (!quote) return false;

    return new Date(quote.expiresAtUtc).getTime() < Date.now();
  }, [quote]);

  const handleCreateQuote = async () => {
    if (!coinId) return;

    try {
      const res = await createQuoteMutation.mutateAsync({
        productType: ProductType.Coin,
        productId: coinId,
        amount,
        side,
      });

      setQuote(res.data);
    } catch {}
  };

  const handleConfirmQuote = async () => {
    if (!quote || isExpired) return;

    try {
      await confirmQuoteMutation.mutateAsync(
        quote.id
      );

      onClose();
    } catch {}
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-2">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-5">
                جزئیات سکه
              </Dialog.Title>

              {isLoading ? (
                <div className="flex justify-center py-14">
                  <Loader2 className="animate-spin w-7 h-7 text-gray-600" />
                </div>
              ) : coin ? (
                <div className="space-y-5">
                  {coin.imageUrl && (
                    <img
                      alt={coin.name}
                      src={`/coins/${coin.imageUrl}`}
                      className="w-full h-52 object-contain rounded-xl bg-gray-50 border"
                    />
                  )}

                  <div>
                    <h5 className="font-bold text-lg text-gray-900">
                      {coin.name}
                    </h5>

                    <p className="text-sm text-gray-500 mt-1 leading-6">
                      {coin.description}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-2">
                    <div className="text-sm text-gray-500 mb-1">
                      قیمت فعلی
                    </div>

                    <div className="text-xl font-bold text-gray-900">
                      {coin.finalPrice.toLocaleString()}
                      <span className="text-sm font-normal mr-1">
                        تومان
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-sm">
                    <div className="rounded-lg border p-1">
                      <div className="text-gray-500">
                        وزن
                      </div>

                      <div className="font-semibold mt-1">
                        {coin.weightInSoot} سوت
                      </div>
                    </div>

                    <div className="rounded-lg border p-1">
                      <div className="text-gray-500">
                        عیار
                      </div>

                      <div className="font-semibold mt-1">
                        {coin.karat}
                      </div>
                    </div>

                    <div className="rounded-lg border p-1">
                      <div className="text-gray-500">
                        اجرت
                      </div>

                      <div className="font-semibold mt-1">
                        {coin.mintingFee.toLocaleString()}
                      </div>
                    </div>

                    <div className="rounded-lg border p-1">
                      <div className="text-gray-500">
                        موجودی
                      </div>

                      <div className="font-semibold mt-1">
                        {coin.stock}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-5 space-y-4">
                    <h4 className="font-bold text-gray-900">
                      معامله سکه
                    </h4>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        تعداد
                      </label>

                    </div>

                    <div className="gap grid-cols-3 gap-1">
                      <input
                        type="number"
                        min={1}
                        value={amount}
                        onChange={(e) =>
                          setAmount(Number(e.target.value))
                        }
                        className="border rounded-xl outline-none focus:ring-2 focus:ring-black/10"
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          setSide(QuoteSide.Buy)
                        }
                        className={`${
                          side === QuoteSide.Buy
                            ? ""
                            : "!bg-gray-100 !text-gray-700"
                        }`}
                      >
                        خرید
                      </Button>

                      <Button
                        onClick={handleCreateQuote}
                        disabled={
                          createQuoteMutation.isPending
                        }
                        className=""
                      >
                        {createQuoteMutation.isPending ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          "دریافت قیمت لحظه‌ای"
                        )}
                      </Button>
                    </div>


                    {quote && (
                      <div className="rounded-xl border bg-gray-50 p-2 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            قیمت واحد
                          </span>

                          <span className="font-semibold">
                            {quote.unitPrice.toLocaleString()} تومان
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            مبلغ کل
                          </span>

                          <span className="font-bold text-base">
                            {quote.totalPrice.toLocaleString()} تومان
                          </span>
                        </div>

                        <div className="text-xs text-gray-500">
                          اعتبار تا:
                          {" "}
                          {new Date(
                            quote.expiresAtUtc
                          ).toLocaleTimeString("fa-IR")}
                        </div>

                        {isExpired && (
                          <div className="text-sm text-red-500">
                            این قیمت منقضی شده است
                          </div>
                        )}

                        <Button
                          onClick={handleConfirmQuote}
                          disabled={
                            confirmQuoteMutation.isPending ||
                            isExpired
                          }
                          className="w-full"
                        >
                          {confirmQuoteMutation.isPending ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            "تایید معامله"
                          )}
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={onClose}
                      className="w-full !bg-gray-100 !text-gray-800"
                    >
                      بستن
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">
                  داده‌ای برای نمایش وجود ندارد.
                </p>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
