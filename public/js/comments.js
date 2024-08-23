$(document).ready(async () => {
  await fetch("/api/comments", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      result.forEach((element) => {
        if (!element.repliedTo) {
          let cmntHtml = createCmntHtml(element);
          $(".comments-list1").prepend(cmntHtml);
        }
      });
      result.forEach((element) => {
        if (element.repliedTo) {
          createCmntReplyHtml(element);
        }
      });
    })
    .catch((err) => console.log(err.msg));
});
// we fetch all the comment likes by user
/*   await fetch("/api/likes/:id", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((err) => console.log(err.msg));
 */

//shows reply div when user clicks on reply icon

$(document).on("click", ".reply-icon", function (event) {
  var x = $(event.target);
  var y = x.closest(".comment-box1").find(".comment-reply");
  if (y.css("display") == "none") {
    y.css("display", "flex");
    $(".comment-reply").not(y).css("display", "none");
  } else {
    y.css("display", "none");
  }
});

// like a comment
$(document).on("click", ".comment-likes", async () => {
  var button = $(event.target);
  var cmntId = findCmntId(button);

  await fetch(`/api/comments/${cmntId}/like`, {
    method: "PUT",
  })
    .then(console.log(cmntId))
    .catch((err) => console.log(err.msg));
});

// show and hide send reply btn in comments and replys when user types
// $(".reply-textarea").on("keyup", function (event) is wrong and it doesnt work on appended items.

$(document).on("keyup", ".reply-textarea", function (event) {
  var textBox = $(event.target);
  var value = textBox.val().trim();
  if (value == "") {
    textBox.next(".submitReplyBtn").css("visibility", "hidden");
  } else {
    textBox.next(".submitReplyBtn").css("visibility", "visible");
  }
});

$(document).on("keyup", ".new-comment-textarea", function (event) {
  var textBox = $(event.target);

  var value = textBox.val().trim();
  if (value == "") {
    textBox.next(".submitCmntBtn").css("visibility", "hidden");
  } else {
    textBox.next(".submitCmntBtn").css("visibility", "visible");
  }
});

// when user calls this function it will submit the txt inside textarea into the backend and it will create a data on comments collection.

async function submitCmnt() {
  var data = { cmntContent: $(".new-comment-textarea").val() };
  console.log(data);
  $(".new-comment-textarea").val("");

  await fetch("/api/comments", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("response is: ", response);
      $(".comment-reply").css("display","none");
      createCmntHtml(response);
    })
    .catch((err) => console.log(err.msg));
}

// the following function makes html of the input variable and prepends it to the comment list.

function createCmntHtml(comment) {
  var timestamp = timeDifference(new Date(), new Date(comment.createdAt));
  let cmntHtml = `
  <li>
                <div class="comment-main-level1">
                    <div class="comment-avatar1">
                        <img src=${comment.postedBy.profilePic} alt="">
                    </div>
                    <div class="comment-box1" data-id=${comment._id}>
                        <div class="comment-head1">
                            <a href="/autherProfile" id="auther-name1">${comment.postedBy.username}</a>
                            <span>${timestamp}</span>
                            <div class="comment-icons">
                                <div class="comment-likes active">
                                    <span class="likesNo">${comment.likedBy.length}</span>
                                    <i class="fa fa-heart"></i>
                                </div>
                                <i class="fa fa-reply reply-icon"></i>
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                        <div class="comment-body">
                            <div class="comment-content1">
                                ${comment.comment_text}
                            </div>
                        </div>
                        <div class="comment-reply">
                            <div class="reply-avatar1">
                                <img src=${comment.postedBy.profilePic} alt="">
                            </div>
                            <div class="textareaContainer">
                                <textarea class="reply-textarea" placeholder="Reply to the comment ..."></textarea>
                                <div  class="submitReplyBtn"> <i class="fa-solid fa-arrow-up"></i>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </li>
  `;
  $(".comments-list1").prepend(cmntHtml);
}

//  listener for reply buttons

$(document).on("click", ".submitReplyBtn", async () => {
  var button = $(event.target);
  var cmntId = findCmntId(button);
  var txt = button.parents(".textareaContainer").find(".reply-textarea").val();

  var data = {
    cmntContent: txt,
    repliedTo: cmntId,
  };

  console.log(data);
  $(".reply-textarea").val("");

  fetch("/api/comments", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      createCmntReplyHtml(response);
    })
    .catch((err) => console.log(err.msg));
});

function createCmntReplyHtml(comment) {
  var parentCmnt = $(`[data-id = ${comment.repliedTo}]`)
    .parents(".comment-main-level1")
    .parent("li");

  var timeStamp = timeDifference(new Date(), new Date(comment.createdAt));

  replyHtml = ` 
  
  <li>
      <div class="comment-main-level1">
          <div class="comment-avatar1">
              <img src=${comment.postedBy.profilePic} alt="">
          </div>
          <div class="comment-box1">

              <div class="comment-head1">
                  <a href="/autherProfile" id="auther-name1">${comment.postedBy.username}</a>
                  <span>${timeStamp}</span>
                  <div class="comment-icons">
                      <div class="comment-likes active">
                          <span class="likesNo">3</span>
                          <i class="fa fa-heart"></i>
                      </div>
                      <i class="fa fa-reply reply-icon"></i>
                      <i class="fa-solid fa-trash"></i>
                  </div>
              </div>
              <div class="comment-body">
                  <div class="comment-content1">
                  ${comment.comment_text}
                  </div>
              </div>

          </div>


      </div>
  </li>
  
  `;

  //makes a <ul> for the first reply and then will add<li> for each comment to this <ul>

  var replyList = parentCmnt.find("ul.reply-list1");
  if (replyList.length) {
    replyList.append(replyHtml);
  } else {
    parentCmnt.append('<ul class="reply-list1"> </ul>');
    parentCmnt.find(".reply-list1").append(replyHtml);
  }

  console.log(comment);
}

function deleteCmnt() {}

// this function calculates elapsed time
function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < 30000) {
    return "Just now";
  }

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

function findCmntId(element) {
  var isRoot = element.hasClass("comment-box1");
  var rootElement = isRoot ? element : element.closest(".comment-box1");
  return rootElement.data().id;
}


