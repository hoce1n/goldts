"use client";

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useGetCoin } from "@/hooks/Coin/useGetCoin"
import { Loader2 } from "lucide-react"
import { Button } from "./Button";

export function CoinDetailsModal({ open, onClose, coinId }: any) {
  
  const { data, isLoading } = useGetCoin(coinId);
  const coin = data?.data;

  return (
    <Transition 
      show={open} 
      as={Fragment}
    >
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
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white shadow-xl p-6">
              
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-3">
                جزئیات محصول
              </Dialog.Title>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
                </div>
              ) : coin ? (
                <div className="space-y-4">
                  
                  {coin.imageUrl && (
                    <img
                      alt={coin.name}
                      src={`/coins/${coin.imageUrl}`}
                      className="w-full h-48 object-contain rounded-md"
                    />
                  )}

                  <div>
                    <h5 className="font-medium text-gray-900">{coin.name}</h5>
                    <p className="text-gray-600 text-sm mt-1">{coin.description}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900">قیمت:</h5>
                    <div className="text-sm mt-1">
                      {coin.finalPrice.toLocaleString()}
                      <span className="text-gray-600 mr-1 text-xs">تومان</span>
                    </div>
                  </div>


                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">وزن:</span>
                      <span className="mr-2 font-medium">{coin.weightInSoot} سوت</span>
                    </div>

                    <div>
                      <span className="text-gray-500">عیار:</span>
                      <span className="mr-2 font-medium">{coin.karat}</span>
                    </div>

                    <div>
                      <span className="text-gray-500">اجرت:</span>
                      <span className="mr-2 font-medium">
                        {coin.mintingFee.toLocaleString()} تومان
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">موجودی:</span>
                      <span className="mr-2 font-medium">{coin.stock}</span>
                    </div>

                    <div>
                      <span className="text-gray-500">وضعیت:</span>
                      <span className="mr-2 font-medium">
                        {coin.isActive ? "فعال" : "غیرفعال"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={onClose}
                    className="w-full"
                  >
                    بستن
                  </Button>

                </div>
              ) : (
                <p className="text-red-500">داده‌ای برای نمایش وجود ندارد.</p>
              )}
            </Dialog.Panel>

          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
