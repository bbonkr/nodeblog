FROM node:11

# 앱 디렉터리 생성
WORKDIR /usr/src/app

COPY package*.json ./

#RUN npm ci --only=production
RUN npm i

# 앱 소스 추가
COPY . .

EXPOSE 3000

CMD ["npm", "start"]