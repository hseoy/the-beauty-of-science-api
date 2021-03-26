script_dir=`dirname $0`
psql -d the_beauty_of_science -a -f $script_dir/users.sql
