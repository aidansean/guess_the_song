<?php
include_once('mysql.php') ;

$success = true ;
if(!isset($_GET['user_id'  ])) $success = false ;
if(!isset($_GET['song_id'  ])) $success = false ;
if(!isset($_GET['score'    ])) $success = false ;
if(!isset($_GET['guesses'  ])) $success = false ;
if(!isset($_GET['hints'    ])) $success = false ;
if(!isset($_GET['successes'])) $success = false ;
if(!isset($_GET['fails'    ])) $success = false ;
if(!isset($_GET['seconds'  ])) $success = false ;
if(!isset($_GET['mode'     ])) $success = false ;

if($success){
  $user_id   = clean_string($_GET['user_id'  ]) ;
  $song_id   = clean_string($_GET['song_id'  ]) ;
  $score     = clean_string($_GET['score'    ]) ;
  $guesses   = clean_string($_GET['guesses'  ]) ;
  $hints     = clean_string($_GET['hints'    ]) ;
  $successes = clean_string($_GET['successes']) ;
  $fails     = clean_string($_GET['fails'    ]) ;
  $seconds   = clean_string($_GET['seconds'  ]) ;
  $mode      = clean_string($_GET['mode'     ]) ;
  
  $query = 'INSERT INTO guessSong_songs (user_id,song_id,score,guesses,hints,successes,fails,seconds,mode) VALUES (' 
    . '"' . $user_id   . '",' 
    . ''  . $song_id   . ',' 
    . ''  . $score     . ',' 
    . ''  . $guesses   . ',' 
    . ''  . $hints     . ',' 
    . ''  . $successes . ',' 
    . ''  . $fails     . ',' 
    . ''  . $seconds   . ','
    . '"' . $mode      . '")' ;
  mysqli_query($database_link,$query) ;
  mysqli_free_result($result) ;
}

$success = true ;
$numbers = array() ;
if(!isset($_GET['user_id'])) $success = false ;
if($success){
  $query = 'SELECT * FROM  guessSong_songs WHERE user_id="' . $user_id . '"' ;
  $result = mysqli_query($database_link,$query) ;
  while($row = mysqli_fetch_assoc($result)){
    $n = $row['song_id'] ;
    $add = true ;
    for($i=0 ; $i<count($numbers) ; $i++){
      if($n==$numbers[$i]){
        $add = false ;
        break ;
      }
    }
    if($add) $numbers[] = $n ;
  }
  mysqli_free_result($result) ;
  echo count($numbers) ;
}
?>

