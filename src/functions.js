var debug = false ;
var words   = [] ;
var guessed = [] ;
var n_success = 0 ;
var n_fail    = 0 ;
var n_guess   = 0 ;
var n_hint    = 0 ;
var n_br      = 0 ;
var got_artist = false ;
var got_title  = false ;
var artist = '' ;
var title  = '' ;
var done = false ;
var mode = 'hard' ;
var use_hint = false ;
var n = -1 ;
var n_prog = null ;

var correct_guesses   = [] ;
var incorrect_guesses = [] ;
var hints             = [] ;
var been_easy = false ;

var seconds = 0 ;
var delay = 100 ;
var paused = true ;
var base_score = 1000 ;
var score = base_score ;
var time_factor = 1e-3 ;
var n_from_url = false ;
var happy_ending = false ;

var all_achievements    = [] ;
var gained_achievements = [] ;
var n_all_achievements = 20 ;

var xmlhttp_submitScore      = null ;
var xmlhttp_getAchievements  = null ;
var xmlhttp_sendAchievements = null ;
var xmlhttp_getSongs         = null ;
var xmlhttp_sendUserId       = null ;
var xmlhttp = 0 ;

function start(){
  debug = (document.URL.indexOf('debug')>=0) ;
  
  if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp                  = new XMLHttpRequest() ;
    xmlhttp_submitScore      = new XMLHttpRequest() ;
    xmlhttp_getAchievements  = new XMLHttpRequest() ;
    xmlhttp_sendAchievements = new XMLHttpRequest() ;
    xmlhttp_getSongs         = new XMLHttpRequest() ;
    xmlhttp_sendUserId       = new XMLHttpRequest() ;
  }
  else{// code for IE6, IE5
    xmlhttp                  = new ActiveXObject('Microsoft.XMLHTTP') ;
    xmlhttp_submitScore      = new ActiveXObject('Microsoft.XMLHTTP') ;
    xmlhttp_getAchievements  = new ActiveXObject('Microsoft.XMLHTTP') ;
    xmlhttp_sendAchievements = new ActiveXObject('Microsoft.XMLHTTP') ;
    xmlhttp_getSongs         = new ActiveXObject('Microsoft.XMLHTTP') ;
    xmlhttp_sendUserId       = new ActiveXObject('Microsoft.XMLHTTP') ;
  }
  check_user_id() ;
  
  document.addEventListener('keydown', keyDown) ;
  Get('input_artist').addEventListener('blur' ,make_guess_artist ) ;
  Get('input_title' ).addEventListener('blur' ,make_guess_title  ) ;
  Get('input_word'  ).addEventListener('blur' ,make_guess_word   ) ;
  Get('submit_quit' ).addEventListener('click',quit       ) ;
  Get('submit_hint' ).addEventListener('click',give_hint  ) ;
  Get('submit_begin').addEventListener('click',choose_song) ;
  Get('submit_easy' ).addEventListener('click',easy_mode  ) ;
  Get('submit_hard' ).addEventListener('click',hard_mode  ) ;
  
  choose_song() ;
  stopwatch() ;
  make_progress_table() ;
  get_songs_numbers() ;
}

function getParameterByName(name){
  // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search) ;
  return match && decodeURIComponent(match[1].replace(/\+/g, ' ')) ;
}
function setCookie(c_name,value,exdays){
  var exdate=new Date() ;
  exdate.setDate(exdate.getDate() + exdays) ;
  var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString()) ;
  document.cookie = c_name + "=" + c_value ;
}
function getCookie(c_name){
  var c_value = document.cookie ;
  var c_start = c_value.indexOf(" " + c_name + "=") ;
  if(c_start == -1){ c_start = c_value.indexOf(c_name + "=") ; }
  if(c_start == -1){ c_value = null ; }
  else{
    c_start = c_value.indexOf("=", c_start) + 1 ;
    var c_end = c_value.indexOf(";", c_start) ;
    if(c_end == -1){
      c_end = c_value.length ;
    }
    c_value = unescape(c_value.substring(c_start,c_end)) ;
  }
  return c_value ;
}
function check_user_id(){
  var user_id_from_cookie = getCookie('user_id') ;
  if(user_id_from_cookie!=null && user_id_from_cookie!=''){
    user_id = user_id_from_cookie ;
  }
  var user_id_tmp = getParameterByName('user_id') ;
  if(user_id_tmp!=null) user_id = user_id_tmp ;
  Get('span_user_id').innerHTML = user_id ;
  Get('a_user_id').href = '?user_id=' + user_id ;
  if(user_id!=null && user_id!=""){
    setCookie('user_id',user_id,365) ;
    var values = 'user_id=' + user_id ;
    xmlhttp_sendUserId.open('GET','add_user.php?'+values,true);
    xmlhttp_sendUserId.send() ;
    xmlhttp_sendUserId.onreadystatechange = function() { 
      if(xmlhttp_sendUserId.readyState==4 && xmlhttp_sendUserId.status==200){
        get_achievements() ;
      }
    }
  }
}

