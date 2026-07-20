# playwright-reto-30-dias

Run tests:

# headless
npm run test:admin
npm run test:login
npm run test:employee
npm run test:all

# headed
npm run test:admin -- --headed
npm run test:login -- --headed
npm run test:employee -- --headed
npm run test:all -- --headed

# specify test description
npm run test:admin -- -g 'test'

# playwright debug mode
PWDEBUG=1 npm run test:admin -- -g 'test'
