//#region 1. Khai báo biến
//#region Element dùng chung
let clearAllButton = document.querySelector("#clear-all-btn");
let addNewTaskButton = document.querySelector("#add-new-task-btn");
let deleteTaskButtonList = document.querySelectorAll(".delete-task-btn");
let submitButton = document.querySelector("#submit-btn");
let taskListElement = document.querySelector("#task-list");
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

//#region 4 element nodelist, 4 values array
let scheduledProgressNodelist,
  actualProgressNodelist,
  budgetNodelist,
  costNodelist;
let scheduledProgressValues, actualProgressValues, budgetValues, costValues;
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

//#region Hàm resetValueOfAllVariable, showCalculationResults, clearAllInputValue
function resetValueOfAllVariable() {
  totalBudget = 0;
  ACValue = 0;
  EVValue = 0;
  PVValue = 0;
  CPI = 0;
  costVariance = 0;
  CPIConclusion = "";
  SPI = 0;
  scheduleVariance = 0;
  SPIConclusion = "";
  ETC = 0;
  EAC = 0;
  projectedBudgetOverrun = 0;
}

function showCalculationResults() {
  totalBudgetResultElement.innerHTML = `$${totalBudget}`;
  ACResultElement.innerHTML = `$${ACValue}`;
  EVResultElement.innerHTML = `$${EVValue}`;
  PVResultElement.innerHTML = `$${PVValue}`;
  CPIResultElement.innerHTML = `${CPI}`;
  costVarianceResultElement.innerHTML = `${costVariance}%`;
  CPIConclusionResultElement.innerHTML = `${CPIConclusion}`;
  SPIResultElement.innerHTML = `${SPI}`;
  scheduleVarianceResultElement.innerHTML = `${scheduleVariance}%`;
  SPIConclusionResultElement.innerHTML = `${SPIConclusion}`;
  ETCResultElement.innerHTML = `$${ETC}`;
  EACResultElement.innerHTML = `$${EAC}`;
  projectedBudgetOverrunResultElement.innerHTML = `$${projectedBudgetOverrun} over budget`;
}

function clearAllInputValue() {
  // 1. Get element
  scheduledProgressNodelist = document.querySelectorAll(
    ".scheduled-progress-input"
  );
  actualProgressNodelist = document.querySelectorAll(".actual-progress-input");
  budgetNodelist = document.querySelectorAll(".budget-input");
  costNodelist = document.querySelectorAll(".cost-input");

  // 2. Clear ...
  Array.from(scheduledProgressNodelist).forEach(
    (element) => (element.value = "")
  );
  Array.from(actualProgressNodelist).forEach((element) => (element.value = ""));
  Array.from(budgetNodelist).forEach((element) => (element.value = ""));
  Array.from(costNodelist).forEach((element) => (element.value = ""));
}
//#endregion

//#region Các hàm Validation
function handleNumber(event) {
  const char = String.fromCharCode(event.which);
  if (!/[0-9]/.test(char) && char != ".") {
    event.preventDefault();
  }
}

function handleInvalidFiled(array) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] == 0) {
      return false;
    }
  }
  return true;
}

function handlePercentFiled(array) {
  for (let index = 0; index < array.length; index++) {
    if (array[index] > 100) {
      return false;
    }
  }
  return true;
}
//#endregion
//#endregion

//#region 2. Config toastr
// toastr.options = {
//   progressBar: true,
//   timeOut: "1000",
//   hideMethod: "fadeOut",
//   extendedTimeOut: "1000",
//   positionClass: "toast-top-center",
// };
//#endregion

//#region 3. Xóa trường lưu số thứ tự task hiện tại trong localStorage
localStorage.removeItem("currentTaskNumber");
//#endregion

//#region 4. LNSK click button "Clear all"
clearAllButton.onclick = function (event) {
  clearAllInputValue();
};
//#endregion

//#region 5. LNSK click button "Add new task"
addNewTaskButton.onclick = function (event) {
  let currentTaskNumberLS = localStorage.getItem("currentTaskNumber");
  let currentTaskNumber = currentTaskNumberLS ? Number(currentTaskNumberLS) : 1;

  const newTaskHTML = `
    <div class="task-item">
      <h2 class="task-item__label">Task ${++currentTaskNumber}</h2>
      <table class="task-item__table">
        <tr>
          <td><input type="text" class="scheduled-progress-input" onkeypress="handleNumber(event)"/></td>
          <td><input type="text" class="actual-progress-input" onkeypress="handleNumber(event)" /></td>
          <td><input type="text" class="budget-input" onkeypress="handleNumber(event)" /></td>
          <td><input type="text" class="cost-input" onkeypress="handleNumber(event)" /></td>
        </tr>
      </table>
      <a class="delete-task-btn" href="" onclick="handleClickDeleteTask(event)">X</a>
    </div>
  `;
  taskListElement.innerHTML += newTaskHTML;

  localStorage.setItem("currentTaskNumber", currentTaskNumber);
  deleteTaskButtonList = document.querySelectorAll(".delete-task-btn");
};
//#endregion

