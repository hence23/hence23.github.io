var gameObj = {
    points: {
        //分數 歷史分數
        score: 0,
        history: [],
        status: 1
    },

    //空陣列
    biglist: [],

    // 4x4矩陣
    intiStage: function() {
        for (var cell = 0; cell < 4; cell++) {
            this.biglist[cell] = [];
            for (var row = 0; row < 4; row++) {
                this.biglist[cell][row] = {
                    boxObj: null,
                    position: [cell, row]
                };
            }
        }
    },

    //清空陣列
    empty: function() {
        var emptyList = [];
        for (var row = 0; row < 4; row++) {
            for (var cell = 0; cell < 4; cell++) {
                if (this.biglist[cell][row].boxObj == null) {
                    emptyList.push(this.biglist[cell][row]);
                }
            }
        }
        return emptyList;
    },

    newBox: function() {
        var _this = this;
        var box = function(obj) {
            //初始先產生2or4
            var num = Math.random() > 0.9 ? 4 : 2;
            this.value = num;
            this.parent = obj;
            this.domObj = function() {
                var domBox = document.createElement('span');
                domBox.innerText = num;
                domBox.textContent = num;
                domBox.className = 'row' + obj.position[0] + ' ' + 'cell' + obj.position[1] + ' ' + 'num' + num;
                var root = document.getElementById('biglist');
                root.appendChild(domBox);
                return domBox;
            }();
            obj.boxObj = this;
        }
        var emptyList = this.empty();
        if (emptyList.length) {
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);
            return true;
        }
    },

    //2048陣列合併邏輯
    isEnd: function() {
        var emptyList = this.empty();
        if (!emptyList.length) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var obj = this.biglist[i][j];
                    var objLeft = (j == 0) ? { boxObj: { value: 0 } } : this.biglist[i][j - 1];
                    var objRight = (j == 3) ? { boxObj: { value: 0 } } : this.biglist[i][j + 1];
                    var objUp = (i == 0) ? { boxObj: { value: 0 } } : this.biglist[i - 1][j];
                    var objDown = (i == 3) ? { boxObj: { value: 0 } } : this.biglist[i + 1][j];
                    if (obj.boxObj.value == objLeft.boxObj.value ||
                        obj.boxObj.value == objDown.boxObj.value ||
                        obj.boxObj.value == objRight.boxObj.value ||
                        obj.boxObj.value == objUp.boxObj.value) {
                        return false
                    }
                }
            }
            return true;
        }
        return false;
    },

    //當上下左右無法合併時，就是遊戲結束
    gameOver: function() {
        alert('GAVE OVER!');
    },
    moveTo: function(obj1, obj2) {
        obj2.boxObj = obj1.boxObj;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj1.boxObj = null;
    },
    addTo: function(obj1, obj2) {
        obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
        obj2.boxObj = obj1.boxObj;
        obj1.boxObj = null;
        obj2.boxObj.value = obj2.boxObj.value * 2;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj2.boxObj.domObj.innerText = obj2.boxObj.value;
        obj2.boxObj.domObj.textContent = obj2.boxObj.value;
        this.points.score += obj2.boxObj.value;
        var scoreBar = document.getElementById('score');
        scoreBar.innerText = this.points.score;
        scoreBar.textContent = this.points.score;
        return obj2.boxObj.value;
    },
    clear: function(x, y) {
        var can = 0;
        for (var i = 0; i < 4; i++) {
            var fst = null;
            var fstEmpty = null;
            for (var j = 0; j < 4; j++) {
                var objInThisWay = null;
                switch ("" + x + y) {
                    case '00':
                        objInThisWay = this.biglist[i][j];
                        break;
                    case '10':
                        objInThisWay = this.biglist[j][i];
                        break;
                    case '11':
                        objInThisWay = this.biglist[3 - j][i];
                        break;
                    case '01':
                        objInThisWay = this.biglist[i][3 - j];
                        break;
                }
                if (objInThisWay.boxObj != null) {
                    if (fstEmpty) {
                        this.moveTo(objInThisWay, fstEmpty)
                        fstEmpty = null;
                        j = 0;
                        can = 1;
                    }
                } else if (!fstEmpty) {
                    fstEmpty = objInThisWay;
                }
            }
        }
        return can;
    },

    move: function(x, y) {
        var can = 0;
        can = this.clear(x, y) ? 1 : 0;
        var add = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                var objInThisWay = null;
                var objInThisWay2 = null;
                //利用switch做不同狀況時調整
                switch ("" + x + y) {
                    case '00':
                        {
                            objInThisWay = this.biglist[i][j];
                            objInThisWay2 = this.biglist[i][j + 1];
                            break;
                        }
                    case '10':
                        {
                            objInThisWay = this.biglist[j][i];
                            objInThisWay2 = this.biglist[j + 1][i];
                            break;
                        }

                    case '11':
                        {
                            objInThisWay = this.biglist[3 - j][i];
                            objInThisWay2 = this.biglist[2 - j][i];
                            break;
                        }
                    case '01':
                        {
                            objInThisWay = this.biglist[i][3 - j];
                            objInThisWay2 = this.biglist[i][2 - j];
                            break;
                        }
                }
                if (objInThisWay2.boxObj && objInThisWay.boxObj.value == objInThisWay2.boxObj.value) {
                    add += this.addTo(objInThisWay2, objInThisWay);
                    this.clear(x, y);
                    //j++;
                    can = 1;
                }
            }
        }
        if (add) {
            var addscore = document.getElementById('addScore');
            addscore.innerText = "+" + add;
            addscore.textContent = "+" + add;
            addscore.className = "show";
            setTimeout(function() {
                addscore.className = "hide";
            }, 500);
        }
        if (can) {
            this.newBox();
        }
        if (this.isEnd()) {
            this.gameOver();
        }
    },

    inti: null
}
var controller = function() {
    var startX = 0;
    var startY = 0;
    var ready = 0;
    this.start = function(x, y) {
        ready = 1;
        startX = x;
        startY = y;
    };
    this.move = function(x, y) {
        if (x - startX > 100 && ready) {
            gameObj.move(0, 1);
            ready = 0;
        } else if (startX - x > 100 && ready) {
            gameObj.move(0, 0);
            ready = 0;
        } else if (startY - y > 100 && ready) {
            gameObj.move(1, 0);
            ready = 0;
        } else if (y - startY > 100 && ready) {
            gameObj.move(1, 1);
            ready = 0;
        }
    }
    this.end = function(x, y) {
        ready = 0;
    }
    return {
        start: this.start,
        move: this.move,
        end: this.end
    }
}();

