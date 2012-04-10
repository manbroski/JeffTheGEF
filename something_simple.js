var canvasHeight = 800;
var canvasWidth = 800;

function main() {
    var stage = new Kinetic.Stage("canvas", canvasWidth, canvasHeight);
	var mainLayer = new Kinetic.Layer();

	var guanosine = new gdp(200,200,15);
	mainLayer.add(guanosine.group);

	//create stage
	stage.add(mainLayer);
}

function gdp (x,y,r) {
	
	this.group = new Kinetic.Group();
	
	var font_size = 11;
	var base = boundRectangle(x,y,r,r,"yellow",false);
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

	this.group.add(p2);
	this.group.add(p1);
	this.group.add(base);
	this.group.add(letter);
	this.group.draggable(true);
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

