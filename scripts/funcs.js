var min_num_players = 2;
var max_num_players = 5;

var colours = ['red','yellow','purple','pink'];
var shapes = ['club','diamond','heart','spade'];
var levels = ['easy','medium','hard'];
var hex_radius = 20;
var hex_padding = 0;
var hex_rows = 6;





club_url = 'https://flaticons.net/custom.php?i=YNPgczyT05DMwibIVIeIxbhpeqkyI7'

function hide_disclaimers(){
    $("#disclaimers").hide(100);
    $("#hide_disclaimers").hide();
    $("#show_disclaimers").show();

}



function calc_hex(i,j){
    var R = hex_radius;
    var pad = hex_padding;
    var sin60 = Math.sqrt(3)/2
    var r = R*sin60;

    x0 = R+i*R*1.1;
    y0 = R+j*2*R;

    var out = (x0 - r) + "," + (y0 - R/2); //a
    out = out + " " + x0 + "," + (y0 - R);//b
    out = out + " " + (x0 + r) + "," + (y0 - R/2);//c
    out = out + " " + (x0 + r) + "," + (y0 + R/2);//d
    out = out + " " + x0 + "," + (y0 + R);//e
    out = out + " " + (x0 - r) + "," + (y0 + R/2);//f
    out = out + " " + (x0 - r) + "," + (y0 - R/2); //a
    return out
}

function paint_tracker(){
    var out = "";
    var polygons = [];
    var xy = [];

    var R = hex_radius;

    for (let i = 0; i <= 10; i++){
	for (let j = -2; j <= 2; j++){
	    if (i % 10 == 0 && j != 0){
		continue;
	    }
	    if (i % 2 == 0 && j%2 != 0){
		continue;
	    }
	    if (i%2 !=0 && j%2 == 0){
		continue;
	    }
	    var x0 = R+i*R*1.1;
	    var y0 = 1.2*R+(j+2)*2*R;
	    polygons.push(calc_hex(i,j+2));
	    xy.push ([x0,y0])
	}
    }

    for (let i = 0; i < polygons.length; i++){
	out = out + "<text played='false' text-anchor='middle' class='.hex' id='hex_label_"+i;
	out = out + "' x='" + xy[i][0];
	out = out + "' y='"+ xy[i][1] +"' fill='red'></text>";
	out = out + "<polygon target='hex_label_" + i ;
	out = out + "' class='hex' style='fill:#ffffff00;stroke:purple;' points='" + polygons[i];
	out = out + "'></polygon>";

    }
    $("#canvas").html(out);

    $(".hex").on("click", function(){
	var target = $(this).attr("target");
	played = document.getElementById(target).getAttribute("played");
	if (played == 'false'){
	    var turn = $("#turn_number").text();
	    turn = parseInt(turn) + 1;
	    $("#turn_number").text(turn);
	    document.getElementById(target).textContent = turn;
	    document.getElementById(target).setAttribute("played","true");
	}
    })
}

function show_disclaimers(){
    $("#disclaimers").show(100);
    $("#show_disclaimers").hide();
    $("#hide_disclaimers").show();
}

function show_tables(n){
	for (let i = 1; i <= max_num_players; i++){
		var el = $("#player_iiid_tracker".replace("iiid",i));
		if (i <= n){
			el.show();
		}else{
			el.hide();
		}
	}
}


function make_easy_table(player_id){
    //there is an empty row at the top of the table.
    var out = "<tbody>";
    for (let i = -1; i < colours.length;i++){
	out += "<tr>";
	for (let j = -1; j < colours.length; j++){
	    if (i == -1){
		if (j == -1){
		    var cell = "<td></td>";
		} else{

		    var cell = "<td class='top'>";
		    cell += "<img width='32' src='images/image_source.png' alt=image_source'>".replaceAll('image_source', colours[colours.length - j -1]);
		    cell += "</td>";
		} 
	    } else if (j == -1){
		var cell = "<td calss='left'>";
		cell += "<img width='32' src='images/image_source.png' alt=club'>".replaceAll('image_source', colours[i]);
		cell += "</td>";
	    } else if (j <= colours.length-i-1){
		var cell = "<td player_id="+ player_id + " value='empty' class='used' onclick='change_mode(this)'> </td>";
	    } else{
		var cell = "<td class='unused'></td>";
	    }

	    out += cell;
	}
	out += "</tr>";
    }
    out += "</tbody>"
    return out;
}

