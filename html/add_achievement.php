<?php
include_once('mysql.php') ;

$success = true ;
if(!isset($_GET['user_id'     ])) $success = false ;
if(!isset($_GET['achievements'])) $success = false ;
if($success){
  $user_id         = clean_string($_GET['user_id'     ]) ;
  $achievements_in = explode(',',clean_string($_GET['achievements'])) ;
  
  $query = 'SELECT * FROM guessSong_users WHERE user_id="' . $user_id . '" ORDER BY user_id DESC LIMIT 1' ;
  $result = mysqli_query($database_link,$query) ;
  $all_achievements = '' ;
  while($row = mysqli_fetch_assoc($result)){
    $row_achievements = $row['achievments'] ;
    $all_achievements = explode(',',$row_achievements) ;
    $achievements_to_add = array() ;
    for($j=0 ; $j<count($achievements_in) ; $j++){
      $add = true ;
      for($i=0 ; $i<count($all_achievements) ; $i++){
        if($all_achievements[$i]==$achievements_in[$j]){
          $add = false ;
          break ;
        }
      }
      if($add){
        $achievements_to_add[] = $achievements_in[$j] ;
      }
    }
    if(count($achievements_to_add)>0){
      for($i=0 ; $i<count($achievements_to_add) ; $i++){
        $all_achievements[] = $achievements_to_add[$i] ;
      }
      $text = join(',',$all_achievements) ;
      $query = 'UPDATE guessSong_users SET achievements="' . $text .'" WHERE user_id="' . $user_id . '"' ;
      $result = mysqli_query($database_link,$query) ;
      mysqli_free_result($result) ;
      echo $text ;
    }
  }
}
?>

