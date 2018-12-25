$(document).ready(function(){
  var characterTemplate = $("#character-template").html();
  var compiledCharacterTemplate = Handlebars.compile(characterTemplate);

  $.ajax("js/cast.json").done(function(cast){
    $(".character-list-container").html(compiledCharacterTemplate(cast));
  });
});