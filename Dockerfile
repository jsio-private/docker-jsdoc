FROM google/nodejs

RUN apt-get update && apt-get install -y ssh

# Add github so we can ssh clone
RUN mkdir /root/.ssh
RUN echo "Host *\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

# Install the preprocessor
# Could just add all at once, but in dev it is nice to not run npm install every time
#ADD jsio-preprocess /jsio-preprocess
ADD jsio-preprocess/package.json /jsio-preprocess/package.json
RUN cd /jsio-preprocess && npm install
ADD jsio-preprocess/gulpfile.js /jsio-preprocess/gulpfile.js

# Add our entrypoint
ADD launch.sh /launch.sh
ENTRYPOINT /launch.sh
