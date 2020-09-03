
$( document ).ready(function(e) {

    $('#search-btn').click(function(){
        //reset()
        $("#movie-details").html('');
        var userInput = $('#input').val();
        ricerca(userInput);
        $('input').val('');
    });

    $(document).keydown(function(e) {
        if (e.keycode == 13 || e.which == 13) {
            //reset()
            $("#movie-details").html('');
            var userInput = $('#input').val();
            ricerca(userInput);
            $('input').val('');
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
                if(risposta.total_results > 0) {
                    printFilm(risposta.results);
                } else {
                    noResults();
                }
            },
            error: function() {
                alert('Attenzione! Errore.');
            }
        }
    )
}

function printFilm(data) {
    var source = $("#entry-template").html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < data.length; i++) {
        var context = {
            titolo: data[i].title,
            original_title: data[i].original_title,
            original_language: data[i].original_language,
            vote_average: data[i].vote_average
        };
        var html = template(context);
        $('#movie-details').append(html);
    }
}

function noResults() {
    var source = $("#no-results-template").html();
    var template = Handlebars.compile(source);
    var context = {
        noResults: 'Non ci sono risultati'
    };
    var html = template(context);
    $('#movie-details').append(html);
}

// function reset() {
//     //$('#movie-details').val('')
//     $('#movie-details').html('');
//     $('#input').val('');
// }