function choose_easy_prog(evt){
  easy_mode() ;
  choose_prog(evt) ;
}
function choose_hard_prog(evt){
  hard_mode() ;
  choose_prog(evt) ;
}
function choose_prog(evt){
  var target ;
  if(!evt) var evt = window.event ;
  if(evt.target) target = evt.target ;
  else if(evt.srcElement) target = evt.srcElement ;
  if(target.nodeType==3) target = target.parentNode ;
  var id = target.id ;
  n_prog = id.split('_')[2] ;
  quit() ;
  choose_song() ;
}
function make_progress_table(){
  var ncol = 25 ;
  var tbody = Get('tbody_progress') ;
  var tr_song = document.createElement('tr') ;
  var tr_easy = document.createElement('tr') ;
  var tr_hard = document.createElement('tr') ;
  var th_song = document.createElement('th') ;
  var th_easy = document.createElement('th') ;
  var th_hard = document.createElement('th') ;
  var td_song = null ; var td_easy = null ; var td_hard = null ;
  var i = 0 ;
  for(i=0 ; i<songs.length ; i++){
    if(i%ncol==0){
      tr_song = document.createElement('tr') ;
      tr_easy = document.createElement('tr') ;
      tr_hard = document.createElement('tr') ;
      th_song = document.createElement('th') ; th_song.className = 'prog_song' ; th_song.innerHTML = 'Song: ' ; tr_song.appendChild(th_song) ;
      th_easy = document.createElement('th') ; th_easy.className = 'prog_song' ; th_easy.innerHTML = 'Easy: ' ; tr_easy.appendChild(th_easy) ;
      th_hard = document.createElement('th') ; th_hard.className = 'prog_song' ; th_hard.innerHTML = 'Hard: ' ; tr_hard.appendChild(th_hard) ;
    }
    td_song = document.createElement('td') ;
    td_easy = document.createElement('td') ;
    td_hard = document.createElement('td') ;
    td_song.className = 'prog_song_n'    ;
    td_easy.className = 'prog_song_easy' ;
    td_hard.className = 'prog_song_hard' ;
    td_easy.id = 'td_easy_'+i ;
    td_hard.id = 'td_hard_'+i ;
    td_song.addEventListener('click', choose_prog) ;
    td_easy.addEventListener('click', choose_easy_prog) ;
    td_hard.addEventListener('click', choose_hard_prog) ;
    td_song.innerHTML = (i+1) ;
    tr_song.appendChild(td_song) ;
    tr_easy.appendChild(td_easy) ;
    tr_hard.appendChild(td_hard) ;
    if(i%ncol==(ncol-1)){
      tbody.appendChild(tr_song) ;
      tbody.appendChild(tr_easy) ;
      tbody.appendChild(tr_hard) ;
    }
  }
  for(var j=i%ncol ; j<ncol ; j++){
    td_song = document.createElement('td') ;
    td_easy = document.createElement('td') ;
    td_hard = document.createElement('td') ;
    td_song.className = 'td.prog_song_n'    ;
    td_easy.className = 'td.prog_song_easy' ;
    td_hard.className = 'td.prog_song_hard' ;
    tr_song.appendChild(td_song) ;
    tr_easy.appendChild(td_easy) ;
    tr_hard.appendChild(td_hard) ;
    tbody.appendChild(tr_song) ;
    tbody.appendChild(tr_easy) ;
    tbody.appendChild(tr_hard) ;
  }
}
function update_progress(data){
  var hard_numbers = data.split('/')[0].split(',') ;
  var easy_numbers = data.split('/')[1].split(',') ;
  for(var i=0 ; i<hard_numbers.length ; i++){
    if(hard_numbers[i]=='' || hard_numbers[i]==null) continue ;
    Get('td_hard_'+hard_numbers[i]).className = 'prog_song_hard_done' ;
  }
  for(var i=0 ; i<easy_numbers.length ; i++){
    if(easy_numbers[i].trim()=='' || easy_numbers[i]==null) continue ;
    Get('td_easy_'+easy_numbers[i]).className = 'prog_song_easy_done' ;
  }
}

