$(document).ready(function(){ 
						   
	$("#addoption").click(function(){
		$("#addoption").before('<div class="option"><input class="form-control" type="text" placeholder="Option wanted here!" name="item" required><i class="fa fa-times"></div>')
	});

	$('body').on('click', 'i', function(){
   		$(this).closest('.option').remove();
	});
	
});
