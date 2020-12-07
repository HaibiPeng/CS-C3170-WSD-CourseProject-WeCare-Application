import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${request.method} ${request.url.pathname} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
    //console.log(`${Deno.cwd()}/static`);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const controlAccess = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/behavior')) {
    if (session && await session.get('authenticated')) {
      await next();
    } else {
      //response.body = 'Warning: you have no access';
      //await sleep(3000);
      response.status = 401;
      response.redirect('/auth/login');
      await next();
    }
  } else {
    await next();
  }
}

export { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware, controlAccess };