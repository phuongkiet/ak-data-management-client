import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import SettingCard from "../components/settings/SettingCard";

export default function Setting() {
  return (
    <>
      <PageMeta
        title="Cài đặt"
        description="Cài đặt"
      />
      <PageBreadcrumb pageTitle="Cài đặt" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <SettingCard />
        </div>
      </div>
    </>
  );
}
