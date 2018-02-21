$(document).ready(function(){ 

	var postData = {};
	var pollId = getUrlVars("pollid");
	postData.pollid = pollId;
	$("#addoption").click(function(){
		$("#addoption").before('<div class="option"><input class="form-control" type="text" placeholder="Option wanted here!" name="item"><i class="fa fa-times"></div>')
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
	

	var que
});

