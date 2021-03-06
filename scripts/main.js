window.onload = function() {
    init();
};

var mode = 0;
var submitButton = document.querySelector("#submit");
var verifyButton = document.querySelector("#verify");
var Button1 = document.querySelector("#button1");
var Button2 = document.querySelector("#button2");
var Button3 = document.querySelector("#button3");
var instruction = document.querySelector("#instruction");
var timer = document.querySelector("#timeanimation");

var wordArray = ["Bed","Bird","Cat","Dog","Down","Eight","Five","Four","Go","Happy","House","Left","Marvin","Nine","No","Off","On","One","Right","Seven","Shelia","Six","Stop","Three","Tree","Two","Up","Wow","Yes","Zero"];
var word = document.querySelector("#word");



var clicked = 0;
var recorded,recBlob;


window.onload = function init() {
    mode = 0;
    Button1.disabled = false;
    Button2.disabled = false;
    Button3.disabled = false;
    word.textContent = wordArray[Math.floor(Math.random()*31)];
    clicked = 0;
}

submitButton.addEventListener("click", function() {
    if(mode!=0)
    {
       mode = 0;
       submitButton.className ="selected";
       verifyButton.className ="normal";
       instruction.textContent = "第二步：請在一秒內念出以下的單詞";
       Button1.className = "fas fa-microphone-alt fa-5x";
       Button1.style ="color : red";
       Button1.title ="錄製";
       Button2.className = "fas fa-play-circle fa-5x";
       Button2.style ="color : red";
       Button2.title ="試聽";
       Button3.className = "fas fa-upload fa-5x";
       Button3.style ="color : yellowgreen";
       Button3.title ="上傳";
       Button1.disabled = false;
       Button2.disabled = false;
       Button3.disabled = false;
       word.textContent = wordArray[Math.floor(Math.random()*30)];
       clicked = 0;
    }   
})

verifyButton.addEventListener("click", function() {
    if(mode!=1)
    {
       mode = 1;
       submitButton.className ="normal";
       verifyButton.className ="selected";      
       instruction.textContent = "第二步：請在按下播放後，確認與顯示的字詞是否相符";
       Button1.className = "fas fa-play-circle fa-5x";
       Button1.style ="color : blue";
       Button1.title ="播放";
       Button2.className = "fas fa-thumbs-up fa-5x";
       Button2.style ="color : green";
       Button2.title ="正確";
       Button3.className = "fas fa-thumbs-down fa-5x";
       Button3.style ="color : red";
       Button3.title ="錯誤";
       Button1.disabled = false;
       Button2.disabled = false;
       Button3.disabled = false;
       word.textContent = wordArray[Math.floor(Math.random()*30)]; 
       clicked = 0;
    }   
})

Button1.addEventListener("click", function() {
    if(mode!=1){
        //錄製
        clicked = 1;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.mimeType = "audio/webm" ;
            mediaRecorder.start();
            const audioChunks = [];
        
            timer.style.animationPlayState="running";
            mediaRecorder.addEventListener("dataavailable", event => {
              audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                recorded = audio;
                recBlob = audioBlob;
            });

            setTimeout(() => {
                mediaRecorder.stop();
                timer.style.animationPlayState="paused";
            }, 1000);
        });    
        Button1.disabled = true;
        Button2.disabled = false;
        Button3.disabled = true;
    }
    else{
        //播放
        recorded.play();
        clicked = 1;
        Button1.disabled = false;
        Button2.disabled = false;
        Button3.disabled = true;
    }
})

Button2.addEventListener("click", function() {
    if(mode!=1){
        //試聽
        if(!clicked){
            alert("請先錄製再進行試聽");
            return;
        }
        
        recorded.play();

        Button1.disabled = false;
        Button2.disabled = false;
        Button3.disabled = false;
    }
    else{
        //正確
        if(!clicked){
            alert("請先聽過錄音後再進行評分");
            return;            
        }
        Button1.disabled = true;
        Button2.disabled = true;
        Button3.disabled = true;
        alert("已提交結果，感謝您的參與");
        word.textContent = wordArray[Math.floor(Math.random()*30)]; 
    }
})

Button3.addEventListener("click", function() {
    if(mode!=1){
        //上傳
        if(!clicked){
            alert("尚未錄製聲音");
            return;            
        }
        ///////////
        var xhr=new XMLHttpRequest();
        xhr.onload=function(e) {
          if(this.readyState === 4) {
              console.log("Server returned: ",e.target.responseText);
          }
        };
        var fd=new FormData();
        fd.append("audio_data",recBlob,"filename");
        xhr.open("POST","upload.php",true);
        xhr.send(fd); 
        ///////////
        Button1.disabled = true;
        Button2.disabled = true;
        Button3.disabled = true;
        alert("已提交結果，感謝您的參與");
        word.textContent = wordArray[Math.floor(Math.random()*30)]; 
    }
    else{
        //錯誤
        if(!clicked){
            alert("請先聽過錄音後再進行評分");
            return;            
        }
        Button1.disabled = true;
        Button2.disabled = true;
        Button3.disabled = true;
        alert("已提交結果，感謝您的參與");
        word.textContent = wordArray[Math.floor(Math.random()*30)]; 
    }
})



