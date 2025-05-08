import { useStore } from '../../../app/stores/store.ts';
import Button from '../../ui/button/Button.tsx'
import { useNavigate } from 'react-router'

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text,
  addButtonLink: string;
  addButtonText: string;
}

const TableComponentCard: React.FC<ComponentCardProps> = ({
                                                            title,
                                                            children,
                                                            className = '',
                                                            desc = '',
                                                            addButtonLink = '',
                                                            addButtonText = ''
                                                          }) => {

  const navigate = useNavigate()
  const { productStore } = useStore()

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-start px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <Button type="button" onClick={() => {
          navigate('/'+ addButtonLink)
          productStore.resetProductForm()
        }} className="ml-4 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800">
          {addButtonText}
        </Button>
      </div>
      {desc && (
        <div className="px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}

export default TableComponentCard
