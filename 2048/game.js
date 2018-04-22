let game = {
    rowNum:4,//4行
    colNum:4,//4列
    state:true,//存储游戏状态,true表示游戏进行中
    score:0,//分数
    data:[],//存储每个单元数字
    
    
    /*
     游戏开始：将表格全部初始化为0，生成两个随机元素填入表格，检测按键，调用移动模块
    */
    test(){
        //this.randomNum();
        console.log(this);
    },
    start(){
        this.state=true;
        this.score=0;
        document.getElementById('alert').style.display='none';
        //初始化表格
        for(let row=0;row<this.rowNum;row++){
            this.data[row]=new Array(this.colNum);
            for(let col=0;col<this.colNum;col++){
                this.data[row][col]=0;
            }
        }
        //表格中生成新的两个随机数
        this.randomNum();
        this.randomNum();
        console.log("begin");
        this.update();
        
        document.onkeydown=function(event){
            if(event.keyCode == '38'){//上
                this.up();
            }else if(event.keyCode == '40'){//下
                this.down();
            }else if(event.keyCode == '37'){//左
                this.left()
            }else if(event.keyCode == '39'){//右
                this.right();
            }
        }.bind(this)
        let ele=document.getElementById('control');
        ele.onclick=function(event){
            switch(event.target.className){
                case 'left':
                    this.left();break;
                case 'right':
                    this.right();break;
                case 'up':
                    this.up();break;
                case 'down':
                    this.down();break;
            }
        }.bind(this)
        
         var mybody = document.getElementsByTagName('body')[0];
    //滑动处理
    let startX, startY, moveEndX, moveEndY, X, Y;   
    mybody.ontouchstart=function(e){
        //e.preventDefault();
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    };
    mybody.ontouchend=function(e){
        //e.preventDefault();
        moveEndX = e.changedTouches[0].pageX;
        moveEndY = e.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
            this.right();
        }
        else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
            this.left();
        }
        else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
            this.down();
        }
        else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
            this.up();
        }
    }.bind(this);
  
    },
    
    /*
     随机找个空单元放入2或4，注意非空单元不放
    */
    randomNum(){
        while(1){
            let row=Math.floor(Math.random() * this.rowNum);
            let col=Math.floor(Math.random() * this.colNum);
            if(this.data[row][col] == 0){//随机位置上是空单元
                this.data[row][col]=Math.random()<0.5 ? 2 :4;
                break;//跳出while循环
            }
        }
    },
    
    /*
      更新数据显示及样式
    */
    update(){
        for(let row=0;row<this.rowNum;row++){
            for(let col=0;col<this.colNum;col++){
                let ele=document.getElementById('d'+row+col);
                if(this.data[row][col] != 0){ //非空就更新
                    ele.innerHTML=this.data[row][col];
                    ele.className="cell n"+this.data[row][col];
                }else{
                    ele.innerHTML='';
                    ele.className="cell";
                }
            }
        }
        document.getElementById('score').innerHTML=this.score;
        
        if(this.isOver()){
            document.getElementById('finalScore').innerHTML=this.score;
            document.getElementById('alert').style.display='block';
        }
    },
    
    left(){
        let dataBefore=String(this.data);
        for(let row=0;row<this.rowNum;row++){
            this.addTogehter(row,'left');
        }
        
        let dataAfter=String(this.data);
        if(dataBefore != dataAfter){//有数据更新
            this.randomNum();
            this.update();
        }
        
        
    },
    right(){
        let dataBefore=String(this.data);
        for(let row=0;row<this.rowNum;row++){//将数组左右翻转
            this.data[row]=this.data[row].reverse();
        }
        
        for(let row=0;row<this.rowNum;row++){
            this.addTogehter(row,'left');
        }
        
        for(let row=0;row<this.rowNum;row++){//将数组左右翻转
            this.data[row]=this.data[row].reverse();
        }
        let dataAfter=String(this.data);
        if(dataBefore != dataAfter){//有数据更新
            this.randomNum();
            this.update();
        }
    },
    up(){//矩阵逆时针转90度就可以调用addTogehter()
        let dataBefore=String(this.data);
        let temData1=[];
        for(let i=0;i<this.rowNum;i++){
            temData1[i]=this.data[i].slice(0);
        }
        for(let row=0;row<this.rowNum;row++){//第row行是原来的第3-row列
            for(let col=0;col<this.colNum;col++){
                this.data[row][col]=temData1[col][this.colNum-1-row];
            }
        }

        for(let row=0;row<this.rowNum;row++){
            this.addTogehter(row);
        }
        
        let temData2=[];
        for(let i=0;i<this.rowNum;i++){
            temData2[i]=this.data[i].slice(0);
        }
        for(let row=0;row<this.rowNum;row++){//第row行是原来的第row列
            for(let col=0;col<this.colNum;col++){
                this.data[row][col]=temData2[this.rowNum-1-col][row];
            }
        }

        let dataAfter=String(this.data);
        if(dataBefore != dataAfter){//有数据更新
            this.randomNum();
            this.update();
        }
        
    },
    down(){//将矩阵上下翻转就能用up()，然后将结果翻转回来再重新更新视图
        this.data=this.data.reverse();//将矩阵上下翻转
        this.up();
        this.data=this.data.reverse();//将结果翻转回来
        this.update();
    },
    /*
     * 功能：处理单行，左移动
     * @ row:传入的一行或者一列
    */
    addTogehter(row){
        for(let col=0;col<this.colNum-1;col++){
            let nextcol=this.getNext(row,col);
            if(!nextcol){//如果(row,col)后面是空本行就结束，跳出for
                break;
            }else{
                if(this.data[row][col] == 0){//如果(row,col)位置上数是空，就将(row,nextcol)移动到此处
                    this.data[row][col]=this.data[row][nextcol];
                    this.data[row][nextcol]=0;
                    col--;//有可能移过来的单元可能和下一个单元可以相等合并
                }else if(this.data[row][col] == this.data[row][nextcol]){//(row,col)位置上数是非空，如果(row,col)与(row,nextcol)位置上数相等则合并 
                    this.data[row][col]+=this.data[row][nextcol];
                    this.data[row][nextcol]=0;
                    this.score+=this.data[row][col];
                }
            }
            
        }
    },
    /*
     * 获取每行(row,col)后面第一个非空单元位置
    */
    getNext(row,col){
        for(let nextc=col+1;nextc<this.colNum;nextc++){
            if(this.data[row][nextc] != 0){
                return nextc;
            }
        }
        return false;
    },
    
    /*
     * 判断游戏是否结束：游戏未结束的标识：存在值为0的空格，左右相邻的元素有相同的，上下相邻的元素有相同的
     * 返回false表示游戏进行中
    */
    isOver(){
        for(let row=0;row<this.rowNum;row++){
            for(let col=0;col<this.colNum;col++){
                if(this.data[row][col] == 2048){
                    this.state=false; //恭喜通关
                    document.getElementById('alertH3').innerHTML='恭喜！游戏通关';
                    console.log(2048);
                    return true;
                }
            }
        }
        for(let row=0;row<this.rowNum;row++){
            for(let col=0;col<this.colNum;col++){
                if(this.data[row][col] == 0 ||(col<this.colNum-1)&&this.data[row][col] == this.data[row][col+1] || (row<this.rowNum-1)&&this.data[row][col] == this.data[row+1][col]){
                    this.state=true;
                    return false;//游戏继续
                }
            }
        }
        this.state=false; //游戏结束
        return true;
    },
    moveAnimation(){
        
    }
};

game.start();

var again=document.getElementById('again');
again.onclick=function(event){
    game.start();
};