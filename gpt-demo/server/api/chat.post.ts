import { OpenAI } from "openai-streams/node";
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    const stream = await OpenAI(
        "chat",
        {
            model: config.model,
            messages: body.messages,
            max_tokens: 4000,
            stream: true,
        },
        { apiKey: config.openai_api_key }
    );
    
    // this is important because otherwise the stream won't be sent correctly
    setHeader(event, "content-type", "application/octet-stream");
    
    return sendStream(event, stream);
});