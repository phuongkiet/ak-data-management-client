import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { useStore } from "../../../app/stores/store.ts";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import SizeTableComponent from "../../../components/tables/size/SizeTableComponent.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel.tsx";
import { useApi } from "../../../hooks/useApi.ts";
import ReactSelect from "react-select";
import { useTheme } from "../../../app/context/ThemeContext.tsx";

function SizeTable() {
  const { theme } = useTheme();
  const { sizeStore, companyCodeStore } = useStore();
  const { productSizeList, loading } = sizeStore;
  const { productCompanyCodeList } = companyCodeStore;
  const { isOnline } = useApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleChangeAutoSized = () => {
    if (sizeStore.sizeForm.wide && sizeStore.sizeForm.length) {
      sizeStore.updateSizeForm(
        "autoSized",
        sizeStore.sizeForm.wide + "x" + sizeStore.sizeForm.length
      );
    }
  };

  useEffect(() => {
    if (isOnline) {
      // loadSizes();
      handleChangeAutoSized();
      companyCodeStore.loadCompanyCodes();
    }
  }, [sizeStore.sizeForm.wide, sizeStore.sizeForm.length, isOnline]);

  const handleSubmit = async () => {
    const result = await sizeStore.addSize();
    if (result) {
      handleModalClose();
    }
  };

  // Format company codes for ReactSelect
  const companyCodeOptions = productCompanyCodeList.map((code) => ({
    value: code.id,
    label: code.codeName,
  }));

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    sizeStore.setTerm(term);
  };

  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là bảng kích thước của website An Khánh House"
      />
      <PageBreadcrumb pageTitle="Kích thước" />
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng kích thước"
          addButtonLink={"add-size"}
          addButtonText={"Tạo kích thước"}
          useModal={true}
          isModalOpen={isModalOpen}
          modalClose={handleModalClose}
          onModalOpen={handleModalOpen}
          modalStyle="w-full max-w-2xl rounded-3xl space-y-4 p-6"
          className="text-white"
          modalContent={
            <div>
              <h1 className="text-2xl font-bold mb-2 text-black">
                Tạo kích thước
              </h1>
              <div className="space-y-4">
                {/* Row: Wide and Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <ProductLabel>Chiều rộng</ProductLabel>
                    <Input
                      placeholder="Nhập chiều rộng"
                      value={sizeStore.sizeForm.wide}
                      onChange={(e) =>
                        sizeStore.updateSizeForm("wide", Number(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <ProductLabel>Chiều dài</ProductLabel>
                    <Input
                      placeholder="Nhập chiều dài"
                      value={sizeStore.sizeForm.length}
                      onChange={(e) =>
                        sizeStore.updateSizeForm(
                          "length",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                {/* Row: AutoSized */}
                <div>
                  <ProductLabel>Tự động tính toán</ProductLabel>
                  <Input
                    placeholder="Nhập tự động tính toán"
                    value={sizeStore.sizeForm.autoSized}
                    onChange={() => handleChangeAutoSized()}
                    disabled={true}
                  />
                </div>
                <div>
                  <ProductLabel>Mã công ty</ProductLabel>
                  <ReactSelect
                    placeholder="Chọn mã công ty"
                    value={companyCodeOptions.find(
                      (option) =>
                        option.value === sizeStore.sizeForm.companyCodeId
                    )}
                    onChange={(e: any) =>
                      sizeStore.updateSizeForm("companyCodeId", e.value)
                    }
                    options={companyCodeOptions}
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
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-[#334355] px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-[#334355] focus:outline-none focus:ring-2 focus:ring-[#334355]/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    "Tạo kích thước"
                  )}
                </Button>
              </div>
            </div>
          }
          onSearch={(term) => {
            handleSearch(term);
          }}
          isOnline={isOnline}
        >
          <SizeTableComponent
            data={productSizeList}
            loading={loading}
            totalPages={1}
            currentPage={1}
            onPageChange={() => {}}
            totalCount={productSizeList.length}
            searchTerm={searchTerm}
          />
        </TableComponentCard>
      </div>
    </>
  );
}

export default observer(SizeTable);
