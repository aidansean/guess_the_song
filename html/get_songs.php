<?php
include_once('mysql.php') ;

$success = true ;
$numbers_hard = array() ;
$numbers_easy = array() ;
if(!isset($_GET['user_id'])) $success = false ;
if($success){
  $user_id = clean_string($_GET['user_id']) ;
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
    if($add){
      if($row['mode']=='hard') $numbers_hard[] = $n ;
      if($row['mode']=='easy') $numbers_easy[] = $n ;
    }
  }
  mysqli_free_result($result) ;
  echo join(',',$numbers_hard) , '/' , join(',',$numbers_easy) ;
}
?>

