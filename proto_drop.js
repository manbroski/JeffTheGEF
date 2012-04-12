var canvas_height = 500;
var canvas_width = 600;

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
	var message_layer = new Kinetic.Layer ();

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
	var ligand = new hexagon (300,150,15,"yellow");
	var trimer = new trimeric_g_protein (300,300,30,"red");
	var trimer_cover = new Kinetic.Rect ({x:287,y:287,width:105,height:105,fill:"white",});
	var GEF = new rounded_rect (50,400,50,50,20,"orange");
	var g3p = new gtp (77, 407,15);
	var g3p_cover = new Kinetic.Rect ({x:0,y:0,width:52,height:52,fill:"white"});
	var GEF_cover = new Kinetic.Rect ({x:49,y:399,width:52,height:52,fill:"white"});
	var effector = new adenyl_cyclase (400,225,50,50,"red");
	var atp = new adenosine_tp (500,300,15);
	var atp_cover = new Kinetic.Rect ({x:499,y:299,width:52,height:52,fill:"white"});
	var camp = new cyclic_amp (445,270,15);
	camp.shape.setAlpha(0);

	//binding sites set up
	var receptor_ligand = new rectangle (110 ,155, 40, 40);
	var receptor_trimer = new rectangle (140, 270 ,25, 25);
	var effector_alpha = new rectangle (390,255,30,30);
	var effector_atp = new rectangle (425, 250, 30, 30);

	//add elements to drawing queue
	main_layer.add (bilayer.shape);
	main_layer.add (receptor.shape);
	main_layer.add (receptor_ligand.shape);
	main_layer.add (receptor_trimer.shape);
	main_layer.add (ligand.shape);
	main_layer.add (GEF.shape);
	main_layer.add (effector.shape);
	main_layer.add (trimer.shape);
	main_layer.add (trimer_cover);

	main_layer.add (effector_alpha.shape);
	main_layer.add (effector_atp.shape);
	main_layer.add (atp.shape);
	main_layer.add (atp_cover);
	main_layer.add (camp.shape);

	main_layer.add (g3p.shape);
	main_layer.add (GEF_cover);
	main_layer.add (g3p_cover);

	//TODO: remove this
	effector.shape.setAlpha(1);
	

	stage.add (main_layer);

	stage.add (message_layer);

	write_message(message_layer, "Welcome to the GPCR tutorial. Your task is to produce a single cAMP molecule. Here, you see receptor and effector molecules. Start by attaching the yellow ligand to the GPCR.");

	//interactivity
	ligand.shape.on("dragend", function () {
		if (!pathway["ligand attachment"]) {
			//ligand
			l_x = ligand.shape.getAbsolutePosition().x - 15;
			l_y = ligand.shape.getAbsolutePosition().y - 15;
			l_w = 30;
			l_h = 30;

			//receptor
			r_x = receptor_ligand.shape.attrs.x;
			r_y = receptor_ligand.shape.attrs.y;
			r_w = receptor_ligand.shape.attrs.width;
			r_h = receptor_ligand.shape.attrs.height;
			
			if (l_x >= r_x && l_y >= r_y &&
					l_x + l_w <= r_x + r_w && l_y +l_h <= r_y + r_h) {
					//color
					receptor.receptor.setFill("green");
		
					//snap in place
					ligand.shape.attrs.x = receptor_ligand.shape.attrs.x + 20;
					ligand.shape.attrs.y = receptor_ligand.shape.attrs.y + 20;
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
					write_message(message_layer, "Great! The G-protein trimer can now attach to the GPCR.");
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
			l_w = 12;
			l_h = 12;

			//receptor
			r_x = receptor_trimer.shape.attrs.x;
			r_y = receptor_trimer.shape.attrs.y;
			r_w = receptor_trimer.shape.attrs.width;
			r_h = receptor_trimer.shape.attrs.height;
			
			//console.log(l_x + " " + l_y);
			//console.log(r_x + " " + r_y);

			if (l_x >= r_x && l_y >= r_y &&
				l_x + l_w <= r_x + r_w && l_y + l_h <= r_y + r_h) {
				trimer.alpha.protein.setFill ("blue");		
				trimer.setX (r_x + 5);
				trimer.setY (r_y + 5); 
				
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
				write_message(message_layer,"The guanosine exchange factor is now coming into play. Complete the exchange reaction by putting the GTP into the trimer's active site. You would need to get rid of the GDP first, though.");
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
				l_w = 15;
				l_h = 15;

				//receptor
				r_x = trimer.getBindingX();
				r_y = trimer.getBindingY();
				r_w = trimer.alpha.gtp_binding_site.attrs.width;
				r_h = trimer.alpha.gtp_binding_site.attrs.height;
				if (l_x + l_w <= r_x || l_x >= r_x + r_w || 
					l_y + l_h <= r_y || l_y >= r_y + r_h) {
					pathway["gdp detachment"]=true;
					write_message(message_layer,"Great. Now put that GTP in.");
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
				l_w = 15;
				l_h = 15;

				//receptor
				r_x = trimer.getBindingX();
				r_y = trimer.getBindingY();
				r_w = trimer.alpha.gtp_binding_site.attrs.width;
				r_h = trimer.alpha.gtp_binding_site.attrs.height;

				
				
				if (l_x >= r_x && l_y >= r_y &&
					l_x <= r_x + r_w && l_y <= r_y + r_h) {
					
					main_layer.add (GEF_cover);
					GEF_cover.setAlpha(0);
					GEF_cover.transitionTo({
						alpha: 1,
						duration: 0.5,
					});


					trimer.beta.transitionTo({
	        			alpha: 0,
		            	duration: 0.5,
        			});
					
					trimer.gamma.transitionTo({
						alpha:0,
						duration: 0.5,
					});
					trimer.alpha.protein.setFill("purple");

					g3p.shape.draggable(false);
					trimer.alpha.shape.draggable(true);
					trimer.alpha.shape.add(g3p.shape);
					g3p.setPosition(r_x + 5,r_y + 5);

					effector.shape.transitionTo({
						alpha: 1,
						duration: 0.5,
					});

					g3p_cover.setAlpha(0);
					g3p_cover.setPosition(trimer.gdp.getX() - 20,trimer.gdp.getY()-1);
					g3p_cover.transitionTo({
						alpha: 1,
						duration: 0.5,
					});
					setTimeout(function(){

						main_layer.remove(GEF.shape);
						main_layer.remove(g3p_cover);
						trimer.shape.remove(trimer.gdp.shape);
						trimer.shape.remove(trimer.beta);
						trimer.shape.remove(trimer.beta_title);
						trimer.shape.remove(trimer.gamma);
						trimer.shape.remove(trimer.gamma_title);
					},500);

					

					write_message(message_layer,"Splendid! Now that the alpha protein is activated and detached, you can use it to turn on the adenyl cyclase.");
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
			l_x = trimer.alpha.getX() + 42;
			l_y = trimer.alpha.getY();
			l_w = 12;
			l_h = 12;

			//receptor
			r_x = effector_alpha.shape.attrs.x;
			r_y = effector_alpha.shape.attrs.y;
			r_w = effector_alpha.shape.attrs.width;
			r_h = effector_alpha.shape.attrs.height;

			if (l_x >= r_x && l_y >= r_y &&
				l_x  + l_w <= r_x + r_w && l_y + l_h <= r_y + r_h) {
				effector.protein.setFill("green");
				trimer.alpha.setPosition(r_x+120,r_y+30);
				
				atp_cover.transitionTo({
	        			alpha: 0,
		            	duration: 0.5,
        			});
				setTimeout(function(){
						main_layer.remove(atp_cover);
				},500);
				main_layer.draw();
				pathway["attachment to effector"] = true;
				write_message(message_layer,"See this ATP? It can now be converted in a cyclic AMP. Go ahead.");
			}
		}
	});

	atp.shape.on ("dragend", function () {
		if (pathway["ligand attachment"] &&
			pathway["g-prot attachment"] &&
			pathway["gdp detachment"] &&
			pathway["gtp attachment"] &&
			pathway["attachment to effector"]) {
	
				l_x = atp.getX();
				l_y = atp.getY();
				l_w = 15;
				l_h = 15;

				//receptor
				r_x = effector_atp.shape.attrs.x;
				r_y = effector_atp.shape.attrs.y;
				r_w = effector_atp.shape.attrs.width;
				r_h = effector_atp.shape.attrs.height;
			
		
				if (l_x >= r_x && l_y >= r_y &&
					l_x  + l_w <= r_x + r_w && l_y + l_h <= r_y + r_h)  {

					atp.shape.remove(atp.letter);
					atp.shape.transitionTo({
						alpha: 0,
						duration: 0.5
					});

					camp.shape.transitionTo({
						alpha: 1,
						transition: 0.5
					});

					setTimeout(function(){
						main_layer.remove(atp.shape);
						main_layer.remove(atp_cover);
					},500);
					main_layer.draw();
					write_message(message_layer,"You have reached the end of your quest! You can now proceed to the question section. Good luck!");
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
		return this.shape.getAbsolutePosition().x + this.initial_x;}
	this.getY = function () {
		return this.shape.getAbsolutePosition().y + this.initial_y;}

	this.setPosition = function (new_x, new_y) {
		this.shape.setPosition(new_x - this.initial_x, new_y - this.initial_y);
		}

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
		y: y + 2*r - 20,
		width: 25,
		height: 25,
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

	this.shape = new Kinetic.Group();
	this.receptor = new Kinetic.Shape({
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

	var font_size = 14;	
	this.title = new Kinetic.Text({
		x:x+5,
		y:y+r-font_size/2,
		text:unescape("GPCR"),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});
	this.shape.add(this.receptor);
	this.shape.add(this.title);
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
		return this.shape.getAbsolutePosition().x + this.initial_x;}
	this.getY = function () {
		return this.shape.getAbsolutePosition().y + this.initial_y;}

	this.setPosition = function (new_x, new_y) {
		this.shape.setPosition(new_x - this.initial_x + 160, new_y - this.initial_y + 20);
		}

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
		return this.shape.getAbsolutePosition().x + this.initial_x;}
	this.getY = function () {
		return this.shape.getAbsolutePosition().y + this.initial_y;}

	this.setPosition = function (new_x, new_y) {
		this.shape.setPosition(new_x - this.initial_x, new_y - this.initial_y);
		}

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
		return this.shape.getAbsolutePosition().x+ this.initial_x;}
	this.getY = function () {
		return this.shape.getAbsolutePosition().y + this.initial_y;}


	this.getBindingX = function () {
		return this.shape.attrs.x + this.initial_x - 5;}
	this.getBindingY = function () {
		return this.shape.attrs.y + this.initial_y + 45;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}
	
	this.alpha = new alpha_subunit(x,y,r,color);

	this.gamma = new Kinetic.Shape({
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
	this.gamma_title = new Kinetic.Text({
		x:x+1.4*d-font_size,
		y:y+1.4*r-font_size/2,
		text:unescape('%u03B3'),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});	

	this.beta = new Kinetic.Shape({
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

	this.beta_title = new Kinetic.Text({
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

	this.shape.add(this.beta);
	this.shape.add(this.beta_title);
	this.shape.add(this.gamma);
	this.shape.add(this.gamma_title);
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
	
	var font_size = 14;	
	this.title = new Kinetic.Text({
		x:x+10,
		y:y + 5 ,
		text:unescape("AC"),
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});

	this.shape.add(this.protein);
	this.shape.add(this.title);
	this.shape.setAlpha(0);
}

function adenosine_tp (x,y,r) {

	this.shape = new Kinetic.Group();

	var font_size = 11;

	this.initial_x = x;
	this.initial_y = y;

	this.getX = function () {
		return this.shape.getAbsolutePosition().x + this.initial_x;}
	this.getY = function () {
		return this.shape.getAbsolutePosition().y + this.initial_y;}

	this.setX = function (new_x) {
		this.shape.attrs.x = new_x - this.initial_x;}

	this.setY = function (new_y) {
		this.shape.attrs.y = new_y - this.initial_y;}

	this.base = new boundRectangle(x,y,r,r,"purple",false);
	this.letter = new Kinetic.Text({
		x: x + r/2 - font_size/2,
		y: y + r/2 - font_size/2 + 1,
		text:"A",
		fontSize: font_size,
		fontFamily:"Calibri",
		textFill:"white",
	});

	var p1 = new Kinetic.Circle({
		x:x+r,
		y:y+r,
		radius:r/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});

	var p2 = new Kinetic.Circle({
		x:x+3*r/2,
		y:y+3*r/2,
		radius:r/2,
		fill:"lightblue",
		stroke:"black",
		strokeWidth:1
	});

	var p3 = new Kinetic.Circle({
		x:x+2*r,
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
	this.shape.add(this.letter);
	this.shape.draggable(true);
}

function cyclic_amp (x, y, r) {
	this.shape = new Kinetic.Group();
	
	var outer_lining = new Kinetic.RegularPolygon({
		x: x,
		y: y,
		sides: 5,
		radius: r+3,
		stroke: "black",
		strokeWidth: 1,
	});
	var fill = new Kinetic.RegularPolygon({
		x: x,
		y: y,
		sides: 5,
		radius: r,
		stroke: "orange",
		strokeWidth: 4,
	});
	var inner_lining = new Kinetic.RegularPolygon({
		x: x,
		y: y,
		sides: 5,
		radius: r-2,
		stroke: "black",
		strokeWidth: 1,
	});
	this.shape.add(outer_lining);
	this.shape.add(fill);
	this.shape.add(inner_lining);
	//this.shape.draggable(true);
}

function write_message(message_layer, message) {
	var context = message_layer.getContext();
	message_layer.clear();
	context.font = "13pt Calibri";
	context.fillStyle = "black";
	wrapText(context, message, 5, 18, 600, 20);
}

/*
 * create function that calculates when a new
 * line should be created based on the width
 */
function wrapText(context, text, x, y, maxWidth, lineHeight){
    var words = text.split(" ");
    var line = "";
 
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}
