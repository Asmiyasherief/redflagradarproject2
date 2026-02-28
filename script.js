/* ================= PARTICLE SYSTEM ================= */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

window.addEventListener("resize",()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight; init();});

let mouse={x:null,y:null,radius:130};

window.addEventListener("mousemove",e=>{mouse.x=e.x;mouse.y=e.y;});
window.addEventListener("mouseout",()=>{mouse.x=null;mouse.y=null;});
window.addEventListener("click",e=>{for(let i=0;i<20;i++) particlesArray.push(new Particle(e.x,e.y,true));});

class Particle{
  constructor(x,y,burst=false){
    this.x=x||Math.random()*canvas.width;
    this.y=y||Math.random()*canvas.height;
    this.size=Math.random()*3+1;
    this.speedX=burst?(Math.random()-0.5)*6:Math.random()*1-0.5;
    this.speedY=burst?(Math.random()-0.5)*6:Math.random()*1-0.5;
    this.hue=Math.random()*360;
  }
  update(){
    this.x+=this.speedX;
    this.y+=this.speedY;
    if(this.x<0||this.x>canvas.width) this.speedX*=-1;
    if(this.y<0||this.y>canvas.height) this.speedY*=-1;
    if(mouse.x&&mouse.y){
      let dx=this.x-mouse.x;
      let dy=this.y-mouse.y;
      let dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<mouse.radius){
        let force=(mouse.radius-dist)/mouse.radius;
        this.x+=dx/dist*force*6;
        this.y+=dy/dist*force*6;
      }
    }
    this.hue+=0.5;
  }
  draw(){
    ctx.fillStyle=`hsl(${this.hue},100%,70%)`;
    ctx.shadowBlur=15;
    ctx.shadowColor=`hsl(${this.hue},100%,70%)`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur=0;
  }
}

let particlesArray=[];
function init(){particlesArray=[];for(let i=0;i<150;i++) particlesArray.push(new Particle());}
init();

function connect(){
  for(let a=0;a<particlesArray.length;a++){
    for(let b=a;b<particlesArray.length;b++){
      let dx=particlesArray[a].x-particlesArray[b].x;
      let dy=particlesArray[a].y-particlesArray[b].y;
      let dist=dx*dx+dy*dy;
      if(dist<10000){ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
      ctx.lineTo(particlesArray[b].x,particlesArray[b].y);ctx.stroke();}}}}

function lightning(){
  if(mouse.x&&mouse.y){
    ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);
    for(let i=0;i<3;i++){ctx.lineTo(mouse.x+(Math.random()-0.5)*100,mouse.y+(Math.random()-0.5)*100);}
    ctx.stroke();
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p=>{p.update();p.draw();});
  connect();
  lightning();
  requestAnimationFrame(animate);
}
animate();

/* TEXT FORM MODE */
function formText(text){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font="bold 80px Arial";
  ctx.fillStyle="white";
  ctx.textAlign="center";
  ctx.fillText(text,canvas.width/2,canvas.height/2);
  const data=ctx.getImageData(0,0,canvas.width,canvas.height);
  particlesArray=[];
  for(let y=0;y<canvas.height;y+=6){
    for(let x=0;x<canvas.width;x+=6){
      const i=(y*canvas.width+x)*4;
      if(data.data[i+3]>128) particlesArray.push(new Particle(x,y));
    }
  }
}

/* ================= ANALYSIS + Advice + Roast ================= */
function analyze(){
  let text = document.getElementById("textInput").value.toLowerCase();
  let redScore = 0;

  // keywords detection
  let keywords = ["control","password","angry","jealous","shout","threat","block","don't talk","give me your phone","you can't","or else","i'll leave you","my rules"];
  keywords.forEach(word=>{
    let count = (text.match(new RegExp(word,"g"))||[]).length;
    redScore += count*20;
  });

  // checkbox contribution
  let checked = document.querySelectorAll(".traits input:checked").length;
  redScore += checked*12;

  redScore = Math.min(redScore,100);
  let greenScore = 100 - redScore;

  // level
  let level="Low";
  if(redScore>=25) level="Medium";
  if(redScore>=50) level="High";
  if(redScore>=75) level="Toxic";

  // particle color
  if(level==="Toxic") particlesArray.forEach(p=>p.hue=0);
  if(level==="Low") particlesArray.forEach(p=>p.hue=120);

  // personalized advice
  let advice="";
  if(level==="Low") advice="All looks healthy, but stay aware!";
  else if(level==="Medium") advice="Pay attention, some red flags detected.";
  else if(level==="High") advice="Caution! Serious red flags spotted.";
  else advice="🚨 Danger! Extremely toxic behavior detected!";

  // roast message
  let roast="";
  if(redScore<25) roast="Nothing alarming here, keep calm 😎";
  else if(redScore<50) roast="Hmm… looks a bit spicy 🔥";
  else if(redScore<75) roast="Whoa! Red alert! 🚩";
  else roast="RUN! Toxic overload! 💥";

  document.getElementById("result").innerHTML=`
    <h3>Analysis Result</h3>
    <p><b>Risk Level:</b> ${level}</p>
    <p>Red Flag Score:</p>
    <div class="progress"><div class="progress-bar red" style="width:${redScore}%">${redScore}%</div></div>
    <p>Green Flag Score:</p>
    <div class="progress"><div class="progress-bar green" style="width:${greenScore}%">${greenScore}%</div></div>
    <p><b>Advice:</b> ${advice}</p>
    <p><b>Roast:</b> ${roast}</p>
  `;
}

/* QUIZ */
function toggleQuiz(){
  let q=document.getElementById("quiz");
  q.style.display=q.style.display==="none"?"block":"none";
}
function calculateQuiz(){
  let score=0;
  document.querySelectorAll(".quiz:checked").forEach(()=>score+=20);
  let level="Low";
  if(score>40) level="Medium";
  if(score>60) level="High";
  if(score>80) level="Toxic";
  document.getElementById("quizResult").innerHTML=`
    <p><b>Toxicity Score:</b> ${score}%</p>
    <p><b>Level:</b> ${level}</p>`;
}
