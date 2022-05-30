// "use strict";

//#region 0. Khai báo biến
const addNewTaskButton = document.querySelector("#add-new-task-btn");
const submitButton = document.querySelector("#submit-btn");
const taskListElement = document.querySelector("#task-list");
//#endregion

// 1. LNSK click button Add new task
addNewTaskButton.onclick = function (event) {
  const newTaskHTML = `
    <table class="task-item">
        <tr>
        <th>Scheduled progress (%)</th>
        <th>Actual progress (%)</th>
        <th>Budget (VND)</th>
        <th>Cost (VND)</th>
        </tr>
        <tr>
        <td><input type="text" class="scheduled-progress-input" /></td>
        <td><input type="text" class="actual-progress-input" /></td>
        <td><input type="text" class="budget-input" /></td>
        <td><input type="text" class="cost-input" /></td>
        </tr>
    </table>
`;

  const taskItems = document.querySelectorAll(".task-item");
  const lastTaskItem = taskItems[taskItems.length - 1];

  taskListElement.innerHTML += newTaskHTML;
};

// 2. LNSK click button SUBMIT
submitButton.onclick = function (event) {
  //#region 4 element nodelist
  const scheduledProgressNodelist = document.querySelectorAll(
    ".scheduled-progress-input"
  );
  const actualProgressNodelist = document.querySelectorAll(
    ".actual-progress-input"
  );
  const budgetNodelist = document.querySelectorAll(".budget-input");
  const costNodelist = document.querySelectorAll(".cost-input");
  //#endregion

  //#region 4 values array
  const scheduledProgressValues = Array.from(scheduledProgressNodelist).map(
    (element) => element.value
  );
  const actualProgressValues = Array.from(actualProgressNodelist).map(
    (element) => element.value
  );
  const budgetValues = Array.from(budgetNodelist).map(
    (element) => element.value
  );
  const costValues = Array.from(costNodelist).map((element) => element.value);
  //#endregion

  //#region Calculate PV, AC, EV
  const taskNumber = scheduledProgressValues.length;
  let PVs = [],
    ACs = [],
    EVs = [];

  for (let i = 0; i < taskNumber; i++) {
    let PV =
      parseFloat(scheduledProgressValues[i]) * parseFloat(budgetValues[i]);
    let AC = parseFloat(costValues[i]);
    let EV = parseFloat(actualProgressValues[i]) * parseFloat(budgetValues[i]);

    PVs.push(PV);
    ACs.push(AC);
    EVs.push(EV);
  }

  let PVValue = PVs.reduce((total, currentValue) => total + currentValue),
    ACValue = ACs.reduce((total, currentValue) => total + currentValue),
    EVValue = EVs.reduce((total, currentValue) => total + currentValue);
  //#endregion

  //#region Calculate CPI, SPI, Cost Variances, Schedule Variance
  let CPI = EVValue / ACValue;
  let SPI = EVValue / PVValue;

  let CPIResult =
    CPI > 1 ? "Under Budget" : CPI == 1 ? "Exactly on budget" : "Over budget";
  let SPIResult =
    CPI > 1
      ? "Ahead of schedule"
      : CPI == 1
      ? "Exactly on schedule"
      : "Behind schedule";

  let costVariances = (EVValue - ACValue) / EVValue;
  let scheduleVariance = (EVValue - PVValue) / PVValue;
  //#endregion

  //#region Calculate ETC, EAC
  let totalBudget = budgetValues.reduce(
    (total, currentValue) => total + currentValue
  );
  let ETC = (totalBudget - EVValue) / CPI;
  let EAC = ACValue + ETC;
  //#endregion
};

// --- Phần việc còn lại ---

// 3. Hiển thị các giá trị tính toán được ra màn hình theo đúng vị trí

// 4. Validation (Thuần)
// + Khi click button SUBMIT => thực hiện validation tất cả thẻ inputs
// + Bắt buộc nhập vào số (kiểu int hoặc float)
// + Validation ok mới thực code trong hàm submitButton.onclick()

// 5.
// CSS lại trang chủ
// Thêm mô tả và hướng dẫn dùng tool (nếu có) vào file guide.html (Hiếu Huỳnh)

// 6. Hiển thị label số thự tự task (Tuấn)

// 7. Deploy website ? (Tuấn ?)
