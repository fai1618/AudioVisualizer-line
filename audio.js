var audioVisualize = function(){
    var source,animationId;
    // Safariでも動く
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var fileReader   = new FileReader();

    this.analyser = audioContext.createAnalyser();
    var analyser = this.analyser;
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.9;//defoult:0.8
    this.analyser.connect(audioContext.destination);

    var animationJudge = false;
    var ave_diffShowJudge = false;//renderでAve,differenceをdivに描画するかどうか

    fileReader.onload = function () {
        console.log("onload");
        audioContext.decodeAudioData(fileReader.result, function (buffer) {
            if (source) {
                source.stop();
                animationJudge = false;
            }

            source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(analyser);
            source.start(0);

            animationJudge = true;
        });
    };


    this.addInputDom = function(){
        var inputDom = $("<input>").attr("id","file").attr("type","file").attr("accept","audio/*");
        $("body").append(inputDom);
    };



    this.addChangeEvent = function () {//これないとうごかない
            $("#file").on("change", function (e) {
            console.log("onchange");
            fileReader.readAsArrayBuffer(e.target.files[0]);
        });
    }



    this.addAveDifferenceDom = function(){
        var aveDom = $("<div>").attr("id","Ave");
        var differenceDom = $("<div>").attr("id","difference");
        $("body").append(differenceDom).append(aveDom);
        ave_diffShowJudge = true;
    }


    this.arduinoJudge = false;
    this.difference = 0;
    this.ave = 0;
    var preAve = 0;
    this.spectrums;
    var spectrums;
    var spectrumCounts;
    var i = 0,len = 0;

    this.render = function() {
        if(animationJudge){
            spectrumCounts = 0,this.ave = 0;
            spectrums = new Uint8Array(analyser.frequencyBinCount);

            analyser.getByteFrequencyData(spectrums);//.call(audioVisualize);

            for (i = 0, len = spectrums.length; i < len; i++) {
                this.ave += spectrums[i];
                if (spectrums[i] !== 0) {
                    spectrumCounts++;
                }
            }

            if(spectrumCounts !== 0){
                this.ave = this.ave / spectrumCounts;//(spectrums.length-1);// this.ave/i と同

                this.difference = this.ave - preAve;
                preAve = this.ave;

                if(ave_diffShowJudge){
                    $("#difference").text("difference: " + this.difference);
                    $("#Ave").text("Ave: " + this.ave);
                }
                if(this.arduinoJudge){
                    if(this.difference > 2){//test!!!!!
                        socket.emit("arduinoCommand","ON_13");
                    }

                    if(this.difference > 1){//test!!!!!
                        socket.emit("arduinoCommand","ON_12");
                    }
                }
            }
        }
        animationId = window.requestAnimationFrame(this.render.bind(this));//requestAnimationFrameはグローバルオブジェクト => 引数の関数を呼ばれると、内部のthisはwindowを指す
    }//render
}


//audio.jsのインスタンス
var audio = new audioVisualize();
$(function(){
    audio.arduinoJudge = false;//arduino使わない
    audio.addInputDom();//ファイル読み込みdom
    audio.addAveDifferenceDom();//数値表示dom
    audio.addChangeEvent();//ファイルが読み込まれたときのイベント
    audio.render();//音流す
});
