'use client';

import { ActivitySquare, CheckCircle, Edit, Eye, Loader2, Trash, XCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container"
import { useGetCoins } from "@/hooks/Coin/useGetCoins"
import { Plus } from "lucide-react";
import { useState } from "react";
import { CoinDetailsModal } from "@/components/CoinDetailsModal";
import { CoinFormModal } from "@/components/CoinFormModal";
import { Coin } from "@/types/coin.types";
import { useUpdateCoinStock } from "@/hooks/Coin/useUpdateCoinStock";
import { TextField } from "@/components/Fields";
import { useUpdateCoinMintingFee } from "@/hooks/Coin/useUpdateCoinMintingFee";
import { useToggleCoinStatus } from "@/hooks/Coin/useCoinStatus";
import { useDeleteCoin } from "@/hooks/Coin/useDeleteCoin";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useMe } from "@/hooks/Auth/useMe";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/hooks/Auth/useAuth";
  
export default function Coins() {

const { data, isLoading } = useGetCoins({
    pageNumber: 1,
    pageSize: 10,
});

const coins = data?.data.coins ?? [];

const [openCreate, setOpenCreate] = useState(false);
const [openEdit, setOpenEdit] = useState(false);
const [openDetails, setOpenDetails] = useState(false);
const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
const [togglingId, setTogglingId] = useState<string | null>(null);
const [deleteId, setDeleteId] = useState<string | null>(null);

const updateStockMutation = useUpdateCoinStock();
const updateMintingFeeMutation = useUpdateCoinMintingFee();
const coinStatus = useToggleCoinStatus();
const deleteMutation = useDeleteCoin();

const handleToggleStatus = async (coin: Coin) => {
    try {
        setTogglingId(coin.id);

        await coinStatus.mutateAsync({
            id: coin.id,
            activate: !coin.isActive,
        });
    } finally {
        setTogglingId(null);
    }
};

const handleDelete = async () => {
    if (!deleteId) return;
  
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch {
    }
  };
  const { isAdmin, isManager } = useAuth();

return (
    <Container>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">محصولات</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        لیستی از محصولات فروشگاه طلای محبی
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button
                        variant="outline"
                        onClick={() => setOpenCreate(true)}
                        type="button"
                    >
                        <span className="flex items-center gap-x-1">
                            <Plus />                         
                            <span>افزودن</span>
                        </span>
                    </Button>
                </div>
            </div>

            <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th scope="col" className="py-3.5 pr-3 pl-4 text-right text-sm font-semibold text-gray-900 sm:pl-0">
                                محصول
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                قیمت
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                وزن
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                عیار
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                اجرت
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                موجودی
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                وضعیت
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                توضیحات
                            </th>
                            
                            <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                <span className="sr-only">عملیات</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {isLoading && (
                            <tr>
                                <td colSpan={7} className="text-center p-6">
                                    <Loader2 className="mx-auto animate-spin" />
                                </td>
                            </tr>
                        )}

                        {!isLoading && coins.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center p-6">
                                    محصولی ثبت نشده است.
                                </td>
                            </tr>
                    )}
                    {coins.map((coin) => (
                        <tr key={coin.id}>
                        <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                            <div className="flex items-center">
                                {coin.imageUrl && (
                                    <div className="size-11 shrink-0">
                                        <img 
                                            alt={coin.name}
                                            src={`./coins/${coin.imageUrl}`}
                                            className="size-11 rounded-full" 
                                        />
                                    </div>
                                )}

                            <div className="mr-4">
                                <div className="font-medium text-gray-900">
                                    {coin.name}
                                </div>
                                <div className="mt-1 text-gray-500">
                                    {new Date(coin.createdAt).toLocaleDateString("fa-IR")}
                                </div>
                            </div>
                            </div>
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div className="text-gray-900">
                                <span>{coin.finalPrice.toLocaleString()}</span>
                                <span className="text-xs"> تومان</span>
                            </div>
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div className="text-gray-900">
                                <span>{coin.weightInSoot }</span>
                                <span className="text-xs"> سوت</span>
                            </div>
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div className="text-gray-900">
                                {coin.karat}
                            </div>
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <TextField 
                                className="w-30"
                                disabled={updateMintingFeeMutation.isPending}
                                type="number"
                                defaultValue={coin.mintingFee}
                                onBlur={(e) => {
                                    const newMintingFee = Number(e.target.value);
                                    if (newMintingFee !== coin.mintingFee) {
                                        updateMintingFeeMutation.mutate({
                                            id: coin.id,
                                            mintingFee: newMintingFee
                                        });
                                    }
                                }}
                            />
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <TextField
                                className="w-15"
                                disabled={updateStockMutation.isPending}
                                type="number"
                                defaultValue={coin.stock}
                                onBlur={(e) => {
                                    const newStock = Number(e.target.value);

                                    if (newStock !== coin.stock) {
                                        updateStockMutation.mutate({
                                            id: coin.id,
                                            stock: newStock,
                                        });
                                    }
                                }}
                            />
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                          <button
                            onClick={() => handleToggleStatus(coin)}
                            disabled={togglingId === coin.id}
                            className={`text-xs px-2 py-1 rounded ${
                              coin.isActive ? "text-green-600" : "text-red-500"
                            } disabled:opacity-50`}
                          >
                            {togglingId === coin.id
                              ? <Loader2 className="animate-spin" />
                              : coin.isActive
                              ? <CheckCircle /> 
                              : <XCircle />}
                          </button>

                            {/* {coin.isActive ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                فعال
                            </span>
                            ) : (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">
                                غیرفعال
                            </span>
                            )} */}
                        </td>
                        <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div className="text-gray-900">
                                {coin.description}
                            </div>
                        </td>
                        <td className="relative py-5 pr-4 pl-3 text-left text-sm font-medium whitespace-nowrap sm:pr-0">
                        {isManager &&
                            <BtnGroup 
                                id={coin.id}
                                onView={(id: any) => {
                                    setSelectedCoinId(id)
                                    setOpenDetails(true)
                                }}

                                onEdit={() => {
                                    setSelectedCoin(coin);
                                    setOpenEdit(true);
                                  }}

                                  onDelete={() => setDeleteId(coin.id)}
                            />
                        }
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>

        <CoinFormModal 
            open={openCreate}
            mode="create"
            onClose={() => setOpenCreate(false)}
        />

        <CoinFormModal 
            open={openEdit}
            mode="edit"
            initialData={
                selectedCoin 
                    ? {
                      id: selectedCoin.id,  
                      name: selectedCoin.name,
                      weightInSoot: selectedCoin.weightInSoot,
                      karat: selectedCoin.karat,
                      mintingFee: selectedCoin.mintingFee,
                      stock: selectedCoin.stock,
                      isActive: selectedCoin.isActive,
                      description: selectedCoin.description ?? "",
                      imageUrl: selectedCoin.imageUrl ?? "",
                    }
                  : undefined
              }
            
            onClose={() => setOpenEdit(false)}
        />

        <CoinDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        coinId={selectedCoinId}
        />

        <ConfirmDialog
            open={!!deleteId}
            title="حذف سکه"
            description="آیا از حذف این سکه مطمئن هستید؟ این عملیات قابل بازگشت نیست."
            confirmText="حذف"
            cancelText="انصراف"
            loading={deleteMutation.isPending}
            onCancel={() => setDeleteId(null)}
            onConfirm={handleDelete}
        />
    </Container>
)
}

type BtnGroupProps = {
    id: string
    onView: (id: string) => void
    onEdit: () => void
    onDelete: (id: string) => void
}

function BtnGroup({ id, onView, onEdit, onDelete }: BtnGroupProps) {
    return(
        <span className="isolate inline-flex rounded-md shadow-xs">
        <button
          type="button"
          onClick={() => onView(id)}
          className="relative inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 group"
        >
          <Eye className="w-4 h-4 group-hover:text-green-600" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 group"
        >
          <Edit className="w-4 h-4 group-hover:text-blue-600" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="relative -ml-px inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 group"
        >
          <Trash className="w-4 h-4 group-hover:text-red-600" />
        </button>
      </span>
    )
}