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

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodeAfterRecord = true;       // when to encode
var clicked = 0;


function init() {
    mode = 0;
    Button1.disabled = false;
    Button2.disabled = false;
    Button3.disabled = false;
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
       clicked = 0;
    }   
})

var handleRecord = function(stream) {
    audioContext = new AudioContext();
    gumStream = stream;
    input = audioContext.createMediaStreamSource(stream);
    recorder = new WebAudioRecorder(input, {
        workerDir: "scripts/", // must end with slash
        encoding: "wav",
        numChannels:2, //2 is the default, mp3 encoding supports only 2
        onEncoderLoading: function(recorder, encoding) {
          // show "loading encoder..." display
          __log("Loading wav encoder...");
        },
        onEncoderLoaded: function(recorder, encoding) {
          // hide "loading encoder..." display
          __log("wav encoder loaded");
        }
    });
    recorder.onComplete = function(recorder, blob) { 
        __log("Encoding complete");
        createDownloadLink(blob,recorder.encoding);
    }

    recorder.setOptions({
      timeLimit:1,
      encodeAfterRecord:encodeAfterRecord,
      ogg: {quality: 0.5},
      mp3: {bitRate: 160}
    });

    //start the recording process
    recorder.startRecording();

     __log("Recording started");
};

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	__log('Recording stopped');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	li.appendChild(link);

	//add the li element to the ordered list
	recordingsList.appendChild(li);
}

Button1.addEventListener("click", function() {
    if(mode!=1){
        //錄製
        clicked = 1;
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(handleRecord)
        console.log("startRecording");       Button1.disabled = false;
        Button1.disabled = true;
        Button2.disabled = false;
        Button3.disabled = true;
    }
    else{
        //播放
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
        alert("已提交結果，欲參與更多測試請重新整理");
    }
})

Button3.addEventListener("click", function() {
    if(mode!=1){
        //上傳
        if(!clicked){
            alert("尚未錄製聲音");
            return;            
        }
        Button1.disabled = true;
        Button2.disabled = true;
        Button3.disabled = true;
        alert("已提交結果，欲參與更多測試請重新整理");
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
        alert("已提交結果，欲參與更多測試請重新整理");
    }
})

