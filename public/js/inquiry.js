$(document).ready(async () => {
  let companies = await loadCompanies();
  companies.forEach((company) => {
    $("#companies-select").append(
      `<option value="${company._id}">${company.name_EN}</option>`
    );
  });
});

// to toggle show/hide items by clicking on their header
$(document).on("click", "div.item-header", function (event) {
  var x = $(event.target);
  var y = x.closest(".item").find(".item-main");
  if (y.css("display") == "none") {
    y.css("display", "flex");
  } else {
    y.css("display", "none");
  }
});

var data = [
  { MF: "", partNo: "", qty: "", itemDescription: "", attachedFiles: [] },
];

$(document).on("click", ".add-item", function () {
  var items = $(".items").find(".item").length;
  data[items] = { itemNo: items };
  console.log(data);
  var itemHtml = `
                      
  <div class="item" draggable="true" data-No=${items}>
    <div class="item-header">
        <span class="itemNo">- Item ${items + 1}</span>


        <div class="item-header-icons">
          <span class="icon-pencil"></span>            
          <span class="icon-copy duplicateItem"></span>
          <span class="icon-bin deleteItem"></span>
        </div>
    </div>
    <div class="item-main">
    <div class="item-content">
        <div class="item-content-left">
            <div class="input">
                <input type="text" name="MF" placeholder="Manufacturer">
            </div>
            <div class="input">
                <input type="text" name="partNo" placeholder="Part No.">
            </div>
            <div class="input">
                <input type="text" name="qty" placeholder="Qty">
            </div>
        </div>
        <div class="item-description">
            <textarea name="itemDescription" id="" placeholder="Item description"></textarea>
        </div>
    </div>
    <div class="item-attachments">
      <input type="file" id="fileInput" multiple>
      <ul id="fileList" class="file-list"></ul>

    </div>
</div>
</div>
<div class="dropZone" id="droptarget"></div>
`;

  $(".items").append(itemHtml);
});

$(document).on("click", ".deleteItem", function (event) {
  var Btn = $(event.target);
  var item = Btn.parents(".item");
  var itemNo = item.attr("data-No");
  data.splice(itemNo, 1);
  console.log(data);
  item.remove();
  updateItemNo();
});

function updateItemNo() {
  $(".item")
    .find(".itemNo")
    .each((index, item) => {
      $(item).parents(".item").attr("data-no", index);
      data[index].itemNo = index;
      $(item).html(`- Item ${index + 1}`);
    });
}

$(document).on("click", ".duplicateItem", function (event) {
  var item = $(event.target).parents(".item");
  var duplicatedItem =
    `<div class="item" draggable="true">` +
    item.html() +
    `</div>
  <div class="dropZone" id="droptarget"></div>`;
  $(".items").append(duplicatedItem);
});

$(document).on("click", ".submit-inquiry", function () {
  console.log(data);
});

$(document).on("focusout", "input,textarea", function (event) {
  const item = $(event.target).parents(".item");
  const itemNo = $(event.target).parents(".item").attr("data-No");
  console.log("itemNo is:", itemNo);
  data[itemNo].MF = item.find(`input[name="MF"]`).val();
  data[itemNo].partNo = item.find(`input[name="partNo"]`).val();
  data[itemNo].qty = item.find(`input[name="qty"]`).val();
  data[itemNo].itemDescription = item
    .find(`textarea[name="itemDescription"]`)
    .val();
  console.log(data);
});

////////////////////////////////////////////////////////////

let dragged;

$(document).on("dragstart", ".item", (event) => {
  dragged = event.target;
  $(event.target).addClass("dragging");
});

$(document).on("dragend", ".item", (event) => {
  $(dragged).removeClass("dragging");
});

/////////////////////////////////////////////////////////////

$(document).on("dragenter", "#droptarget", (event) => {
  if ($(event.target).hasClass("dropZone")) {
    $(event.target).addClass("dragOver");
  }
});

$(document).on("dragleave", "#droptarget", (event) => {
  if ($(event.target).hasClass("dropZone")) {
    $(event.target).removeClass("dragOver");
  }
});

$(document).on("dragover", "#droptarget", (event) => {
  event.preventDefault();
});

$(document).on("drop", "#droptarget", (event) => {
  if ($(event.target).hasClass("dropZone")) {
    var draggingItem = $(".dragging").attr("data-No");
    console.log("dragging Item is: ", draggingItem);

    try {
      var droppedTo = $(event.target).prev(".item").attr("data-No");
    } catch (error) {
      var droppedTo = "0";
    }

    

    var draggingData = data[draggingItem];
    console.log("dragging data is: ", draggingData);

    data.splice(draggingItem, 1);
    console.log("data after removing dragging Item: ", data)

    console.log("dropped to: ", droppedTo);
    data.splice(droppedTo, 0, draggingData);

    console.log("data after adding dragging Item: ", data)


    $(".dragging").next(".dropZone").remove();
    $(event.target).after($(".dragging"));
    $(".dragging").after(`<div class="dropZone" id="droptarget"> </div>`);
    $(event.target).removeClass("dragOver");
    updateItemNo();
  }

  console.log("drop", event.target);
});

