export const getChemicalExplanation = (key: string): string => {
  switch (key) {
    case "perchlorate":
      return "Perchlorate có thể ảnh hưởng đến tuyến giáp, đặc biệt ở trẻ em và phụ nữ mang thai. MRL được đặt để hạn chế nguy cơ ảnh hưởng nội tiết.";
    case "chlorate":
      return "Chlorate có thể làm giảm khả năng vận chuyển oxy trong máu. MRL giúp kiểm soát nguy cơ tích tụ từ thuốc bảo vệ thực vật và khử trùng.";
    case "hydrogen_phosphide":
      return "Hydrogen phosphide là một loại khí được sử dụng để xông trùng trong bảo quản ngũ cốc và các sản phẩm khô khác. Quy định tại EU: Theo Regulation (EC) No 396/2005, hydrogen phosphide không có MRL cụ thể cho rau tươi, và do đó, mọi dư lượng phát hiện trong rau tươi đều không được chấp nhận, trừ khi có quy định cụ thể khác. ";
    case "methyl_bromide":
      return "Methyl bromide là chất khí gây độc cao, ảnh hưởng hệ thần kinh trung ương. Giới hạn MRL được thiết lập rất thấp.";
    case "glyphosate_glufosinate":
      return "Các hợp chất diệt cỏ như glyphosate và glufosinate có thể ảnh hưởng tới gan, thận. MRL được đặt để bảo vệ người tiêu dùng.";
    case "nitrat":
      return "Nitrat chuyển hóa thành nitrit trong cơ thể, có thể gây methemoglobinemia. Giới hạn giúp kiểm soát tổng nitrate nạp vào cơ thể.";
    case "dithiocarbamate":
      return "Dithiocarbamate là nhóm thuốc diệt nấm phổ biến. Một số dẫn xuất có thể gây độc mãn tính, nên cần kiểm soát dư lượng.";
    case "ecoli":
      return `E. coli được kiểm tra theo 5 mẫu, phân loại như sau:
      
      - Nếu tất cả < 10² CFU/g → Loại 1 (an toàn).
      - Nếu có 2–3 mẫu thuộc khoảng 10² < m < 10³ CFU/g → Loại 2 (cảnh báo nhẹ).
      - Nếu tất cả 5 mẫu đều thuộc 10² < m < 10³ CFU/g → Loại 3 (cảnh báo cao).
      - Nếu có bất kỳ mẫu nào > 10³ CFU/g → Loại 3 (cảnh báo cao).`;
    case "salmonella":
      return "Salmonella bắt buộc < 0 vì nguy cơ gây bệnh cao, không thể chấp nhận bất kỳ hàm lượng nào và để đảm bảo an toàn tuyệt đối cho người tiêu dùng.";
    case "coliforms":
      return "Coliforms là nhóm vi khuẩn chỉ thị ô nhiễm phân. MRL giúp đánh giá mức độ an toàn vi sinh của rau.";
    case "sulfur_dioxide":
      return "Sulfur là chất bảo quản hoá học,trong nông nghiệp hữu cơ,mọi hình thức dùng hoá chất tổng hợp đều bị cấm,bao gồm cả chất này So2.Nếu phát hiện có So2 tức là vi phạm nguyên tắc canh tác hữu cơ dù hàm lượng rất nhỏ.";
    case "nano3_kno3":
      return "Không có giới hạn dư lượng tối đa (MRL) cụ thể cho NaNO₃ và KNO₃ trong rau không đồng nghĩa với việc chúng hoàn toàn an toàn. Do chúng chủ yếu được chuyển hóa thành NO₃⁻ trong cơ thể và có thể được quản lý thông qua giới hạn tổng Nitrat.\n\nGiới hạn tiêu thụ hàng ngày (ADI): EFSA đã thiết lập mức lượng tiêu thụ hàng ngày chấp nhận được (ADI) cho Nitrat là 3,7 mg/kg trọng lượng cơ thể mỗi ngày. Điều này áp dụng cho tổng lượng Nitrat từ tất cả các nguồn thực phẩm, bao gồm cả rau và nước uống.";

    case "cadmi":
      return "Cadmi là kim loại nặng độc hại, tích tụ lâu dài gây tổn thương thận và xương. MRL nhằm hạn chế phơi nhiễm mãn tính.";
    case "plumbum":
      return "Plumbum (chì) gây ảnh hưởng hệ thần kinh, đặc biệt với trẻ nhỏ. MRL được đặt để giảm thiểu tích lũy chì từ thực phẩm.";
    case "hydrargyrum":
      return "Thủy ngân (Hg) là chất cực độc, ảnh hưởng nghiêm trọng đến thần kinh và thận. Dư lượng dù nhỏ cũng gây nguy hiểm.";
    case "arsen":
      return "Arsen (As) là chất gây ung thư đã được chứng minh. MRL đảm bảo kiểm soát phơi nhiễm lâu dài từ nguồn rau.";

    default:
      return "Hiện chưa có giải thích cụ thể cho chất này.";
  }
};
