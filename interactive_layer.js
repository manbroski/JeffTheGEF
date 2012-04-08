var canvasHeight = 800;
var canvasWidth = 800;

function main() {
	var stage = new Kinetic.Stage("canvas", canvasWidth, canvasHeight);
	var mainLayer = new Kinetic.Layer();
	var messageLayer = new Kinetic.Layer();

	var pathwaySteps = new Array();
	//this is a bit clanky, but it will make the code a little more readable in the animation loop
	pathwaySteps["ligand attachment"] = false;
	pathwaySteps["g-protein attachment"] = false;
	pathwaySteps["gef appearance"] = false;
	pathwaySteps["gtp detachment"] = false;
	pathwaySteps["gdp detachment"] = false;
	pathwaySteps["gtp attachment"] = false;
	pathwaySteps["g-protein activation"] = false;
	pathwaySteps["alpha detachment"] = false;
	pathwaySteps["aplha attachment to effector"] = false;
	pathwaySteps["effector activation"] = false;
	pathwaySteps["atp attachment"] = false;
	pathwaySteps["atp transformation"] = false;
	pathwaySteps["camp detachment"] = false;




	//TODO create an automatic image loader	

	//create static elements
	mainLayer.add(rect_bilayer(250,60,30));


	//create dynamic elements
	var glucose = hexagon (10,50,15,"yellow",true);
	//var ligandBox = rectangle (205,220,20,20,"white",false);
	//var gprotBox = boundRectangle (205,285,50,50,"white",false);
	var gpcr = barrelProtein (200,250,60,60,"green");
	//var gprotB = rectangle (100,300,40,40,"blue",true);
	//var gprotA = rectangle (120,330,20,20,"yellow",true);
	var alpha = trimeric_g_prot(100,100,30,"red");

	var thing = adenyl_cyclase(400,300,50,50,"green");

	var guanosine_d = gtp (200,200,15);
	//add dynamic stuff to the layers
	mainLayer.add(gpcr);
	//mainLayer.add(ligandBox);
	//mainLayer.add(gprotBox);
	mainLayer.add(glucose);
	mainLayer.add(thing);
	//mainLayer.add(gprotB);
	//mainLayer.add(gprotA);
	//mainLayer.add(alpha);

	//create stage
	stage.add(mainLayer);
	stage.add(messageLayer);
	stage.add(alpha);
	stage.add(guanosine_d);

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
		if (inside(glucose,ligandBox)) {

			glucose.draggable(false);
			pathwaySteps ["ligand attachment"]= true;
			writeMessage(messageLayer, "Receptor activated");
		}
	});

	alpha.on("dragend",function() {
		console.log(alpha.x+100);
	});

	/*gprotB.on("drag",function () {
		//gprotA.x = gprotB.x + 30;
		//gprotA.y = gprotB.y + 30;
		//mainLayer.draw();
		//writeMessage(messageLayer,"ups");
		console.log("dragged");
	}); 

	gprotB.on("dragend", function () {
		if (inside(gprotB,gprotBox)) {
			gprotB.draggable(false);
			pathwaySteps ["g-protein attachment"] = true;
			writeMessage(messageLayer, "Way to go champ");
		}
	});*/

	//adding some super simple animation
	var animationIncrement = 3;
	var finalDestination = 300;
	stage.onFrame(function(frame){
		if (pathwaySteps["ligand attachment"]) {
			/*gpcr.x += animationIncrement;
			glucose.x += animationIncrement;
			ligandBox.x += animationIncrement;*/
			gpcr.fill = "red";
			//writeMessage(messageLayer,"Now put that blue g-protein into the binding site!");	
		}

		mainLayer.draw();
		
	});
	stage.start();
	
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
 * Simple resolution of rectangle A being at center of B
 */
function inside (a,b) {
	return (a.x > b.x && 
	a.x < b.x + b.width && 
	a.y > b.y &&
	a.y < b.y + b.height );
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
		fill:"#FFDF64",
		stroke: "black",
		strokeWidth: 1
	});
}

/**
 * Create a rectangular bilayer backdrop.
 * Solid, no graphics
 * @param origin: origin of the bilayer drawing (upper left corner)
 * @param thickness: height of the drawing
 * @param curvature: inflection value for the curve. Suggested: 30
 */
function rect_bilayer(origin, thickness, curvature) {
	return new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			context.beginPath();
			context.moveTo(0, origin);
			context.lineTo(canvasWidth,origin);
			context.lineTo(canvasWidth, origin + thickness);
			context.lineTo(0, origin + thickness);
			context.closePath();
			this.fillStroke();
		},
		fill:"#FFDF64",
		stroke: "black",
		strokeWidth: 1
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
	var r = width/2;
	var ligand_radius = 20;
	var alpha_radius = 30;
	var alpha_bs = 30 *2/5;
	return new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			
			//draw
			context.beginPath();
			context.moveTo(x, y);
			context.arc(x + r, y, r, Math.PI, Math.PI * 4/3,false);
			context.lineTo(x + r/2, y - r/3);
			context.lineTo(x + width - r/2, y - r/3);
			context.arc(x + r, y, r, Math.PI* 5/3, 0, false);
			context.lineTo(x + width, y + height);
			context.arc(x + r, y + height, r, 0, Math.PI * 1/6,false); 
			context.lineTo(x + width - r/2, y + height + r/2);
			context.arc(x + r, y + height, r, Math.PI*1/3,Math.PI, false);
			context.closePath();
			
			//add gradient
			/*var gradient = context.createRadialGradient(x+width, y+height, width/2, x+width, y+height, width);
			gradient.addColorStop(0, "#8ED6FF");
			gradient.addColorStop(1, "#004CB3");
			context.fillStyle = gradient;
			context.fill();
			context.stroke();*/
			this.fillStroke();
		},
		fill:color,
		stoke: "black",
		strokeWidth: 1
	});
}


