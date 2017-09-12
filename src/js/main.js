'use strict';

var $ = require('jquery');
var TweenLite = require('gsap/TweenLite');
require('gsap/CSSPlugin');

$(function(){

    window.requestAnimFrame = require('./requestAnimFrame.js');
    var scrollTop = $(document).scrollTop();
    var angle = 0;
    var poem = document.querySelector('#poem'), text = poem.textContent.split(''), bigChar = $('.big-char'), letters, words;
    var voyelles = ['a', 'A', 'e', 'E', 'i', 'I', 'O', 'o', 'u', 'U'];
    var phaseJump = 360 / text.length;
    var rectSizeX, rectSizeY;
    var doneWords = [];

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function wordCheck(){
        words.each(function(i){
            if(!$(this).data('complete')){
                var numVoy = $(this).find('.voy').length;
                var vDone = 0;
                $(this).find('.voy').each(function(i){
                    if(!$(this).data('hidden')){
                        vDone ++;
                    }
                });
                if(numVoy == vDone){
                    $(this).data('complete', true);
                    $(this).find(':not(.voy)').each(function(i){
                        TweenLite.fromTo($(this), 0.3, {y: -3}, {ease: Power2.easeInOut, y: 0, delay : i * 0.05});
                    });
                    $(this).find('.voy').each(function(i){
                        $(this).css('color', '');
                    });
                    doneWords.push($(this));
                }
            }
        });
    }

    function searchLetter(start, toColor){
        var d = 0;
        rectSizeX = getRandom(100, 300);
        rectSizeY = getRandom(100, 300);
        letters.each(function(i){
            if(start.data('letter') == $(this).data('letter')){
                if(($(this).data('offsetTop') > start.data('offsetTop') - rectSizeY && $(this).data('offsetTop') < start.data('offsetTop') + rectSizeY) && ($(this).data('offsetLeft') > start.data('offsetLeft') - rectSizeX && $(this).data('offsetLeft') < start.data('offsetLeft') + rectSizeX) && $(this).data('hidden') ){
                    $(this).data('hidden', false);
                    TweenLite.to($(this), 0.3, {css:{color : toColor}, delay : d});
                    TweenLite.fromTo($(this), 0.3, {y: -10}, {ease: Power2.easeInOut, y: 0, delay : d});
                    d += 0.05;
                    $(this).on('click', function(e){
                        var start = $(this);
                        searchLetter(start, toColor);
                    });
                }
            }
        });
        setTimeout(wordCheck, d * 1000 + 800);
    }

    function initText(){
        poem.innerHTML = '<span class="word">' + text.map(function (char) {
            if(char == "%"){
                return '</span><br><span class="word">';
            }else if(char == " "){
                return '</span> <span class="word">'
            }else{
                if($.inArray(char, voyelles) !== -1){
                    return '<span class="voy">' + char + '</span>';
                }else{
                    return '<span>' + char + '</span>';
                }
                
            }
        }).join('');
        poem.innerHTML += '</span>';
        words = $('.word');
        letters = $('.word > span');
        letters.each(function(i){
            $(this).data({'offsetTop' : $(this).offset().top, 'offsetLeft' : $(this).offset().left, 'letter' : $(this).text().toLowerCase(), 'hidden' : true});
        });
        bigChar.each(function(i){
            $(this).data({'offsetTop' : $(this).offset().top, 'offsetLeft' : $(this).offset().left, 'letter' : $(this).text().toLowerCase()});
        });
    }

    function buttonColor() {
        bigChar.each(function( i ) {
            $(this).css('color', 'hsl(' + (angle + i* 360 / bigChar.length) + ', 55%, 70%)');
        });
        angle += 2;
        requestAnimationFrame(buttonColor);
    }
    
    function wheee() {
        $(doneWords).each(function( i ) {
            $(this).css('color', 'hsl(' + (angle + i * phaseJump) + ', 55%, 70%)');
        });
        angle++;
        requestAnimationFrame(wheee);
    }

    initText();
    buttonColor();
    wheee();

    bigChar.each(function(){
        $(this).on('click', function(e){
            var start = $(this);
            searchLetter(start, $(this).data('color'));
            $(this).removeClass('big-char').off( "click");
        });
    });

    $("body").on("keypress", function (e) {
        var theLetter;
        switch(e.key){
            case 'a' :
                theLetter = $('#char-A');
            break;
            case 'e' :
                theLetter = $('#char-E');
            break;
            case 'i' :
                theLetter = $('#char-I');
            break;
            case 'o' :
                theLetter = $('#char-O');
            break;
            case 'u' :
                theLetter = $('#char-U');
            break;
        }
        searchLetter(theLetter, theLetter.data('color'));
    });
});