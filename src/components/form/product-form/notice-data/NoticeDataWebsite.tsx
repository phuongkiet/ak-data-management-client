import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { NoticeDataWebsite } from "../../../../app/models/product/enum/product.enum.ts";
import { useStore } from "../../../../app/stores/store.ts";
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

const noticeOptions: Option[] = Object.values(NoticeDataWebsite)
  .filter((v) => typeof v === "number")
  .map((value) => ({
    value: value as number,
    label: NoticeDataWebsite[value as number].replace(/([A-Z])/g, " $1").trim(),
  }));

const NoticeDataWebsiteGroup = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const { theme } = useTheme();
  const { productStore } = useStore();
  const noticeValue = typeof product?.noticeDataWebsite === 'number'
    ? product.noticeDataWebsite
    : productStore.productForm.noticeDataWebsite;

  const selectedNotice = noticeOptions.find(
    (option) => option.value === noticeValue
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={noticeOptions}
          value={selectedNotice}
          defaultValue={noticeOptions[2]}
          noOptionsMessage={() => "Không có thông tin"}
          onChange={(selected) => {
            if (!selected) {
              if (onChange) {
                onChange("noticeDataWebsite", null);
              } else if (isCreateMode) {
                productStore.updateProductForm("noticeDataWebsite", 0);
              }
            }

            if (onChange) {
              onChange("noticeDataWebsite", selected?.value || 0);
            } else {
              productStore.updateProductForm(
                "noticeDataWebsite",
                selected?.value || 0
              );
            }
          }}
          placeholder={"Chọn ..."}
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

export default observer(NoticeDataWebsiteGroup);
