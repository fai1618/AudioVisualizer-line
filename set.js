$(function(){
  

  var $file = $("<input/>").attr("id","file").attr("type","file");
  var $difference = $("<div/>").attr("id","difference");
  var $Ava = $("<div/>").attr("id","Ava");
  $("body").append($file).append($difference).append($Ava);
  

  var source, animationId;
  var audioContext = new AudioContext;
  var fileReader   = new FileReader;

  var analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.99;//defoult:0.8
  analyser.connect(audioContext.destination);

  var canvas        = $("<canvas/>")[0];//$("#id")[0] === document.getElementById('id')
  $(canvas).attr("id","visualizer");
  $(canvas).css("width",$(window).width());
  $(canvas).css("height",$(window).height()*0.9);
  $("body").append(canvas);
  var canvasContext = canvas.getContext('2d');
　$(canvas).attr("width",analyser.frequencyBinCount*15);
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
    $("#file").css("display","none");
  };
　
  $("#file").on("change",function(e){
    console.log("onchange");
    fileReader.readAsArrayBuffer(e.target.files[0]);
  });
　
  var difference = 0;
  var Ava = 0;
  var preAva = 0;
  var height = $(canvas).attr("height");
  var BorderWidth = analyser.frequencyBinCount * 10;
  var a  = 0.5;
  var _r = '00';
  var _g = 'aa';
  var _b = 'e1';

  var timeDomain = true;//表示切り替え

  render = function(){

    var spectrums = new Uint8Array(analyser.frequencyBinCount);
    
    if(timeDomain === true){
      analyser.getByteTimeDomainData(spectrums);//波形表示のとき
    }else{
      analyser.getByteFrequencyData(spectrums);
    }
　
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    //canvasContext.fillStyle = '#000000';//波形表示のとき
    //canvasContext.fillRect( 0, 0, canvas.width, canvas.height);//波形表示のとき
      
    for(var i=0, len=spectrums.length; i<len; i++){
      Ava += spectrums[i];

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
      var x = i*5;
        
    if(timeDomain === true){  
      canvasContext.fillStyle = '#00ddaa';//波形表示のとき
      //canvasContext.fillStyle = '#ffffff';//波形表示のとき
      ////canvasContext.fillRect( x*2, -10, 2, BarHeight*3);//波形表示のとき
      canvasContext.fillRect( x*11,400, 10, -BarHeight*3);
      
      //クリアする
      canvasContext.fillStyle = '#000000';//波形表示のとき
      ////canvasContext.fillRect( x*2, -10, 2, BarHeight*3-4);//波形表示のとき(背景が黒の時)
      canvasContext.fillRect( x*11, 400, 10, -BarHeight*3+5);


      //////canvasContext.clearRect(x*2, -100,1,BarHeight*8-2);//波形表示のとき(背景が白の時)

      var interval = $(input).val();//波形表示?
      


      if(i === len-1){//test!!!!!
        canvasContext.fillStyle = '#ffffff';//波形表示のとき
        for(var aaa=0;aaa<=8;aaa++){
          canvasContext.fillRect( x*2*aaa/8, (height-BarHeight)/2+100, 10, 300);//波形表示のとき
        }
      }


    
    }else{
      canvasContext.fillRect(x+10, height/2-BarHeight-100, 1, BarHeight);
      canvasContext.fillRect(x+10, height/2-100, 1, BarHeight);



      if(i === len-1){//test!!!!!
        canvasContext.fillStyle = '#000000';//波形表示のとき
        for(var aaa=0;aaa<=8;aaa++){
          canvasContext.fillRect( x*aaa/8, height/2-100, 2, 430);//波形表示のとき
        }

        canvasContext.fillRect( x*0.5/8, height/2-100, 2, 430); 

        canvasContext.fillStyle = '#000000';//波形表示のとき
        canvasContext.fillRect( 0, height/2-100, 2560*2, 1);//波形表示のとき
        canvasContext.fillRect( 0, height/2, 2560*2, 1);//波形表示のとき
        canvasContext.fillRect( 0, height/2+100, 2560*2, 1);//波形表示のとき
        canvasContext.fillRect( 0, height/2+200, 2560*2, 1);//波形表示のとき
        canvasContext.fillRect( 0, height/2+300, 2560*2, 1);//波形表示のとき
        canvasContext.fillRect( 0, height/2+400, 2560*2, 1);//波形表示のとき
      }



    }

    }//for

    Ava   = Ava/(spectrums.length-1);// Ava/i と同じ
    difference = Ava - preAva;
    preAva = Ava;

    $("#difference").text("diffrrence: "+difference);
    $("#Ava").text("Ava: "+Ava);

    if(timeDomain === true){
      setTimeout(render, interval);//波形表示のとき?
      $("#Ava").text("interval: "+interval);//波形表示のとき?
    }else{
      en(difference,'#00ddc5');
      en2(Ava,'#00c5dd');
      animationId = requestAnimationFrame(render);
    }

  };//render

  if(timeDomain === true){
    var input = $("<input/>").attr("id","interval").attr("type","range");//波形表示のとき?
    $(input).attr("max","1000").attr("min","10").attr("step","10").attr("volume","500").attr("value","60");
    $("body").prepend(input);//波形表示のとき?
  }

/* 円弧を塗りつぶす */
function en(radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(600, 50, 20+radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function en2(radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(800, 50, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

});