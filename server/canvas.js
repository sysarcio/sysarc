const { createCanvas, loadImage } = require("canvas");

module.exports = {
  drawCanvas(data) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext("2d");

    // // test from github ------------------------------------------

    // Write "Awesome!"
    ctx.font = "30px Impact";
    ctx.rotate(0.1);
    ctx.fillText("Awesome!", 50, 100);

    // Draw line under text
    var text = ctx.measureText("Awesome!");
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.lineTo(50, 102);
    ctx.lineTo(50 + text.width, 102);
    ctx.stroke();

    // Draw cat with lime helmet
    loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Breathe-face-smile.svg/220px-Breathe-face-smile.svg.png"
    ).then(image => {
      ctx.drawImage(image, 50, 0, 70, 70);
    });

    // test from github end ---------------------------------------
  }
};
