// Scripts for making a puzzle on our website. Girls Coding Club 2016-2017
// David's js file as of 12/16/16 - 1/13/17
// script 6 Let's now create a swaping piece function and switch with mouseUp
// and check to see if correct puzzle and change size of puzzle

// global variables
var canvas, ctx, dragging, w=600, h=400;
var canvasOffset, offsetX, offsetY;

// load up the canvas, 
function init() {
	//load canvas
	canvas = document.getElementById("puzzleCanvas");
	ctx = canvas.getContext("2d"), canvas.width = w, canvas.height = h;
	canvasOffset = $("#puzzleCanvas").offset();
	offsetX = Math.round(canvasOffset.left),
	offsetY = Math.round(canvasOffset.top);    
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);

	// alternative ways of using a button on the html
	//document.getElementById("loadPuzzleButton").addEventListener("click",function() { loadPuzzle();});
	//document.getElementById("changeDifficultyButton").addEventListener("click",function() { changeSize();});

	// loadPuzzle will do everything but load the picture. that's okay the button will :)
	initArrays();
	loadPuzzle();
} // end init

// setting up the number of sides and number of pieces	
// to start we will do a 2 by 2 with 4 pieces
// the startClip and sectionWidth is for cropping to just a section of the image
var sides = 2;
var pieces = sides*sides;
var startClipX = w/sides;
var startClipY = h/sides;
var sectionWidth = w/sides;
var sectionHeight = h/sides;

// loading up the puzzle images
var imageObj = new Image();
imageObj.src = 'pict2.JPG';


// creating arrays for the pieces of the puzzle to hold x, y, and piecenumber.
var piecesArray=new Array();
function Piece() {
	var pieceNumber;
	var x;
	var y;
}
var slotArray=new Array();
function Slot() {
	var Piece
	var slotNumber;
	var x;
	var y;
}
function initArrays() {
	for (var i = 0; i < pieces; i++) {
	 	piecesArray[i] = new Piece();
	 	slotArray[i] = new Slot();
	 	piecesArray[i].pieceNumber = i;
	 	slotArray[i].slotNumber = i; 
	 	slotArray[i].Piece = piecesArray[i];
	} 
	for (var i = 0; i < sides; i++) {
		for (var j = 0; j < sides; j++) {
			var index = (i*sides)+j;
			piecesArray[index].x = j*sectionWidth;
			piecesArray[index].y = i*sectionHeight;
			slotArray[index].x = j*sectionWidth;
			slotArray[index].y = i*sectionHeight;
		}
	}
	shuffle(slotArray);
}// end initArray

// Fisher-Yates shuffle of randomly building a new list
function shuffle(array) {
	var currentIndex = array.length, tempValue, randomIndex;

	// keep selecting elements until list is gone
	while (currentIndex!==0) {
		// pick an element from list randomly 
		randomIndex = Math.floor(Math.random()*currentIndex);
		currentIndex -= 1;

		// swap with last element
		tempValue = array[currentIndex].Piece;
		array[currentIndex].Piece= array[randomIndex].Piece;
		array[randomIndex].Piece=tempValue;
	}
}

// load picture for puzzle
function loadPuzzle() {
	ctx.clearRect(0,0,w,h)
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0,0,w,h)

	// after the image parameter, these are the rest in order IMAGE MUST BE SAME SIZE AS CANVAS!
	// startClipX, startClipY, width of clip, height of clip, location x, location y, width, height
	for (var tempIndex=0; tempIndex<pieces; tempIndex++) {
		var tempPiece = slotArray[tempIndex].slotNumber;
		ctx.drawImage(imageObj, slotArray[tempPiece].Piece.x, slotArray[tempPiece].Piece.y, sectionWidth, sectionHeight, slotArray[tempIndex].x, slotArray[tempIndex].y, sectionWidth, sectionHeight);
	}
} // end loadPuzzle

function doMouseDown() {
  	canvas.addEventListener("mousemove", doMouseMove, false);
  	mouseX = event.clientX-offsetX;
  	mouseY = event.clientY-offsetY;
	currentMovingFromPiece = getCurrentPiece(mouseX, mouseY);
	dragging =true;
}  // end doMouseDown

function doMouseMove() {
  	if (dragging){
  		mouseX = event.clientX-offsetX;
  		mouseY = event.clientY-offsetY;
  		loadPuzzle();
  		var piece = slotArray[currentMovingFromPiece].Piece;
  		ctx.drawImage(imageObj, piece.x, piece.y, sectionWidth, sectionHeight, mouseX-.5*sectionWidth, mouseY-.5*sectionHeight, sectionWidth, sectionHeight);
  	}	
}  // end doMouseMove

function doMouseUp() {
	if (dragging) {
		dragging = false;
	  	mouseX = event.clientX-offsetX;
  		mouseY = event.clientY-offsetY;
		currentMovingToPiece = getCurrentPiece(mouseX, mouseY)
		// swap with last element
		tempValue = slotArray[currentMovingToPiece].Piece;
		slotArray[currentMovingToPiece].Piece= slotArray[currentMovingFromPiece].Piece;
		slotArray[currentMovingFromPiece].Piece=tempValue;
		
	} // endIf 
	loadPuzzle();
	piecesCorrect();
	canvas.removeEventListener("mousemove", doMouseMove, false);
}  // end doMouseUp

//  determining the current piece when mouse is down

// check if puzzles are correct
function piecesCorrect() {
	var piecesSolved = 0;
	for (var int = 0; int < pieces; int++) {
		if (slotArray[int].slotNumber == slotArray[int].Piece.pieceNumber) {
			piecesSolved++;
		}
	}
	if (piecesSolved == pieces) {
		ctx.font = "80px Arial";
		ctx.fillText("Nice!",50,150);
	}
}

// check for mouse location and current piece
function getCurrentPiece(x, y) {
	// checking which column by x index jumping at section widths
	var xIndex = 0;
	var tempSectionWidth = sectionWidth;
	while (x >= tempSectionWidth) {
		xIndex++;
		tempSectionWidth += sectionWidth;
	}
	// checking which column by y index jumping at section heights	
	var yIndex = 0;
	var tempSectionHeight = sectionHeight;
	while (y >= tempSectionHeight) {
		yIndex++;
		tempSectionHeight += sectionHeight;
	}

	var pieceIndex = xIndex + (yIndex * sides);
	return pieceIndex;
}

function changeSize(){
	sides +=1;
	pieces=sides*sides;
	startClipX = w/sides;
	startClipY = h/sides;
	sectionWidth = w/sides;
	sectionHeight = h/sides;
	initArrays();
	loadPuzzle();
}

function nextImg() {
	alert('This will load next image in file');
}