function make_medium_table(player_id){
	//This is going to create a single table with some empty columns for separation between the two tables
	//There is an assumptino here that the number of columns and the number of rows is the same. If there
	//is an expension to the game, I'll have to take care of that somehow. 
	
    var out = '<tbody>';
    for (let i = -1; i < colours.length; i++){//going over the rows. This is simple
	out += '<tr>';
	for (let j = -1; j < shapes.length; j++){//going over the columns first let's do the shapes
	    var cell = "";
	    if (i == -1){
		if (j == -1){
		    cell = '<td></td>';
		} else {
		    cell = '<td>';
		    cell += "<img width='32' src='images/image_source.png' alt=image_source'>".replaceAll('image_source', shapes[shapes.length - j -1]);
		    cell += '</td>';
		}
	    }else if (j == -1){
		cell = '<td>';
		cell += "<img width='32' src='images/image_source.png' alt=image_source'>".replaceAll('image_source', shapes[i]);
		cell += '</td>';
	    }else if (j <= colours.length-i-1){
		var cell = "<td player_id=" + player_id + " value='empty' class='used' onclick='change_mode(this)'> </td>";
	    }else{
		var cell = "<td class='unused'></td>";
	    }
	    out += cell;
	}

	out += '<td><span class="hspace"></span></td>';//add an empty coloun for easy reading

	for (let j = -1; j < shapes.length; j++){//going over the colours now
	    var cell = '<td></td>';
	    if (i == -1){
		if (j == -1){
		    cell = '<td></td>';
		}else {
		    cell = '<td>';
		    cell += "<img width='32' src='images/image_source.png' alt=image_source'>".replaceAll('image_source', colours[colours.length - j -1]);
		    cell +="</td>";
		}
	    }else if (j == -1){
		cell = '<td>';
		cell += "<img width='32' src='images/image_source.png' alt=image_source'>".replaceAll('image_source', colours[i]);
		cell += '</td>';
	    }else if (j <= colours.length-i-1){
		var cell = "<td player_id=" + player_id + " value='empty' class='used' onclick='change_mode(this)'> </td>";
	    }else{
		var cell = "<td class='unused'></td>";
	    }
	    out += cell;
	}
    }
    out += '</tbody>';
    return out;
}

function make_hard_table(player_id){
    //the hard table is actually easier to make since we use exactly the same approach as the easy table, only that before it we merge the two arrays into one
        //there is an empty row at the top of the table.
    var out = "<tbody>";
    var rows = colours.concat(shapes);
    var columns = colours.concat(shapes).reverse();
    for (let i = -1; i < rows.length;i++){
	out += "<tr>";
	for (let j = -1; j < columns.length; j++){
	    if (i == -1){
		if (j == -1){
		    var cell = "<td></td>";
		} else{
		    var cell = "<td class='top'>";
		    var name = columns[j];
		    cell += "<img width='32' src='images/" + name + ".png' alt='" + name + "'>";
		    cell += "</td>";
		} 
	    } else if (j == -1){
		var cell = "<td calss='left'>";
		var name = rows[i];
		cell += "<img width='32' src='images/" + name + ".png' alt='" + name + "'>";
		cell += "</td>";
	    } else if (j <= rows.length-i-1){
		var cell = "<td player_id=" + player_id + " value='empty' class='used' onclick='change_mode(this)'> </td>";
	    } else{
		var cell = "<td class='unused'></td>";
	    }

	    out += cell;
	}
	out += "</tr>";
    }
    out += "</tbody>"
    return out;
}

function change_mode(me){
	current = me.getAttribute('value');
	if (current == 'empty'){
		me.setAttribute('value','not');
		me.innerHTML = '<img class="mark" src=images/not.png alt="not">';
	}else if (current == 'not'){
		me.setAttribute('value', 'maybe');
		me.innerHTML = '<img class="mark" src=images/maybe.png alt="maybe">';
	}else if (current == 'maybe'){
		me.setAttribute('value','empty');
		me.innerHTML ='';
	}
}

function clear_card(player_id){
    $("td[player_id="+player_id + "]").attr("value","empty");
    $("td[player_id="+player_id + "]").html("");
    $("#player_"+player_id+"_easy").hide();
    $("#player_"+player_id+"_medium").hide();
    $("#player_"+player_id+"_hard").hide();
}

function switch_table(player_id){
    var level = $('#card_type_' + player_id).val();
    for (let i = 0; i < levels.length; i++){
	var table_id = '#player_id_level'.replaceAll('id',player_id).replaceAll('level',levels[i]);
	if (level == levels[i]){
	    $(table_id).show();
	    
	} else{
	    $(table_id).hide();
	}
    }
}

function make_tables(){
    var html = "";
    for (let i = 1; i <= max_num_players; i++){
	html += "<div id='player_iiid_tracker'>".replace('iiid',i);
	html += "Player iiid: <input id='player_iiid_name' type='text'></input>".replace('iiid',i);
	
	html += '<span class="hspace"></span>';
	html += "<select name='card_type_" + i + "' id='card_type_" + i + "' onchange='switch_table(" + i + ")'>";
	for (let j = 0; j < 3; j++){
	    html += levels[j];
	    html += "<option value='valuej'> valuej </option>".replaceAll('valuej',levels[j]);
	}
	html += '</select>';
	html += '<span class="hspace"></span>';
	html += '<button onclick="clear_card(' + i + ')">Clear card</button>';
	html += "<table id='player_iiid_easy'>".replace('iiid',i);
	html += make_easy_table(i);
	html += "</table>"
	html += "<table id='player_iiid_medium' style='display: none;'>".replace('iiid',i);
	html += make_medium_table(i);
	html += "</table>"
	html += "<table id='player_iiid_hard' style='display: none;'>".replace('iiid',i);
	html += make_hard_table(i);
	html += "</table>"
	html += "</div>"
	
	html += "<br>";
    }
    $("#place_for_tables").html(html);
}

$(document).ready(function(){
    var num_players = parseInt($("#num_players").val());

    $("#num_players").on("change", function(){
	    var num_players = parseInt($(this).val());
	    show_tables(num_players);
    });

    make_tables();
    show_tables(num_players);
    paint_tracker();
    show_disclaimers();
});
