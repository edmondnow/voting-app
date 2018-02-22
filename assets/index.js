

$.ajax({
	type: 'GET',
	url: "/polls",
	contentType: 'application/json',
	data: {user: {}, index: true},
	success: function(data){
    displayPolls(data);
	},
	error: function(error){
		console.log(error)
	}
});


function displayPolls(data){

	for(var j = 0; j<data.length; j++){
		var polls = data[j].polls;
		for(var i = polls.length-1; i>=0&&i>polls.length-20; i--){
			var listHtml = '<li class="list-group-item"' + ' id="' + i + '">'+ data[j].username + ': ' + polls[i].question;
	        listHtml += '<input type="hidden" name="pollid"  value="' + polls[i]._id + '" id="input' + i + '">';
	        listHtml += '</li>';
			$(".list-group").append(listHtml);
	}
}}

$(document).on('click', 'li', function(){
	
    var id = $(this).attr('id');
    var pollId = $('#input' + id).attr('value');
    var url = 'http://localhost:3000/pollpage?pollid=' + pollId +'&index=' + id;
    console.log(url);
    window.location.replace(url);
});
