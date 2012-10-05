var bfp = {};

bfp.add = function(email, neck, abdomen, height, bfp) {
	console.log('add', arguments);
	$.indexedDB("bfp")
		.objectStore("bfp").add({"email": email, "neck": neck, "abdomen": abdomen, "height": height, "bfp": bfp, "date": $.now()})
		.done(bfp.display);	
}

bfp.empty = function() {
	$.indexedDB("bfp").objectStore("bfp").clear().done(bfp.display);
}

bfp.del = function(itemId) {
	console.log('bfp.del', itemId);
	$.indexedDB("bfp")
		.objectStore("bfp")["delete"](itemId)
		.done(bfp.display);
}

bfp.display = function(email) {
	console.log('display', email);
	$('#storedResults').html('<table id="srTable" class="ui-widget ui-widget-content"><thead><tr class="ui-widget-header "><th>Date</th><th>Email</th><th>Height</th><th>Neck</th><th>Abdomen</th><th>BF%</th><th>Del</th></tr></table>');
	$.indexedDB("bfp")
		.objectStore("bfp")
			.each(function(elem) { if(typeof email =="undefined") { bfp.disp(elem) } else { if(elem.value.email == email) { bfp.disp(elem) } } });
}

bfp.disp = function(val) {
	console.log('disp', val);
	var res = val.value;
	dt = new Date(res.date);
	$('#srTable tr:last').after('<tr><td>'+$.datepicker.formatDate('dd-mm-yy', dt)+'</td><td>'+res.email+'</td><td>'+res.height+'</td><td>'+res.neck+'</td><td>'+res.abdomen+'</td><td>'+res.bfp.toFixed(1)+'</td><td><a href="#" class="del" rel="'+res.id+'"><span class="ui-icon ui-icon-close-thick">&nbsp;</span></a></td></tr>');
}

bfp.calcBFP = function(neck, abdomen, height) {
	return 86.010 * Math.log10( (abdomen - neck) )  - 70.041 * Math.log10(height) + 30.30;
}

Math.log10 = function(n) {
    return (Math.log(n)) / Math.LN10;
}

$(document).ready(function() {
    $('button').button();
	
	$('#storedResults').on("click", 'a.del', function() { bfp.del($(this).attr('rel')); return false; });
	
	$('#dialog-form').dialog({ autoOpen: false, height: 300, width: 350, modal: true });
	
	$('#ShowAdd').click(function() {
		$( "#dialog-form" ).dialog( "open" );
	});
	
    $('#Calculate').click(function() {
		var email = $('#email').val();
        var neck = $('#neck').val();
        var abdomen = $('#abdomen').val();
        var height = $('#height').val();
		
        var bp = bfp.calcBFP(neck, abdomen, height);

        bfp.add(email, neck, abdomen, height, bp);
		
		$('#dialog-form').dialog("close");
		
        bfp.display();
		return false;
	});
	
	$('#ClearDB').click(function() {
		bfp.empty();
		return false;
	});
	
	$('#CalcVars').submit(function() {
        return false;
    });

    $('#FilterForm').submit(function() {
        email = $('#FilterEmail').val();
        bfp.display(email);
        return false;
    });
	
	$.indexedDB("bfp", {
		"schema" : { "3": function(tr) { 
							var bf = tr.createObjectStore("bfp", {"keyPath": "id", "autoIncrement": true}) 
						} 
					} 
	}); 
				
	bfp.display();
    $('#calc')
		.calculator()
		.dialog({height:200,width:250,resizable:false,position:[400,10]});
});