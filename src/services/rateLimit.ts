import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


const rateLimit = (limit: number, interval: number) => {
    const requests = new Map();
    return async(req: NextApiRequest, res : NextApiResponse) => {

        console.log('Checking rate limit')
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        if (!requests.has(ip)) {
            requests.set(ip, { count: 0, firstRequest: Date.now() });
        }
        const data = requests.get(ip);
        if (Date.now() - data.firstRequest > interval) {
            // Reset the count every interval
            data.count = 0;
            data.firstRequest = Date.now();
        }
        data.count += 1;
        console.log('Limit Count: ', data.count)
        requests.set(ip, data);
        if (data.count > limit) {
            return false
        }
        // NextResponse.next();
        return true;

    };
};
export default rateLimit;