function disableSelection(target) {
    if (typeof target.onselectstart != "undefined") //IE route
        target.onselectstart = function() { return false }
    else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
        target.style.MozUserSelect = "none"
    else //All other route (ie: Opera)
        target.onmousedown = function() { return false }
    target.style.cursor = "default"
}
window.onload = function() {
    gameObj.intiStage();
    gameObj.newBox();
    //    gameObj.newBox();
    var biglist = document.getElementById('biglist');
    document.onmousedown = function(e) {
        var event = e || window.event;
        var obj = event.target || event.srcElement;
        var x = event.clientX;
        var y = event.clientY;
        controller.start(x, y);
    }
    document.onmousemove = function(e) {
        var event = e || window.event;
        var obj = event.target || event.srcElement;
        var x = event.clientX;
        var y = event.clientY;
        controller.move(x, y);
    }
    document.onmouseup = function(e) {
        var event = e || window.event;
        var obj = event.target || event.srcElement;
        var x = event.clientX;
        var y = event.clientY;
        controller.end(x, y);
    }

    //用keycode來操作上下左右的function
    function keyUp(e) {
        var currKey = 0,
            e = e || event;
        currKey = e.keyCode || e.which || e.charCode;
        var keyName = String.fromCharCode(currKey);
        switch (currKey) {
            case 37:
                gameObj.move(0, 0);
                break;
            case 38:
                gameObj.move(1, 0);
                break;
            case 39:
                gameObj.move(0, 1);
                break;
            case 40:
                gameObj.move(1, 1);
                break;
        }
    }
    document.onkeyup = keyUp;
}