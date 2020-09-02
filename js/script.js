
$( document ).ready(function(e) {

    $('#search-btn').click(function(){
        $("#movie-details").html('');
        var userInput = $('#input').val();
        ricerca(userInput);
        //$('input').val('');
    });

    $(document).keydown(function(e) {
        if (e.keycode == 13 || e.which == 13) {
            $("#movie-details").html('');
            var userInput = $('#input').val();
            ricerca(userInput);
            //$('input').val('');
        }
    });
});

//**************FUNZIONI

function ricerca(data) {
    $.ajax(
        {
            url:"https://api.themoviedb.org/3/search/movie",
            method: "GET",
            data: {
                api_key: "57d971dc9f1c534367f2c21507e580d4",
                query: data,
                language: "it-IT"
            },
            success: function(risposta) {
                //$("#movie-details").empty();
                var movie = risposta.results;
                //console.log(movie);
                for (var i = 0; i < movie.length; i++) {
                    var source = $("#entry-template").html();
                    var template = Handlebars.compile(source);
                    var context = movie[i];
                    var html = template(context);
                    $('#movie-details').append(html);
                }
            },
            error: function() {
                alert('Attenzione! Errore.');
            }
        }
    )
}
