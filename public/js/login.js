function login() {
  const loginForm = document.getElementById("login-form");
  const loginFormData = new FormData(loginForm);
  const data = {};
  for (const [key, value] of loginFormData.entries()) {
    data[key] = value;
  }
  console.log(data);

  fetch("/login", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      $("div#login-error").html("");
      $("p.error").remove();

      if (response.success) {
        window.location.href = "/"; // Redirect to homepage if login successful
      }
      if (response.msg) {
        console.log(response.msg);
        $("#login-error").html(response.msg);
      }
      if (response.errors) {
        const errors = response.errors;

        errors.forEach((error) => {
          if (error.path == "username") {
            $("#username").append(`<p class="error">${error.msg}</p>`);
          }
          if (error.path == "password") {
            $("#password").append(`<p class="error">${error.msg}</p>`);
          }
        });
      }
    })
    .catch((err) => console.log(err.msg));
}