$("button.importByXlsx").click(() => {
  let input = document.getElementById("excelInput");
  input.click();
  input.addEventListener("change", function () {
    console.log("reading excel file ....");
    readXlsxFile(input.files[0]).then(function (rows) {
      // `rows` is an array of rows
      console.log(rows);
      // each row being an array of cells.
    });
  });
});

/////////// when user selects the company image changes and contact persons will be loaded ///////////////

$("#companies-select").on("change", async function (event) {
  var companyId = $(event.target).val();
  console.log(companyId);
  await getCompanyData(companyId).then((company) => {
    console.log(company);
    ////////////changing logo /////////
    var inquiryLogo = $("#inquiry-logo-img");
    inquiryLogo.attr("src", company.companyLogo);
  });
  await getCompanyPersons(companyId).then((people) => {
    $("#contact-person-select").empty();
    $("#contact-person-select").append(
      `<option selected="" disabled="">Select</option>`
    );
    people.forEach((p) => {
      $("#contact-person-select").append(
        `<option value="${p._id}">${p.lastname_EN}</option>`
      );
    });
  });
});

async function getCompanyData(companyId) {
  return await fetch(`/api/companies/${companyId}`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
}

async function getCompanyPersons(companyId) {
  return await fetch(`/api/companycontacts/${companyId}`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
}

/////////////////////  items attachments ////////////////////

const fileList = $("#fileList");

// Prevent default drag behaviors
$(document).on(
  "dragenter dragover dragleave drop",
  ".item-attachments",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
  }
);

$(document).on("click", ".item-attachments", function (event) {
  $(event.target).find("#fileInput").click();
});

// Highlight drop area when item is dragged over it
$(document).on("dragenter dragover", ".item-attachments", function () {
  $(this).addClass("itemAttachmentHighlight");
});

$(document).on("dragleave drop", ".item-attachments", function () {
  $(this).removeClass("itemAttachmentHighlight");
});

// Handle dropped files
$(document).on("drop", ".item-attachments", function (e) {
  var itemNo = $(e.target).parents(".item").attr("data-No");
  const dt = e.originalEvent.dataTransfer;
  const droppedFiles = dt.files;
  console.log("adding files to : ",itemNo)
  addFilesToArray(droppedFiles, itemNo);
});

// Handle selected files
$(document).on("change", "#fileInput", function (e) {
  var itemNo = $(e.target).parents(".item").attr("data-No");
  const selectedFiles = $(this)[0].files;
  addFilesToArray(selectedFiles, itemNo);
});

// Function to add files to the global array
function addFilesToArray(newFiles, itemNo) {
  if (
    !data[itemNo].attachedFiles ||
    !Array.isArray(data[itemNo].attachedFiles)
  ) {
    data[itemNo].attachedFiles = [];
  }
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i];
    if (isFileTypeSupported(file)) {
      console.log(data[itemNo]);
      const files = data[itemNo].attachedFiles;
      files.push(file);
    } else {
      alert("Unsupported file type: " + file.name);
    }
  }
  updateFileList(itemNo);
}

// Function to check if file type is supported
function isFileTypeSupported(file) {
  const supportedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return supportedTypes.includes(file.type);
}

// Update the file list on the frontend
function updateFileList(itemNo) {
  const itemDiv = $(`div[data-No=${itemNo}]`);
  const fileList = itemDiv.find("#fileList");
  fileList.empty();

  data[itemNo].attachedFiles.forEach(function (file) {
    const thumbnail = getFileThumbnail(file);
    const listItem =
      `<li><a class="item-file" href=${URL.createObjectURL(
        file
      )} target="_blank">` +
      thumbnail +
      `<span class="item-file-name">${file.name}</span>
                            </a></li>`;
    fileList.append(listItem);
  });
}

// Function to get file thumbnail
function getFileThumbnail(file) {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  if (fileType.startsWith("image/")) {
    return `<span class="icon-image" style="font-size:14px; color: #3097B0;"></span>`;
  } else if (fileName.endsWith(".pdf")) {
    return `<span class="icon-file-pdf" style="font-size:14px; color: #DE2429;"></span>`;
  } else if (fileName.endsWith(".xlsx")) {
    return `<span class="icon-file-excel" style="font-size:14px; color: #1E6C41;"></span>`;
  } else if (fileName.endsWith(".docx")) {
    return `<span class="icon-file-word" style="font-size:14px; color: #0067B3;"></span>`;
  } else {
    // Unsupported file type
    return `<span class="icon-file-empty"></span>`;
  }
}