function alpha_subunit (x, y, r, color) {
	var	rbs = r *2/5;
	var ebs = r *2/5;
	var d = r * 2;
	var layer = new Kinetic.Layer();
	var protein = new Kinetic.Shape({
		drawFunc: function() {
			var c = this.getContext();
			
			//draw
			c.beginPath();
			
			c.moveTo(x,y);
			c.lineTo(x, y + rbs);
			c.arc(x + r, y + r, r, (Math.PI * 7/6), (Math.PI * 11/6), true);
			c.arc(x + d - ebs, y + ebs, ebs, 0, Math.PI*1.5,true);
			c.arc(x + r, y + r, r, (Math.PI * 5/3), (Math.PI * 4/3), true);
			c.lineTo(x + rbs, y);
			
			c.closePath();
			this.fillStroke();
			
		},
		fill:color,
		stoke: "black",
		strokeWidth: 1,
		//draggable:true
	});
	font_size = 20;	
	var title = new Kinetic.Text({
		x:x+r-font_size/2,
		y:y+r-font_size/2,
		text:unescape('%u03B1'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});

	layer.add(protein);
	layer.add(title);
	layer.draggable(true);
	//this.x = protein.x;
	//this.y=protein.y;
	//this.onDrag = function()  {
	//	protein.onDrag();};
	return layer;
}

function trimeric_g_prot (x, y, r, color) {
	var	rbs = r *2/5;
	var ebs = r *2/5;
	var d = r * 2;
	//var c;
	var layer = new Kinetic.Layer();
	var alpha = new Kinetic.Shape({
		drawFunc: function() {
			var c = this.getContext();
			
			//draw
			c.beginPath();
			
			c.moveTo(x,y);
			c.lineTo(x, y + rbs);
			c.arc(x + r, y + r, r, (Math.PI * 7/6), (Math.PI * 11/6), true);
			c.arc(x + d - ebs, y + ebs, ebs, 0, Math.PI*1.5,true);
			c.arc(x + r, y + r, r, (Math.PI * 5/3), (Math.PI * 4/3), true);
			c.lineTo(x + rbs, y);
			
			c.closePath();
			this.fillStroke();
			
		},
		fill:color,
		stoke: "black",
		strokeWidth: 1,
		//draggable:true
	});

	var gamma = new Kinetic.Shape({
		drawFunc: function() {
			var c = this.getContext();
			c.beginPath();
			c.moveTo(x+r,y+r);
			c.lineTo(x+r,y+d);
			c.lineTo(x+3*r,y+d);
			c.lineTo(x+3*r,y+r);
			c.closePath();
			this.fillStroke();
		},
		fill: color,
		stroke: "black",
		strokeWidth: 1,
	});

	font_size = 20;	
	var gamma_title = new Kinetic.Text({
		x:x+1.4*d-font_size,
		y:y+1.4*r-font_size/2,
		text:unescape('%u03B3'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});	

	var beta = new Kinetic.Shape({
		drawFunc: function() {
			var c = this.getContext();
			c.beginPath();
			c.moveTo(x+r,y+r);
			c.lineTo(x+d,y+r);
			c.lineTo(x+d, y+3*r);
			c.lineTo(x+r,y+3*r);
			c.closePath();
			this.fillStroke();
		},
		fill: color,
		stroke: "black",
		strokeWidth: 1,
	});

	var beta_title = new Kinetic.Text({
		x:x+1.5*r-font_size/2,
		y:y+1.4*d-font_size,
		text:unescape('%u03B2'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});	

	var alpha_title = new Kinetic.Text({
		x:x+r-font_size/2,
		y:y+r-font_size/2,
		text:unescape('%u03B1'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});

	layer.add(beta);
	layer.add(beta_title);
	layer.add(gamma);
	layer.add(gamma_title);
	layer.add(alpha);
	layer.add(alpha_title);
	layer.draggable(true);
	//this.x = protein.x;
	//this.y=protein.y;
	//this.onDrag = function()  {
	//	protein.onDrag();};
	return layer;
}

function gtp (x,y,r) {
	var layer = new Kinetic.Layer();

	var base = hexagon(x,y,r,"yellow",false);
	var p1 = new Kinetic.Circle({
		x:x,
		y:y+r,
		radius:r/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});
	var p2 = new Kinetic.Circle({
		x:x-r/2,
		y:y+3*r/2,
		radius:r/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});

	var p3 = new Kinetic.Circle({
		x:x-r,
		y:y+2*r,
		radius:r/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});
	layer.add(p3);
	layer.add(p2);
	layer.add(p1);
	layer.add(base);
	layer.draggable(true);
	return layer;
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

function boundRectangle (x, y, width, height, color, draggable) {
	return new Kinetic.Rect({
		x: x,
		y: y,
		width: width,
		height: height,
		stoke: "black",
		fill: color,
		strokeWidth: 1,
		draggable: draggable
	});
}

function adenyl_cyclase (x,y,width,height,color) {
	//var layer = new Kinetic.Layer();
	var alpha_radius = 30;
	var ebs = 2/5*alpha_radius;
	var effector = new Kinetic.Shape({
		drawFunc:function () {
			var c = this.getContext();
			c.beginPath();
			c.moveTo(x,y);
			c.lineTo(x + width, y);
			c.lineTo(x + width, y + height);
			c.lineTo(x + width/2, y + height);
			c.arc(x, y + height, ebs, 0, Math.PI*3/2, true);
			c.closePath();
			this.fillStroke();
		},
		fill: color,
		stroke: "black",
		strokeWidth:1,
	});
	return effector;
}
