
var topics = ["banana", "apple", "peach", "kiwi", "apricot", "cherry", "mango", "pineapple", "coconut", "papaya", "jackfruit"];
var topic = "";
let rating = "";
let title = "";
let image = "";
let still = "";
let website = "";
var gifTerm = "";

    // function loops through topics, creates a button for each, prints to page

const renderButtons = () => {
    for (let i = 0; i < topics.length; i++) {
        $topic = $("<button>").text(topics[i]);
        $topic.addClass("btn btn-outline-success trigger").attr("id", topics[i]);
        $("#search-terms").append($topic);
    }
};

renderButtons();

    // function that makes ajax call given search terms

const getGif = () => {
    var queryURL = `https://api.giphy.com/v1/gifs/search?q=${gifTerm}&limit=9&api_key=WQeGcqgEdYHR6ekiScLHg7XbYTpLdhHm`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.data.length; i++) {
            title = response.data[i].title; 
            image = response.data[i].images.fixed_height.url; 
            still = response.data[i].images.fixed_height_still.url;
            rating = response.data[i].rating;
            website = response.data[i].bitly_url;
            renderCards();
        }
    })
};

    // function that listens to clicks to pause/play

$(document).on("click", ".image", function() {
    var status = $(this).attr("state");
    if (status === "animate") {
        let newLink = $(this).attr("still-link");
        $(this).attr("src", newLink);
        $(this).attr("state", "inanimate");
    }
    if (status === "inanimate") {
        let newLink = $(this).attr("live-link");
        $(this).attr("src", newLink);
        $(this).attr("state", "animate");
    }
});

    // function that listens to button click and runs ajax call

$(document).on("click", ".trigger", function() {
    gifTerm = $(this).attr("id");
    $("#giphy-cards").empty();
    getGif();
});

    // function that listens to user submit and runs ajax call

$(document).on("click", "#submit-search", function(event) {
    event.preventDefault();
    renderInput();
});

    // function that loops through topic buttons, appends to cards, prints to page

const renderCards = () => {
    $title = $("<div>").html(`<h5>${title}</h5>`).addClass("title");
    $image = $("<img>").attr("src", image).attr("state", "animate").addClass("image card-img-top").attr("live-link", image).attr("still-link", still);
    $still = $("<img>").attr("src", still).attr("state", "inanimate").addClass("image card-img-top").attr("live-link", image).attr("still-link", still);
    $rating = $("<span>").text(`Rating: ${rating}`).addClass("rating");
    $icon = $("<img>").attr("src", "./assets/images/giphy-icon.png").addClass("website");
    $website = $("<a>").append($icon).attr("href", website).attr("target", "_blank");

    $divCard = $("<div>").addClass("card-body");
    $divCard.append($rating).append($website);

    $gifCard = $("<div>").addClass("card").attr("id", "gif-card");
    $gifCard.append($title).append($still).append($divCard);

    $divColumn = $("<div>").addClass("col-sm-4 col-xs-12 col-md-4").attr("id", "card-bkgd");
    $divColumn.append($gifCard);

    $("#giphy-cards").append($divColumn);
};

    // function that captures user input and runs ajax call

const renderInput = () => {
    var userTerm = $("#user-term").val().trim();
    topics.push(userTerm);
    $("#search-terms").empty();
    renderButtons();
    gifTerm = userTerm;
    $("#giphy-cards").empty();
    getGif();
};

    // function that saves giphy to favorites and stores it in local storage