import ErrorResponse from '@/utils/errorResponse';

const handleSignUp = (db, bcrypt) => (req, res, next) => {
  const saltRounds = 10;
  const { username, userid, userpw } = req.body;

  if (!userid || !userpw) {
    return next(new ErrorResponse('incorrect form submission', 400));
  }

  const userhash = bcrypt.hashSync(userpw, saltRounds);

  return db
    .transaction(trx => {
      trx
        .insert({ userhash, userid })
        .into('users_login')
        .then(() =>
          trx('users')
            .returning('*')
            .insert({ userid, username, joined: new Date() }),
        )
        .then(user => res.json({ success: true, user: user[0] }))
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(_err => next(new ErrorResponse('unable to signup', 400)));
};

export default handleSignUp;
