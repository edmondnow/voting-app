$(document).ready(function(){
	var items;
	var votes;
	var colors;
	var borderColors;
    var pollsData;
    var myChart;
    $(document).on('click','li', function(){
        var pollIndex = parseInt($(this).attr('id'));
        $('li').removeClass('active');
        if(pollsData[0].polls[pollIndex]==undefined){
            if(pollIndex==pollsData[0].polls.length-1){
                 processData(pollsData[0].polls[1]);
               $("#" + pollsData[0].polls.length-2).addClass('active');
            } else {
               processData(pollsData[0].polls[0]);
               $("#" + pollsData[0].polls.length-1).addClass('active');
           }
        } else {
            processData(pollsData[0].polls[pollIndex]);
            $(this).addClass('active');
        }
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
    		items.push(data.items[i].item);
    		votes.push(data.items[i].votes);
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
    		var listHtml = '<li class="list-group-item"' + ' id="' + i + '">'+ polls[i].question;
            listHtml += '<input type="hidden" name="pollid"  value="' + polls[i]._id + '" id="input' + i + '">';
            listHtml += '<button type="submit" class="btn btn-sm btn-danger page" form="'+i+'">Delete</button>';
            listHtml += '<button type="submit" class="btn btn-sm btn-success page" form="'+i+'">Page</button>';
            listHtml += '<button type="submit" class="btn btn-sm btn-default page" form="'+i+'">Edit</button>';
            listHtml += '</li>';
    		$(".list-group").append(listHtml);
    		if(i===polls.length-1){
    			$(".list-group-item").addClass("active");
    		}
    	}

        $('li > button').addClass('btn-custom');
    }
        $('ul').on('click', '.page', function(){
            
            var id = $(this).attr('form');
            var pollId = $('#input' + id).attr('value');
            var url = '';
            if($(this).text()=='Delete'){
                deletePolls(pollId, id);
            } else if ($(this).text()=="Page"){
                window.location.replace('http://localhost:3000/pollpage?pollid=' + pollId +'&index=' + id);
            } else {
                window.location.replace('http://localhost:3000/edit?pollid=' + pollId);
            }

        });

        function deletePolls(pollId, id){
            $.ajax({
                type:'GET',
                url: '/delete',
                data: {pollid: pollId},
                contentType: 'application/json',
                success: function(data){
                    $('#' + id).remove();
                    $('li:first-of-type').trigger('click');
                    
                },
                error: function(err){
                    console.log(err)
                }
            });
        }
    })