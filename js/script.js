
$( document ).ready(function(e) {
    var userInput = $('#input').val();
        $('input').keyup(function(e){
            var code = e.key;
            if(code==="Enter") e.preventDefault();
            if (code==13 || code==="Enter") {
                ricerca(userInput);
            }
        });

        $('#search-btn').click(function(){
            ricerca(userInput);
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
