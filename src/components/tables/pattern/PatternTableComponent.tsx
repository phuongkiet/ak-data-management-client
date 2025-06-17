import { useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ProductPatternDto } from '../../../app/models/product/productPattern.model.ts'
import { useStore } from '../../../app/stores/store.ts';  
import { observer } from 'mobx-react-lite';
import Button from '../../ui/button/Button.tsx';
import Modal from '../../ui/modal/index.tsx';
import ProductLabel from '../../form/product-form/ProductLabel.tsx';
import ProductInputField from '../../form/product-form/input/product/ProductInputField.tsx';
import ProductTextArea from '../../form/product-form/input/product/ProductTextArea.tsx';
interface PatternTableComponentProps {
  data: ProductPatternDto[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  totalCount: number;
  searchTerm: string;
}

const PatternTableComponent = ({ data }: PatternTableComponentProps) => {
  const { patternStore } = useStore();
  const { loading } = patternStore;
  const [selectedProducts, setSelectedProducts] = useState<ProductPatternDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductPatternDto | null>(null);

  const handleView = (pattern: ProductPatternDto) => {
    setSelectedItem(pattern);
    patternStore.patternFormUpdate = {
      name: pattern.name,
      description: pattern.description || '',
      shortCode: pattern.shortCode,
    };
    setIsModalOpen(true);
  };

  const handleSelectedRowsChange = (state: {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: ProductPatternDto[];
  }) => {
    setSelectedProducts(state.selectedRows);
    console.log('Selected Patterns:', state.selectedRows);
    console.log(selectedProducts)
  };

  const columns: TableColumn<ProductPatternDto>[] = [
    {
      name: 'STT',
      selector: row => row.id,
      sortable: true,
      maxWidth: '5px'
    },
    {
      name: 'Tên',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Mã ngắn',
      selector: row => row.shortCode,
      sortable: true,
    },
    {
      name: 'Mô tả',
      selector: row => row.description ? row.description : "Không có mô tả",
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
      const success = await patternStore.updatePattern(selectedItem.id);
      if (success) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }else{
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    } 
  }

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
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Chi tiết hệ vân
          </h2>
          <div className="space-y-4">
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">Tên hệ vân</ProductLabel>
              <ProductInputField
                value={patternStore.patternFormUpdate.name}
                onChange={(e) => patternStore.updatePatternFormUpdate('name', e.target.value)}
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">Mã ngắn</ProductLabel>
              <ProductInputField
                value={patternStore.patternFormUpdate.shortCode}
                onChange={(e) => patternStore.updatePatternFormUpdate('shortCode', e.target.value)}
              />
            </div>
            <div>
              <ProductLabel className="block text-sm font-medium mb-1">Mô tả</ProductLabel>
              <ProductTextArea
                value={patternStore.patternFormUpdate.description || ''}
                onChange={(e) => patternStore.updatePatternFormUpdate('description', e.target.value)}
                rows={4}
              />
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
export default observer(PatternTableComponent);