function stopwatch(){
  if(!paused){
    seconds += delay/1000 ;
    var h = Math.floor(seconds/3600) ;
    var s = seconds - 3600*h ;
    var m = Math.floor(s/60) ;
    s = s-60*m ;
    s = Math.round(s) ;
    if(s<10) s = '0' + s ;
    if(m<10) m = '0' + m ;
    Get('td_time').innerHTML = h+':'+m+':'+s  ;
    score = base_score - 5*n_hint - 2*n_guess ;
    score = score*(Math.exp(-seconds*time_factor)) ;
    if(been_easy) score = 0.5*score ;
    Get('td_score').innerHTML = Math.round(score) ;
  }
  window.setTimeout(stopwatch,delay) ;
}

function easy_mode(){
  mode = 'easy' ;
  for(var i=0 ; i<words.length ; i++){
    if(guessed[i]==0 && words[i]!='<br/>'){
      var span = Get('span_word_'+i) ;
      span.innerHTML = make_word_span_innerHTML(words[i]) ;
    }
  }
  Get('td_mode').innerHTML = 'Easy' ;
  been_easy = true ;
}
function hard_mode(){
  mode = 'hard' ;
  for(var i=0 ; i<words.length ; i++){
    if(guessed[i]==0 && words[i]!='<br/>'){
      var span = Get('span_word_'+i) ;
      span.innerHTML = make_word_span_innerHTML(words[i]) ;
    }
  }
  Get('td_mode').innerHTML = 'Hard' ;
}

function keyDown(evt){
  Get('input_word').className = 'input_neutral' ;
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  if(keyDownID==8) evt.preventDefault ;
  switch(keyDownID){ case 13: evt.preventDefault() ; make_guess() ; break ; }
}

function quit(){
  if((n_success+n_br>0.75*words.length) && seconds>=1800){
    gained_achievements.push('RAGEQUIT') ;
    view_achievements() ;
  }
  for(var i=0 ; i<words.length ; i++){
    var span = Get('span_word_'+i) ;
    if(span){
      span.className = 'word_shown' ;
      span.innerHTML = words[i] ;
    }
  }
  Get('input_artist').value = artist ;
  Get('input_title' ).value = title  ;
  done = true ;
  paused = true ;
}
function choose_song(){
  reset_song() ;
  
  n = Math.floor(Math.random()*songs.length) ;
  var n_tmp = getParameterByName('n') ;
  if(n_tmp!=null){
    n = parseInt(n_tmp)-1 ;
    n_from_url = true ;
  }
  if(n_prog!=null) n = n_prog ;
  var the_song = songs[n] ;
  Get('span_song_n'     ).innerHTML = n+1 ;
  Get('span_total_songs').innerHTML = songs.length ;
  if(debug==true){
    n = -1 ;
    the_song = ['A','B','Mary had a little lamb'] ;
  }
  artist = the_song[0] ;
  title  = the_song[1] ;
  parse_song(the_song[2]) ;
  
  Get('input_artist').value = '' ;
  Get('input_title' ).value = '' ;
  Get('input_word'  ).value = '' ;
  
  Get('input_word').focus() ;
  paused = false ;
  if(mode=='hard') been_easy = false ;
  n_prog = null ;
}

