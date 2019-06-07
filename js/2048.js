$(function() {
    let isNewEle = false; //判断是否产生新元素
    gameinit();
    $('.GameOver').hide();
    //监听键 dei
    $(document).keydown(function(e) {

        switch (e.which) {
            case 39: //右
                isNewEle = false;
                move('right');
                ifGameOver();
                break;
            case 40: //下
                isNewEle = false;
                move('down');
                ifGameOver();
                break;
            case 37: //左
                isNewEle = false;
                move('left');
                ifGameOver();
                break;
            case 38: //上
                isNewEle = false;
                move('top');
                ifGameOver();
                break;
        }
    })

    //取当前元素旁边的元素位置 dei
    function GetSideEle(current, direction) {
        let currentX = current.attr('x');
        let currentY = current.attr('y');

        let sideX = null,
            sideY = null;
        switch (direction) {
            case 'right':
                sideX = Number(currentX);
                sideY = Number(currentY) + 1;
                break;
            case 'down':
                sideX = Number(currentX) + 1;
                sideY = Number(currentY);
                break;
            case 'left':
                sideX = Number(currentX);
                sideY = Number(currentY) - 1;
                break;
            case 'top':
                sideX = Number(currentX) - 1;
                sideY = Number(currentY);
                break;
        }
        let side = $('.x' + sideX + 'y' + sideY);

        return side;
    }
    // 单个元素移动
    function SingleEleMove(current, direction) {

        let side = GetSideEle(current, direction);

        if (side.length == 0) {

            //如果当前元素的长度 =0 => 在最边上 的话不动 
        }
        //如果不在最边上 
        else if (!side.html()) { //如果旁边为空元素

            side.html(current.html()).removeClass('empty').addClass('non'); //旁边元素的值变为当前元素值
            current.html('').removeClass('non').addClass('empty'); //当前元素内容变为空
            SingleEleMove(side, direction);
            isNewEle = true;

        } else if (side.html() != current.html()) {

            //如果旁边元素内容和当前元素不一样的话不动
        } else { //如果旁边元素内容和当前元素一样的话合并

            side.html(current.html() * 2); //合并内容 X2
            current.html('').removeClass('non').addClass('empty'); //当前元素内容清空
            isNewEle = true;
            return;
        }

    }

    //遍历全部元素移动 => 绑定单个元素移动
    function move(direction) {
        let non = $('.game  .non'); //所有非空元素

        // 遍历方向不同是因为在设置单个元素移动的函数的时候 判断当前元素的位置的原因（？不知道还有没有别的更好的方法）
        if (direction == "left" || direction == "top") { //左或上 正向遍历

            for (let i = 0; i < non.length; i++) {
                let current = non.eq(i); //单个元素
                SingleEleMove(current, direction);
            }
        } else { //右或下 反向遍历

            for (let i = non.length - 1; i >= 0; i--) {
                let current = non.eq(i); //单个元素
                SingleEleMove(current, direction);
            }
        }
    }

    
    function goingGameOver(){
        NodeList.prototype.map=Array.prototype.map;
        const eles = document.querySelectorAll('.ele').map(item => parseInt(item.innerText===""?0:item.innerText));
        const getNeighbors = (raw,index) => {
            const width = Math.sqrt(raw.length);
            const neighbors=[];
            const atTop = () => index<width;
            const atBottom = () => raw.length > index && raw.length -width <= index;
            const atLeft = () => index%width === 0;
            const atRight = () => (index+1)%width === 0;
            if(!atTop()) neighbors.push(raw[index-width]);
            if(!atBottom()) neighbors.push(raw[index+width]);
            if(!atLeft()) neighbors.push(raw[index-1]);
            if(!atRight()) neighbors.push(raw[index+1]);
            return neighbors; 
        }
        if(eles.some((item,index) => getNeighbors(eles,index).includes(item) )){
            return false;
        }
        else{
            return true;
        }
    }

    //判断游戏是否结束
    function ifGameOver() {
        let AllEle = $('.game .ele');
        let non = $('.game  .non');

        // if (non.length == AllEle.length) { //满格的话
        if (non.length == AllEle.length&&goingGameOver()) { //没办法再继续移动的话

            for (let i = 0; i < non.length; i++) {

                let current = non.eq(i);
                //如果当前元素指定方向旁还有元素 且 其他元素与当前元素内容不同
                if (GetSideEle(current, 'up').length != 0 && GetSideEle(current, 'up').html() != current.html()) {
                    $('.GameOver').show();
                } else if (GetSideEle(current, 'down').length != 0 && GetSideEle(current, 'down').html() != current.html()) {
                    $('.GameOver').show();
                } else if (GetSideEle(current, 'left').length != 0 && GetSideEle(current, 'left').html() != current.html()) {
                    $('.GameOver').show();
                } else if (GetSideEle(current, 'right').length != 0 && GetSideEle(current, 'right').html() != current.html()) {
                    $('.GameOver').show();
                    return;
                }
            }
        } else { //没有满格 继续游戏
            IfNewEle(isNewEle);
            CreateColor();
            return;
        }

    }

    //游戏初始化
    function gameinit() {
        $('.refreshBtn').click(NewGame); //刷新 => 初始化 
        NewRandomEle(); //随机生成两个新元素做初始元素
        NewRandomEle();
        CreateColor();
    }

    //开始新游戏

    function NewGame() {
        let eles = $('.game .line .ele');
        for (let i = 0; i < eles.length; i++) {
            eles.eq(i).html('').removeClass('non').addClass('empty');
        }
        //随机生成两个新元素
        NewRandomEle(); //随机生成两个新元素做初始元素
        NewRandomEle();
        CreateColor();
        $('.GameOver').hide();
    }

    $('button').click(NewGame);
    //产生新的随机的元素 （合并/移动/初始化的时候用）
    function NewRandomEle() {
        let NewRandomEleArr = [2, 2, 4, 4];
        let NewRandomEleNum = NewRandomEleArr[GetRandom(0, 2)]; //随机初始值数组中的 2 / 4 中的两个做初始值

        let empty = $('.game .empty');
        let NewRandomElePosition = GetRandom(0, empty.length - 1); //取随机的位置安放新元素

        empty.eq(NewRandomElePosition).html(NewRandomEleNum).removeClass('empty').addClass('non'); //将新元素的值赋给空元素
    }

    //取随机数 （产生新的随机的元素用）
    function GetRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    //是否产生新的随机元素 （移动 / 合并 用）
    function IfNewEle(isNewEle) {
        NewRandomEle(); //新元素
        CreateColor();
    }

    //新颜色
    function CreateColor() {
        let Allele = $('.game .ele');
        for (let i = 0; i < Allele.length; i++) {

            switch ($(Allele.eq(i)).html()) {
                case '':
                    $(Allele.eq(i)).css('backgroundColor', '#cde4cd');
                    break;
                case '2':
                    $(Allele.eq(i)).css('backgroundColor', '#b8d6b8');
                    break;
                case '4':
                    $(Allele.eq(i)).css('backgroundColor', '#a8cca8 ');
                    break;
                case '8':
                    $(Allele.eq(i)).css('backgroundColor', '#97bd97');
                    break;
                case '16':
                    $(Allele.eq(i)).css('backgroundColor', '#8bbf8b');
                    break;
                case '32':
                    $(Allele.eq(i)).css('backgroundColor', '#78af78');
                    break;
                case '64':
                    $(Allele.eq(i)).css('backgroundColor', '#81ce81');
                    break;
                case '128':
                    $(Allele.eq(i)).css('backgroundColor', '#5eb15e');
                    break;
                case '256':
                    $(Allele.eq(i)).css('backgroundColor', '#4fa24f');
                    break;
                case '512':
                    $(Allele.eq(i)).css('backgroundColor', '#337d33');
                    break;
                case '1024':
                    $(Allele.eq(i)).css('backgroundColor', '#1d5d1d');
                    break;
                case '2048':
                    $(Allele.eq(i)).css('backgroundColor', '#052d05');
                    break;
            }
        }
    }
})