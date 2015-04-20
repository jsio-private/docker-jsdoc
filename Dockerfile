FROM google/nodejs

RUN apt-get update && apt-get install -y ssh

# Add github so we can ssh clone
RUN mkdir /root/.ssh
RUN echo "Host *\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

# Clone the theme
RUN git clone https://github.com/davidshimjs/jaguarjs-jsdoc /jaguarjs-jsdoc

# Install the preprocessor
ADD jsio-preprocess /jsio-preprocess
RUN cd /jsio-preprocess && npm install

# Add our entrypoint
ADD launch.sh /launch.sh
ENTRYPOINT /launch.sh
