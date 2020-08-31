import passport from 'passport'
import { Strategy } from 'passport-local'

export default function setup() {
  passport.use(
    new Strategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      function (id, password, done) {
        // TODO: DB에서 제대로 된 유저와 비밀번호가 맞는지 확인하기.
        if (id === 'agrajak') {
          return done(null, {
            id,
          })
        }
        return done(null, false, {
          message: 'Failed to login',
        })
      }
    )
  )
}
