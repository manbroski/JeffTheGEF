function start() {
	var stage = new Kinetic.Stage("canvas", 500, 500);
	var main_layer = new Kinetic.Layer();
	var message_layer = new Kinetic.Layer();
	
	//create drop-box with a title
	var target_box = new Kinetic.Rect({
		x: 220,
		y: 240,
		width: 40,
		height: 40,
	});
	main_layer.add(target_box);


	//create caption
	/*var caption = new Kinetic.Text({
		x: stage.width / 2 - 25,
		y: target_box.y +target_box.width + 20,
		text: "Drag that glucose inside!",
		fontSize: 12,
		fontFamily: "Calibri",
		textFill: "black"
	});
	main_layer.add(caption);*/

	//draw image
	var imageObject = new Image();
	imageObject.onload = function (){
		var protein = new Kinetic.Image({
			x: 150, 
			y: 150,
			image: imageObject
		});
		main_layer.add(protein);
		main_layer.add(target_box);
		main_layer.add(glucose);
		stage.add(main_layer);
		stage.add(message_layer);
		writeMessage(message_layer, "Drag that glucose in the active site!");
	};
	imageObject.src = "prot.jpg";


	//create a substrate shape
	var glucose = new Kinetic.RegularPolygon({
		x: 200,
		y: 200,
		sides: 6,
		radius: 12,
		stroke: "black",
		fill: "yellow",
		strokeWidth: 2,
		draggable: true 
	});


	//set pointer cursor for the glucose
	glucose.on("mouseover", function(){
		document.body.style.cursor = "pointer";
	});
	glucose.on("mouseout", function () {
		document.body.style.cursor = "default";
	});

	//detect glucose being dropped
	glucose.on("dragend", function() {
		if (glucose.x > target_box.x && glucose.x < target_box.x + target_box.width && glucose.y > target_box.y && glucose.y < target_box.y + target_box.height) {
			writeMessage(message_layer, "Good job!");
			glucose.draggable(false);
			/*stage.onFrame(function(frame){
				target_x = target_box.x+target_box.width/2;
				target_y = target_box.y+target_box.height/2; 
				while (glucose.x != target_x && glucose.y != target_y) {
					if (glucose.x < target_x) {
						glucose.x++;
					} else if (glucose.x > target.x) {
						glucose.x--;
					}
					if (glucose.y < target_y) {
						glucose.y++;
					} else if (glucose.y > target_y) {
						glucose.y--;
					}
				
					main_layer.draw();
				}
			});*/
		}

	});
	
	//draw everything

	//stage.add(main_layer);

	//stage.start();


	//var debug_text = document.getElementById("debug_zone");
	//debug_text.innerHTML=target_box.y + 20;	
	
	
	//notice that messages have to be written after the message layer was created	

}

function writeMessage(messageLayer, message) {
	var context = messageLayer.getContext();
	messageLayer.clear();
	context.font = "12pt Caliblri";
	context.fillStyle = "black";
	context.fillText(message, 10, 25);
}
