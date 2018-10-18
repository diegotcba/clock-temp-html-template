/* 
	Usage:

	The most important data sent from a CasparCG Client 
	must be the URL of the Scoreboard OCR Node. 
	The other data is related to the info shown on the template.
	On the html file you must insert a script reference for the Scoreboard OCR Client and to the SocketIO library.
	

	AMCP command for playing the template:

	CG 1-10 ADD 0 "clock-temp-html-template/INDEX" 1 "<templateData><componentData id=\"logging\"><data id=\"text\" value=\"false\"></data></componentData></templateData>"

*/

//Object that holds all the values of the template
var weatherLocation = "Cordoba, AR";

function play(stringData) {
	$('#info').append('<br>calling play');

	$('.scoreboard').css('visibility', 'visible');
	initClockTemp();
	parseAndInsertData(stringData);
}

function update(stringData) {
	$('#info').append('<br>calling parse and insert from update');
	initClockTemp();
	parseAndInsertData(stringData);
}

function stop() {
	$('#info').append('<br>calling stop');
	
	$('.scoreboard').css('visibility', 'hidden');
}

function parseAndInsertData(stringData) {
	if(stringData) {
		$('#info').append('<br>update: ' + stringData);
		var data = parseCaspar(stringData);

		if(data.logging) {
			var aux = (data.logging == "true" ? 'visible' : 'hidden');
			$('#info').css('visibility', aux);					
		}
		$('#info').append('<br>json string: ' + JSON.stringify(data));



	}
	initClockTemp();
}

function parseCaspar(str)	{
	var xmlDoc;
	var jsonData;

	if (window.DOMParser)	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(str,"text/xml");
	}

	$('#info').append('<br>xml: ' + xmlDoc);

		
	$('#info').append("<br>calling XML2JSON");	

	$('#info').append("<br>" + xmlDoc.documentElement.childNodes.length);

	jsonData = XML2JSON(xmlDoc.documentElement.childNodes);

	$('#info').append("<br>json: " + jsonData);

	return jsonData;
}


// Make the XML templateData message into a more simple key:value object
function XML2JSON(node)	{
	var data = {};	// resulting object
	if(node) {
		for (k=0;k<node.length;k++)	{
			var idCaspar = node[k].getAttribute("id");
			var valCaspar = node[k].childNodes[0].getAttribute("value");
			if ( idCaspar != undefined && valCaspar != undefined)	{ data[idCaspar] = valCaspar; };
		}
	
	}
	
	return data;
}

// This is useful on browser testing
$(document).ready(function() {
	showTestMode();

	$('#testMode').on('click', function(e){
		testMode();
	});

	initClockTemp();
});

function initClockTemp() {
	getClock();
	getWeather(); //Get the initial weather.
	setInterval(getWeather, 60000); //Update the weather every 1 minutes.
	setInterval(getClock, 30000); //Update the time every 30 seconds.	
}

function getWeather() {
  $.simpleWeather({
    location: weatherLocation,
    unit: 'c',
    success: function(weather) {
      html = weather.temp+'&deg;';
  
   	  $('#info').append("<br>weather link");
   	  $('#info').append("<br>" + weather.link);

      $("#temp").html(html);
    },
    error: function(error) {
      $("#temp").html('<p>'+error+'</p>');
    }
  });
}

function getClock() {
	let newDate = new Date();

	let strTime = pad(newDate.getHours())+":"+pad(newDate.getMinutes());

	$("#clock").text(strTime);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

// Shows the UI for the test mode
function showTestMode() {
	// checks that the url contains the "test" word
	if(location.search.includes('test')) {
		console.log('Test mode');
	    $('#background').css('display', 'block');
	    $('#info').css('visibility', 'visible');			
	    $('#info').append('Test mode ON');
	}
}

function testMode() {
	$('#info').append('<br>test mode');
}

