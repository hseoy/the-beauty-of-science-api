script_dir=`dirname $0`
psql -d the_beauty_of_science -a -f $script_dir/users.sql
psql -d the_beauty_of_science -a -f $script_dir/posts.sql
psql -d the_beauty_of_science -a -f $script_dir/quizzes.sql