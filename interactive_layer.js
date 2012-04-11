var canvasHeight = 800;
var canvasWidth = 800;

function main() {
    var stage = new Kinetic.Stage("canvas", canvasWidth, canvasHeight);
	var mainLayer = new Kinetic.Layer();
	var messageLayer = new Kinetic.Layer();

	var pathwaySteps = new Array();
	pathwaySteps["ligand attachment"] = false;
	pathwaySteps["g-protein attachment"] = false;
	//this second one is just for ensuring events only fire once.
	pathwaySteps["g-protein docking"] = false;
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

	//create static elements
	mainLayer.add(rect_bilayer(250,60,30));
	//just a useless comment

	//create dynamic elements
	var glucose = hexagon (10,50,15,"yellow",true);
	var ligandBox = rectangle (215,210,30,30,"blue",false);
	var gpcr_binding_site = rectangle (245,325,15,15,"blue",false);

	var gpcr = barrelProtein (200,250,60,60,"green");
	var trimer = new trimeric_g_protein(100,100,30,"red");
	//var guanosine_diphosphate = new gdp (200,200,15);
	var effector = adenyl_cyclase(500,300,50,50,"green");
	//var GEF = new loaded_GEF(100,500);
	
	//var GEF = new roundedRect(100,500,50,50,20,"orange");
	var GEF = new boundRectangle(100,500,50,50,"orange",true);
	
	var gtp_x = 100 + 27;
	var gtp_y = 500 + 7;
	var guanosine_triphosphate = new gtp(gtp_x,gtp_y,15);


	//add dynamic stuff to the layers
	mainLayer.add(gpcr);
	mainLayer.add(ligandBox);
	mainLayer.add(glucose);
	mainLayer.add(effector);
	mainLayer.add(gpcr_binding_site);
	mainLayer.add(GEF.protein);
	mainLayer.add(guanosine_triphosphate.group);
	mainLayer.add(trimer.group);

	//mainLayer.add(guanosine_diphosphate.group);

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
		if (inside(glucose,ligandBox)) {

			glucose.draggable(false);
			pathwaySteps ["ligand attachment"]= true;
			gpcr.fill="red";
			writeMessage(messageLayer, "Receptor activated. Now add the G protein");
				var thing = new Kinetic.Rect({
						x: 50,
						y: 50,
						width: 50,
						height: 50,
						fill: "orange",
						alpha: 0.2
					});
					mainLayer.add(thing);
                	Kinetic.Rect(thing).transitionTo({alpha: 1,duration: 1,});
					mainLayer.draw();
					console.log("what the fuck");
		}
	});

	trimer.group.on("dragend",function() {
		//console.log((trimer.x()) + " " + (trimer.y()));
		//size restriction should be 12 for this, but i am making it smaller
		if (trimer.x() > gpcr_binding_site.x &&
			trimer.x() + 5 < gpcr_binding_site.x + gpcr_binding_site.width &&
			trimer.y() > gpcr_binding_site.y &&
			trimer.y() + 5 < gpcr_binding_site.y + gpcr_binding_site.height) {
			if (pathwaySteps["ligand attachment"]) {

				pathwaySteps["g-protein attachment"] = true;

			}
			if (pathwaySteps["g-protein docking"] == false)
			{
					/*GEF.group.remove(GEF.base);
					GEF.group.remove(GEF.letter);
					GEF.group.remove(GEF.p1);
					GEF.group.remove(GEF.p2);
					GEF.group.remove(GEF.p3);
					GEF.protein.draggable(false);

					mainLayer.add(guanosine_triphosphate.group);*/
					trimer.group.draggable(false);
					//trimer.gdp.moveToTop();
					pathwaySteps["g-protein docking"] = true
			}
			else {
			writeMessage(messageLayer,"It is probably too early for the G protein. Make sure the lignad is on the receptor first");
			}

			mainLayer.draw();
		}
	});

		guanosine_triphosphate.group.on("dragend", function () {
			x = guanosine_triphosphate.group.x + 45;
			y = guanosine_triphosphate.group.y;
			//console.log(guanosine_triphosphate.base);
			//console.log(trimer.alpha.gtp_binding_site);
			if (inside(guanosine_triphosphate.base, trimer.alpha.gtp_binding_site)) {
				console.log("Success");
			}
			//if (x < )
		});
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
		if (pathwaySteps["g-protein attachment"]) {
			//log("hello from chicago!");	
			trimer.alpha.protein.fill = "green";
			//trimer.layer.draw();
		}

			if (pathwaySteps["ligand attachment"]) {

				pathwaySteps["g-protein attachment"] = true;
				if (pathwaySteps["g-protein docking"] == false)
				{

					pathwaySteps["g-protein docking"] = true;
				}
			}

		mainLayer.draw();
		
	});
	stage.start();
	
}

/**
 * Firefox  3 compliant log function
 */
 function log () {
    if (typeof console == 'undefined') {
        return;
    }
    console.log.apply(console, arguments);
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
	a.y < b.y + b.height);
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

	//start off with defining some crap
	var	rbs = r *2/5;
	var ebs = r *2/5;
	var d = r * 2;
	var gbs = 15;

	this.group = new Kinetic.Group();
	this.protein = new Kinetic.Shape({
		drawFunc: function() {
			var c = this.getContext();
			
			//draw
			c.beginPath();
			
			c.moveTo(x,y);
			c.lineTo(x, y + rbs);
			c.arc(x + r, y + r, r, (Math.PI * 7/6), (Math.PI * 5/6), true);
			c.lineTo(x + gbs, y + 2*r - gbs);
			c.arc(x + r, y + r, r, (Math.PI * 4/6), (Math.PI * 11/6), true);
			c.arc(x + d - ebs, y + ebs, ebs, 0, Math.PI*1.5,true);
			c.arc(x + r, y + r, r, (Math.PI * 5/3), (Math.PI * 4/3), true);
			c.lineTo(x + rbs, y);
			
			c.closePath();
			this.fillStroke();
			
		},
		fill:color,
		stoke: "black",
		strokeWidth: 1,
	});

	this.gtp_binding_site = new Kinetic.Rect({
		x: x,
		y: y + 2*r - gbs,
		width: 20,
		height: 20,
		//fill: "blue",
	});
	var font_size = 20;	
	var title = new Kinetic.Text({
		x:x+r-font_size/2,
		y:y+r-font_size/2,
		text:unescape('%u03B1'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});

	this.group.add(this.protein);
	this.group.add(this.gtp_binding_site);
	this.group.add(title);
	this.group.draggable(true);
	//return group;
}

