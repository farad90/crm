/////////////// Globals /////////////////////

/////////////////document ready ///////////////

$(document).ready(async () => {
  await loadCompanies1();
  await personPositions();
  await loadPeople();
});

///////////////// submit Person //////////////////

$(document).on("click", "#submit-person", async function () {
  const personForm = document.getElementById("personForm");
  const formData = new FormData(personForm);
  let personFormData = {};

  formData.forEach((value, key) => {
    personFormData[key] = value;
  });

  console.log(JSON.stringify(personFormData));

  await fetch("/api/people", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(personFormData),
  })
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
});

///////////////// load People //////////////////

async function loadPeople() {
  await fetch("/api/people", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((people) =>
      people.forEach((person) => {
        console.log(person);
        createPersonHtml(person);
      })
    );
}

function createPersonHtml(person) {
  const personHtml = `        <div class="person">
    <div class="person-header">
  
        <div class="personTitle">
            <div class="personProfilePic">
                <img src="/images/profilePic.png" alt="">
            </div>
  
            <span class="name">${person.firstname_EN} - ${person.lastname_EN} </span>
        </div>
        <div class="personIcons">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>
    </div>
    <div class="company-main">
  
        <div class="contactPhone">
            <i class="fa-solid fa-phone"></i>
            <span>${person.phone}</span>
        </div>
        <hr>
        <div class="contactMobile">
            <i class="fa fa-mobile"></i>
            <span>${person.cellPhone}</span>
        </div>
        <hr>
        <div class="company-webmail">
            <div class="contactEmail">
                <i class="fa-solid fa-envelope"></i>
                <span>${person.email}</span>
            </div>
        </div>
        <hr>
        <div class="contactPosition">
            <i class="fa-solid fa-user"></i>
            <span>manager</span>
            <span> at </span>
            <span class="personCompany">Poulad Tajhiz apadana</span>
        </div>
        
        
    </div>
  
  
  </div>`;

  $("#people").append(personHtml);
}

/////////////////////// Load People Positions ////////////////////

async function personPositions() {
  await fetch("/api/personposition", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((positions) => {
      positions.forEach((position) => {
        $("#personPositions").append(
          `<option value="${position._id}">${position.position}</option>`
        );
      });
    });
}

//////////////////load Companies select options //////////

async function loadCompanies1() {
  await fetch("/api/companies", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((companies) =>
      companies.forEach((company) => {
        $("#workingAt").append(
          `<option value="${company._id}">${company.name_EN}</option>`
        );
      })
    );
}

/////////////// hide and show Person details by clicking on header //////////

$(document).on("click", ".person-header", (event) => {
  var headerDiv = $(event.target);
  var companyDiv = headerDiv.parents(".person");
  var mainDiv = companyDiv.find(".person-main");
  if (mainDiv.css("display") == "none") {
    mainDiv.css("display", "block");
    $(".person-main").not(mainDiv).css("display", "none");
  } else {
    mainDiv.css("display", "none");
  }
});
