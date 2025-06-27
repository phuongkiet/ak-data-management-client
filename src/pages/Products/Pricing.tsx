import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DataTable from "react-data-table-component";
import Input from "../../components/form/input/InputField";
import { NumericFormat } from "react-number-format";

const columns = [
  {
    name: "STT",
    selector: (_: any, i?: number) => (i !== undefined ? i + 1 : ""),
    width: "60px",
    center: true,
    cell: (_: any, i: number) => (
      <span className="font-bold text-xs">{i + 1}</span>
    ),
  },
  {
    name: "Mã Barcode",
    selector: (row: any) => row.barcode,
    cell: (row: any) => (
      <span className="font-bold text-xs">{row.barcode}</span>
    ),
    width: "100px",
  },
  {
    name: "Mô tả sản phẩm",
    selector: (row: any) => row.description,
    grow: 2,
    width: "574px",
    cell: (row: any) => (
      <div className="text-xs py-2">
        <span className="font-bold text-xs">{row.productName}</span>
        <span className="ml-2 text-xs">{row.description}</span>
      </div>
    ),
  },
  {
    name: "Kích thước",
    selector: (row: any) => row.size,
    cell: (row: any) => <span className="font-bold text-xs">{row.size}</span>,
    width: "90px",
    center: true,
  },
  {
    name: "Số m2",
    selector: (row: any) => row.m2,
    cell: (row: any) => <span className="font-bold text-xs">{row.m2}</span>,
    width: "90px",
    right: true,
  },
  {
    name: "Số viên",
    selector: (row: any) => row.quantity,
    width: "85px",
    right: true,
    cell: (row: any) => <span className="text-xs">{row.quantity}</span>,
  },
  {
    name: "Đơn giá",
    selector: (row: any) => row.price,
    width: "110px",
    right: true,
    cell: (row: any) => (
      <span className="text-xs">{row.price.toLocaleString()}</span>
    ),
  },
  {
    name: "VAT",
    selector: (row: any) => row.vat,
    width: "70px",
    right: true,
    cell: (row: any) => <span className="text-xs">{row.vat}</span>,
  },
  {
    name: "Bốc vác khác #",
    selector: (row: any) => row.other,
    width: "120px",
    right: true,
    cell: (row: any) => <span className="text-xs">{row.other}</span>,
  },
  {
    name: "Thành tiền",
    selector: (row: any) => row.total,
    width: "110px",
    right: true,
    cell: (row: any) => (
      <span className="font-bold text-xs">{row.total.toLocaleString()}</span>
    ),
  },
  {
    name: "GHI CHÚ",
    selector: (row: any) => row.note,
    grow: 1,
    width: "130px",
    cell: (row: any) => <span className="text-xs">{row.note}</span>,
  },
];

const data = [
  {
    barcode: "TRZ - 8Ô",
    productName: "TRZ - 8Ô",
    description:
      "GẠCH VỈA HÈ 8 Ô XÁM - TERRAZZO - kvsd: FF-14 Tổng số lượng: 0 thùng 263 viên ) ~ 2630 Kg",
    size: "40x40",
    m2: 42.08,
    quantity: 263,
    price: 102000,
    vat: 1.08,
    other: "0 vnd ( vnd/ thùng )",
    total: 4635533,
    note: "Chờ xác nhận ngày giao",
  },
  {
    barcode: "TCT 6811",
    productName: "TCT 6811",
    description:
      "GẠCH MÀU ĐỎ TƯƠI - kvsd: FF-12 Tổng số lượng: 4 thùng 0 viên ) ~ 480 Kg",
    size: "60x60",
    m2: 5.76,
    quantity: 16,
    price: 442000,
    vat: 1.08,
    other: "0 vnd ( vnd/ thùng )",
    total: 2749594,
    note: "Chờ xác nhận ngày giao",
  },
  {
    barcode: "TSMT606",
    productName: "TSMT606",
    description:
      "GẠCH MÀU NÂU - kvsd: FF-11 Tổng số lượng: 1 thùng 0 viên ) ~ 120 Kg",
    size: "60x60",
    m2: 1.44,
    quantity: 4,
    price: 265000,
    vat: 1.08,
    other: "0 vnd ( vnd/ thùng )",
    total: 412128,
    note: "Chờ xác nhận ngày giao",
  },
  {
    barcode: "G49034",
    productName: "G49034",
    description:
      "GẠCH MÀU KEM MỠ - kvsd: FF-02 Tổng số lượng: 95 thùng 5 viên ) ~ 5750 Kg",
    size: "40x40",
    m2: 92,
    quantity: 575,
    price: 171000,
    vat: 1.08,
    other: "0 vnd ( vnd/ thùng )",
    total: 16990560,
    note: "Chờ xác nhận ngày giao",
  },
  {
    barcode: "T01A",
    productName: "T01A",
    description:
      "GẠCH MÀU TRẮNG MỠ - kvsd: FF-03 Tổng số lượng: 7 thùng 0 viên ) ~ 420 Kg",
    size: "40x40",
    m2: 6.72,
    quantity: 42,
    price: 136000,
    vat: 1.08,
    other: "0 vnd ( vnd/ thùng )",
    total: 987034,
    note: "Chờ xác nhận ngày giao",
  },
];

