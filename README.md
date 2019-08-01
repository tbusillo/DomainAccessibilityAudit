# Domain Accessibility Audit

This web application automatically crawls websites and checks for accessibility violations.
It can crawl within subdomains of the initial domain it starts with.
It reports statistics of violations for the whole audit, domains and pages.

## Current status
This is a beta version, and it does crash sometimes.
However it already gives useful results.

## To start it
- Install Docker and docker-compose if needed.
- Edit a `.env` file at the root of this folder (next to the README),
  with the following line ending with your admin password:
  ```
  ADMIN_PASSWORD=
  ```
  (this password is needed to create and remove audits)
- `docker-compose up -d`
- Direct a browser to `http://localhost/`.

## To stop it
- A running audit can be stopped with the Stop button in the form to start a new audit.
- `docker-compose stop` will stop the containers.
- `docker-compose down` will stop and remove the containers. They are recreated automatically with `docker-compose up -d`.

## To check the server logs
- Get a list of container ids: `docker ps`.
- Look at the logs for a container: `docker logs <container_id>`.
- Keep looking in real time: `docker logs -f <container_id>`.  
  (another way to do that is to use `docker-compose up` without the `-d` option)

## To uninstall
**Warning**: this will remove all the data !!!
- `docker-compose down -v --rmi all --remove-orphans`
- Remove the files.

## Features
- Accessibility testing based on [axe](https://github.com/dequelabs/axe-core), which does not return false positives.
- Choice of accessibility standard to use: WCAG 2.0 Level A or AA, WCAG 2.1 Level AA or Section 508.
- Choice of web browser for testing: Firefox or Chromium.
- Option to check subdomains automatically.
- Options to use site maps and/or crawling to discover pages to test.
- Option to limit the number of pages checked per domain.
- Option to include only pages matching a regular expression.
- Results can be browsed on a dynamic website. Access to create new audits or remove them is protected by password.
- Results include violation statistics with links to Deque documentation given for the whole audit (including subdomains), for each domain and for each page.
- Easy way to see which domains or pages are most impacted by specific violations.

## Other environment variables
Besides the required `ADMIN_PASSWORD` variable, other variables can be used in `.env`:
- `MODE`: running environment, `development` or `production` (`production` by default)
- `RESTRICTED_IP`: an IP address which will be the only one able to access the app
  (`127.0.0.1` by default for development, `0.0.0.0` by default for production,
    set to `0.0.0.0` to allow connections from everywhere even in development)
- `DEVELOPMENT_PORT`: the port used for development (3142 by default)
- `DEVELOPMENT_API_PORT`: the port used for API calls in development (3143 by default)
- `PRODUCTION_PORT`: the port used for production (80 by default)

## FAQ
- Why would I ever want to not use site maps when they're available?  
  Site maps are great to check entire sites. A crawling depth of 0 can even
  be used when they are complete.
  However one might want to focus on the most visible pages
  (based on the number of clicks used to reach them).
  Ignoring site maps and crawling the sites with a maximum depth is
  a better option in this case.
- How could I check only a part of a site ?  
  With the "Include only paths matching the regular expression" option,
  for instance `^/section1` would only match paths starting with `/section1`
  (the paths the expression is checked against start with a slash,
  but do not include the protocol or domain parts of the URL).

## Current issues
- Sometimes the audit will start failing after a while. It will try to restart WebDriver automatically to continue. A large number of scan errors will be reported if the audit keeps failing.

## Current non-features that would be nice to have in the future
- Possibility to access non-public websites.
- Taking `robots.txt` into account.
- Option to only start subdomain audits at the root.
- Reporting more than accessibility violations.
- Ability to pause an audit.
- User management beyond a simple admin password.
- Option to ignore pages returning a 404 status code.
- Regular expression to ignore some URLs.

## Licence
GPL 3.0.

## Technologies used
- [Docker](https://www.docker.com/)
- [aXe](https://github.com/dequelabs/axe-core)
- [Selenium WebDriver](https://www.seleniumhq.org/projects/webdriver/)
- [axe-webdriverjs](https://github.com/dequelabs/axe-webdriverjs)
- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Firefox](https://www.mozilla.org/en-US/firefox/)
- [Chromium](https://www.chromium.org/Home)
- [Debian](https://www.debian.org/)