/**
 * This an object that encapsulates the trimeric G protein assembly together with a GDP. It includes the labels and all too
 * Address the drawing layer as this.layer
 **/
function trimeric_g_protein (x, y, r, color) {
	
	var rbs = r *2/5;
	var ebs = r *2/5;
	var d = r * 2;
	this.group = new Kinetic.Group();

	//TODO: resolve for better coordinate system!
	this.initial_x = x;
	this.initial_y = y;

	this.x = function () {
		return this.group.x + this.initial_x;}
	this.y = function () {
		return this.group.y + this.initial_y;}


	this.alpha = new alpha_subunit(x,y,r,color);

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

	/*var alpha_title = new Kinetic.Text({
		x:x+r-font_size/2,
		y:y+r-font_size/2,
		text:unescape('%u03B1'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});*/
	
	font_size = 11;
	gx = x;
	gy = y + 45;
	//console.log(gy);
	gr = 15;
	this.gdp = new gdp(gx,gy,gr);




	this.group.add(beta);
	this.group.add(beta_title);
	this.group.add(gamma);
	this.group.add(gamma_title);
	this.group.add(this.alpha.group);
	//this.group.add(this.gdp.group);
	this.group.draggable(true);
	//this.x = alpha.x;
	//this.y = alpha.y;
	//this.onDrag = function()  {
	//	protein.onDrag();};
	//return layer;
}

function gtp (x,y,r) {
	this.group = new Kinetic.Group();

	var font_size = 11;
	this.base = new boundRectangle(x,y,r,r,"yellow",false);
	var letter = new Kinetic.Text({
		x: x + r/2 - font_size/2,
		y: y + r/2 - font_size/2 + 1,
		text:"G",
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"black",
	});

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
	this.group.add(p3);
	this.group.add(p2);
	this.group.add(p1);
	this.group.add(this.base.protein);
	this.group.add(letter);
	this.group.draggable(true);
}

function gdp (x,y,r) {
	
	this.group = new Kinetic.Group();
	
	var font_size = 11;
	var base = new boundRectangle(x,y,r,r,"yellow",false);
	var letter = new Kinetic.Text({
		x: x + r/2 - font_size/2,
		y: y + r/2 - font_size/2 + 1,
		text:"G",
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"black",
	});
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

	this.moveToTop = function () {
		p2.moveToTop();
		p1.moveToTop();
		base.moveToTop();
		letter.moveToTop();
	}

	this.group.add(p2);
	this.group.add(p1);
	this.group.add(base.protein);
	this.group.add(letter);
	this.group.draggable(true);
	//return this.group;
}
/**
 * This is a shape of a GEF protein, initially carrying a GTP
 * */
function loaded_GEF (x,y) {
	var size = 50;
	var curve_radius = 20;
	this.group = new Kinetic.Group();
	
	this.protein = roundedRect(100,500,size,size,curve_radius,"orange");
	
	var font_size = 11;
	var gx = x + 27;
	var gy = y + 7;
	//console.log(gy);
	var gr = 15;

    this.initial_x = x;
	this.initial_y = y;

    this.x = function () {
		return this.group.x + this.initial_x;}
	this.y = function () {
		return this.group.y + this.initial_y;}

	this.base = new boundRectangle(gx,gy,gr,gr,"yellow",false);

	this.letter = new Kinetic.Text({
		x: gx + gr/2 - font_size/2,
		y: gy + gr/2 - font_size/2 + 1,
		text:"G",
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"black",
	});

	this.p1 = new Kinetic.Circle({
		x:gx,
		y:gy+gr,
		radius:gr/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});

	this.p2 = new Kinetic.Circle({
		x:gx-gr/2,
		y:gy+3*gr/2,
		radius:gr/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});

	this.p3 = new Kinetic.Circle({
		x:gx-gr,
		y:gy+2*gr,
		radius:gr/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});
	this.group.add(this.protein);
	this.group.add(this.p3);
	this.group.add(this.p2);
	this.group.add(this.p1);
	this.group.add(this.base.protein);
	this.group.add(this.letter);
	this.group.draggable(true);

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
	this.protein = new Kinetic.Rect({
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

function roundedRect (x, y, w, h, r, color) {
	this.protein = new Kinetic.Shape({
		drawFunc:function() {
			var c = this.getContext();
			c.beginPath();
			c.moveTo(x + r,y);
			c.lineTo(x + w - r, y);
			c.arcTo(x + w, y, x + w, y + r, r);
			c.lineTo(x + w, y + h - r);
			c.arcTo(x + w, y + h, x + w - r, y + h, r);
			c.lineTo(x + r, y + h);
			c.arcTo(x, y + h, x, y + h - r, r);
			c.lineTo(x, y + r);
			c.arcTo(x,y,x+r, y, r);
			c.closePath();
			this.fillStroke();
		},
		fill: color,
		stroke: "black",
		strokeWidth:1
	});
}

