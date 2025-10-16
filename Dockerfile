FROM node:22 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json  ./
RUN HUSKY=0 npm install --omit=optional

COPY . .
RUN npm run build

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/multiflex/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