//#region 6. LNSK click icon X - "Delete task"
// function handleClickDeleteTask(event) {
//   event.preventDefault();
//   console.log("clickkkkkkkkkk");
//   console.log(this.parentNode);
// }
// // Array.from(deleteTaskButtonList).forEach(function (deleteTaskButton) {
// //   deleteTaskButton.onclick = function (event) {
// //     event.preventDefault();
// //     // var parent = this.parentNode;
// //     // var index = Array.prototype.indexOf.call(parent.children, this);
// //     console.log("clickkkkkkkkkk");
// //     console.log(this.parentNode);
// //   };
// // });
// $(".delete-task-btn").click(function (e) {
//   e.preventDefault();
//   console.log("clickkkkkkkkkk");
// });
//#endregion

//#region 7. LNSK click button "Submit"
submitButton.onclick = function (event) {
  // Reset giá trị cho tất cả các biến tính toán về bằng 0, bằng ""
  resetValueOfAllVariable();

  //#region 4 element nodelist
  scheduledProgressNodelist = document.querySelectorAll(
    ".scheduled-progress-input"
  );
  actualProgressNodelist = document.querySelectorAll(".actual-progress-input");
  budgetNodelist = document.querySelectorAll(".budget-input");
  costNodelist = document.querySelectorAll(".cost-input");
  //#endregion

  //#region 4 values array
  scheduledProgressValues = Array.from(scheduledProgressNodelist).map(
    (element) => Number(element.value)
  );
  actualProgressValues = Array.from(actualProgressNodelist).map((element) =>
    Number(element.value)
  );
  budgetValues = Array.from(budgetNodelist).map((element) =>
    Number(element.value)
  );
  costValues = Array.from(costNodelist).map((element) => Number(element.value));
  //#endregion

  //#region Tính PV, AC, EV
  const taskNumber = scheduledProgressValues.length;
  // Validation ...
  if (
    handleInvalidFiled(scheduledProgressValues) &&
    handleInvalidFiled(actualProgressValues) &&
    handleInvalidFiled(budgetValues) &&
    handleInvalidFiled(costValues)
  )
    if (
      handlePercentFiled(scheduledProgressValues) &&
      handlePercentFiled(actualProgressValues)
    ) {
      for (let i = 0; i < taskNumber; i++) {
        let PV = parseFloat(
          (scheduledProgressValues[i] * parseFloat(budgetValues[i])) / 100
        );
        let AC = parseFloat(costValues[i]);
        let EV = parseFloat(
          (actualProgressValues[i] * parseFloat(budgetValues[i])) / 100
        );

        PVs.push(PV);
        ACs.push(AC);
        EVs.push(EV);
      }

      PVValue = Number(
        PVs.reduce((total, currentValue) => total + currentValue).toFixed(0)
      );
      ACValue = Number(
        ACs.reduce((total, currentValue) => total + currentValue).toFixed(0)
      );
      EVValue = Number(
        EVs.reduce((total, currentValue) => total + currentValue).toFixed(0)
      );
      //#endregion

      //#region Tính CPI, SPI, CPIConclusion, SPIConclusion, Cost Variances, Schedule Variance
      CPI = Number((EVValue / ACValue).toFixed(3));
      SPI = Number((EVValue / PVValue).toFixed(3));

      CPIConclusion =
        CPI > 1
          ? "Under Budget"
          : CPI == 1
          ? "Exactly on budget"
          : "Over budget";
      SPIConclusion =
        CPI > 1
          ? "Ahead of schedule"
          : CPI == 1
          ? "Exactly on schedule"
          : "Behind schedule";

      costVariance = Number((((EVValue - ACValue) * 100) / EVValue).toFixed(2));
      scheduleVariance = Number(
        (((EVValue - PVValue) * 100) / PVValue).toFixed(2)
      );
      //#endregion

      //#region Tính TotalBudget, ETC, EAC, ProjectedBudgetOverrun
      totalBudget = Number(
        budgetValues
          .reduce((total, currentValue) => total + currentValue)
          .toFixed(0)
      );
      ETC = Number(((totalBudget - EVValue) / CPI).toFixed(0));
      EAC = Number((ACValue + ETC).toFixed(0));
      projectedBudgetOverrun = Number((EAC - totalBudget).toFixed(0));
      //#endregion

      // Hiển thị các giá trị tính toán được ra màn hình theo đúng vị trí
      showCalculationResults();
    } else {
      toastr.error(
        "Scheduled progress (Task #1) must be between 0% and 100%.",
        { timeOut: 1000, progressBar: true }
      );
    }
  else {
    toastr.error("Please enter all filed", {
      progressBar: true,
      timeOut: 1000,
    });
  }
};
//#endregion
