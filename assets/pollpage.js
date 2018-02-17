$(document).ready(function(){
	var items;
	var votes;
	var colors;
	var borderColors;
    var pollsData;
    var myChart;
    var user = getUrlVars()["user"];
    var index = getUrlVars()["index"];


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




    $('ul').on('click','li', function(){
        $('li').removeClass('active');
        $(this).addClass('active');
        $('input').attr('checked', false);
        $(this).find('input').attr('checked', true);
    });



    $.ajax({
    	type: 'GET',
    	url: "/polls",
    	contentTypes: 'application/json',
        data: {user: user, index: index},
    	success: function(data){
    	pollsData = data;
        processData(data[0].polls[index]);
        showOptions(data[0].polls[index].items);
    	}, 
    	error: function(error){
    		console.log(error)
    	}
    	});



    function processData(data){
    	$("#question").text(data.question);
        $("canvas").empty();
    	items = [];
    	votes = [];
    	for(var i = 0; i<data.items.length; i++){
    		items.push(data.items[i][0]);
    		votes.push(data.items[i][1]);
    		genColors(items.length);
    		makeChart(items, votes, colors, borderColors);
    	}
    };


    function showOptions(data){

        for(var i = 0; i < data.length; i++){
            var listItem = '';
            listItem += '<div class="form-group"> <li class="list-group-item"> <div class="form-check">';
            listItem += '<input class="form-check-input" type="checkbox" ' + 'value="' + data[i][0] + '" id="' + i + '">'
            listItem += data[i][0];
            listItem += '</div></li>';
            $('.list-group').append(listItem);
        }

        $('list-group').append('<input class="btn btn-success" type="submit" value="Submit" id="submit">');
    }


    function genColors(length){
    	colors = [];
    	borderColors = [];
    	for(var i = 0; i<length; i++){
    		var first = random();
    		var second = random();
    		var third = random();
    		var col = 'rgba(' + third + ',' + second + ',' + third + ',' + '0.5)';
    		colors.push(col);
    		var colBor = 'rgba(' + third + ',' + second + ',' + third + ',' + '1)';
    		borderColors.push(colBor);
    	}
    }

    function random(){
    	return Math.floor(Math.random() * 255) + 1 
    }

    function makeChart(items, votes, colors, borderColors){
	    var currentPoll = $('#pollChart');
        
        if(myChart!=undefined){
            console.log('destroy');
            myChart.destroy();
        }
		myChart = new Chart(currentPoll, {
	    type: 'bar',
	    data: {
	        labels: items,
	        datasets: [{
	            label: '# of Votes',
	            data: votes,
	            backgroundColor: colors,
	            borderColor: borderColors,
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
		});
	}




});