function reset_song(){
  div = Get('song_wrapper').innerHTML = '' ;
  words   = [] ;
  guessed = [] ;
  
  correct_guesses   = [] ;
  incorrect_guesses = [] ;
  hints             = [] ;
  
  n_success = 0 ;
  n_fail    = 0 ;
  n_guess   = 0 ;
  n_hint    = 0 ;
  n_br      = 0 ;
  done = false ;
  use_hine = false ;
  
  got_artist = false ;
  got_title  = false ;
  
  seconds = 0 ;
  paused = false ;
  
  Get('td_guesses'  ).innerHTML = n_guess   ;
  Get('td_successes').innerHTML = n_success ;
  Get('td_hints'    ).innerHTML = n_hint    ;
  
  Get('td_hints_words'      ).innerHTML = '' ;
  Get('td_correct_guesses'  ).innerHTML = '' ;
  Get('td_incorrect_guesses').innerHTML = '' ;
}

function parse_song(string){
  string = string.replace(/\n/g, ' <br/> ') ;
  words = string.split(' ') ;
  
  var div = Get('song_wrapper') ;
  for(var i=0 ; i<words.length ; i++){
    guessed.push(0) ;
    if(words[i]=='<br/>'){
      var br = document.createElement('br') ;
      div.appendChild(br) ;
      n_br++ ;
    }
    else{
      var span = document.createElement('span') ;
      span.id = 'span_word_'+i ;
      span.className = 'word_hidden' ;
      span.innerHTML = make_word_span_innerHTML(words[i]) ;
      div.appendChild(span) ;
      
      span = document.createElement('span') ;
      span.className = 'word_spacer' ;
      span.innerHTML = ' ' ;
      div.appendChild(span) ;
    }
  }
}

function make_word_span_innerHTML(word){
  var text = '' ;
  if(mode=='hard'){
    for(var j=0 ; j<word.length ; j++){
      text = text + '_' ;
    }
  }
  else if(mode=='easy'){
    for(var j=0 ; j<word.length ; j++){
      if(word[j].match(/\w/)){
        text = text + '_' ;
      }
      else{
        text = text + '<span class="viewable">' + word[j] + '</span>' ;
      }
    }
  }
  return text ;
}

function give_hint(){
  if(done) return ;
  var unguessed_words = [] ;
  for(var i=0 ; i<guessed.length ; i++){
    if(guessed[i]==0){
      if(words[i]!='<br/>') unguessed_words.push(words[i]) ;
    }
  }
  var guess_word = unguessed_words[ Math.floor(Math.random()*unguessed_words.length) ] ;
  Get('input_word').value = guess_word ;
  use_hint = true ;
  make_guess() ;
  guess_word = filter_chars(guess_word) ;
  hints.push(guess_word) ;
  hints.sort( function(a,b){ return a>b ; } ) ;
  Get('td_hints_words').innerHTML = hints.join(', ') ;
}

function make_guess_artist(){
  if(Get('input_artist').value=='') return ;
  if(got_artist) return ;
  make_guess() ;
}
function make_guess_title(){
  if(Get('input_title').value=='') return ;
  if(got_title) return ;
  make_guess() ;
}
function make_guess_word(){
  if(Get('input_word').value=='') return ;
  make_guess() ;
}

function add_to_array(array, term){
  var matched = false ;
  for(var j=0 ; j<array.length ; j++){
    if(term==array[j]){
      matched = true ;
      break ;
    }
  }
  if(!matched) array.push(term) ;
  array.sort( function(a,b){ return a>b ; } ) ;
}

