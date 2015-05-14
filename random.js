var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var cellSize = 10;
var sizes = [c.width/cellSize, c.height/cellSize];
var clicks = 0;
var N = 20;


var cells = [];
for (var i=0; i<sizes[0]; i++){
	cells.push([]);
	for (var j=0; j<sizes[1]; j++){
		cells[i].push(0);
	};
};

function draw(){
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,c.width,c.height);

	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0,0,c.width,c.height);
};

function drawCell(x,y){
	ctx.fillStyle = "#000000";
	ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
};

var total = 0;
function calcDiscrepancy(){
	// Points chosen
	var points = [];
	for (var i=0; i<cells.length; i++){
		for (var j=0; j<cells[i].length; j++){
			if (cells[i][j] === 1){
				points.push([(i/sizes[0]), (j/sizes[1])]);
			};
		};
	};
	
	/* // Random pointset
	for (var i=0; i<N; i++){
		points.push([Math.random(), Math.random()])
	}; */
	
	
	
	// Calculation of the L2 star discrepancy
	// First term
	var L2term1 = 0;
	for (var i=0; i<N; i++){
		for (var j=0; j<N; j++){
			if (points[i][0] > points[j][0]){
				if (points[i][1] > points[j][1]){
					L2term1 += (1 - points[i][0])*(1 - points[i][1]);
				}
				else {
					L2term1 += (1 - points[i][0])*(1 - points[j][1]);
				};
			}
			else {
				if (points[i][1] > points[j][1]){
					L2term1 += (1 - points[j][0])*(1 - points[i][1]);
				}
				else {
					L2term1 += (1 - points[j][0])*(1 - points[j][1]);
				};
			};
		};
	};
	L2term1 = L2term1/Math.pow(N,2);
	
	// Second term
	var L2term2 = 0;
	for (var i=0; i<N; i++){
		L2term2 += (1 - Math.pow(points[i][0],2))*(1 - Math.pow(points[i][1],2));
	};
	L2term2 = L2term2 * 2 / (4*N);
	
	// Total
	L2 = L2term1 - L2term2 + Math.pow((1/3),2);
	
	document.getElementById("tekst").innerHTML = L2;
	
	
	// Diaphonies
	var Dia = 0;
	for (var i=0; i<N; i++){
		for (var j=0; j<N; j++){
			Dia += beta(points[i],points[j]);
		};
	};
	
	Dia += Dia/N;
};

function beta(point1, point2){
	//var n01 = 
	//var n10 = 
	//var n11 = 
};


c.addEventListener("mousedown", getPosition, false);

function getPosition(event){
	var x = event.x;
	var y = event.y;

	x -= c.offsetLeft;
	y -= c.offsetTop;
	
	var xCell = Math.floor(x/cellSize);
	var yCell = Math.floor(y/cellSize);
		
	if (cells[xCell][yCell] === 0){
		cells[xCell][yCell] = 1;
		clicks++;
		
		drawCell(xCell,yCell);
		
		if (clicks === N){
			calcDiscrepancy();
		};
	};
	
};

draw();