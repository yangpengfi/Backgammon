/**
 * Created by Administrator on 2016/12/26.
 */
var chessBoard=[];
var me=true;
var over=false;

/*赢法数组*/
var wins=[];

/*赢法统计数组*/
var myWin=[];
var computerWin=[];

for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}
var count=0;
for(var i=0;i<15;i++){//横线赢法
    for(var j=0;j<11;j++){
        //wins[0][0][0]=true
        //wins[0][1][0]=true
        //wins[0][2][0]=true
        //wins[0][3][0]=true
        //wins[0][4][0]=true

        //wins[0][1][0]=true
        //wins[0][2][0]=true
        //wins[0][3][0]=true
        //wins[0][4][0]=true
        //wins[0][5][0]=true
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
for(var i=0;i<15;i++){//竖线赢法
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count]=true;
        }
        count++;
    }
}
for(var i=0;i<11;i++){//斜线赢法
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}
for(var i=0;i<11;i++){//反斜线赢法
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);
for(var i=0;i<count;i++){
    myWin[i]=0;
    computerWin[i]=0;
}
var chess=document.getElementById('chess');
var context=chess.getContext('2d');

context.strokeStyle='#888';//bfbfbf
/*水印*/
var shuiyin=new Image();
shuiyin.src='images/bg.jpg';
shuiyin.onload=function(){
    context.drawImage(shuiyin,0,0,460,460);
    drawChessBoard();
};
/*画线*/
var drawChessBoard=function(){
    for(var i=0;i<15;i++){
        context.moveTo(20+i*30,20);
        context.lineTo(20+i*30,440);
        context.stroke();
        context.moveTo(20,20+i*30);
        context.lineTo(440,20+i*30);
        context.stroke();
    }
};
/*画棋子*/
var oneStep=function(i,j,me){
    context.beginPath();
    context.arc(20+i*30,20+j*30,13,0,2*Math.PI);
    context.closePath();
    var gradient=context.createRadialGradient(20+i*30+2,20+j*30-2,13,20+i*30+2,20+j*30-2,0);
    /*黑白子*/
    if(me){
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    context.fillStyle=gradient;
    context.fill();
};
chess.onclick=function(e){
    if(over){
        return;
    }
    if(!me){
        return;
    }
    var x= e.offsetX;
    var y= e.offsetY;
    var i=Math.floor(x/30);
    var j=Math.floor(y/30);
    /*落子*/
    if(chessBoard[i][j]==0){
        oneStep(i,j,me);
        chessBoard[i][j]=1;

        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k]=6;
                if(myWin[k]==5){
                    alert('你赢了！');
                    over=true;
                }
            }
        }
        if(!over){
            me=!me;
            computerAI();
        }
    }
};
var computerAI=function(){
    var myScore=[];
    var computerScore=[];
    var max=0;
    var u= 0,v=0;
    for(var i=0;i<15;i++){
        myScore[i]=[];
        computerScore[i]=[];
        for(var j=0;j<15;j++){
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j]==0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k]==1){
                            myScore[i][j]+=200;
                        }else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }else if(myWin[k]==3){
                            myScore[i][j]+=2000;
                        }else if(myWin[k]==4){
                            myScore[i][j]+=10000;
                        }
                        if(computerWin[k]==1){
                            computerScore[i][j]+=220;
                        }else if(computerWin[k]==2){
                            computerScore[i][j]+=420;
                        }else if(computerWin[k]==3){
                            computerScore[i][j]+=2200;
                        }else if(computerWin[k]==4){
                            computerScore[i][j]+=20000;
                        }
                    }
                }
                if(myScore[i][j]>max){
                    max=myScore[i][j];
                    u=i;
                    v=j;
                }else if(myScore[i][j]==max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j]>max){
                    max=computerScore[i][j];
                    u=i;
                    v=j;
                }else if(computerScore[i][j]==max){
                    if(myScore[i][j]>myScore[u][v]){
                        u=i;
                        v=j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v]=2;
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            myWin[k]=6;
            if(computerWin[k]==5){
                alert('计算机赢了！');
                over=true;
            }
        }
    }
    if(!over){
        me=!me;
    }
}
function agains(){//刷新页面
    window.location.reload();
}