function make_guess(){
  if(done) return ;
  if(use_hint){ n_hint++ ; }
  else{ n_guess++ ; }
  var input = Get('input_word') ;
  var guess = input.value ;
  guess = filter_chars(guess) ;
  if(guess=='fuck') alert('Language!') ;
  var fail = true ;
  for(var i=0 ; i<words.length ; i++){
    var w = filter_chars(words[i]) ;
    if(w==guess){
      fail = false ;
      if(guessed[i]!=0) continue ;
      var span = Get('span_word_'+i) ;
      span.className = (use_hint) ? 'word_hinted' : 'word_shown' ;
      span.innerHTML = words[i] ;
      n_success++ ;
      input.value = '' ;
      guessed[i] = (use_hint) ? 2 : 1 ;
    }
  }
  if(fail==false){
    if(use_hint==false){
      add_to_array(correct_guesses, guess) ;
      Get('td_correct_guesses').innerHTML = correct_guesses.join(', ') ;
    }
  }
  else if(guess!=''){
    n_fail++ ;
    add_to_array(incorrect_guesses, guess) ;
    Get('td_incorrect_guesses').innerHTML = incorrect_guesses.join(', ') ;
  }
  if(guess!=''){
    input.className = (fail==true) ? 'input_fail' : 'input_succeed' ;
    window.setTimeout(reset_inputs,1000) ;
  }
  
  var artist_in = Get('input_artist').value ;
  if(got_artist==false && artist_in!=''){
    if(filter_chars(artist_in)==filter_chars(artist)){
      got_artist = true ;
      Get('input_artist').className = 'input_succeed' ;
      Get('input_artist').value = artist ;
    }
    else{
      Get('input_artist').className = 'input_fail' ;
      Get('input_artist').value = '' ;
    }
  }
  
  var title_in = Get('input_title').value ;
  if(got_title==false && title_in!=''){
    if(filter_chars(title_in)==filter_chars(title)){
      got_title = true ;
      Get('input_title').className = 'input_succeed' ;
      Get('input_title').value = title ;
    }
    else{
      Get('input_title').className = 'input_fail' ;
      Get('input_title').value = '' ;
    }
  }
  
  if((n_success+n_br)==words.length || (got_artist==true && got_title==true)){
    if(done==false){
      for(var i=0 ; i<words.length ; i++){
        var span = Get('span_word_'+i) ;
        if(span){
          if(span.className=='word_hidden'){
            span.className = 'word_shown' ;
            span.innerHTML = words[i] ;
          }
        }
      }
      done = true ;
      alert('Well done!  You successfully identified the song in ' + n_guess + ' guesses and ' + n_hint + ' hints, giving you a score of ' + Math.round(score) + '!') ;
      got_artist = true ;
      Get('input_artist').className = 'artist_succeed' ;
      Get('input_artist').value = artist ;
      got_title = true ;
      Get('input_title').className = 'input_succeed' ;
      Get('input_title').value = title ;
      paused = true ;
      if(n_hint==1 && use_hint) happy_ending = true ;
      submit_score() ;
    }
  }
  Get('td_guesses'  ).innerHTML = n_guess   ;
  Get('td_successes').innerHTML = n_success ;
  Get('td_hints'    ).innerHTML = n_hint    ;
  use_hint = false ;
}

