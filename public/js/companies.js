///////////// Globals ////////////
var cropper;
var companyLogoBlob;

///////////////////////////////////////////////////

$(document).ready(async () => {
  await showCompanies();
  await companyTypes();
});

/////////////////// submit Company //////////////////////

$(document).on("click", "#submit-company", async function () {
  //////// validating inputs and handling errors //////////

  var errors = [];
  $("#companyForm input ,#companyForm select, #companyForm textarea").each(
    function () {
      var fieldName = $(this).attr("name");
      var value = $(this).val(); // Get the trimmed value of the input

      console.log("fieldname: ", fieldName, "value: ", value);

      if (
        fieldName == "companyLogo" &&
        $(".imageCropperButtons").css("display") === "flex"
      ) {
        errors.push("* Please Upload or reset image");
      }

      if (fieldName === "companyType" && value === null) {
        errors.push("* Please choose type of company");
      }

      if (fieldName === "name_EN" && value.trim() === "") {
        errors.push("* Name field is required.");
      }

      if (fieldName === "regNo" && value.trim()) {
        if (isNaN(value.trim()))
          errors.push("* registration No. should be a number");
      }

      if (fieldName === "commercialCode" && value.trim()) {
        if (isNaN(value.trim()))
          errors.push("* commercial Code should be a number");
      }

      if (fieldName === "idNo" && value.trim()) {
        if (isNaN(value.trim())) errors.push("* ID No. should be a number");
      }

      if (fieldName === "phone" && value.trim() === "") {
        errors.push("* Phone No. is required.");
      }

      if (fieldName === "address" && value.trim() === "") {
        errors.push("* Address is required.");
      }

      if (fieldName === "abbreviation" && value.trim() === "") {
        var companyName = $('#companyForm input[name="name_EN"]').val().trim();
        if (companyName !== "") {
          $(this).val(generateAbbreviation(companyName)); // Set abbreviation value
        }
      }
    }
  );

  if (errors.length > 0) {
    $("#submitCompanyErrors").html(errors.join("<br>")).show(); // Display error messages
    return false; // Return false to prevent form submission
  } else {
    $("#submitCompanyErrors").hide(); // Hide error messages if no errors
    const companyForm = document.getElementById("companyForm");
    const formData = new FormData(companyForm);

    // Append additional data to formData directly
    formData.set("companyLogo", companyLogoBlob);

    //////////////// if the form has _id value it means that the user is editing and if not the user is creating //////////////
    if ($("#companyId").val()) {
      updateCompany(formData);
    } else {
      submitCompany(formData);
    }
  }
});

