var canvasHeight = 800;
var canvasWidth = 800;

function main() {
	var stage = new Kinetic.Stage("canvas", canvasWidth, canvasHeight);
	var mainLayer = new Kinetic.Layer();
	var messageLayer = new Kinetic.Layer();


	//TODO create an automatic image loader	

	//create static elements
	mainLayer.add(bilayer(250,50,30));
	mainLayer.add(barrelProtein(200,239,40,50,"#62B869"));

	//create dynamic elements
	var glucose = hexagon (10,50,10,"yellow",true);
	var target_box = rectangle (100,100,20,20,"green",false);

	//add dynamic stuff to the layers
	mainLayer.add(target_box);
	mainLayer.add(glucose);

	//create stage
	stage.add(mainLayer);
	stage.add(messageLayer);

	writeMessage(messageLayer, "Drag that glucose in the active site!");

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
			writeMessage(messageLayer, "Good job!");
			glucose.draggable(false);
		}

	});
	
}

/**
 * Write a message to the message layer
 */
function writeMessage(messageLayer, message) {
	var context = messageLayer.getContext();
	messageLayer.clear();
	context.font = "12pt Caliblri";
	context.fillStyle = "black";
	context.fillText(message, 10, 25);
}

/**
 * Create a simple bilayer backdrop.
 * Solid, no graphics
 * @param origin: origin of the bilayer drawing (upper left corner)
 * @param thickness: height of the drawing
 * @param curvature: inflection value for the curve. Suggested: 30
 */
function bilayer(origin, thickness, curvature) {
	return new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			context.beginPath();
			context.moveTo(0, origin);
			context.quadraticCurveTo(canvasWidth/2, origin - curvature, canvasWidth, origin);
			context.lineTo(canvasWidth, origin + thickness);
			context.quadraticCurveTo(canvasWidth/2,	origin + thickness - curvature , 0, origin + thickness);
			context.closePath();
			this.fillStroke();
		},
		fill:"#FFDF64"
	});
}

/**
 * Create a simple barrel protein drawing.
 * Suggested to be used as a generic membrane protein shape.
 * Gradient, with a stroke outline.
 * @param x
 * @param y
 * @param width
 * @param height: suggested to be equal to membrane thickness
 * @param color
 */

function barrelProtein (x, y, width, height, color) {
	var	curvature = 20;
	return new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			
			//draw
			context.beginPath();
			context.moveTo(x, y);
			context.quadraticCurveTo(x + width/2, y - curvature, x + width, y);
			context.lineTo(x + width, y + height);
			context.quadraticCurveTo(x + width/2, y + height + curvature , x, y + height);
			context.closePath();
			
			//add gradient
			var gradient = context.createRadialGradient(x, y, width, x + width, y + height, width);
			gradient.addColorStop(0, "#FFDFFF");
			gradient.addColorStop(1, "#004CB3");
			context.fillStyle = gradient;
			context.fill();
			context.stroke();
		},
		stoke: "black",
		strokeWidth: 1
	});
}

/**
 * Create a glucose shape.
 * @param x
 * @param y
 * @param radius
 * @param color
 * @param draggable
 */
function hexagon (x, y, radius, color, draggable) {
	return new Kinetic.RegularPolygon({
		x: x,
		y: y,
		sides: 6,
		radius: radius,
		stroke: "black",
		fill: color,
		strokeWidth: 1,
		draggable: draggable 
	});
}

/**
 * Create a rectangle shape
 * @param x
 * @param y
 * @param width
 * @param height
 * @param color
 * @param draggable
 */
function rectangle (x, y, width, height, color, draggable) {
	return new Kinetic.Rect({
		x: x,
		y: y,
		width: width,
		height: height,
		fill: color,
		draggable: draggable
	});
}