function submit_score(){
  var values = 'user_id=' + user_id +
    '&song_id='   + n +
    '&score='     + Math.round(score) +
    '&guesses='   + n_guess + 
    '&hints='     + n_hint + 
    '&successes=' + n_success +
    '&fails='     + n_fail +
    '&seconds='   + Math.round(seconds) +
    '&mode='      + mode ;
  xmlhttp_submitScore.open('GET','add_completed_song.php?'+values,true);
  xmlhttp_submitScore.send() ;
  xmlhttp_submitScore.onreadystatechange = function(){
    if(xmlhttp_submitScore.readyState==4 && xmlhttp_submitScore.status==200){
      var response = xmlhttp_submitScore.responseText ;
      check_achievements(response) ;
    }
  }
}
function check_achievements(response){
  var n_songs = parseInt(response) ;
  gained_achievements = [] ;
  if(n_songs>=1 )                gained_achievements.push('SONG1' ) ;
  if(n_songs>=5 )                gained_achievements.push('SONG5' ) ;
  if(n_songs>=10)                gained_achievements.push('SONG10') ;
  if(n_songs>=25)                gained_achievements.push('SONG25') ;
  if(n_songs>=50)                gained_achievements.push('SONG50') ;
  if((n_success+n_br)==words.length && n_guess==0) gained_achievements.push('TOOEASY') ;
  if(n_hint==0)                  gained_achievements.push('LIKEAPRO') ;
  if(n_success==0)               gained_achievements.push('BEENHEREBEFORE') ;
  if(seconds>3600)               gained_achievements.push('CLOCKSUCKER') ;
  if(score<0)                    gained_achievements.push('SUBZERO') ;
  if(score>=500 && score<749)    gained_achievements.push('SCORE') ;
  if(score>=750 && score<899)    gained_achievements.push('HIGHSCORE') ;
  if(score>=900)                 gained_achievements.push('TOPSCORE') ;
  if(score>665.5 && score<666.5) gained_achievements.push('BADSCORE') ;
  if(n_from_url==true)           gained_achievements.push('TRYTHIS') ;
  if(n_hint==0 && ( (got_artist && !got_title) || (!got_artist && got_title) ) ) gained_achievements.push('ALMOSTTHERE') ;
  if(happy_ending)               gained_achievements.push('SWEAR') ;
  if(n_hint==1)                  gained_achievements.push('HAPPYENDING') ;
  happy_ending = false ;
  send_achievements() ;
}
function get_achievements(){
  var values = 'user_id=' + user_id ;
  xmlhttp_getAchievements.open('GET','get_achievements.php?'+values,true);
  xmlhttp_getAchievements.send() ;
  xmlhttp_getAchievements.onreadystatechange = function(){
    if(xmlhttp_getAchievements.readyState==4 && xmlhttp_getAchievements.status==200){
      var response = xmlhttp_getAchievements.responseText ;
      all_achievements = response.split(',') ;
      view_achievements() ;
    }
  }
}
function get_songs_numbers(){
  var values = 'user_id=' + user_id ;
  xmlhttp_getSongs.open('GET','get_songs.php?'+values,true);
  xmlhttp_getSongs.send() ;
  xmlhttp_getSongs.onreadystatechange = function(){
    if(xmlhttp_getSongs.readyState==4 && xmlhttp_getSongs.status==200){
      var response = xmlhttp_getSongs.responseText ;
      update_progress(response) ;
    }
  }
}
function view_achievements(){
  var counter = 0 ;
  if(debug && false){
    all_achievements.push('SONG1' ) ;
    all_achievements.push('SONG5' ) ;
    all_achievements.push('SONG10') ;
    all_achievements.push('SONG25') ;
    all_achievements.push('SONG50') ;
    all_achievements.push('TOOEASY') ;
    all_achievements.push('LIKEAPRO') ;
    all_achievements.push('BEENHEREBEFORE') ;
    all_achievements.push('CLOCKSUCKER') ;
    all_achievements.push('SUBZERO') ;
    all_achievements.push('SCORE') ;
    all_achievements.push('HIGHSCORE') ;
    all_achievements.push('TOPSCORE') ;
    all_achievements.push('BADSCORE') ;
    all_achievements.push('TRYTHIS') ;
    all_achievements.push('ALMOSTTHERE') ;
    all_achievements.push('SWEAR') ;
    all_achievements.push('HAPPYENDING') ;
    all_achievements.push('RAGEQUIT') ;
  }
  
  for(var i=0 ; i<all_achievements.length ; i++){
    if(all_achievements[i].trim()=='') continue ;
    counter++ ;
    p1 = Get('achievement_'     +all_achievements[i].trim()) ;
    p2 = Get('achievement_desc_'+all_achievements[i].trim()) ;
    p1.className = p1.className + ' achievement_' + all_achievements[i] ;
    p2.className = p2.className + ' achievement_desc_achieved' ;
  }
  if(counter>=n_all_achievements-1){
    p1 = Get('achievement_ALLDONE'     ) ;
    p2 = Get('achievement_desc_ALLDONE') ;
    p1.className = p1.className + ' achievement_ALLDONE' ;
    p2.className = p2.className + ' achievement_desc_achieved' ;
  }
}
function send_achievements(){
  if(gained_achievements.length==0) return ;
  var text = '' ;
  for(var i=0 ; i<gained_achievements.length ; i++){
    if(i>0) text = text + ',' ;
    text = text + gained_achievements[i] ;
  }
  var values = 'user_id=' + user_id + '&achievements=' + text ;
  xmlhttp_sendAchievements.open('GET','add_achievement.php?'+values,true);
  xmlhttp_sendAchievements.send() ;
  xmlhttp_sendAchievements.onreadystatechange = function(){
    if(xmlhttp_sendAchievements.readyState==4 && xmlhttp_sendAchievements.status==200){
      var response = xmlhttp_sendAchievements.responseText ;
      all_achievements = response.split(',') ;
      view_achievements() ;
    }
  }
}

function reset_inputs(){
  Get('input_artist').className = 'input_neutral' ;
  Get('input_title' ).className = 'input_neutral' ;
  Get('input_word'  ).className = 'input_neutral' ;
}

function filter_chars(str){
  str = str.replace(/[^\w]/gi, '') ;
  str = str.toLowerCase() ;
  return str ;
}
function Get(id){ return document.getElementById(id) ; }