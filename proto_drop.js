var canvas_height = 500;
var canvas_width = 800;

/**
 * Most of the interactive behaviour happens here.
 *
 **/
function main () {

	//canvas setup
	var stage = new Kinetic.Stage ({
	container: "canvas",
	width: canvas_width, 
	height: canvas_height
	});
	var main_layer = new Kinetic.Layer ();

	//logic setup
	var pathway = new Array ();
	pathway ["ligand attachment"] = false;
	pathway ["g-prot attachment"] = false;
	pathway ["gdp detachment"] = false;
	pathway ["gtp attachment"] = false;
	pathway ["attachment to effector"] = false;

	//elements setup
	var bilayer = new rect_bilayer (200,50);
	var receptor = new barrel_protein (100,200,60,60,"red");
	var ligand = new hexagon (100,100,15,"yellow");
	var trimer = new trimeric_g_protein (300,300,30,"red");
	var trimer_cover = new Kinetic.Rect ({x:287,y:287,width:105,height:105,fill:"white",});
	var GEF = new rounded_rect (50,400,50,50,20,"orange");
	var g3p = new gtp (77, 407,15);
	var GEF_cover = new Kinetic.Rect ({x:49,y:399,width:52,height:52,fill:"white"});
	var effector = new adenyl_cyclase (400,225,50,50,"red");

	//binding sites set up
	var receptor_ligand = new rectangle (115 ,160, 30, 30);
	var receptor_trimer = new rectangle (145, 275 ,15, 15);
	var effector_alpha = new rectangle (395,260,20,20,"blue");	
	var effector_atp = new rectangle (425, 250, 30, 30, "blue");

	//add elements to drawing queue
	main_layer.add (bilayer.shape);
	main_layer.add (receptor.shape);
	main_layer.add (receptor_ligand.shape);
	main_layer.add (receptor_trimer.shape);
	main_layer.add (ligand.shape);
	main_layer.add (GEF.shape);
	main_layer.add (trimer.shape);
	main_layer.add (trimer_cover);
	main_layer.add (effector.shape);
	main_layer.add (effector_alpha.shape);
	main_layer.add (effector_atp.shape);

	main_layer.add (g3p.shape);
	main_layer.add (GEF_cover);

	//TODO: remove this
	effector.shape.setAlpha(1);
	
	stage.add (main_layer);


	//interactivity
	ligand.shape.on("dragend", function () {
		if (!pathway["ligand attachment"]) {
			//ligand
			l_x = ligand.shape.attrs.x;
			l_y = ligand.shape.attrs.y;
			l_w = ligand.shape.attrs.width;
			l_h = ligand.shape.attrs.height;

			//receptor
			r_x = receptor_ligand.shape.attrs.x;
			r_y = receptor_ligand.shape.attrs.y;
			r_w = receptor_ligand.shape.attrs.width;
			r_h = receptor_ligand.shape.attrs.height;

			if (l_x >= r_x && l_y >= r_y &&
					l_x <= r_x + r_w && l_y <= r_y + r_w) {
					//color
					receptor.shape.setFill("green");
		
					//snap in place
					ligand.shape.attrs.x = receptor_ligand.shape.attrs.x + 15;
					ligand.shape.attrs.y = receptor_ligand.shape.attrs.y + 15;
					ligand.shape.draggable (false);	
				    //show the alpha
					trimer_cover.transitionTo({
	        			alpha: 0,
		            	duration: 0.5,
        			});
					setTimeout(function(){
						main_layer.remove(trimer_cover);
					},500);

					pathway["ligand attachment"] = true;
					main_layer.draw();
			}

		}
	});

	trimer.shape.on("dragend", function () {
		//console.log(trimer.getBindingX() + "; " + trimer.getBindingY());
		if (!pathway["g-prot attachment"] &&
			pathway["ligand attachment"]) {
			
			//ligand
			l_x = trimer.getX();
			l_y = trimer.getY();
			l_w = trimer.alpha.protein.attrs.width;
			l_h = trimer.alpha.protein.attrs.height;

			//receptor
			r_x = receptor_trimer.shape.attrs.x;
			r_y = receptor_trimer.shape.attrs.y;
			r_w = receptor_trimer.shape.attrs.width;
			r_h = receptor_trimer.shape.attrs.height;
			
			//console.log(l_x + " " + l_y);
			//console.log(r_x + " " + r_y);

			if (l_x >= r_x && l_y >= r_y &&
				l_x <= r_x + r_w && l_y <= r_y + r_w) {
				trimer.alpha.protein.setFill ("green");		
				trimer.setX (r_x);
				trimer.setY (r_y); 
				
				GEF_cover.transitionTo({
	        			alpha: 0,
		            	duration: 0.5,
        			});
				setTimeout(function(){
						main_layer.remove(GEF_cover);
				},500);
				trimer.gdp.shape.draggable(true);
				trimer.shape.draggable(false);
				trimer.alpha.shape.draggable(false);

				main_layer.draw();
				pathway["g-prot attachment"] = true;
			}
		}
	});

	trimer.gdp.shape.on("dragend", function () {
		if (pathway["ligand attachment"] &&
			pathway["g-prot attachment"] &&
			!pathway["gdp detachment"]){
				//ligand
				l_x = trimer.gdp.getX();
				l_y = trimer.gdp.getY();
				l_w = trimer.gdp.shape.attrs.width;
				l_h = trimer.gdp.shape.attrs.height;

				//receptor
				r_x = trimer.getBindingX();
				r_y = trimer.getBindingY();
				r_w = trimer.alpha.gtp_binding_site.attrs.width;
				r_h = trimer.alpha.gtp_binding_site.attrs.height;
				if (l_x <= r_x && l_y <= r_y ||
					l_x >= r_x + r_w && l_y >= r_y + r_w) {
					pathway["gdp detachment"]=true;
				}
		}
	});

	g3p.shape.on("dragend", function () {
		if (pathway["ligand attachment"] &&
			pathway["g-prot attachment"] &&
			pathway["gdp detachment"] &&
			!pathway["gtp attachment"]) {
	
				//ligand
				l_x = g3p.getX();
				l_y = g3p.getY();
				l_w = g3p.shape.attrs.width;
				l_h = g3p.shape.attrs.height;

				//receptor
				r_x = trimer.getBindingX();
				r_y = trimer.getBindingY();
				r_w = trimer.alpha.gtp_binding_site.attrs.width;
				r_h = trimer.alpha.gtp_binding_site.attrs.height;

				
				console.log(l_x + " " + l_y);
				console.log(r_x + " " + r_y);
				
				if (l_x >= r_x && l_y >= r_y &&
					l_x <= r_x + r_w && l_y <= r_y + r_w) {
					
					GEF.shape.transitionTo({
	        			alpha: 0,
		            	duration: 0.5,
        			});
					
					trimer.gdp.shape.transitionTo({
						alpha:0,
						duration: 0.5,
					});

					g3p.shape.draggable(false);
					trimer.alpha.shape.draggable(true);
					trimer.alpha.shape.add(g3p.shape);
					g3p.setX(r_x);
					g3p.setY(r_y);

					effector.shape.transitionTo({
						alpha: 1,
						duration: 0.5,
					});
					

					main_layer.draw();
					pathway["gtp attachment"] = true;
				}
		}
	});

	trimer.alpha.shape.on("dragend", function () {
		if (pathway["ligand attachment"] &&
			pathway["g-prot attachment"] &&
			pathway["gdp detachment"] &&
			pathway["gtp attachment"] &&
			!pathway["attachment to effector"]) {
			//ligand
			l_x = trimer.alpha.getX() + 50;
			l_y = trimer.alpha.getY();
			l_w = 15;
			l_h = 15;

			//receptor
			r_x = effector_alpha.shape.attrs.x;
			r_y = effector_alpha.shape.attrs.y;
			r_w = effector_alpha.shape.attrs.width;
			r_h = effector_alpha.shape.attrs.height;
			
			console.log(l_x + " " + l_y);
			console.log(r_x + " " + r_y);
		
			if (l_x >= r_x && l_y >= r_y &&
				l_x <= r_x + r_w && l_y <= r_y + r_w) {
				effector.protein.setFill("green");
			}
		}

	});

}


