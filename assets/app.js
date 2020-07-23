const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const preview = document.querySelector(".preview");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = "600";
const SAVE_IMG = "saveImg";
// const SAVE_IMGG = "saveImgg";

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
//css 상으로 크기 정했지만 시스템상으로 작동하게 하려면 pixel 사이즈 줘야함.

ctx.fillStyle= "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = "#INITIAL_COLOR";
ctx.fillStyle = "#INITIAL_COLOR";
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;
let images = [];

function startPainting(){
    painting = true;
}

function stopPainting(){
    painting = false;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting){
      ctx.beginPath();//click 할 때까지 따라다니는 것.
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke(); // stroke: 현재의 sub-path를 현재의 strokeStlye로 획을 그음
      // ctx.closePath();
    }
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    console.log(color);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick() {
    if(filling === true){
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling  = true;
        mode.innerText = "Paint";
        ctx.fillStyle = ctx.strokeStyle;
    }
  }

function handleCanvasClick(){
    if(filling){
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  }



function handleSaveClick(text){
    let picture = canvas.toDataURL("image/png"); //png가 디폴트값 >> image/png 안 적어도 됨.
    paintImages(picture);
  }

function handleCM(event){
  event.preventDefault();
  //우클릭 방지
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);//mousedown: 클릭 상태에서 일어나는 event
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

if(range) {
  range.addEventListener("input", handleRangeChange);
}

if(mode){
  mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
  saveBtn.addEventListener("click", handleSaveClick);
}


function deleteImages(event){
  const btn = event.target;
  const div = btn.parentNode;
  preview.removeChild(div);
  const cleanImgs = images.filter(function(img){
    return img.id !== parseInt(div.id);
  });
  images = cleanImgs;
  saveImage();
}

function saveImage(){
  localStorage.setItem(SAVE_IMG, JSON.stringify(images));
}

function paintImages(text){
  const image = new Image();
  const delBtn = document.createElement("button");
  const div = document.createElement("div");
  const newId = images.length + 1;
  delBtn.innerText = "x";
  delBtn.addEventListener("click", deleteImages);
  image.src = text;
  div.id = newId;
  div.appendChild(image);
  div.appendChild(delBtn);
  preview.appendChild(div);
  const picturesObj = {
    text: text,
    id: newId
  };
  images.push(picturesObj);
  localStorage.setItem(SAVE_IMG, JSON.stringify(images));
}

function loadImage(){
  const loadedImages = localStorage.getItem(SAVE_IMG);
  if(loadedImages !== null){
    const parseImages = JSON.parse(loadedImages);
    parseImages.forEach(function(saves){
      paintImages(saves.text);
    })
  }
}

function init(){
  loadImage();
}
init();
