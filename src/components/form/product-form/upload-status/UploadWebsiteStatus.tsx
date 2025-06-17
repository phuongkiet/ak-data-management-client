import { observer } from "mobx-react-lite";
import ReactSelect from "react-select";
import { ProductDetail } from "../../../../app/models/product/product.model.ts";
import { UploadWebsiteStatus, NoticeDataWebsite } from "../../../../app/models/product/enum/product.enum.ts";
import { useStore } from "../../../../app/stores/store.ts";
import { uploadWebsiteStatusToVietnamese } from "../../../../app/common/common";
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
            }),
            valueContainer: (base) => ({
              ...base,
              height: "44px",
              padding: "0 8px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "44px",
            }),
            option: (base, state) => ({
              ...base,
              fontFamily: "Roboto, sans-serif",
              backgroundColor: state.isFocused ? "#f3f4f6" : "white",
              color: "black",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default observer(UploadWebSiteStatusGroup);
