<?php
include_once('mysql.php') ;

$success = true ;
if(!isset($_GET['user_id'])) $success = false ;
if($success){
  $user_id = clean_string($_GET['user_id']) ;
  $query = 'SELECT * FROM guessSong_users WHERE user_id="' . $user_id . '"' ;
  echo $query ;
  $result = mysqli_query($database_link,$query) ;
  $exists = false ;
  while($row = mysqli_fetch_assoc($result)){
    print_r($row) ;
    $exists = true ;
    break ;
  }
  mysqli_free_result($result) ;
  if(!$exists){
    $query = 'INSERT INTO guessSong_users (user_id,achievements) VALUES (' . '"' . $user_id   . '","")' ;
    mysqli_query($database_link,$query) ;
  }
}
?>

