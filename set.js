$(function(){
  var source, animationId;
  var audioContext = new AudioContext;
  var fileReader   = new FileReader;

  var analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.connect(audioContext.destination);

  var canvas        = $("<canvas/>")[0];//$("#id")[0] === document.getElementById('id')
  $(canvas).attr("id","visualizer");
  $("body").append(canvas);
  var canvasContext = canvas.getContext('2d');
　$(canvas).attr("width",analyser.frequencyBinCount * 2);
　$(canvas).attr("height",$(window).height());
  fileReader.onload = function(){
    audioContext.decodeAudioData(fileReader.result, function(buffer){
      //if(source) {
      //  source.stop();
      //  cancelAnimationFrame(animationId);
      //}
　
      source = audioContext.createBufferSource();

      source.buffer = buffer;
      source.connect(analyser);
      source.start(0);
　
      animationId = requestAnimationFrame(render);
    });
    $("input").css("display","none");
  };
　
  $("#file").on("change",function(e){
    fileReader.readAsArrayBuffer(e.target.files[0]);
  });
　
  render = function(){
    var height = $(window).height();
    var BorderWidth = analyser.frequencyBinCount * 10;
    var a = 0.5;
    var _r = '00';
    var _g = '88';
    var _b = 'c1';

    var spectrums = new Uint8Array(analyser.frequencyBinCount);//周波数
    //var spectrums = new Float32Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(spectrums);
    //analyser.getFloatFrequencyData(spectrums);
　
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    for(var i=0, len=spectrums.length; i<len; i++){
      if( 85 > spectrums[i] ){
        //canvasContext.fillStyle = 'rgba(255,0,0,'+a+')';
        canvasContext.fillStyle = '#'+_b+_r+_g;
      }else{
        if( 85 <= spectrums[i] && spectrums[i] < 170){
          //canvasContext.fillStyle = 'rgba(0,255,0,'+a+')';
          canvasContext.fillStyle = '#'+_g+_b+_r;
        }else{
          if( spectrums[i] >= 170 ){
            //canvasContext.fillStyle = 'rgba(0,0,255,'+a+')';
            canvasContext.fillStyle = '#'+_r+_g+_b;
          }
        }
      }
      var BarHeight = spectrums[i]/2;
      var x = i*2;
      canvasContext.fillRect(x, height-BarHeight-300, 1, BarHeight);
      canvasContext.fillRect(x, height-300, 1, BarHeight);
    }
    animationId = requestAnimationFrame(render);
  };
});