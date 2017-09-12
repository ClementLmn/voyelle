'use strict';

var $ = require('jquery');
var TweenLite = require('gsap/TweenLite');
require('gsap/CSSPlugin');

$(function(){

    //Pour des belles animations à 60fps
    window.requestAnimFrame = require('./requestAnimFrame.js');

    //Variables pour la modification du texte
    var poem = document.querySelector('#poem'), text = poem.textContent.split(''), bigChar = $('.big-char'), letters, words;
    var voyelles = ['a', 'A', 'e', 'E', 'i', 'I', 'O', 'o', 'u', 'U'];
    var allVoy, allVoyDone = [];
    var doneWords = [];

    // Variables pour le mode rainbow
    var angle = 0, angleB = 0;
    var phaseJump = 360 / text.length;

    //Variables pour la progressbar
    var step = 1,percent, progressT = $('#progressT'), progressR = $('#progressR'), progressB = $('#progressB'), progressL = $('#progressL');

    //Variables pour le canvas
    var r;
    var canvas = $('#canvas'), radius = 0, opacity = 1, iCircle = 0;
    var ctx = document.getElementById('canvas').getContext('2d');


    //Fonction pour avoir un nombre aléatoire
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Fonction de easing pour que l'animation du canvas (cercle de couleur) soit plus beeelle
    function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
        return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
    }

    //On met a jour la barre de progression
    function updateProgress(){
        $(allVoyDone).each(function(){
            if($(this).data('hidden')){
                $(this).data('hidden', false);
            }
        });
        percent = allVoyDone.length * 100 / allVoy.length;
        if(percent <= 25){
            progressT.css('width', percent*4 +'%' );
        }
        if(percent > 25 && percent <= 50){
            if(step == 1){
                step ++;
                progressT.css('width', '100%' );
                setTimeout(function() {
                    progressR.css('height', (percent - 25) * 100 / 25 +'%' );
                }, 1000);
            }else{
                progressR.css('height', (percent - 25) * 100 / 25 +'%' );
            }
        }
        if(percent > 50 && percent <= 75){
            if(step == 2){
                step ++;
                progressR.css('height', '100%' );
                setTimeout(function() {
                    progressB.css('width', (percent - 50) * 100 / 25 +'%' );
                }, 1000);
            }else{
                progressB.css('width', (percent - 50) * 100 / 25 +'%' );
            }
        }
        if(percent > 75){
            if(step == 3){
                step ++;
                progressB.css('width', '100%' );
                setTimeout(function() {
                    progressL.css('height', (percent - 75) * 100 / 25 +'%' );
                }, 1000);
            }else{
                progressL.css('height', (percent - 75) * 100 / 25 +'%' );
            }
        }
    }

    //On verifie si un mot est complet
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
                    $(this).find('.voy').each(function(i){
                        $(this).css('color', '');
                    });
                    $(this).find(':not(.voy)').each(function(i){
                        TweenLite.fromTo($(this), 0.3, {y: -3}, {ease: Power2.easeInOut, y: 0, delay : i * 0.05});
                        TweenLite.to($(this), 0.3, {css:{autoAlpha: 1}, delay : i * 0.05});
                    });
                    doneWords.push($(this));
                }
            }
        });
    }

    // On recherche si une lettre est présente dans la zone
    function searchLetter(start, toColor){
        var x = start.data('offsetLeft');
        var y = start.data('offsetTop');
        r = getRandom(100, 250);
        drawCircle(x,y,toColor);
        var d = 0;
        letters.each(function(i){
            if(start.data('letter') == $(this).data('letter')){
                // (x1 - x2)^2 + (y1 - y2)^2 <= r^2 TRIGONOMETRIE ON ADORE
                if(Math.pow(($(this).data('offsetLeft') - start.data('offsetLeft')), 2) + Math.pow(($(this).data('offsetTop') - start.data('offsetTop')), 2) < Math.pow(r, 2) && $(this).data('hidden')){
                    allVoyDone.push($(this));
                    TweenLite.to($(this), 0.3, {css:{color : toColor, autoAlpha: 1}, delay : d});
                    TweenLite.fromTo($(this), 0.3, {y: -10}, {ease: Power2.easeInOut, y: 0, delay : d});
                    d += 0.05;
                    $(this).on('click', function(e){
                        var start = $(this);
                        searchLetter(start, toColor);
                    });
                }
            }
        });
        setTimeout(wordCheck, d * 1000 + 600);
        updateProgress();
    }


    //Split le texte avec un span par mot et un span par caractere
    function initText(){
        poem.innerHTML = '<span class="word">' + text.map(function (char) {
            if(char == "%"){
                return '</span><br><span class="word">';
            }else if(char == "*"){
                return '</span><br><br><span class="word">'
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
        allVoy = $('.voy');
    }


    // Petit canvas fait avec les mains
    function drawCircle(x,y,color){
        var coordX = x;
        var coordY = y;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if(radius < r){
            ctx.beginPath();
            ctx.globalAlpha = opacity;
            ctx.arc(coordX, coordY, radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 5;
            ctx.fillStyle = color;
            ctx.fill();
            radius = easeOutCubic(iCircle, 0, r, 50);
            opacity = easeOutCubic(iCircle, 1, -1, 50)
            iCircle++;
            requestAnimationFrame(function(){
                drawCircle(x,y);
            });
        }else{
            opacity = 1;
            radius = 0;
            iCircle = 0;
        }
    }
    

    //RAINBOW MODE cette fonction change la couleur
    function wheee() {
        $(doneWords).each(function( i ) {
            $(this).css('color', 'hsl(' + (angle + i * phaseJump) + ', 55%, 70%)');
        });
        $('.progressbar').each(function( i ) {
            $(this).css('background-color', 'hsl(' + (angleB) + ', 55%, 70%)');
        });
        // bigChar.each(function( i ) {
        //     $(this).css('color', 'hsl(' + (angle + i* 360 / bigChar.length) + ', 55%, 70%)');
        // });
        angleB += 2;
        angle ++;
        requestAnimationFrame(wheee);
    }

    //Pour mettre la bonne taille sur le canvas (en css c'est pas bien)
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    initText();
    wheee();
    


    // EVENTS
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