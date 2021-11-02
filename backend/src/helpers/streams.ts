import {Stream} from "stream";

// https://stackoverflow.com/questions/14269233/node-js-how-to-read-a-stream-into-a-buffer
export function toBuffer(stream: Stream): Promise<Buffer>
{
    return new Promise < Buffer > ((resolve, reject) => {
        const _buf = Array < any > ();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
}