async function submitCompany(formData) {

  await fetch("/api/companies", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("companyForm").reset();
      showCompanies();
      console.log(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

async function updateCompany() {
  console.log("editing ........");
}

//////////////////////////////load select options ////////

async function showCompanies(){
  const companies = await loadCompanies();
  companies.forEach((company) => {
    createCompanyHtml(company);
  })
}



async function loadCompanies() {
  $("#companies").html("");
  return await fetch("/api/companies", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
}

function createCompanyHtml(data) {
  let companyHtml = `<div class="company" data-id=${data._id}>
  <div class="company-header">

      <div class="companyTitle">
          <div class="company-logo">
              <img src=${data.companyLogo} alt="">
          </div>

          <span class="name">${data.name_EN} - ${data.abbreviation}</span>
      </div>
      <div class="companyIcons">
        <i class="fa-solid fa-ellipsis-vertical action-btn"></i>
        <ul class="action-menu">
          <li class="view"><i class="fa-solid fa-eye"></i>View details</li>
          <li class="new-inquiry"><i class="fa-solid fa-square-plus"></i>Create a new Inquiry</li>
          <li class="new-person"><i class="fa-solid fa-user-plus"></i>Add a new person</li>
          <li class="edit"><i class="fa-solid fa-pen"></i>Edit</li>
          <li class="delete"><i class="fa-solid fa-trash"></i>Delete</li>
        </ul>
      </div>
  </div>
  <div class="company-main">
      <div class="companyPhone">
          <i class="fa-solid fa-phone"></i>
          <span>${data.phone}</span>
      </div>
      <hr>
      <div class="company-webmail">
          <div class="companyEmail">
              <i class="fa-solid fa-envelope"></i>
              <span>${data.Email}</span>
          </div>
          <div class="companyWebsite">
              <i class="fa-solid fa-globe"></i>
              <span>${data.website}</span>
          </div>
      </div>
      <hr>
      <div class="companyAddress">
          <i class="fa-solid fa-location-dot"></i>
          <span>${data.address_EN}</span>
      </div>
  </div>


</div>`;
  $("#companies").append(companyHtml);
}

/////////// load Company types select options //////////////

async function companyTypes() {
  console.log("hi");
  await fetch("/api/companytypes", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((types) => {
      console.log(types);
      types.forEach((type) => {
        $("#companyTypes").append(
          `<option value="${type._id}">${type.type}</option>`
        );
      });
    });
}

///////////////////// show or hide company details by clicking on header ////////////////////

$(document).on("click", ".companyTitle", (event) => {
  var headerDiv = $(event.target);
  var companyDiv = headerDiv.parents(".company");
  var mainDiv = companyDiv.find(".company-main");
  if (mainDiv.css("display") == "none") {
    mainDiv.css("display", "block");
    $(".company-main").not(mainDiv).css("display", "none");
  } else {
    mainDiv.css("display", "none");
  }
});

///////////////////////// upload image //////////////////////////////

$("button.profilePictureBtn").click(() => {
  let input = document.getElementById("imageInput");
  input.click();
});

$("#imageInput").change(function () {
  // you can use this method to get file and perform respective operations
  let files = Array.from(this.files);
  console.log(files);

  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = (e) => {
    $("#uploadImage").css("display", "none");
    $(".imageCropper").css("display", "flex");
    $(".imageCropperButtons").css("display", "flex");

    var image = document.getElementById("imageCropper");
    image.src = e.target.result;

    if (cropper !== undefined) {
      cropper.destroy();
    }

    cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
    });
  };
});

//////////// upload and reset buttons /////////

$(document).on("click", ".uploadImage", (event) => {
  event.preventDefault();
  var canvas = cropper.getCroppedCanvas();

  if (canvas == null) {
    alert("couldnt upload the image");
    return;
  }

  canvas.toBlob((blob) => {
    companyLogoBlob = blob;
    const blobUrl = URL.createObjectURL(blob);
    console.log(companyLogoBlob);
    $("#uploadImage").css("display", "flex");
    $("#imagePreview").attr("src", blobUrl);
    $(".imageCropper").css("display", "none");
    $(".imageCropperButtons").css("display", "none");
  });

  console.log("uploading...");
});

$(".resetImage").click((event) => {
  event.preventDefault();
  cropper.destroy();
  var image = document.getElementById("imageCropper");
  image.src = "";
  $("#uploadImage").css("display", "flex");
  $(".imageCropperButtons").css("display", "none");

  // Reset the file input by cloning and replacing it
  var input = $("#imageInput");
  input.replaceWith(input.val("").clone(true));
});

/////////////////// Generate Abbreviation /////////////
function generateAbbreviation(companyName) {
  // Split the company name into words
  var words = companyName.trim().split(/\s+/);

  // Initialize an empty string to store the abbreviation
  var abbreviation = "";

  // Iterate over the words
  for (var i = 0; i < words.length; i++) {
    // Get the first letter of each word and append it to the abbreviation
    abbreviation += words[i].charAt(0).toUpperCase();
  }

  return abbreviation;
}

///////////////////////// action-menu ////////////////////////

$(document).on("click", ".companyIcons .delete", async (event) => {
  var company = $(event.target).parents(".company");
  var companyId = company.data().id;
  console.log(companyId);

  await fetch(`/api/companies/${companyId}`, {
    method: "DELETE",
  })
    .then(showCompanies())
    .catch((err) => console.log(err));
});

$(document).on("click", ".companyIcons .edit", async (event) => {
  var company = $(event.target).parents(".company");
  var companyId = company.data().id;
  console.log(companyId);

  await fetch(`/api/companies/${companyId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((company) => {
      populateForm(company);
    })
    .catch((err) => console.log(err));
});

////////// the following function is to insert datas to form to be edited by user/////////

function populateForm(company) {
  var formData = new FormData();

  // Insert FormData into the form
  var form = document.getElementById("companyForm");
  // Insert each key-value pair from JSON data into FormData
  for (var key in company) {
    console.log(key);
    if (key === "companyLogo") {
      $("#imagePreview").attr("src", company[key]);
      return;
    }
    if (form.elements[key]) {
      // Check if form field exists
      form.elements[key].value = company[key];
    }
  }
}
