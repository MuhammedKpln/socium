export enum ERROR_CODES_RAW {
  'USERNAME_OR_PASSWORD_INCORRECT' = 2132,
  'USER_IS_ALREADY_REGISTERED' = 2133,
  'EMAIL_VERIFY_HASH_DOES_NOT_MATCH' = 2134,
  'DATA_NOT_FOUND' = 2135,
  'NOT_ENOUGH_STARS' = 2136,
  'REQUEST_ALREADY_EXISTS' = 2137,
  'FOLLOWED_USER' = 3000,
  'ALREADY_FOLLOWING_USER' = 3001,
  'NOT_FOLLOWING_USER' = 3002,
  'ALREADY_LIKED' = 2139,
  'EMAIL_DOES_NOT_EXISTS' = 2140,
}

export const translates = {
  USERNAME_OR_PASSWORD_INCORRECT: 'Kullanıcı adı ve şifre hatalı.',
  USER_IS_ALREADY_REGISTERED:
    'Bu kullanıcı adıyla veya e-posta ile zaten kayıtlı bir kullanımıcız bulunmakta.',
  EMAIL_VERIFY_HASH_DOES_NOT_MATCH: 'Lütfen yeni bir doğrulama kodu kullanın.',
  REQUEST_ALREADY_EXISTS: 'Hali hazırda zaten bir isteğiniz mevcut.',
  NOT_ENOUGH_STARS:
    'Yeterli yıldızınız yok, fakat reklam izleyerek yıldız sahibi olabilirsiniz.',
  FOLLOWED_USER: 'Kullaniciyi takip ediyorsunuz.',
  ALREADY_FOLLOWING_USER: 'Zaten bu kullanıcıyı takip ediyorsunuz.',
  NOT_FOLLOWING_USER: 'Kullanıcıyı takip etmiyorsunuz.',
  ALREADY_LIKED: 'Bu içeriği zaten beğenmişsiniz.',
  EMAIL_DOES_NOT_EXISTS:
    'Bu e-posta adresiyle herhangi bir kullanıcı bulunmakta.',
}

export const ERROR_CODES: {
  [index: number]: string
} = {
  [ERROR_CODES_RAW.USERNAME_OR_PASSWORD_INCORRECT]:
    translates['USERNAME_OR_PASSWORD_INCORRECT'],
  [ERROR_CODES_RAW.USER_IS_ALREADY_REGISTERED]:
    translates['USER_IS_ALREADY_REGISTERED'],
  [ERROR_CODES_RAW.EMAIL_VERIFY_HASH_DOES_NOT_MATCH]:
    translates['EMAIL_VERIFY_HASH_DOES_NOT_MATCH'],
  [ERROR_CODES_RAW.NOT_ENOUGH_STARS]: translates['NOT_ENOUGH_STARS'],
  [ERROR_CODES_RAW.REQUEST_ALREADY_EXISTS]:
    translates['REQUEST_ALREADY_EXISTS'],
  [ERROR_CODES_RAW.FOLLOWED_USER]: translates['FOLLOWED_USER'],
  [ERROR_CODES_RAW.ALREADY_FOLLOWING_USER]:
    translates['ALREADY_FOLLOWING_USER'],
  [ERROR_CODES_RAW.NOT_FOLLOWING_USER]: translates['NOT_FOLLOWING_USER'],
  [ERROR_CODES_RAW.ALREADY_LIKED]: translates['ALREADY_LIKED'],
  [ERROR_CODES_RAW.EMAIL_DOES_NOT_EXISTS]: translates['EMAIL_DOES_NOT_EXISTS'],
}
