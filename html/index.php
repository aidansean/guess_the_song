<?php include_once('mysql.php') ; ?>
<?php
$title = 'Guess the song' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('songs_data.js', 'functions.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>

<script type="text/javascript">var user_id = '<?=uniqid()?>' ;</script>
<div class="right">
  <div class="blurb">
    <!--<div id="notice">There are currently some bugs.  Please bear with me as I fix them!</div>-->
    <table class="main">
      <tbody>
        <tr>
          <th class="th_guess">Guess the artist:</th>
          <td><input id="input_artist" type="text" value="" class="input_neutral"/></td>
        </tr>
        <tr>
          <th class="th_guess">Guess the title:</th>
          <td><input id="input_title" type="text" value="" class="input_neutral"/></td>
        </tr>
        <tr>
          <th class="th_guess">Guess the lyrics:</th>
          <td><input type="text" id="input_word" class="input_neutral" /></td>
        </tr>
      </tbody>
    </table>
    <div id="big_wrapper">
      <div id="song_wrapper"></div>
      <div id="song_column">
        <table id="table_stats">
          <tbody>
            <tr><td class="buttons" colspan="2"><input type="submit" id="submit_quit"  class="input_neutral" value="QUIT"        /></td></tr>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><td class="buttons" colspan="2"><input type="submit" id="submit_hint"  class="input_neutral" value="Hint"        /></td></tr>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><td class="buttons" colspan="2"><input type="submit" id="submit_begin" class="input_neutral" value="Another song"/></td></tr>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><td class="buttons" colspan="2"><input type="submit" id="submit_easy"  class="input_neutral" value="Easy mode"   /></td></tr>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><td class="buttons" colspan="2"><input type="submit" id="submit_hard"  class="input_neutral" value="Hard mode"   /></td></tr>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><td class="stats"   colspan="2"><p id="song_number">You are currently playing song number <span id="span_song_n"></span> of <span id="span_total_songs"></span>. (<a id="a_song_n" href="">link</a>)</p></td>
            <tr><th class="spacer"  colspan="2"></th></tr>
            <tr><th class="stats">Guesses: </th><td id="td_guesses" class="stats">0</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th class="stats">Successes: </th><td id="td_successes" class="stats">0</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th class="stats">Hints: </th><td id="td_hints" class="stats">0</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th class="stats">Time: </th><td id="td_time" class="stats">0:00:00</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th class="stats">Score: </th><td id="td_score" class="stats">1000</td></tr>
            <tr><th class="spacer"></th></tr>
            <tr><th class="stats">Mode: </th><td id="td_mode" class="stats">Hard</td></tr>
            <tr><th class="spacer"></th></tr>
            <tr><th id="th_correct_guess"   class="th_guess" colspan="2">Correct guesses:</th></tr>
            <tr><td id="td_correct_guesses" class="td_guesses" colspan="2">&nbsp;</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th id="th_incorrect_guess" class="th_guess" colspan="2">Incorrect guesses:</th></tr>
            <tr><td id="td_incorrect_guesses" class="td_guesses" colspan="2">&nbsp;</td></tr>
            <tr><th class="spacer" colspan="2"></th></tr>
            <tr><th id="th_hints_words" class="th_guess" colspan="2">Hints:</th></tr>
            <tr><td id="td_hints_words" class="td_guesses" colspan="2">&nbsp;</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <div id="achievements">
    <h3 id="h3_achievements">Achievements:</h3>
    <table id="table_achievements">
      <tbody>
        <tr>
          <td class="achievement">
            <p id="achievement_SONG1" class="achievement_text achievement_text_huge" title="Locked">1</p>
            <p id="achievement_desc_SONG1" class="achievement_desc" title="Locked">Complete 1 song</p>
          </td>
          <td class="achievement">
            <p id="achievement_SONG5" class="achievement_text achievement_text_huge" title="Locked">5</p>
            <p id="achievement_desc_SONG5" class="achievement_desc" title="Locked">Complete 5 songs</p>
          </td>
          <td class="achievement">
            <p id="achievement_SONG10" class="achievement_text achievement_text_huge" title="Locked">10</p>
            <p id="achievement_desc_SONG10" class="achievement_desc" title="Locked">Complete 10 songs</p>
          </td>
          <td class="achievement">
            <p id="achievement_SONG25" class="achievement_text achievement_text_huge" title="Locked">25</p>
            <p id="achievement_desc_SONG25" class="achievement_desc" title="Locked">Complete 25 songs</p>
          </td>
          <td class="achievement">
            <p id="achievement_SONG50" class="achievement_text achievement_text_huge" title="Locked">50</p>
            <p id="achievement_desc_SONG50" class="achievement_desc" title="Locked">Complete 50 songs</p>
          </td>
        </tr>
        <tr>
          <td class="achievement">
            <p id="achievement_TOOEASY" class="achievement_text" title="Locked">TOO EASY</p>
            <p id="achievement_desc_TOOEASY" class="achievement_desc" title="Locked">Complete a song using only hints</p>
          </td>
          <td class="achievement">
            <p id="achievement_RAGEQUIT" class="achievement_text" title="Locked">RAGE QUIT</p>
            <p id="achievement_desc_RAGEQUIT" class="achievement_desc" title="Locked">Quit a song after guessing 75% of the words and 30 minutes of play</p>
          </td>
          <td class="achievement">
            <p id="achievement_LIKEAPRO" class="achievement_text" title="Locked">LIKE A PRO</p>
            <p id="achievement_desc_LIKEAPRO" class="achievement_desc" title="Locked">Complete a song with no hints</p>
          </td>
          <td class="achievement">
            <p id="achievement_BEENHEREBEFORE" class="achievement_text" title="Locked">BEEN HERE BEFORE</p>
            <p id="achievement_desc_BEENHEREBEFORE" class="achievement_desc" title="Locked">Guess the artist and title without guessing any words</p>
          </td>
          <td class="achievement">
            <p id="achievement_CLOCKSUCKER" class="achievement_text" title="Locked">CLOCK SUCKER</p>
            <p id="achievement_desc_CLOCKSUCKER" class="achievement_desc" title="Locked">Spend more than an hour on a song</p>
          </td>
        </tr>
        <tr>
          <td class="achievement">
            <p id="achievement_SUBZERO" class="achievement_text" title="Locked">SUB ZERO</p>
            <p id="achievement_desc_SUBZERO" class="achievement_desc" title="Locked">Have a score below zero</p>
          </td>
          <td class="achievement">
            <p id="achievement_SCORE" class="achievement_text" title="Locked">SCORE</p>
            <p id="achievement_desc_SCORE" class="achievement_desc" title="Locked">Score 500-749 points</p>
          </td>
          <td class="achievement">
            <p id="achievement_HIGHSCORE" class="achievement_text" title="Locked">HIGH SCORE</p>
            <p id="achievement_desc_HIGHSCORE" class="achievement_desc" title="Locked">Score 750-899 points</p>
          </td>
          <td class="achievement">
            <p id="achievement_TOPSCORE" class="achievement_text" title="Locked">TOP SCORE</p>
            <p id="achievement_desc_TOPSCORE" class="achievement_desc" title="Locked">Score more than 900 points</p>
          </td>
          <td class="achievement">
            <p id="achievement_BADSCORE" class="achievement_text" title="Locked">BAD SCORE</p>
            <p id="achievement_desc_BADSCORE" class="achievement_desc" title="Locked">Score exactly 666 points</p>
          </td>
        </tr>
        <tr>
          <td class="achievement">
            <p id="achievement_TRYTHIS" class="achievement_text" title="Locked">TRY THIS</p>
            <p id="achievement_desc_TRYTHIS" class="achievement_desc" title="Locked">Complete a song a friend sent you</p>
          </td>
          <td class="achievement">
            <p id="achievement_ALMOSTTHERE" class="achievement_text" title="Locked">ALMOST THERE</p>
            <p id="achievement_desc_ALMOSTTHERE" class="achievement_desc" title="Locked">Get the artist or title (not both) then get every word without any hints</p>
          </td>
          <td class="achievement">
            <p id="achievement_HAPPYENDING" class="achievement_text" title="Locked">HAPPY ENDING</p>
            <p id="achievement_desc_HAPPYENDING" class="achievement_desc" title="Locked">Complete a song using your one and only hint</p>
          </td>
          <td class="achievement">
            <p id="achievement_SWEAR" class="achievement_text" title="Locked">%$&*#@!</p>
            <p id="achievement_desc_SWEAR" class="achievement_desc" title="Locked">Complete the hard song without any hints</p>
          </td>
          <td class="achievement">
            <p id="achievement_ALLDONE" class="achievement_text" title="Locked">ALL DONE</p>
            <p id="achievement_desc_ALLDONE" class="achievement_desc" title="Locked">Complete all achievements</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <h3>Progressometer:</h3>
  <table>
    <tbody id="tbody_progress">
    </tbody>
  </table>
  
  <h3 id="h3_userid">User id:</h3>
  <div><p>Your user id is: <span id="span_user_id">-</span>.  You can recover your session by appending <tt>?user_id=&lt;user_id&gt;</tt> to the end of the url.  <a id="a_user_id" href="">Link</a></div>
  
  <div id="quotes">
    <h3 id="h3_quotes">See what others are saying about this page:</h3>
    <p class="quote">"You're writing to my supervisor and explaining why my thesis is delayed, yeah?"</p>
    <p class="quote">"I'm never touching your evil time sucking site again!"</p>
    <p class="quote">"Why have you made this thing? Why? Why?"</p>
    <p class="quote">"Have you no mercy?"</p>
    <p class="quote">"WHY DO YOU HATE PRODUCTIVITY?"</p>
  </div>
  <div id="div_debug"></div>
</div>

<?php foot() ; ?>
