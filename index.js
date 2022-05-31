"use strict";

//#region 0. Khai báo biến
//#region Element node
const addNewTaskButton = document.querySelector("#add-new-task-btn");
const submitButton = document.querySelector("#submit-btn");
const taskListElement = document.querySelector("#task-list");
//#endregion

//#region Các biến chứa giá trị tính toán
let PVs = [],
  ACs = [],
  EVs = [],
  PVValue,
  ACValue,
  EVValue,
  CPI,
  SPI,
  CPIConclusion,
  SPIConclusion,
  costVariance,
  scheduleVariance,
  totalBudget,
  ETC,
  EAC,
  projectedBudgetOverrun;
//#endregion

//#region Element hiển thị kết quả tính toán
let totalBudgetResultElement = document.querySelector("#total-budget-result");
let ACResultElement = document.querySelector("#AC-result");
let EVResultElement = document.querySelector("#EV-result");
let PVResultElement = document.querySelector("#PV-result");
let CPIResultElement = document.querySelector("#CPI-result");
let costVarianceResultElement = document.querySelector("#cost-variance-result");
let CPIConclusionResultElement = document.querySelector(
  "#CPI-conclusion-result"
);
let SPIResultElement = document.querySelector("#SPI-result");
let scheduleVarianceResultElement = document.querySelector(
  "#schedule-variance-result"
);
let SPIConclusionResultElement = document.querySelector(
  "#SPI-conclusion-result"
);
let ETCResultElement = document.querySelector("#ETC-result");
let EACResultElement = document.querySelector("#EAC-result");
let projectedBudgetOverrunResultElement = document.querySelector(
  "#projected-budget-overrun-result"
);
//#endregion
//#endregion

//#region 1. LNSK click button Add new task
addNewTaskButton.onclick = function (event) {
  let currentTaskNumberLS = localStorage.getItem("currentTaskNumber");
  let currentTaskNumber = currentTaskNumberLS ? Number(currentTaskNumberLS) : 1;

  const newTaskHTML = `
    <div class="task-item">
      <h2 class="task-item__label">Task ${++currentTaskNumber}</h2>
      <table class="task-item__table">
        <tr>
          <th>Scheduled progress (%)</th>
          <th>Actual progress (%)</th>
          <th>Budget ($)</th>
          <th>Cost ($)</th>
        </tr>
        <tr>
          <td><input type="text" class="scheduled-progress-input" /></td>
          <td><input type="text" class="actual-progress-input" /></td>
          <td><input type="text" class="budget-input" /></td>
          <td><input type="text" class="cost-input" /></td>
        </tr>
      </table>
    </div>
  `;
  taskListElement.innerHTML += newTaskHTML;

  localStorage.setItem("currentTaskNumber", currentTaskNumber);
};
//#endregion

//#region 2. LNSK click button SUBMIT
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
    (element) => Number(element.value)
  );
  const actualProgressValues = Array.from(actualProgressNodelist).map(
    (element) => Number(element.value)
  );
  const budgetValues = Array.from(budgetNodelist).map((element) =>
    Number(element.value)
  );
  const costValues = Array.from(costNodelist).map((element) =>
    Number(element.value)
  );
  //#endregion

  // Validation ...

  //#region Calculate PV, AC, EV
  const taskNumber = scheduledProgressValues.length;

  for (let i = 0; i < taskNumber; i++) {
    let PV =
      parseFloat(scheduledProgressValues[i]) * parseFloat(budgetValues[i]);
    let AC = parseFloat(costValues[i]);
    let EV = parseFloat(actualProgressValues[i]) * parseFloat(budgetValues[i]);

    PVs.push(PV);
    ACs.push(AC);
    EVs.push(EV);
  }

  PVValue = PVs.reduce((total, currentValue) => total + currentValue);
  ACValue = ACs.reduce((total, currentValue) => total + currentValue);
  EVValue = EVs.reduce((total, currentValue) => total + currentValue);
  //#endregion

  //#region Calculate CPI, SPI, CPIConclusion, SPIConclusion, Cost Variances, Schedule Variance
  CPI = EVValue / ACValue;
  SPI = EVValue / PVValue;

  CPIConclusion =
    CPI > 1 ? "Under Budget" : CPI == 1 ? "Exactly on budget" : "Over budget";
  SPIConclusion =
    CPI > 1
      ? "Ahead of schedule"
      : CPI == 1
      ? "Exactly on schedule"
      : "Behind schedule";

  costVariance = (EVValue - ACValue) / EVValue;
  scheduleVariance = (EVValue - PVValue) / PVValue;
  //#endregion

  //#region Calculate TotalBudget, ETC, EAC, ProjectedBudgetOverrun
  totalBudget = budgetValues.reduce(
    (total, currentValue) => total + currentValue
  );
  ETC = (totalBudget - EVValue) / CPI;
  EAC = ACValue + ETC;
  projectedBudgetOverrun = EAC - totalBudget;
  //#endregion

  showCalculationResults();
};
//#endregion

//#region 3. Hiển thị các giá trị tính toán được ra màn hình theo đúng vị trí
function showCalculationResults() {
  totalBudgetResultElement.innerHTML += ` $${totalBudget}`;
  ACResultElement.innerHTML += ` $${ACValue}`;
  EVResultElement.innerHTML += ` $${EVValue}`;
  PVResultElement.innerHTML += ` $${PVValue}`;
  CPIResultElement.innerHTML += ` ${CPI}`;
  costVarianceResultElement.innerHTML += ` ${costVariance}%`;
  CPIConclusionResultElement.innerHTML += ` ${CPIConclusion}`;
  SPIResultElement.innerHTML += ` ${SPI}`;
  scheduleVarianceResultElement.innerHTML += ` ${scheduleVariance}%`;
  SPIConclusionResultElement.innerHTML += ` ${SPIConclusion}`;
  ETCResultElement.innerHTML += ` $${ETC}`;
  EACResultElement.innerHTML += ` $${ETC}`;
  projectedBudgetOverrunResultElement.innerHTML += ` $${projectedBudgetOverrun} over budget`;
}
//#endregion

// --- Phần việc còn lại ---

// 4. Validation (Thuần)
// + Khi click button SUBMIT => thực hiện validation tất cả thẻ inputs
// + Bắt buộc nhập vào số (kiểu int hoặc float)
// + Validation ok mới thực code trong hàm submitButton.onclick()

// 5. (Hiếu Huỳnh)
// CSS lại trang chủ
// Thêm mô tả và hướng dẫn dùng tool (nếu có) vào file guide.html
