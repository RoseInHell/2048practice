var board = new Array(); //存放游戏数据
var score = 0; //存放分数

$(document).ready(function(){
    newgame();
});

function newgame()
{   //初始化棋盘格
    init();
    //在随机两个格子生成数字 
    generateOneNumber();
    generateOneNumber();
}

function init()
{
    for(var i=0; i<4; i++)
    {
        for(var j=0; j<4; j++)
        {
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop(i,j));
            gridCell.css('left', getPosLeft(i,j));
        }
    }


    for(var i=0; i<4; i++)
    {
        board[i] = new Array() //产生二维数组
        for(var j=0; j<4; j++)
        {
            board[i][j] = 0; //二维数组初始化
        }
    }

    updateBoardView();  //根据board变量的值 通知前端的numbercell 进行操作
}

function updateBoardView()
{
    $(".number-cell").remove();
    for(var i=0; i<4; i++)
    {
        for(var j=0; j<4; j++)
        {
            $("#grid-container").append(
                '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' //question
            );
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0)
            {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j )+50); //放于gridCell中间
                theNumberCell.css('left', getPosLeft(i, j)+50); 
            }
            else
            {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j ));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j])); //前景色
                theNumberCell.text(board[i][j]);
            }
        }
    }
}

function generateOneNumber()  //棋盘格里还有位置就可以生成数字
{
    if(nospace(board))
    {
        return false;
    }
    //随机一个位置 random() 产生0-1之间随机数  floor() 方法返回小于等于x的最大整数。
    var randx = parseInt(Math.floor(Math.random() * 4));  //parseInt()强制取证
    var randy = parseInt(Math.floor(Math.random() * 4));

    while(true) //判断生成的位置上有没有数字
    {
        if(board[randx][randy] == 0)
        {
            break;
        }
            
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }
    
    //随机一个数 50%概率生成2/4
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

$(document).keydown(function(event)
{
    switch(event.keyCode)
    {
        case 37: //left
            if(moveLeft())
            {
                generateOneNumber(); //向左后在随机产生一个新数字
                isgameover(); //然后判断是否gameover
            }
            break;
        case 38: //up
            if(moveUp())
            {
                generateOneNumber();
                isgameover();
            }
            break;
        case 39: //right
            if(moveRight())
                {
                    generateOneNumber();
                    isgameover();
                }
            break;
        case 40: //down
            if(moveDown())
            {
                generateOneNumber();
                isgameover();
            }
            break;
        default: // 按其他键没反应
            break;
    }       
});                         

function isgameover()
{

}
                            
function moveLeft()         //moveLeft()
{                           //对每一个数字的左侧位置进行判断，看是否能为落脚点
    if(!canMoveLeft(board))  //1.落脚位置是否为空 2.落脚位置数字和待判定元素数字相等？3.移动路径中是否有障碍物
    {                       
        return false;         //判断canMoveLeft()   
    }                         //1.左边是否没有数字
    for (var i=0; i<4; i++)   //2.左边数字是否和自己相等
    {
        for(var j=1; j<4; j++)
        {
            if(board[i][j] != 0)
            {
                for(var k=0; k<j; k++)
                {
                    if(board[i][k] == 0 && noBlockHorizonta(i, k, j, board))
                    {   //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizonta(i, k, j, board))
                    {   // move
                        showMoveAnimation(i, j, i, k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200); //对整体函数进行更新
    return true;
}

function moveRight()
{
    if(!canMoveRight(board))  
    {                       
        return false;          
    }                         
    for (var i=0; i<4; i++)   
    {
        for(var j=0; j<3; j++)
        {
            if(board[i][j] != 0)
            {
                for(var k=3; k>j; k--)
                {
                    if(board[i][k] == 0 && noBlockHorizonta(i, j, k, board))
                    {   //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHorizonta(i, j, k, board))
                    {   // move
                        showMoveAnimation(i, j, i, k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200); //对整体函数进行更新
    return true;
}

function moveUp()
{
    if(!canMoveUp(board))  
    {                       
        return false;          
    }                         
    for (var j=0; j<4; j++)   
    {
        for(var i=1; i<4; i++)
        {
            if(board[i][j] != 0)
            {
                for(var k=0; k<i; k++)
                {
                    if(board[k][j] == 0 && noBlockHorizonta(j, k, i, board))
                    {   //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockHorizonta(j, k, i, board))
                    {   // move
                        showMoveAnimation(i, j, k, j);
                        // add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200); //对整体函数进行更新
    return true;
}

function moveDown()
{
    if(!canMoveDown(board))  
    {                       
        return false;          
    }                         
    for (var j=0; j<4; j++)   
    {
        for(var i=0; i<3; i++)
        {
            if(board[i][j] != 0)
            {
                for(var k=3; k>i; k--)
                {
                    if(board[k][j] == 0 && noBlockHorizonta(j, i, k, board))
                    {   //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockHorizonta(j, i, k, board))
                    {   // move
                        showMoveAnimation(i, j, k, j);
                        // add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()", 200); //对整体函数进行更新
    return true;
}

                            
        