const customStyles = {
  headCells: {
    style: {
      background: "#4c5f78",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "12px",
      borderRight: "1px solid #fff",
    },
  },
  rows: {
    style: {
      borderBottom: "1px dotted #aaa",
      fontSize: "12px",
      minHeight: "36px",
    },
  },
  cells: {
    style: {
      borderRight: "1px solid #f0f0f0",
      fontSize: "12px",
    },
  },
};

const Pricing = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "BangBaoGia",
  });

  return (
    <div>
      <div ref={printRef}>
        <div className="relative mx-auto overflow-auto">
          <img src="/images/product/header.png" alt="header-pricing" />
          <div className="my-5">
            <div className="flex justify-center items-center">
              <h3 className="text-4xl font-bold text-[#334355]">
                Bảng báo giá
              </h3>
            </div>
            <div className="flex justify-center items-center">
              <span className="text-lg font-bold text-[#334355]">
                {new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>

            {/* Thông tin người nhận hàng */}
            <div className="bg-[#4c5f78] py-3">
              <div className="flex justify-center items-center mb-3">
                <h3 className="text-2xl font-bold text-white">
                  Thông tin người nhận hàng
                </h3>
              </div>
              <div className="flex justify-start items-center px-5 gap-2">
                <span className="w-[124px] text-sm text-white">
                  Mã đơn ĐH:{" "}
                </span>
                <div className="flex justify-start items-center gap-8 ml-2">
                  <Input
                    className="max-w-[130px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Mã đơn ĐH"
                  />
                  <Input
                    className="max-w-[300px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Thông tin khách hàng"
                  />
                </div>
                <div className="flex justify-start items-center mx-10 ">
                  <Input
                    className="max-w-[320px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Mã đơn ĐH"
                  />
                  <Input
                    className="max-w-[320px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Thông tin khách hàng"
                  />
                </div>
                <div className="flex justify-between items-center ml-10 gap-6">
                  <Input
                    className="max-w-[300px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Mã đơn ĐH"
                  />
                  <Input
                    className="max-w-[300px] h-[30px] bg-white text-black rounded-none text-center text-xs"
                    placeholder="Thông tin khách hàng"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin công ty */}
            <div className="bg-[#4c5f78] mt-3 py-5 space-y-4 grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <div className="grid grid-cols-12 gap-4 px-5">
                  <div className="col-span-2 flex justify-start items-center gap-2">
                    <span className="text-sm text-white">Tên công ty: </span>
                  </div>
                  <div className="col-span-10">
                    <Input
                      className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                      placeholder="Tên công ty"
                    />
                  </div>
                  <div className="col-span-2 flex justify-start items-center gap-2">
                    <span className="text-sm text-white">Địa chỉ: </span>
                  </div>
                  <div className="col-span-10">
                    <Input
                      className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                      placeholder="Địa chỉ"
                    />
                  </div>
                  {/* Row: Mã số thuế, Phân loại khách hàng, Hình thức thanh toán */}
                  <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 flex justify-start items-center gap-2">
                      <span className="text-sm text-white">Mã số thuế: </span>
                    </div>
                    <div className="col-span-3 flex justify-start items-center">
                      <Input
                        className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                        placeholder="Mã số thuế"
                      />
                    </div>
                    <div className="col-span-2 flex justify-start items-center">
                      <Input
                        className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                        placeholder="Phân loại khách hàng"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end items-center gap-2">
                      <span className="text-xs text-white">
                        Hình thức thanh toán:{" "}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-start items-center">
                      <Input
                        className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                        placeholder="CK"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <div className="grid grid-cols-12 gap-4 px-5">
                  <div className="col-span-3 flex justify-start items-center gap-2">
                    <span className="text-sm text-white">
                      Địa chỉ giao hàng:{" "}
                    </span>
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="w-full h-[60px] bg-white text-black rounded-none text-xs font-bold"
                      placeholder="Địa chỉ"
                    />
                  </div>
                  <div className="col-span-3 flex justify-start items-center gap-2">
                    <span className="text-sm text-white">
                      Ghi chú đơn hàng:{" "}
                    </span>
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="w-full h-[40px] bg-white text-black rounded-none text-xs font-bold"
                      placeholder="Ghi chú"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="py-5 space-y-4 gap-4 w-full max-w-full">
              <DataTable
                columns={columns}
                data={data}
                customStyles={customStyles}
              />
              <div className="flex flex-col items-center mt-2 pr-34">
                <div className="flex w-full justify-end items-center">
                  <span className="font-bold text-sm text-[#334355] mr-3">TẠM TÍNH: </span>
                  <NumericFormat
                    className="h-[30px] w-[200px] bg-white text-black rounded-none text-xs font-bold text-end p-2 border-2 border-gray-300"
                    value={25774848}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator="," 
                    decimalScale={0}
                    fixedDecimalScale={true}
                  />
                </div>
                <div className="flex w-full text-sm justify-end items-center font-bold text-[#334355] mt-2">
                  <span className="font-bold text-sm text-[#334355] mr-3">GIAO HÀNG TRONG NỘI THÀNH HCM: </span>
                  <NumericFormat
                    className="h-[30px] w-[200px] bg-white text-black rounded-none text-xs font-bold text-end p-2 border-2 border-gray-300"
                    placeholder="TẠM TÍNH"
                    value={25774848}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator="," 
                    decimalScale={0}
                    fixedDecimalScale={true}
                  />
                </div>
                <div className="flex w-full text-sm justify-end items-center font-bold text-[#334355]">
                  <span className="font-bold text-sm text-[#334355] mr-3">THANH TOÁN TẠM ỨNG: </span>
                  <NumericFormat
                    className="h-[30px] w-[200px] bg-white text-black rounded-none text-xs font-bold text-end p-2 border-2 border-gray-300"
                    placeholder="TẠM TÍNH"
                    value={25774848}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator="," 
                    decimalScale={0}
                    fixedDecimalScale={true}
                  />
                </div>
                <div className="flex w-full text-sm justify-end items-center font-bold text-[#334355]">
                  <span className="font-bold text-sm text-[#334355] mr-3">HẠN MỨC CÔNG NỢ 30,000,000 TRONG VÒNG 15 NGÀY: </span>
                  <NumericFormat
                    className="h-[30px] w-[200px] bg-white text-black rounded-none text-xs font-bold text-end p-2 border-2 border-gray-300"
                    placeholder="TẠM TÍNH"
                    value={25774848}
                    displayType="text"
                    thousandSeparator="."
                    decimalSeparator="," 
                    decimalScale={0}
                    fixedDecimalScale={true}
                  />
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="bg-[#4c5f78] my-3 p-5 space-y-4 grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex justify-start items-center gap-2">
                    <span className="text-sm text-white">
                      Tổng tiền bằng chữ:{" "}
                    </span>
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                      placeholder="Tổng tiền"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <div className="grid grid-cols-12">
                  <div className="col-span-3 flex justify-start items-center gap-2 ml-5">
                    <span className="text-sm text-white">Tổng cộng: </span>
                  </div>
                  <div className="col-span-9">
                    <Input
                      className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                      placeholder="Tổng cộng"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin banking */}
            <div className="bg-[#4c5f78] my-3 py-5 space-y-4 grid grid-cols-12 gap-4 px-5 h-[220px]">
              <div className="col-span-7">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 flex justify-start items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      Quý khách vui lòng chuyển thanh toán vào tài khoản công ty
                      :
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-start items-center gap-2">
                    <span className="text-xs text-white">Tên tài khoản: </span>
                  </div>
                  <div className="col-span-10">
                    <Input
                      className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                      placeholder="Địa chỉ"
                    />
                  </div>
                  {/* Row: Mã số thuế, Phân loại khách hàng, Hình thức thanh toán */}
                  <div className="col-span-12 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 flex justify-start items-center gap-2">
                      <span className="text-xs text-white">
                        Tên ngân hàng:{" "}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <Input
                        className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                        placeholder="Tên ngân hàng"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end items-center gap-2">
                      <span className="text-xs text-white">Số tài khoản: </span>
                    </div>
                    <div className="col-span-3">
                      <Input
                        className="w-full h-[30px] bg-white text-black rounded-none text-xs"
                        placeholder="Số tài khoản"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-5">
                <div className="flex bg-white rounded shadow h-[180px] border-2 border-black">
                  {/* Thông tin tài khoản: 1 nửa */}
                  <div className="flex flex-col justify-between h-full flex-1 border-r border-[#4c5f78]">
                    <div className="px-3">
                      <span className="font-bold text-xs">Tên tài khoản:</span>
                      <br />
                      <span className="text-xs">
                        CÔNG TY TNHH XUẤT NHẬP KHẨU THƯƠNG MẠI VÀ ĐẦU TƯ AN
                        KHÁNH
                      </span>
                    </div>
                    <div className="px-3">
                      <span className="font-bold text-xs">Tên ngân hàng:</span>
                      <br />
                      <span className="text-xs">ACB PGD NGUYỄN THÁI BÌNH</span>
                    </div>
                    <div className="bg-[#3386c3] text-white font-bold flex items-center justify-between p-2 border-black px-3">
                      <span className="text-xs">Số tài khoản:</span>
                      <span className="tracking-widest text-xs ml-2">
                        8 8 1 1 8 6 6 8
                      </span>
                    </div>
                  </div>

                  {/* QR code: 1 nửa */}
                  <div className="flex-1 flex items-center justify-center h-full ">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/images/product/qr.png"
                        alt="qr"
                        className="w-[167px] h-[167px] object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin ghi chú */}
            <div className="bg-[#4c5f78] py-5 px-2">
              <div className="max-w-6xl mx-auto">
                <div className="text-white font-bold text-lg mb-2">
                  GHI CHÚ:
                </div>
                <div className="bg-white rounded p-8">
                  <ol className="text-xs">
                    <li className="mb-4">
                      <span className="font-bold">1. Giao Nhận Hàng Hóa:</span>
                      <ul className="list-disc ml-6">
                        <li>
                          <span className="font-bold">
                            Kiểm tra & Xác nhận:
                          </span>{" "}
                          Đại diện hai bên cùng kiểm tra hàng (loại, số lượng,
                          tình trạng) và ký xác nhận. Mọi khiếu nại sau ký nhận
                          sẽ không được giải quyết.
                        </li>
                        <li>
                          <span className="font-bold">Địa điểm Giao:</span> Giao
                          tại chân công trình, bốc xếp xuống mặt đất trong phạm
                          vi 10m (không bao gồm hầm, tầng lầu, thềm cao).
                        </li>
                        <li>
                          <span className="font-bold">
                            Giao Vị Trí Đặc Biệt:
                          </span>{" "}
                          Khách hàng tự lo nhân lực/phương tiện nếu yêu cầu giao
                          hầm, tầng lầu.
                        </li>
                        <li>
                          <span className="font-bold">Đơn Hàng Dự Án:</span> Phí
                          vận chuyển & bốc xếp sẽ báo giá riêng theo từng đơn.
                        </li>
                      </ul>
                    </li>
                    <li className="mb-4">
                      <span className="font-bold">2. Quy Định Đổi Trả:</span>
                      <ul className="list-disc ml-6">
                        <li>
                          <span className="font-bold">Vận Chuyển & Phí:</span>{" "}
                          Khách hàng tự vận chuyển hàng trả đến kho Công ty và
                          chịu phí 20% trên tổng giá trị sản phẩm đã mua.
                        </li>
                        <li>
                          <span className="font-bold">Giới Hạn Số Lượng:</span>{" "}
                          Số lượng trả không quá 5% / mã sản phẩm / đơn hàng đổi
                          trả.
                        </li>
                        <li>
                          <span className="font-bold">Thời Gian:</span> Đổi trả
                          trong 7 ngày từ ngày xuất kho.
                        </li>
                        <li>
                          <span className="font-bold">Điều Kiện Hàng:</span> Sản
                          phẩm còn nguyên vẹn, không bể vỡ, nguyên đai kiện, bao
                          bì không rách/ướt, không dính tạp chất hoặc vật liệu
                          khác.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-bold">3. Khuyến Cáo Ốp Lát:</span>
                      <ul className="list-disc ml-6">
                        <li>
                          <span className="font-bold">Keo Dán Gạch:</span> Bắt
                          buộc sử dụng keo dán gạch cho khu vực ốp tường và ốp
                          trên cao. Vui lòng tham khảo tư vấn kỹ thuật từ Công
                          ty chúng tôi.
                        </li>
                        <li>
                          <span className="font-bold">Đường Ron:</span> 1.5-3mm.
                          Dùng ke/nẹp cân bằng & ke ron.
                        </li>
                        <li>
                          <span className="font-bold">Kiểu Ốp:</span> Nên ốp
                          song song hoặc sole tối đa 25%. Tránh ốp sole 50/50.
                        </li>
                        <li>
                          <span className="font-bold">Màu Sắc:</span> Gạch có
                          thể khác biệt màu giữa các viên & lô hàng. Vui lòng
                          kiểm tra kỹ trước khi nhận hàng.
                        </li>
                        <li>
                          <span className="font-bold">Phát Hiện Lỗi:</span> Dừng
                          thi công & báo ngay nếu phát hiện lỗi trước khi ốp.
                          Công ty chúng tôi không chịu trách nhiệm sau khi hoàn
                          thiện.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <img src="/images/product/footer.png" alt="footer-pricing" />
        </div>
      </div>
      <div className="flex justify-start items-center pt-5">
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 bg-[#334355] hover:bg-[#334355]/80 text-white rounded h-[44px] font-semibold text-lg"
        >
          Xuất PDF
        </button>
      </div>
    </div>
  );
};

export default Pricing;
