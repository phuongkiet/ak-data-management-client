import { useStore } from "../../../../app/stores/store.ts";
import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { useApi } from "../../../../hooks/useApi.ts";
import { useTheme } from "../../../../app/context/ThemeContext.tsx";

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const FactoryGroup = ({ product, isCreateMode, onChange }: ProductProps) => {
  const { productStore, factoryStore } = useStore();
  const { productForm } = productStore;
  const { getFactoriesBySupplier, productFactoryList, loading } = factoryStore;
  const [selectedFactory, setSelectedFactory] = useState<Option | null>(null);
  const { isOnline } = useApi();
  const prevSupplierId = useRef<number | null>(null);
  const { theme } = useTheme();
  // Mapping list
  const factoryOptions: Option[] = productFactoryList.map((factory) => ({
    value: factory.id,
    label: factory.name,
  }));

  useEffect(() => {
    if (
      productForm.supplierId &&
      productForm.supplierId !== prevSupplierId.current &&
      isOnline
    ) {
      if (productStore.productForm.productFactoryId !== null) {
        productStore.updateProductForm("productFactoryId", null);
      }
      setSelectedFactory(null);
      getFactoriesBySupplier(productForm.supplierId);
      prevSupplierId.current = productForm.supplierId;
    }
    if (!isCreateMode && product?.productFactoryId) {
      const factory = factoryOptions.find(option => option.value === product.productFactoryId);
      setSelectedFactory(factory || null);
    }
  }, [productForm.supplierId, isOnline, isCreateMode, product?.productFactoryId, factoryOptions]);

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={factoryOptions}
          value={selectedFactory}
          defaultValue={null}
          noOptionsMessage={() => "Không có nhà máy"}
          onChange={async (selectedOption) => {
            if (!selectedOption) {
              if (onChange) {
                onChange("productFactoryId", product?.productFactoryId);
              } else if (isCreateMode) {
                productStore.updateProductForm("productFactoryId", null);
              }
              setSelectedFactory(null);
              return;
            }

            if (isCreateMode) {
              if (onChange) {
                onChange("productFactoryId", selectedOption.value);
              } else if (isCreateMode) {
                productStore.updateProductForm("productFactoryId", selectedOption.value);
              }
              setSelectedFactory(selectedOption);
            }
          }}
          placeholder="Chọn nhà máy..."
          isClearable={true}
          className="react-select-container"
          classNamePrefix="react-select"
          isLoading={loading}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
              height: "44px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
              borderColor: theme === 'dark' ? '#384052' : base.borderColor,
              border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
            }),
            valueContainer: (base) => ({
              ...base,
              height: "44px",
              padding: "0 8px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "44px",
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
            }),
            option: (base, state) => ({
              ...base,
              fontFamily: "Roboto, sans-serif",
              backgroundColor: state.isFocused
                ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                : (theme === 'dark' ? '#131827' : 'white'),
              color: theme === 'dark' ? '#fff' : 'black',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            singleValue: (base) => ({
              ...base,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
            input: (base) => ({
              ...base,
              color: theme === 'dark' ? '#fff' : base.color,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default observer(FactoryGroup);
