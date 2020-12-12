$(document).ready(function() {
    var displayTeams = function(){
        $.ajax({
            type: 'GET',
            url: '/api/get_myteams',
            success: function(myTeams) {
                console.log('success get sports',myTeams);  
                var select = $("#team-list");

                select.children().remove();
                for(var i = 0; i < myTeams.length; i++){                    
                    select.append('<li id = li-'+ i + '>' + myTeams[i].name + '&nbsp&nbsp<button id ="button-' + i + '">Remove</button></li>');         
                }
                for(var i = 0; i < myTeams.length; i++) (function(i){
                    
                    $("#button-" + i).on('click', function() {
                        console.log(i, myTeams[i]);
                        deleteTeam(myTeams[i]);
                        $('#li-' + i).remove();

                    }); 
                    
                })(i);
            },
            error: function() {
                alert('error in get sports');
            }
        });
    };
    $.ajax({
        type: 'GET',
        url: '/api/get_sports',
        success: function(sports) {
            console.log('success get sports',sports);  
            var select = $("select#sport-selector");

            select.children().remove();
            select.append('<option value="">---Select Sport---</option>');
            for(var i = 0; i < sports.length; i++){                    
                select.append('<option value="' + sports[i] + '">' + sports[i] + '</option>');          
            }
        },
        error: function() {
            alert('error in get sports');
        }
    });


    $('select#sport-selector').change(function () {
        var id = $(this).val();// has paramenter 
        console.log('selectorid', id);
        $.ajax({
            type: 'GET',
            url: '/api/get_teams_by_sport',
            data : {sport: id},
            success: function(teams) {
                console.log('success get teams',teams);  
                var select = $("select#team-selector");

                select.children().remove();
                select.append('<option value="">--Select Team--</option>');
                for(var i = 0; i < teams.length; i++){                    
                    select.append('<option value="' + teams[i].id + '">' + teams[i].name + '</option>');          
                }             
            },
            error: function() {
                alert('error in get teams');
            }
        }); 
    });

    $('#add-team').on('click',function () {
        var selectLeague = $("select#sport-selector");
        var selectTeam = $("select#team-selector");
        var text = $("select#team-selector option:selected").text();
        console.log("add-team click: ", selectLeague.val(), selectTeam.val(), text);
        addTeam(selectTeam.val(), text);
    });

    displayTeams();

    var deleteTeam = function (team){
        $.ajax({
            type: 'DELETE',
            url: '/api/delete_myteam',
            data: {"id" : team.id},
            success: function(data) {
                console.log('success delete myteam',data);               
            },
            error: function() {
                alert('error in delete my team');
            }
        });
    };

    var addTeam = function(teamID, teamName){
        $.ajax({
            type: 'POST',
            url: '/api/add_myteam',
            data: {"id" : teamID, "name" : teamName},
            success: function(data) {
                console.log('success add myteam',data);
                displayTeams();               
            },
            error: function() {
                alert('error in add my team');
            }
        });
    };

    
});