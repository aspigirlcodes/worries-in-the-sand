var keyboard = false
var paperscript = {};

function hideInstructions(){
  document.getElementById("instruction_wrapper").style.display = 'none';
}

function showInstructions(){
  document.getElementById("instruction_wrapper").style.display = 'block';
  document.getElementById("keyboard_toggle").addEventListener("click", keyToggle);
  if (keyboard){
    paperscript.typeInit();
  }
}

window.onload = function () {
  showInstructions();
}

function keyToggle() {
  if(! keyboard){
    document.getElementById("instructions").innerHTML = '<p>Write your worries in the sand using your keyboard. <br/><a href="#" id="keyboard_toggle">(click here to use the mouse instead.)</a></p> <p>Than click the sea to change the tide.</p>';
    document.getElementById("keyboard_toggle").addEventListener("click", keyToggle);
    keyboard = true;
    paperscript.typeInit();
  } else {
    document.getElementById("instructions").innerHTML = '<p>Write/draw your worries in the sand using your mouse. <br/><a href="#" id="keyboard_toggle">(click here to use the keyboard instead.)</a></p> <p> Than click the sea to change the tide.</p>';
    document.getElementById("keyboard_toggle").addEventListener("click", keyToggle);
    keyboard = false;
    paperscript.typeCleanup();
  }
  return false;
}
