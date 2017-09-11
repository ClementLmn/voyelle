'use strict';

var $ = require('jquery');

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var throttle = require('./throttle.js');
    // window.outerWidth returns the window width including the scroll, but it's not working with $(window).outerWidth
    var windowWidth = window.outerWidth, windowHeight = $(window).height();
    var scrollTop = $(document).scrollTop();
    var angle = 0;
    var poem = document.querySelector('#poem'), text = poem.textContent.split(''), bigChar, spans;
    var phaseJump = 360 / text.length;
    var rectSize = 200;


    function initEvent(){
        $('#char-A').on('click', function(e){
            var start = $(this);
            searchLetter(start, 'black');
        });
        $('#char-E').on('click', function(e){
            var start = $(this);
            searchLetter(start, 'white');
        });
        $('#char-I').on('click', function(e){
            var start = $(this);
            searchLetter(start, '#ff5319');
        });
        $('#char-U').on('click', function(e){
            var start = $(this);
            searchLetter(start, 'green');
        });
        $('#char-O').on('click', function(e){
            var start = $(this);
            searchLetter(start, 'blue');
        });

    }

    function searchLetter(start, color){
        spans.each(function(i){
            if(start.data('letter') == $(this).data('letter')){
                if(($(this).data('offsetTop') > start.data('offsetTop') - rectSize && $(this).data('offsetTop') < start.data('offsetTop') + rectSize) && ($(this).data('offsetLeft') > start.data('offsetLeft') - rectSize && $(this).data('offsetLeft') < start.data('offsetLeft') + rectSize) ){
                    $(this).css('color', color);
                    $(this).on('click', function(e){
                        var start = $(this);
                        searchLetter(start, color);
                    });
                }
            }
        })
    }

    function initText(){
        poem.innerHTML = text.map(function (char) {
            if(char == "%"){
                return '<br>';
            }else if(char == "1"){
                return '<span class="big-char" id="char-A">A</span>';
            }else if(char == "2"){
                return '<span class="big-char" id="char-E">E</span>';
            }else if(char == "3"){
                return '<span class="big-char" id="char-I">I</span>';
            }else if(char == "4"){
                return '<span class="big-char" id="char-U">U</span>';
            }else if(char == "5"){
                return '<span class="big-char" id="char-O">O</span>';
            }else{
                return '<span>' + char + '</span>';
            }
        }).join('');
        bigChar= $('.big-char');
        spans = $('#poem > span');
        spans.each(function(i){
            $(this).data({'offsetTop' : $(this).offset().top, 'offsetLeft' : $(this).offset().left, 'letter' : $(this).text().toLowerCase()});
        });
        initEvent();
    }

    function scrollHandler() {

    }

    function resizeHandler(){

    }
    
    function wheee() {
        bigChar.each(function( i ) {
            $(this).css('color', 'hsl(' + (angle + i* 360 / bigChar.length) + ', 55%, 70%)');
        });
        angle = angle + 3;
        requestAnimationFrame(wheee);
    }

    initText();
    //wheee();


    $(window).on('resize', throttle(function () {
        requestAnimFrame(resizeHandler);
    }, 60));

    $(document).on('scroll', throttle(function(){
        requestAnimFrame(scrollHandler);
    }, 10));

});