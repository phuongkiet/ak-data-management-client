import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import Storage from "../../components/common/Storage";

export default function Home() {
  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là trang chủ của trang quản lý dữ liệu sản phẩm An Khánh"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics />

          {/* <MonthlySalesChart /> */}
          <Storage />
        </div>
      </div>
    </>
  );
}
