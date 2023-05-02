## Installation

```bash
# enviroment - Gmail - if you use 2-factor-authentication [check] (#two-factor)
  Add your gmail and password on .env (EMAIL, EMAIL_PASSWORD)
# instaçç
$ npm install
```

## Running the app

```bash
# run mongodb and RabbitMQ on Docker
$ npm run up-dc

# run project
$ npm run start

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## 2-factor-authentication on Gmail (#two-factor)

Of course for a real project must not use personal emails and use a service like SES of AWS. But for that case I used my personal gmail putting the email and the password on .env. If you have 2-factor-authentication, as me, you need to create a password to use the email on a device without need to authenticate twice. That person explain how make it: https://stackoverflow.com/a/69172787
