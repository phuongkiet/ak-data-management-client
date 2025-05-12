import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import WaterAbsorptionTableComponent from "../../../components/tables/water-absorption/WaterAbsorptionTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import ReactSelect from "react-select";

const operatorOptions = [
  { value: "≥", label: "≥" },
  { value: "≤", label: "≤" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: "=", label: "=" },
];

function WaterAbsorptionTable() {
  const { waterAbsorptionStore } = useStore();
  const { loadWaterAbsorption, productWaterAbsorptionList, loading } =
    waterAbsorptionStore;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operator, setOperator] = useState("");
  const [level, setLevel] = useState("");

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  useEffect(() => {
    loadWaterAbsorption();
  }, []);

  useEffect(() => {
    if (operator && level) {
      waterAbsorptionStore.updateWaterAbsorptionForm(
        "waterAbsoprtionLevel",
        `${operator} ${level} %`
      );
    }
  }, [operator, level, waterAbsorptionStore]);

  const handleSubmit = async () => {
    const result = await waterAbsorptionStore.addWaterAbsorption();
    if (result) {
      handleModalClose();
    }
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng độ hút nước của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Độ hút nước" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng độ hút nước"
          addButtonLink={"add-water-absorption"}
          addButtonText={"Tạo độ hút nước"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-md rounded-3xl space-y-4 p-6"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2">Tạo mức độ hút nước</h1>
              <div className="grid grid-cols-2 gap-4 space-y-2">
                <div className="col-span-2">
                  <ProductLabel>Mức độ hút nước</ProductLabel>
                  <div className="gap-2">
                    <div className="flex items-center gap-2">
                      <div>
                        <ReactSelect
                          options={operatorOptions}
                          value={operatorOptions.find(
                            (opt) => opt.value === operator
                          )}
                          onChange={(opt) => setOperator(opt?.value || "")}
                          placeholder="Chọn"
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: "44px",
                              height: "44px",
                              fontFamily: "Roboto, sans-serif",
                              fontSize: "14px",
                              width: "128px",
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
                              backgroundColor: state.isFocused
                                ? "#f3f4f6"
                                : "white",
                              color: "black",
                            }),
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          step={0.1}
                          placeholder="Nhập mức"
                          value={level === "" ? "" : Number(level)}
                          onChange={(e) => setLevel(e.target.value)}
                          disabled={!operator}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "Tạo độ hút nước"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            waterAbsorptionStore.setTerm(term);
          }}
        >
          <WaterAbsorptionTableComponent
            data={productWaterAbsorptionList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            onSearch={() => {}}
            totalCount={productWaterAbsorptionList.length}
            searchTerm={""}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(WaterAbsorptionTable);
