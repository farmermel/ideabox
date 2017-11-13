var IdeaCard = function(title, idea, id) {
  this.title = title;
  this.idea = idea;
  this.id = id;
  this.counter = 0;
};
var ratingArray = ['Swill', 'Plausible', 'Genius'];

$(document).ready(function() {
  for (let i = 0; i < localStorage.length; i++) {
  var retrievedObject = localStorage.getItem(localStorage.key(i));
  var parsedObject = JSON.parse(retrievedObject);
  createCard(parsedObject);
  };
});

$('.save-button').on('click', makeCardObject);

function makeCardObject(event) {
  event.preventDefault();
  disableSaveButton();
  var titleInput = $('#title-input').val();
  var ideaInput = $('#idea-input').val();
  var dateNow = Date.now();
  var ideaCard = new IdeaCard(titleInput, ideaInput, dateNow);
  localStorage.setItem(dateNow, JSON.stringify(ideaCard));
  createCard(ideaCard)
};

function createCard(card) {
  $('.idea-card-wrap').prepend(`<article id="${card.id}" class="idea-card">
  <h1 id="title" class="user-idea" contenteditable="true">${card.title}</h1>
  <button class="delete-button" aria-label="Delete Button"></button>
  <p id="idea" class="user-idea-details" contenteditable="true">${card.idea}</p>
  <button class="upvote-button" aria-label="upvote button"></button>
  <button class="downvote-button" aria-label="downvote button"></button>
  <h2>quality: <span class="rating">${ratingArray[card.counter]}</span></h2>
  <hr>
  </article>`);
};

$(window).on('keydown', function() {
  if (($('#title-input').val() !== '') && ($('#idea-input').val() !== '')) {
    enableSaveButton();
  } else {
    disableSaveButton();
  };
});


//$('.idea-card-wrap').on('click', determineRatingVote)

function determineRatingVote() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = JSON.parse(localStorage.getItem(clickedCardId));
  var buttonClicked = $(this).prop('class');
  changeRating(buttonClicked, theObject)
}

function changeRating(vote, cardObject) {

  //the below line disables the wrong button, it should get downvote
  //but it grabs upvote instead. Maybe use same strategy as with disabling and
  //having a seperate function
  // $(this).siblings(`.${buttonClicked}`).removeAttr('disabled')
  if (theObject.counter === 2 || theObject.counter === 0 ) {
    disableVote(vote);
  } else {
    //stuck here because I think this function is officially handling too much
    //maybe have it be just determine vote?
    //and then change rating is a different function and
    //disableVote is a different function
  }

}


$('.idea-card-wrap').on('click', '.upvote-button', function() {
  //have a disableVote function that takes the event target as an argument
  //place it inside the first conditional of this event listener and have if
  //be (theObject.counter === 2 || theObject.counter === 0 )
  //if target === upvote, disable upvote
  //else disable downvote
  console.log($(this).prop('class'))
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = JSON.parse(localStorage.getItem(clickedCardId));
  $(this).siblings('.downvote-button').removeAttr('disabled');
  if (theObject.counter === 2) {
    $(this).attr('disabled', true);
  } else {
    theObject.counter++;
    $(this).siblings('h2').find('.rating').text(ratingArray[theObject.counter]);
    localStorage.setItem(clickedCardId, JSON.stringify(theObject));
  };
});

$('.idea-card-wrap').on('click', '.downvote-button', function() {
  var clickedCardId = $(this).parent('article').attr('id');
  var theObject = JSON.parse(localStorage.getItem(clickedCardId));
  $(this).siblings('.upvote-button').removeAttr('disabled');
  if (theObject.counter === 0) {
    $(this).attr('disabled', true);
  } else {
    theObject.counter--;
    $(this).siblings('h2').find('.rating').text(ratingArray[theObject.counter]);
    localStorage.setItem(clickedCardId, JSON.stringify(theObject));
  };
});


$('.idea-card-wrap').on('click', '.delete-button', function(event) {
  deleteCard(event);
});

$('.idea-card-wrap').on('blur', 'p', persistEdit);

$('.idea-card-wrap').on('blur', 'h1', persistEdit);

$('#search-box').on('keyup', function() {
  $('article').remove();
  arrayOfLocalStorage();
});

function arrayOfLocalStorage() {
  var newArray = [];
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    newArray.push(parsedObject);
  };
  runSearch(newArray);
};

function deleteCard(event) {
  var parentArticle = $(event.target).closest('article');
  var id = parentArticle.prop('id');
  parentArticle.remove();
  localStorage.removeItem(id);
};

function disableSaveButton() {
  $('.save-button').attr('disabled', true);
};

function enableSaveButton() {
  $('.save-button').removeAttr('disabled');
};

function persistEdit() {
  var parentArticle = $(event.target).closest('article');
  var id = parentArticle.prop('id');
  var object = JSON.parse(localStorage.getItem(id));
  object[$(event.target).prop('id')] = $(event.target).text();
  localStorage.setItem(id, JSON.stringify(object));
}

function printSearchResults(searchedArray) {
  searchedArray.forEach(function(result) {
    createCard(result);
  });
};

function runSearch(newArray) {
  var searchInput = $('#search-box').val().toUpperCase();
  var searchedArray = newArray.filter(function(card) {
    return card.title.toUpperCase().includes(searchInput) || card.idea.toUpperCase().includes(searchInput);
  });
  printSearchResults(searchedArray);
};



