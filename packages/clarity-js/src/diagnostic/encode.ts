import { Event, Token } from "@clarity-types/data";
import { time } from "@src/core/time";
import { queue } from "@src/data/upload";
import * as image from "@src/diagnostic/image";
import * as internal from "@src/diagnostic/internal";
import * as script from "@src/diagnostic/script";
import { metadata } from "@src/layout/target";

export default async function (type: Event): Promise<void> {
    let tokens: Token[] = [time(), type];

    switch (type) {
        case Event.ScriptError:
            tokens.push(script.data.message);
            tokens.push(script.data.line);
            tokens.push(script.data.column);
            tokens.push(script.data.stack);
            tokens.push(script.data.source);
            queue(tokens);
            break;
        case Event.ImageError:
            if (image.data) {
                let imageTarget = metadata(image.data.target as Node, type);
                tokens.push(image.data.source);
                tokens.push(imageTarget.id);
                queue(tokens);
            }
            break;
        case Event.Log:
            if (internal.data) {
                tokens.push(internal.data.code);
                tokens.push(internal.data.name);
                tokens.push(internal.data.message);
                tokens.push(internal.data.stack);
                tokens.push(internal.data.severity);
                queue(tokens, false);
            }
            break;
    }
}
