########## build_stage ##########
FROM node:16-alpine as build_stage

# set working directory
WORKDIR /app/

# install dependencies
COPY package.json package-lock.json /app/
RUN NO_POSTINSTALL=1 npm ci

# generate prisma models
COPY prisma/schema.prisma /app/
RUN npm run prisma:gen

# copy all files
COPY .env build.mjs tsconfig.json /app/
COPY src/ /app/src/

# build the production app
RUN npm run build

# remove non production dependencies
RUN npm prune --production


########## final_stage ##########
FROM node:16-alpine as final_stage

# set working directory
WORKDIR /app/

# copy production dependencies
COPY --from=build_stage /app/node_modules/ /app/node_modules/

# copy all config files
COPY --from=build_stage /app/package.json /app/.env /app/

# copy production app
COPY --from=build_stage /app/build/ /app/build/

# copy prisma migration files
COPY prisma/ /app/prisma/

# default app port
EXPOSE 4000

RUN npm run prisma:gen

# default command
CMD ["npm", "run", "start"]
