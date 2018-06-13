$(document).ready(function(){ 



	$("#addoption").click(function(){
		$("#addoption").before('<div class="option"><input class="form-control" type="text" placeholder="Option wanted here!" name="item" id="new" required><i class="fa fa-times"></div>')
	});

	$('body').on('click', 'i', function(){
			$(this).closest('.option').remove();
	});

			
	function getUrlVars(){
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				for(var i = 0; i < hashes.length; i++)
				{
						hash = hashes[i].split('=');
						vars.push(hash[0]);
						vars[hash[0]] = hash[1];
				}
				return vars;
		}



function getData(){
	var postData = {};
	var pollId = getUrlVars("pollid").pollid;
	postData.pollid = pollId;
	postData.question =$("#pollQ").val();
	postData.items = [];
	var items = $(".form-control");
		for(var i = 1; i< items.length; i++){
			var value = $(items[i]).val();
			var id = $(items[i]).attr('id');
				var itemObject = {item: value, _id: id};
			postData.items.push(itemObject);
		}

	return postData;
}


$("#submit").click(function(e){
	e.preventDefault();
	e.isDefaultPrevented();;
	$.ajax({
		type: 'GET',
		url: '/polledit',
		contentType: 'application/json',
		data: getData(),
		success: function(){
			console.log('success');
			window.location.replace('http://localhost:3000/mypolls');
		},
		error: function(error){
			console.log(error);
		}
	})
})

});