function alpha_subunit (x, y, r, color, a) {

	var	rbs = r * 0.4;
	var ebs = r * 0.4;
	var d = r * 2;
	var gbs = 15;

	this.shape = new Kinetic.Group();

	this.initial_x = x;
	this.initial_y = y;

	this.getX = function () {
		return this.shape.attrs.x + this.initial_x;}
	this.getY = function () {
		return this.shape.attrs.y + this.initial_y;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}

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
		x: x-5,
		y: y + 2*r - gbs,
		width: 20,
		height: 20,
		fill: "blue",
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

	this.shape.add(this.protein);
	this.shape.add(this.gtp_binding_site);
	this.shape.add(title);
	this.shape.draggable(true);
}

function rect_bilayer(origin, thickness) {
	this.shape = new Kinetic.Shape({
		drawFunc: function() {
			var context = this.getContext();
			context.beginPath();
			context.moveTo(0, origin);
			context.lineTo(canvas_width,origin);
			context.lineTo(canvas_width, origin + thickness);
			context.lineTo(0, origin + thickness);
			context.closePath();
			this.fillStroke();
		},
		fill:"#FFDF64",
		stroke: "black",
		strokeWidth: 1
	});
}

function barrel_protein (x, y, width, height, color) {
	
	var curvature = 20;
	var r = width/2;
	var ligand_radius = 20;
	var alpha_radius = 30;
	var alpha_bs = 12;

	this.shape = new Kinetic.Shape({
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
			
			this.fillStroke();
		},
		
		fill:color,
		stoke: "black",
		strokeWidth: 1
	});
}

