import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { UploadWebsiteStatus, NoticeDataWebsite } from "../../../../app/models/product/enum/product.enum.ts";
import { useStore } from "../../../../app/stores/store.ts";
import { uploadWebsiteStatusToVietnamese } from "../../../../app/common/common";
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

const statusOptions: Option[] = Object.values(UploadWebsiteStatus)
  .filter((v) => typeof v === "number")
  .map((value) => ({
    value: value as number,
    label: uploadWebsiteStatusToVietnamese(
      UploadWebsiteStatus[value as number]
    ),
  }));

const UploadWebSiteStatusGroup = ({
  product,
  isCreateMode,
  onChange,
}: ProductProps) => {
  const { productStore } = useStore();
  const { theme } = useTheme();
  const selectedStatus = statusOptions.find(
    (option) => option.value === product?.uploadWebsiteStatus
  );

  return (
    <div>
      <div className="relative">
        <ReactSelect
          options={statusOptions}
          value={selectedStatus}
          defaultValue={statusOptions[5]}
          noOptionsMessage={() => "Không có trạng thái"}
          onChange={(selected) => {
            let noticeValue: NoticeDataWebsite = NoticeDataWebsite.No;
            if (selected?.value === 1) noticeValue = NoticeDataWebsite.Ok;
            else if (selected?.value === 7) noticeValue = NoticeDataWebsite.Cancel;

            if (onChange) {
              onChange("uploadWebsiteStatus", selected?.value || 0);
              onChange("noticeDataWebsite", noticeValue);
            } else if (isCreateMode) {
              productStore.updateProductForm("uploadWebsiteStatus", selected?.value || 0);
              productStore.updateProductForm("noticeDataWebsite", noticeValue);
            }
          }}
          placeholder={"Chọn trạng thái..."}
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

export default observer(UploadWebSiteStatusGroup);
