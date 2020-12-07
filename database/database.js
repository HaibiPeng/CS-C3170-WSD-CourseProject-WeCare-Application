import { config } from "../config/config.js";
import { Pool } from "../deps.js";

const CONCURRENT_CONNECTIONS = 5;
const connectionPool = new Pool(config.database, CONCURRENT_CONNECTIONS);

const executeQuery = async(query, ...params) => {
    const client = await connectionPool.connect();
    try {
        return await client.query(query, ...params);
    } catch (e) {
        console.log(e);  
    } finally {
        client.release();
    }
return null;
};

let cache = {};

const executeCachedQuery = async(query, ...params) => {
    const key = query + params.reduce((acc, o) => acc + "-" + o, "");
    if (key.startsWith('INSERT' || key.startsWith('UPDATE'))) {
      cache = {};
    }
    if (cache[key]) {
        return cache[key];
    }

    const res = await executeQuery(query, ...params);
    cache[key] = res;

    return res;
}

export { executeQuery, executeCachedQuery };