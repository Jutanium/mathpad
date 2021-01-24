import $ from "jquery";
import "./mathquill.css"
let MQ = null;
export default async function () {
    if (MQ) return MQ;
    window.jQuery = $;
    const MathQuill = (await import("./mathquill.js")).default;
    MQ = MathQuill.getInterface(2);
    return MQ;
}
