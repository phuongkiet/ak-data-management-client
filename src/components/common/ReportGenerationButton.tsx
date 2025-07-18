import { Tooltip } from "react-tooltip";
import { useStore } from "../../app/stores/store";
import { FileIcon } from "../../icons";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";

export const ReportGenerationButton: React.FC = observer(() => {
  const { productStore } = useStore();
  const { generateReport, reportGenerationLoading } = productStore;

  const handleGenerateReport = async () => {
    try {
      if(await generateReport()) {
        toast.success("Báo cáo đã được tạo thành công");
      } else {
        console.error("Lỗi khi tạo báo cáo");
      }

    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={reportGenerationLoading}
      className={`relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
        reportGenerationLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      data-tooltip-id="reload-tooltip"
      data-tooltip-content="Tạo báo cáo"
    >
      <FileIcon className={`size-6 ${reportGenerationLoading ? 'animate-spin' : ''}`} />
      <Tooltip id="reload-tooltip" className="text-md" />
    </button>
  );
});
