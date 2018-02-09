$(document).ready(function(){
	var items;
	var votes;
	var colors;
	var borderColors;
    var pollsData;
    var myChart;

    $('ul').on('click','li', function(){
        $('li').removeClass('active');
        $(this).addClass('active');
        console.log(pollsData[0]);
        processData(pollsData[0].polls[$(this).attr('id')]);
    })

    $.ajax({
    	type: 'GET',
    	url: "/polls",
    	contentType: 'application/json',
    	success: function(data){
    	pollsData = data;
        processData(data[0].polls[data[0].polls.length-1]);
        displayPolls(data[0].polls);
    	},
    	error: function(error){
    		console.log(error)
    	}
    	});



    function processData(data){
    	$("h2").text(data.question);
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

    function displayPolls(polls){
    	for(var i = polls.length-1; i>=0&&i>polls.length-9; i--){
    		var listHtml = '<li class="list-group-item"' + ' id="' + i + '">'+ polls[i].question
            listHtml += '<button class="btn btn-sm btn-danger">Delete</button>';
            listHtml += '<button class="btn btn-sm btn-success">Page</button></li>';
    		$(".list-group").append(listHtml);
    		if(i===polls.length-1){
    			$(".list-group-item").addClass("active");
    		}
    	}

        $('li > button').addClass('btn-custom');
    }



});