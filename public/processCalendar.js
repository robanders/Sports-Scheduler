$(document).ready(function() {
	var events = [];
		    // page is now ready, initialize the calendar...

	$.ajax({
        type: 'GET',
        url: '/api/get_myschedule',
        data: 'user',
        success: function(myschedule) {
            console.log('success get myschedule',myschedule);
            console.log(myschedule[0].sport, myschedule[0].home.alias, myschedule[0].away.alias, myschedule[0].scheduled.substring(0,10));
            events.length = 0;
            for(var i = 0; i < myschedule.length; i++){
                var color;
                if(myschedule[i].sport == 'NBA'){
                    color = 'blue';
                } else if(myschedule[i].sport == 'NFL') {
                    color = 'red';
                } else if(myschedule[i].sport == 'NHL') {
                    color = 'green';
                } else {
                    color = 'orange';
                }

                if(myschedule[i].status == 'closed'){
                    var event = {
                        title : myschedule[i].sport + ' : ' + myschedule[i].away.alias + ' @ ' + myschedule[i].home.alias,
                        start : myschedule[i].scheduled.substring(0,10),
                        backgroundColor : color,
                        url : '/gameInfo?sport=' + myschedule[i].sport + '&gameID=' + myschedule[i].id
                    };
                } else {
                    var event = {
                        title : myschedule[i].sport + ' : ' + myschedule[i].away.alias + ' @ ' + myschedule[i].home.alias,
                        start : myschedule[i].scheduled.substring(0,10),
                        backgroundColor : color
                    };
                }
            	
            	events.push(event);
            }
            $('#calendar').fullCalendar({
		        // put your options and callbacks here
		        events: events
            });
         	
        },
        error: function() {
            alert('error in get myschedule');
        }
    });

});