////////// we define a class with different validation methods to use in different routers. ///////////////


class validators {
  isFarsi(value) {
    // Regular expression to match Arabic letters
    // javascript
    const persian_alpha_codepoints = /^[\u0600-\u06FF\s]+$/;
    console.log(value);
    console.log("value test", persian_alpha_codepoints.test(value));
    if (!persian_alpha_codepoints.test(value)) {
      return true;
    }

    return false;
  }

  isShenaseMelli(value) {
    var L = value.length; // Get the length of the value

    // Check conditions for early rejection
    if (L < 11 || parseInt(value, 10) === 0) {
      //throw new Error("تعداد ارقام شناسه ملی می بایست 11 رقم باشد");
      throw new Error("ID No should contain 11 digits");

    }

    if (parseInt(value.substr(3, 6), 10) === 0) {
      // Extract digits and apply a validation algorithm
      var c = parseInt(value.substr(10, 1), 10);
      var d = parseInt(value.substr(9, 1), 10) + 2;
      var z = new Array(29, 27, 23, 19, 17);
      var s = 0;

      for (var i = 0; i < 10; i++) {
        s += (d + parseInt(value.substr(i, 1), 10)) * z[i % 5];
      }
      throw new Error("ID No is not correct");
    }

    s = s % 11;

    if (s === 10) {
      s = 0;
    }

    // Check if the calculated value matches the provided code
    if (!c === s) {
      throw new Error("ID No is not correct");
    } else return true;
  }

  isCodeMeli(value) {
    var L = value.length;

    // Check conditions for early rejection
    if (L < 8 || parseInt(value, 10) === 0) {
      throw new Error("کد ملی اشتباه است");
    }

    // Normalize the input value to have a length of 10 by adding leading zeros
    value = ("0000" + value).substr(L + 4 - 10);

    // Check if the substring from index 3 to 8 (6 characters) is equal to 0
    if (parseInt(value.substr(3, 6), 10) === 0) {
      throw new Error("کد ملی اشتباه است");
    }

    // Extract a single digit from the value at index 9
    var c = parseInt(value.substr(9, 1), 10);
    var s = 0;

    // Calculate a value 's' based on the value
    for (var i = 0; i < 9; i++) {
      s += parseInt(value.substr(i, 1), 10) * (10 - i);
    }

    s = s % 11;

    // Check if 'c' matches 's' based on specific conditions
    if (!((s < 2 && c === s) || (s >= 2 && c === 11 - s))) {
      throw new Error("کد ملی اشتباه است");
    } else return true;
  }
}



module.exports = new validators();