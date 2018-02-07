$(document).ready(function(){
	var items;
	var votes;
	var colors;
	var borderColors;

    $.ajax({
    	type: 'GET',
    	url: "/polls",
    	contentType: 'application/json',
    	success: function(data){
    	
        processData(data[0].polls[0]);
        console.log(data[0].polls);
        displayPolls(data[0].polls);
    	},
    	error: function(error){
    		console.log(error)
    	}
    	});



    function processData(data){
    	$("h2").text(data.question);
    	items = [];
    	votes = [];
    	for(var i = 0; i<data.items.length; i++){
    		items.push(data.items[i][0]);
    		votes.push(data.items[i][1]);
    		genColors(items.length);
    		makeChart(items, votes, colors, borderColors);
    	}
    };

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
		var myChart = new Chart(currentPoll, {
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

    function displayPolls(polls){
    	for(var i = polls.length-1; i>=0&&i>polls.length-10; i--){
    		var listHtml = '<li class="list-group-item">'+ polls[i].question + '</li>';
    		$(".list-group").append(listHtml);
    	}
    }


});