function hexagon (x, y, radius, color ) {
	this.shape = new Kinetic.RegularPolygon({
		x: x,
		y: y,
		sides: 6,
		radius: radius,
		stroke: "black",
		fill: color,
		strokeWidth: 1,
		draggable: true
	});
}

function rectangle (x, y, width, height, color, draggable) {
	this.shape = new Kinetic.Rect({
		x: x,
		y: y,
		width: width,
		height: height,
		fill: color,
	});
}

function gtp (x,y,r) {

	this.shape = new Kinetic.Group();

	var font_size = 11;

	this.initial_x = x;
	this.initial_y = y;

	this.getX = function () {
		return this.shape.attrs.x + this.initial_x;}
	this.getY = function () {
		return this.shape.attrs.y + this.initial_y;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}

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
	this.shape.add(p3);
	this.shape.add(p2);
	this.shape.add(p1);
	this.shape.add(this.base.shape);
	this.shape.add(letter);
	this.shape.draggable(true);
}

function gdp (x,y,r) {

	this.shape = new Kinetic.Group();

	this.initial_x = x;
	this.initial_y = y;

	this.getX = function () {
		return this.shape.attrs.x + this.initial_x;}
	this.getY = function () {
		return this.shape.attrs.y + this.initial_y;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}

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


	this.shape.add(p2);
	this.shape.add(p1);
	this.shape.add(this.base.shape);
	this.shape.add(letter);
	this.shape.draggable(true);
}

function boundRectangle (x, y, width, height, color, draggable) {
	this.shape = new Kinetic.Rect({
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

function trimeric_g_protein (x, y, r, color) {
	
	var rbs = r *2/5;
	var ebs = r *2/5;
	var d = r * 2;
	this.shape = new Kinetic.Group();

	this.initial_x = x;
	this.initial_y = y;

	this.getX = function () {
		return this.shape.attrs.x + this.initial_x;}
	this.getY = function () {
		return this.shape.attrs.y + this.initial_y;}


	this.getBindingX = function () {
		return this.shape.attrs.x + this.initial_x - 5;}
	this.getBindingY = function () {
		return this.shape.attrs.y + this.initial_y + 45;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}
	
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

	
	font_size = 11;
	gx = x + 5;
	gy = y + 45;
	gr = 15;
	this.gdp = new gdp(gx,gy,gr);

	this.shape.add(beta);
	this.shape.add(beta_title);
	this.shape.add(gamma);
	this.shape.add(gamma_title);
	this.shape.add(this.alpha.shape);
	this.shape.add(this.gdp.shape);
	this.shape.draggable(true);
}

function rounded_rect (x, y, w, h, r, color) {
	this.shape = new Kinetic.Shape({
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

function adenyl_cyclase (x,y,width,height,color) {
	this.shape = new Kinetic.Group();

	var alpha_radius = 30;
	var ebs = 2/5*alpha_radius;
	this.protein = new Kinetic.Shape({
		drawFunc:function () {
			var c = this.getContext();
			c.beginPath();
			c.moveTo(x,y);
			c.lineTo(x + width, y);
			c.lineTo(x + width, y + height/2);
			c.lineTo(x + width/2 , y + height/2);
			c.lineTo(x + width/2, y + height);
			c.lineTo(x + width/2, y + height);
			c.arc(x, y + height, ebs, 0, Math.PI*3/2, true);
			c.closePath();
			this.fillStroke();
		},
		fill: color,
		stroke: "black",
		strokeWidth:1,
	});
	this.shape.add(this.protein);
	this.shape.setAlpha(0);
}
