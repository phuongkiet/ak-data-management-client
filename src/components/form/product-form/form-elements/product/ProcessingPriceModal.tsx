import { useState } from "react";
import Modal from "../../../../ui/modal";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { CalculateProcessingPriceResponse, ProductDetail } from "../../../../../app/models/product/product.model";
import { useStore } from "../../../../../app/stores/store";
import { observer } from "mobx-react-lite";

interface ProcessingPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDetail;
}

const ProcessingPriceModal = ({
  isOpen,
  onClose,
  product,
}: ProcessingPriceModalProps) => {
  const { productStore, processingStore } = useStore();
  const { productProcessingList } = processingStore;
  const [selectedProcessing, setSelectedProcessing] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [priceData, setPriceData] =
    useState<CalculateProcessingPriceResponse | null>(null);

  const processingOptions = (
    productProcessingList || []
  )
    .filter((processing) => product?.productProcessingId?.includes(processing.id))
    .map((processing) => ({
      value: processing.id,
      label: processing.processingCode,
      description: processing.processingDescription
    }));

  const customOption = ({ innerProps, label, data }: any) => (
    <div {...innerProps} className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="font-medium">{label}</div>
      {data.description && (
        <div className="text-sm text-gray-500">{data.description}</div>
      )}
    </div>
  );

  const handleCalculate = async () => {
    if (!selectedProcessing) return;

    const result = await productStore.calculateProcessingPrice({
      productId: product?.id || 0,
      processingId: selectedProcessing,
      quantity,
    });

    if (result) {
      setPriceData(result);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[600px] px-10 py-10"
    >
      <h1 className="text-2xl font-bold mb-4">Tính giá gia công</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại gia công
          </label>
          <Select
            options={processingOptions}
            onChange={(option) => setSelectedProcessing(option?.value || null)}
            placeholder="Chọn loại gia công"
            className="basic-single"
            classNamePrefix="select"
            components={{ Option: customOption }}
            formatOptionLabel={(option: any) => (
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng
          </label>
          <NumericFormat
            value={quantity}
            onValueChange={(values) => setQuantity(values.floatValue || 1)}
            thousandSeparator
            allowNegative={false}
            displayType="input"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCalculate}
            disabled={!selectedProcessing}
            className="px-4 py-2 bg-[#334355] text-white rounded-lg hover:bg-[#283849] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tính giá
          </button>
        </div>

        {priceData && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chi phí gia công
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {priceData.processingCost.toLocaleString()} VNĐ
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kích thước sau gia công
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {priceData.processedDimensions}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Diện tích sau gia công
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {priceData.processedAreaM2} m²
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giá bán lẻ/viên
                </label>
                <p className="mt-1 text-lg font-semibold">
                  {priceData.retailPricePerPiece.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá website/viên
              </label>
              <p className="mt-1 text-lg font-semibold">
                {priceData.webPricePerPiece.toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default observer(ProcessingPriceModal);
