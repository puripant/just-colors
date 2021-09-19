const maxWidth = 500;
const scaling = 50;

let input, src, dst;
let width, height;

const options_shuffle = document.getElementById('options-shuffle');
const options_save = document.getElementById('options-save');
let option = 'shuffle-horizontal'

let imgElement = document.getElementById('image');
imgElement.onload = () => {
  input = cv.imread('image');
  // cv.imshow('background', input);

  width = Math.min(input.cols, maxWidth);
  height = Math.min(input.rows, width * input.rows / input.cols);
  cv.resize(input, input, new cv.Size(width, height), 0, 0, cv.INTER_AREA);

  canvas.width = width;
  canvas.height = height;

  src = input.clone();
  cv.resize(src, src, new cv.Size(width/scaling, height/scaling), 0, 0, cv.INTER_AREA);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);

  update(option);

  options_shuffle.style.visibility = 'visible';
  options_save.style.visibility = 'visible';
}

let inputElement = document.getElementById('file');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

function update(option) {
  dst = input.clone()
  for (let i = 0; i < src.rows; i++) {
  for (let j = 0; j < src.cols; j++) {
    let avg = src.ucharPtr(i, j);

    for (let x = 0; x < scaling; x++) {
    for (let y = 0; y < scaling; y++) {
      dst.ucharPtr(scaling*i + x, scaling*j + y)[0] = avg[0];
      dst.ucharPtr(scaling*i + x, scaling*j + y)[1] = avg[1];
      dst.ucharPtr(scaling*i + x, scaling*j + y)[2] = avg[2];
      dst.ucharPtr(scaling*i + x, scaling*j + y)[3] = 255;
    }
    }
  }
  }
  cv.imshow('result', dst);
  dst.delete();
}

function onOpenCvReady() {
  inputElement.disabled = false;
}

let canvas = document.getElementById('result');
let ctx = canvas.getContext('2d');