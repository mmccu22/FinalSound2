let palette = [
  '#FF0000', // red
  '#FFA500', // orange
  '#FFFF00', // yellow
  '#00FF00', // green
  '#00FFFF', // cyan
  '#0000FF', // blue
  '#FF00FF', // magenta
  '#A52A2A', // brown
  '#FFFFFF', // white
  '#000000'  // black
]

let currentColor = '#000000'; // Initial color is black
let brushSize = 10; // Initial brush size
let paletteWidth = 30; // Width of the color palette
let canDraw = true; // Flag to control drawing


let synth;
let envelope;
let osc;

function setup() {
  createCanvas(1500, 800);
  drawPalette();
  synth = new p5.PolySynth();

  envelope = new p5.Envelope();
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);
  envelope.setRange(1, 0);
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(240);
  osc.amp(envelope);
  osc.start();  // Start the oscillator here
}


function draw() {
  if (mouseIsPressed && mouseX > (paletteWidth + 5) && canDraw) {
    stroke(currentColor);
    strokeWeight(brushSize);
    line(pmouseX, pmouseY, mouseX, mouseY);
    playSound(); // Call the function to play sound while drawing
  }
}

function drawPalette() {
  let boxHeight = height / palette.length;
  
  push(); // Save the current drawing state
  noStroke(0);
  for (let i = 0; i < palette.length; i++) {
    fill(palette[i]); // Set the fill color to the current palette color
    rect(0, i * boxHeight, paletteWidth, boxHeight);
  }
  pop(); // Restore the original drawing state
}




function mousePressed() {
  osc.start(); // Ensure the oscillator starts on a user action
  if (mouseX < paletteWidth && mouseY < height) {
    let index = Math.floor(mouseY / (height / palette.length));
    currentColor = palette[index];
    playColorChangeSound();
    canDraw = false;
    setTimeout(() => canDraw = true, 100);
  } else {
    canDraw = true;
    playBrushSound();
  }
}



function playSound() {
  // Adjust sound parameters based on painting action
  let volume = map(mouseX, 0, width, 0.1, 1);
  let freq = map(mouseY, 0, height, 100, 1200);
  envelope.setADSR(0.001, map(mouseX, 0, width, 0.1, 2), 0.1, map(mouseY, 0, height, 0.1, 2));
  envelope.setRange(volume, 0);
  osc.freq(freq);
  envelope.play(osc);
}

function playBrushSound() {
  // Play brush sound when painting starts
  osc.start();
}

function playColorChangeSound() {
  // Play sound when color changes
  osc.freq(1000);
  envelope.play(osc);
  setTimeout(() => {
    osc.freq(240); // Reset frequency
  }, 200);
}



function keyPressed() {
  if (key === 'c' || key === 'C') {
    clear(); // Clear the canvas
    drawPalette(); // Redraw the palette after clearing
    backgroundColor = 255; // Reset background color
    playClearScreenSound();
  }
}



function keyTyped() {
  if (keyIsDown(CONTROL) && key === 's') {
    // Save the file with corresponding sound when Command + S is pressed
    saveCanvas('My Paint Art', 'png');
    playSaveSound();
  }
}

function playClearScreenSound() {
  // Play sound when screen is cleared
  osc.setType('sawtooth');
  envelope.play(osc);
  setTimeout(() => {
    osc.setType('sine'); // Reset oscillator type
  }, 200);
}

function playSaveSound() {
  // Play bell-like sound when file is saved
  osc.setType('triangle');
  osc.freq(800);
  envelope.play(osc);
  setTimeout(() => {
    osc.setType('sine'); // Reset oscillator type
  }, 200);
}