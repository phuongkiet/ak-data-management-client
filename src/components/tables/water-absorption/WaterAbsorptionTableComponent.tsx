import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductWaterAbsorptionDto } from '../../../app/models/product/productWaterAbsorption.model.ts'
import { useStore } from '../../../app/stores/store.ts';
import { observer } from 'mobx-react-lite';
import Modal from '../../ui/modal/index.tsx';
import Button from '../../ui/button/Button.tsx';
import ProductLabel from '../../form/product-form/ProductLabel.tsx';
import ProductInputField from '../../form/product-form/input/product/ProductInputField.tsx';
import ReactSelect from 'react-select';

interface WaterAbsorptionTableComponentProps {
  data: ProductWaterAbsorptionDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const operatorOptions = [
  { value: '≥', label: '≥' },
  { value: '≤', label: '≤' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '=', label: '=' },
];

function parseLevel(str: string): { op: string; val: string } {
  if (!str) return { op: '', val: '' };
  const match = str.match(/^([<>=≤≥]+)\s*([\d.,]+)/);
  if (match) {
    return { op: match[1], val: match[2].replace(',', '.') };
  }
  return { op: '', val: str.replace(/[^\d.,]/g, '').replace(',', '.') };
}

const WaterAbsorptionTableComponent = ({ data }: WaterAbsorptionTableComponentProps) => {
  const { waterAbsorptionStore } = useStore();
  const { loading } = waterAbsorptionStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductWaterAbsorptionDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductWaterAbsorptionDto | null>(null);
  const [operator, setOperator] = useState<string>('');
  const [level, setLevel] = useState<string>('');

  const handleView = (waterAbsorption: ProductWaterAbsorptionDto) => {
    setSelectedItem(waterAbsorption);
    const { op, val } = parseLevel(waterAbsorption.waterAbsoprtionLevel);
    setOperator(op);
    setLevel(val);
    setIsModalOpen(true);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductWaterAbsorptionDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Water Absorptions:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductWaterAbsorptionDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Mức độ',
      selector: row => row.waterAbsoprtionLevel,
      sortable: true,
    },
    {
      name: 'Hành động',
      cell: row => (
        <button
          onClick={() => handleView(row)}
          className="text-blue-600 hover:underline font-medium"
        >
          Xem
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const handleSave = async () => {
    if (selectedItem) {
      const newLevel = operator && level ? `${operator} ${level.replace('.', ',')}%` : '';
      waterAbsorptionStore.updateWaterAbsorptionFormUpdate('waterAbsoprtionLevel', newLevel);
      const success = await waterAbsorptionStore.updateWaterAbsorption(selectedItem.id);
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }else{
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    }
  };

  return (
    <>
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        striped
        selectableRows
        onSelectedRowsChange={handleSelectedRowsChange}
        progressPending={loading}
        progressComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Đang chờ...</div>}
        noDataComponent={<div className="py-8 text-center font-semibold font-roboto w-full">Không có dữ liệu để hiển thị.</div>}
      />
    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Chi tiết độ hút nước
          </h2>
          <div className="space-y-4">
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">Mức độ hút nước</ProductLabel>
              <div className="flex items-center gap-2">
                <div style={{ minWidth: 80 }}>
                  <ReactSelect
                    options={operatorOptions}
                    value={operatorOptions.find(opt => opt.value === operator)}
                    onChange={opt => setOperator(opt?.value || "")}
                    placeholder="Chọn"
                    styles={{
                      control: (base: any) => ({ ...base, minHeight: "44px", height: "44px", width: 80 }),
                      valueContainer: (base: any) => ({ ...base, height: "44px", padding: "0 8px" }),
                      indicatorsContainer: (base: any) => ({ ...base, height: "44px" }),
                      option: (base: any, state: any) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                        color: "black",
                      }),
                    }}
                  />
                </div>
                <div className="flex-1">
                  <ProductInputField
                    type="number"
                    step={0.01}
                    placeholder="Nhập mức"
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    disabled={!operator}
                  />
                </div>
                <span className="ml-2">%</span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg bg-[#334357] text-white hover:bg-[#334357]/80 h-[44px] text-md font-semibold"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="px-4 py-2 bg-[#334357] text-white rounded-lg hover:bg-[#334357]/80 h-[44px] text-md font-semibold"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default observer(WaterAbsorptionTableComponent);
